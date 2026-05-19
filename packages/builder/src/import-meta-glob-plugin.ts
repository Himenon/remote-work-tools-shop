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
      if (!code.includes("import.meta.glob")) {
        return null;
      }

      // Vite と同じく stripped code でマッチ位置を検出して偽陽性を防ぐ
      const strippedCode = stripLiteral(code);

      const addedImports: string[] = [];
      const replacements: Array<{ start: number; end: number; replacement: string }> = [];

      GLOB_CALL_RE.lastIndex = 0;
      let match: RegExpExecArray | null;

      while ((match = GLOB_CALL_RE.exec(strippedCode)) !== null) {
        const callStart = match.index;
        // "(" の位置から元コードの残りを取り出してパターン引数を解析する
        const afterParen = code.slice(match.index + match[0].length);
        const patternMatch = PATTERN_ARG_RE.exec(afterParen);
        if (!patternMatch) continue;

        const patternsArg = patternMatch[1];
        const patterns = parsePatterns(patternsArg);
        if (patterns.length === 0) continue;

        // 閉じ括弧まで読み進めて call expression の終端を特定する
        const callEnd = findCallEnd(code, callStart + match[0].length - 1);
        if (callEnd === -1) continue;

        // Vite glob patterns start with "/" (relative to project root).
        // path.join(root, "/absolute") on POSIX ignores root, so strip the leading "/".
        const toFsPath = (p: string) => {
          const rel = p.startsWith("/") ? p.slice(1) : p;
          return join(root, rel);
        };
        const fsPatterns = patterns.map((p) => (p.startsWith("!") ? `!${toFsPath(p.slice(1))}` : toFsPath(p)));

        const files = fastGlob.sync(fsPatterns, { absolute: true });
        const entries = files.map((file) => {
          const varName = `__glob${counter}`;
          counter += 1;
          const key = `/${relative(root, file).replaceAll("\\", "/")}`;
          addedImports.push(`import * as ${varName} from ${JSON.stringify(file)};`);
          return `${JSON.stringify(key)}: ${varName}`;
        });

        replacements.push({ start: callStart, end: callEnd, replacement: `{${entries.join(", ")}}` });
      }

      if (replacements.length === 0) {
        return null;
      }

      // 後ろから置換することでオフセットのズレを回避する
      let result = code;
      for (const { start, end, replacement } of replacements.toReversed()) {
        result = result.slice(0, start) + replacement + result.slice(end);
      }

      return { code: `${addedImports.join("\n")}\n${result}`, map: null };
    },
  };
}

/** `(` の位置から対応する `)` の末尾インデックス（次の文字位置）を返す */
function findCallEnd(code: string, openParenIndex: number): number {
  let depth = 0;
  for (let i = openParenIndex; i < code.length; i++) {
    if (code[i] === "(") depth++;
    else if (code[i] === ")") {
      depth--;
      if (depth === 0) return i + 1;
    }
  }
  return -1;
}
