// import.meta.env.PROD は Vite が提供する変数であり、Node.js ネイティブの ESM には存在しない。
// HonoX の _renderer.tsx は `import.meta.env.PROD ? "/static/..." : "/app/..."` で
// dev/prod のアセットパスを切り替えているが、これは Vite が本番ビルド時に静的置換することを前提にしている。
// 参照: https://vite.dev/guide/env-and-mode#production-replacement
//
// このビルドは Vite を経由しない直接 Rolldown ビルドであるため、Vite による置換は行われない。
// Rolldown は ESM 以外の出力形式では import.meta の未知プロパティを {} に置換するが、
// ESM 出力でも import.meta.env は Node.js に存在しないため undefined となり
// `undefined.PROD` で TypeError が発生する。
// 参照: https://rolldown.rs/in-depth/non-esm-output-formats.html
//
// replacePlugin でテキストベースの静的置換を行い、バンドル内から import.meta.env を除去する。

import type { RolldownPlugin } from "rolldown";
import { replacePlugin } from "rolldown/plugins";

export function importMetaEnvPlugin(): RolldownPlugin {
  return replacePlugin(
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
  );
}
