import commonjs from "@rollup/plugin-commonjs";
import json from "@rollup/plugin-json";
import resolve from "@rollup/plugin-node-resolve";
import { copyFileSync, mkdirSync } from "node:fs";
import { createRequire } from "node:module";
import { dirname, join } from "node:path";
import { pathToFileURL } from "node:url";
import { swc } from "rollup-plugin-swc3";

/**
 * better-sqlite3 v12 の native addon を output dir に配置し、
 * モジュール本体を virtual module に置き換える Rollup plugin。
 *
 * v12 は独自の native loader を内包するが、バンドル後の minify で
 * 変数名衝突が発生して loader が呼び出せなくなる。
 * virtual module で直接 createRequire + .node ロードに差し替えることで回避する。
 */
function betterSqlite3Plugin() {
  // CWD 基準で解決することで、このファイルの場所ではなく
  // ビルド対象プロジェクトの node_modules から .node を取得する
  const _require = createRequire(pathToFileURL(join(process.cwd(), "package.json")));

  return {
    name: "better-sqlite3-native",

    /** @param {string} id */
    resolveId(id) {
      if (id === "better-sqlite3") {
        return "\0virtual:better-sqlite3";
      }
      return null;
    },

    /** @param {string} id */
    load(id) {
      if (id !== "\0virtual:better-sqlite3") {
        return null;
      }
      return `
import { createRequire } from 'node:module';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
const _req = createRequire(import.meta.url);
const _addon = _req(join(dirname(fileURLToPath(import.meta.url)), 'better_sqlite3.node'));
export default _addon.Database ?? _addon;
      `.trim();
    },

    /** @param {import("rollup").NormalizedOutputOptions} options */
    writeBundle(options) {
      const outDir = options.dir ?? (options.file ? dirname(options.file) : "dist");
      mkdirSync(outDir, { recursive: true });
      const src = _require.resolve("better-sqlite3/build/Release/better_sqlite3.node");
      copyFileSync(src, join(outDir, "better_sqlite3.node"));
    },
  };
}

/**
 * @param {{ input: string, output: import("rollup").OutputOptions }} options
 * @returns {import("rollup").RollupOptions}
 */
export function createNodeConfig({ input, output }) {
  return {
    input,
    output: {
      format: "esm",
      generatedCode: { constBindings: true },
      sourcemap: true,
      ...output,
    },
    plugins: [
      resolve({
        extensions: [".ts", ".tsx", ".mjs", ".js", ".json"],
        moduleDirectories: ["node_modules"],
        preferBuiltins: true,
      }),
      commonjs({ requireReturnsDefault: "auto" }),
      json(),
      swc({
        sourceMaps: true,
        jsc: {
          target: "es2022",
          parser: { syntax: "typescript", tsx: true },
          transform: { react: { runtime: "automatic" } },
        },
      }),
      betterSqlite3Plugin(),
    ],
  };
}
