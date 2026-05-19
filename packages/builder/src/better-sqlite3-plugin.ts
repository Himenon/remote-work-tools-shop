import { copyFileSync, mkdirSync } from "node:fs";
import { createRequire } from "node:module";
import { dirname, join } from "node:path";
import { pathToFileURL } from "node:url";
import dedent from "dedent";
import type { NormalizedOutputOptions, RolldownPlugin } from "rolldown";

/**
 * better-sqlite3 v12 の native addon を output dir に配置し、
 * モジュール本体を virtual module に置き換える Rolldown plugin。
 *
 * v12 は独自の native loader を内包するが、バンドル後の minify で
 * 変数名衝突が発生して loader が呼び出せなくなる。
 * virtual module で直接 createRequire + .node ロードに差し替えることで回避する。
 */
export function betterSqlite3Plugin(): RolldownPlugin {
  // CWD 基準で解決することで、このファイルの場所ではなく
  // ビルド対象プロジェクトの node_modules から .node を取得する
  const _require = createRequire(pathToFileURL(join(process.cwd(), "package.json")));

  return {
    name: "better-sqlite3-native",

    resolveId(id: string) {
      if (id === "bindings") {
        return "\0virtual:bindings";
      }
      return null;
    },

    load(id: string) {
      if (id !== "\0virtual:bindings") {
        return null;
      }
      // better-sqlite3 の lib/database.js が require('bindings')('better_sqlite3.node') で
      // ネイティブアドオンを取得する。バンドル後は dist/ 直下の .node を直接 require する。
      return dedent`
        import { createRequire } from 'node:module';
        import { dirname, join } from 'node:path';
        import { fileURLToPath } from 'node:url';
        const _req = createRequire(import.meta.url);
        const bindings = (name) => _req(join(dirname(fileURLToPath(import.meta.url)), name));
        export default bindings;
        export { bindings as "module.exports" };
      `;
    },

    writeBundle(options: NormalizedOutputOptions) {
      const outDir = options.dir ?? (options.file ? dirname(options.file) : "dist");
      mkdirSync(outDir, { recursive: true });
      const src = _require.resolve("better-sqlite3/build/Release/better_sqlite3.node");
      copyFileSync(src, join(outDir, "better_sqlite3.node"));
    },
  };
}
