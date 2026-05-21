// import.meta.glob は Vite 固有の Glob Import API であり、Node.js ESM には存在しない。
// HonoX は自身の dist コード内でルート・レンダラー・アイランドの自動収集に使用している。
//   例: import.meta.glob("/app/routes/**/_renderer.tsx", { eager: true })
// このビルドは Vite を経由しない直接 Rolldown ビルドであるため、このプラグインで
// import.meta.glob(...) 呼び出しを静的 import の展開に変換する必要がある。
// 参照: https://vite.dev/guide/features#glob-import
//
// 実装は Vite の importMetaGlob プラグインを参考にしている。
// 参照: https://github.com/vitejs/vite/blob/main/packages/vite/src/node/plugins/importMetaGlob.ts
//
// Vite との主な違い:
// - このプラグインは HonoX が使う静的リテラルパターン・eager: true のみを対象とした簡略実装
// - lazy import (オプション未指定) や as/query オプションは非対応
// - HMR（ファイル追加時の自動再収集）は不要なため未実装

import fastGlob from "fast-glob";
import { join, relative } from "node:path";
import type { Plugin } from "rolldown";
import { stripLiteral } from "strip-literal";

// Vite と同様に、まず stripLiteral でコメントと文字列リテラルを除去した stripped code に対して
// 正規表現でマッチ位置を検出し、元の code から実際の引数を取り出す。
// これにより `"import.meta.glob('./foo')"` のような文字列内の偽陽性を防ぐ。
const GLOB_CALL_RE = /\bimport\.meta\.glob\s*\(/g;

// パターン引数: 文字列リテラルまたは文字列リテラルの配列
const PATTERN_ARG_RE = /^(\[[\s\S]*?\]|'[^']*'|"[^"]*")/;
const QUOTE_PATTERN_RE = /['"]([^'"]+)['"]/g;

function parsePatterns(arg: string): string[] {
  const s = arg.trim();
  if (s.startsWith("[")) {
    return [...s.matchAll(QUOTE_PATTERN_RE)].map((m) => m[1]);
  }
  const m = QUOTE_PATTERN_RE.exec(s);
  return m ? [m[1]] : [];
}

/** `(` の位置から対応する `)` の末尾インデックス（次の文字位置）を返す */
function findCallEnd(code: string, openParenIndex: number): number {
  let depth = 0;
  for (let i = openParenIndex; i < code.length; i += 1) {
    if (code[i] === "(") {
      depth += 1;
    } else if (code[i] === ")") {
      depth -= 1;
      if (depth === 0) {
        return i + 1;
      }
    }
  }
  return -1;
}

/** Vite glob パターン（`/` 始まり）をファイルシステムの絶対パスパターンに変換する */
function toFsPathPatterns(patterns: string[], root: string): string[] {
  const toFsPath = (p: string): string => {
    const rel = p.startsWith("/") ? p.slice(1) : p;
    return join(root, rel);
  };
  return patterns.map((p) => (p.startsWith("!") ? `!${toFsPath(p.slice(1))}` : toFsPath(p)));
}

/** マッチしたファイル群から import 文と object entry 文字列を生成する */
function buildGlobEntries(files: string[], root: string, startIndex: number): { entries: string[]; imports: string[] } {
  const entries: string[] = [];
  const imports: string[] = [];
  files.forEach((file, fileIndex) => {
    const varName = `__glob${startIndex + fileIndex}`;
    const key = `/${relative(root, file).replaceAll("\\", "/")}`;
    imports.push(`import * as ${varName} from ${JSON.stringify(file)};`);
    entries.push(`${JSON.stringify(key)}: ${varName}`);
  });
  return { entries, imports };
}

function transformGlob(code: string, root: string, counter: number): { code: string; newCounter: number } | null {
  if (!code.includes("import.meta.glob")) {
    return null;
  }
  const strippedCode = stripLiteral(code);
  const addedImports: string[] = [];
  const replacements: { start: number; end: number; replacement: string }[] = [];
  GLOB_CALL_RE.lastIndex = 0;
  let match: RegExpExecArray | null;
  let currentCounter = counter;

  while ((match = GLOB_CALL_RE.exec(strippedCode)) !== null) {
    const callStart = match.index;
    const afterParen = code.slice(match.index + match[0].length);
    const patternMatch = PATTERN_ARG_RE.exec(afterParen);
    if (!patternMatch) {
      continue;
    }
    const patterns = parsePatterns(patternMatch[1]);
    if (patterns.length === 0) {
      continue;
    }
    const callEnd = findCallEnd(code, callStart + match[0].length - 1);
    if (callEnd === -1) {
      continue;
    }
    const files = fastGlob.sync(toFsPathPatterns(patterns, root), { absolute: true });
    const { entries, imports } = buildGlobEntries(files, root, currentCounter);
    currentCounter += files.length;
    addedImports.push(...imports);
    replacements.push({ start: callStart, end: callEnd, replacement: `{${entries.join(", ")}}` });
  }

  if (replacements.length === 0) {
    return null;
  }
  let result = code;
  for (const { start, end, replacement } of replacements.toReversed()) {
    result = result.slice(0, start) + replacement + result.slice(end);
  }
  return { code: `${addedImports.join("\n")}\n${result}`, newCounter: currentCounter };
}

/**
 * Vite の import.meta.glob() を Rolldown 向けに static import に展開する plugin。
 *
 * @param root プロジェクトルート（デフォルト: process.cwd()）
 */
export function importMetaGlobPlugin(root = process.cwd()): Plugin {
  let counter = 0;

  return {
    name: "import-meta-glob",

    transform(code: string, _id: string) {
      const result = transformGlob(code, root, counter);
      if (result === null) {
        return null;
      }
      counter = result.newCounter;
      return { code: result.code, map: null };
    },
  };
}
