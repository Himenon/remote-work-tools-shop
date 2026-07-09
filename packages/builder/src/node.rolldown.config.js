import { copyFileSync, mkdirSync } from "node:fs";
import { createRequire } from "node:module";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { replacePlugin } from "rolldown/plugins";
import { importMetaGlobPlugin } from "./glob-plugin.js";

/**
 * better-sqlite3 v12 の native addon を output dir に配置し、
 * モジュール本体を virtual module に置き換える Rolldown plugin。
 *
 * v12 は独自の native loader を内包するが、バンドル後の minify で
 * 変数名衝突が発生して loader が呼び出せなくなる。
 * virtual module で直接 createRequire + .node ロードに差し替えることで回避する。
 */
function betterSqlite3Plugin() {
  // CWD 基準で解決することで、このファイルの場所ではなく
  // ビルド対象プロジェクトの node_modules から .node を取得する
  const packageJsonUrl = pathToFileURL(path.join(process.cwd(), "package.json"));
  const projectRequire = createRequire(packageJsonUrl);

  return {
    name: "better-sqlite3-native",

    /** @param {string} id */
    resolveId(id) {
      if (id === "bindings") {
        return "\0virtual:bindings";
      }
      return null;
    },

    /** @param {string} id */
    load(id) {
      if (id !== "\0virtual:bindings") {
        return null;
      }
      // better-sqlite3 の lib/database.js が require('bindings')('better_sqlite3.node') で
      // ネイティブアドオンを取得する。バンドル後は dist/ 直下の .node を直接 require する。
      return `
import { createRequire } from 'node:module';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
const _req = createRequire(import.meta.url);
const bindings = (name) => _req(join(dirname(fileURLToPath(import.meta.url)), name));
export default bindings;
export { bindings as "module.exports" };
      `.trim();
    },

    /** @param {import("rolldown").NormalizedOutputOptions} options */
    writeBundle(options) {
      const outDir = options.dir ?? (options.file ? path.dirname(options.file) : "dist");
      mkdirSync(outDir, { recursive: true });
      const src = projectRequire.resolve("better-sqlite3/build/Release/better_sqlite3.node");
      copyFileSync(src, path.join(outDir, "better_sqlite3.node"));
    },
  };
}

/**
 * @param {{ input: string, output: import("rolldown").OutputOptions }} options
 * @returns {import("rolldown").RolldownOptions}
 */
export function createNodeConfig({ input, output }) {
  return {
    input,
    platform: "node",
    output: {
      format: "esm",
      sourcemap: true,
      codeSplitting: false,
      ...output,
    },
    plugins: [
      replacePlugin(
        {
          "import.meta.env.PROD": "true",
          "import.meta.env.DEV": "false",
          "import.meta.env.MODE": JSON.stringify("production"),
          "import.meta.env.SSR": "true",
          "import.meta.env": JSON.stringify({
            PROD: true,
            DEV: false,
            MODE: "production",
            SSR: true,
          }),
        },
        { preventAssignment: true },
      ),
      importMetaGlobPlugin(),
      betterSqlite3Plugin(),
    ],
  };
}
