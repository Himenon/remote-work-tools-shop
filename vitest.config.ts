import path from "node:path";

import tailwindcss from "@tailwindcss/vite";
import { storybookTest } from "@storybook/addon-vitest/vitest-plugin";
import { playwright } from "@vitest/browser-playwright";
import { defineConfig } from "vitest/config";

process.env.STORYBOOK_COMPONENT_PATHS ??= ["src/**/*.spec.?(m)[jt]s?(x)", "src/**/*.vrt.?(m)[jt]s?(x)"].join(";");

const dirname = typeof __dirname === "undefined" ? import.meta.dirname : __dirname;

// vitest.a11y.config.ts と統合してはいけない。
// 理由1: STORYBOOK_COMPONENT_PATHS がプロセス単位の環境変数のため、
//         このファイル（spec/vrt を含む）と a11y（空文字でストーリーのみ）を同一プロセスで共存できない。
// 理由2: このファイルはコンポーネントテスト・VRT 用、a11y はライト/ダーク両モードの
//         アクセシビリティチェック用であり、CI 上で実行目的が異なる。
// More info at: https://storybook.js.org/docs/next/writing-tests/integrations/vitest-addon
export default defineConfig({
  plugins: [tailwindcss()],
  test: {
    globals: true,
    projects: [
      {
        extends: true,
        plugins: [
          // The plugin will run tests for the stories defined in your Storybook config
          // See options at: https://storybook.js.org/docs/next/writing-tests/integrations/vitest-addon#storybooktest
          storybookTest({ configDir: path.join(dirname, ".storybook") }),
        ],
        // __VITEST_DARK__ を false に置換する。未定義のままだと preview.ts が ReferenceError を投げる。
        define: { __VITEST_DARK__: "false" },
        test: {
          name: "storybook",
          browser: {
            enabled: true,
            headless: true,
            provider: playwright({}),
            // 16:10 のビューポートサイズで撮影する
            viewport: { width: 1280, height: 800 },
            instances: [{ browser: "chromium" }],
            expect: {
              toMatchScreenshot: {
                comparatorOptions: {
                  threshold: 0.1,
                  allowedMismatchedPixelRatio: 0.01,
                },
              },
            },
          },
        },
      },
    ],
  },
});
