import path from "node:path";

import tailwindcss from "@tailwindcss/vite";
import { storybookTest } from "@storybook/addon-vitest/vitest-plugin";
import { playwright } from "@vitest/browser-playwright";
import { defineConfig } from "vitest/config";

process.env.STORYBOOK_COMPONENT_PATHS = "src/**/*.vrt.?(m)[jt]s?(x)";

// vitest.config.ts と統合してはいけない。
// 理由1: STORYBOOK_COMPONENT_PATHS がプロセス単位の環境変数のため、
//         このファイル（vrt のみ）と vitest.config.ts（spec のみ）を同一プロセスで共存できない。
// 理由2: VRT はスクリーンショット比較のため macOS ランナーでの実行が必要であり、
//         ubuntu で実行する spec テストとは CI 上の実行環境が異なる。
const dirname = typeof __dirname === "undefined" ? import.meta.dirname : __dirname;

export default defineConfig({
  plugins: [tailwindcss()],
  optimizeDeps: {
    include: ["@base-ui/react/fieldset", "@base-ui/react/number-field", "@base-ui/react/slider"],
  },
  test: {
    globals: true,
    projects: [
      {
        extends: true,
        plugins: [storybookTest({ configDir: path.join(dirname, ".storybook") })],
        define: { __VITEST_DARK__: "false" },
        test: {
          name: "vrt",
          browser: {
            enabled: true,
            headless: true,
            provider: playwright({}),
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
