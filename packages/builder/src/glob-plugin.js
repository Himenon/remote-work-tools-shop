import fastGlob from "fast-glob";
import path from "node:path";

// Matches import.meta.glob(patterns [, options])
// patterns: string literal or array of string literals (possibly multiline)
const GLOB_CALL_RE = /import\.meta\.glob\((?<patterns>\[[\s\S]*?\]|'[^']*'|"[^"]*")\s*(?:,\s*\{[^}]*\})?\)/gu;

const QUOTE_PATTERN_RE = /['"](?<quotePattern>[^'"]+)['"]/gu;
const SINGLE_QUOTE_PREFIX_RE = /^['"](?<singleQuote>[^'"]+)['"]/u;

/** @param {string} arg */
function parsePatterns(arg) {
  const s = arg.trim();
  if (s.startsWith("[")) {
    return [...s.matchAll(QUOTE_PATTERN_RE)].map((m) => m[1]);
  }
  const m = SINGLE_QUOTE_PREFIX_RE.exec(s);
  return m ? [m[1]] : [];
}

/**
 * Vite の import.meta.glob() を Rollup 向けに static import に展開する plugin。
 *
 * @param {string} [root] プロジェクトルート（デフォルト: process.cwd()）
 * @returns {import("rollup").Plugin}
 */
export function importMetaGlobPlugin(root = process.cwd()) {
  let counter = 0;

  return {
    name: "import-meta-glob",

    /** @param {string} code @param {string} _id */
    transform(code, _id) {
      if (!code.includes("import.meta.glob")) {
        return null;
      }

      const addedImports = /** @type {string[]} */ ([]);
      const re = new RegExp(GLOB_CALL_RE.source, "gu");
      let hadMatch = false;

      const result = code.replaceAll(re, (match, /** @type {string} */ patternsArg) => {
        const patterns = parsePatterns(patternsArg);
        if (patterns.length === 0) {
          return match;
        }

        hadMatch = true;

        // Vite glob patterns start with "/" (relative to project root).
        // path.join(root, "/absolute") on POSIX ignores root, so strip the leading "/".
        const toFsPath = (/** @type {string} */ p) => {
          const rel = p.startsWith("/") ? p.slice(1) : p;
          return path.join(root, rel);
        };
        const fsPatterns = patterns.map((p) => (p.startsWith("!") ? `!${toFsPath(p.slice(1))}` : toFsPath(p)));

        const files = fastGlob.sync(fsPatterns, { absolute: true });
        const entries = files.map((file) => {
          const varName = `__glob${counter}`;
          counter += 1;
          const key = `/${path.relative(root, file).replaceAll("\\", "/")}`;
          addedImports.push(`import * as ${varName} from ${JSON.stringify(file)};`);
          return `${JSON.stringify(key)}: ${varName}`;
        });

        return `{${entries.join(", ")}}`;
      });

      // hadMatch でなければ置換対象がなかったので null を返す。
      // addedImports が空でも hadMatch なら glob パターンを {} に置換済みなので結果を返す。
      if (!hadMatch) {
        return null;
      }
      return { code: `${addedImports.join("\n")}\n${result}`, map: null };
    },
  };
}
