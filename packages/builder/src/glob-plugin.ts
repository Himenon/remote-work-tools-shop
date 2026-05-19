// import.meta.glob は Vite 固有の Glob Import API であり、Node.js ESM には存在しない。
// HonoX は自身の dist コード内でルート・レンダラー・アイランドの自動収集に使用している。
//   例: import.meta.glob("/app/routes/**/_renderer.tsx", { eager: true })
// このビルドは Vite を経由しない直接 Rolldown ビルドであるため、このプラグインで
// import.meta.glob(...) 呼び出しを静的 import の展開に変換する必要がある。
// 参照: https://vite.dev/guide/features#glob-import

import fastGlob from "fast-glob";
import { join, relative } from "node:path";
import type { Plugin } from "rolldown";

// Matches import.meta.glob(patterns [, options])
// patterns: string literal or array of string literals (possibly multiline)
const GLOB_CALL_RE = /import\.meta\.glob\((\[[\s\S]*?\]|'[^']*'|"[^"]*")\s*(?:,\s*\{[^}]*\})?\)/g;

const QUOTE_PATTERN_RE = /['"]([^'"]+)['"]/g;
const SINGLE_QUOTE_PREFIX_RE = /^['"]([^'"]+)['"]/;

function parsePatterns(arg: string): string[] {
  const s = arg.trim();
  if (s.startsWith("[")) {
    return [...s.matchAll(QUOTE_PATTERN_RE)].map((m) => m[1]);
  }
  const m = SINGLE_QUOTE_PREFIX_RE.exec(s);
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

      const addedImports: string[] = [];
      const re = new RegExp(GLOB_CALL_RE.source, "g");
      let hadMatch = false;

      const result = code.replaceAll(re, (match, patternsArg: string) => {
        const patterns = parsePatterns(patternsArg);
        if (patterns.length === 0) {
          return match;
        }

        hadMatch = true;

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

        return `{${entries.join(", ")}}`;
      });

      if (!hadMatch) {
        return null;
      }
      return { code: `${addedImports.join("\n")}\n${result}`, map: null };
    },
  };
}
