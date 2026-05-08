import path from "node:path";

import { storybookTest } from "@storybook/addon-vitest/vitest-plugin";
import { playwright } from "@vitest/browser-playwright";
import { defineConfig } from "vitest/config";

process.env.STORYBOOK_COMPONENT_PATHS = "";

// vitest.config.ts と統合してはいけない。
// 理由1: STORYBOOK_COMPONENT_PATHS をここでは "" にしてストーリーのみ実行しているが、
//         vitest.config.ts は spec/vrt を含む値を設定しており、プロセス単位の環境変数のため共存できない。
// 理由2: このファイルはライト/ダーク両モードの a11y チェック専用であり、
//         コンポーネントテスト・VRT とは CI 上の実行目的が異なる。
const dirname = typeof __dirname === "undefined" ? import.meta.dirname : __dirname;
const configDir = path.join(dirname, ".storybook");

export default defineConfig({
  test: {
    globals: true,
    projects: [
      {
        plugins: [storybookTest({ configDir })],
        test: {
          name: "a11y:light",
          browser: {
            enabled: true,
            headless: true,
            provider: playwright({}),
            instances: [{ browser: "chromium" }],
          },
        },
      },
      {
        plugins: [storybookTest({ configDir })],
        // Vite のコンパイル時置換で preview.ts の __VITEST_DARK__ を true にする
        define: { __VITEST_DARK__: "true" },
        test: {
          name: "a11y:dark",
          browser: {
            enabled: true,
            headless: true,
            provider: playwright({}),
            instances: [{ browser: "chromium" }],
          },
        },
      },
    ],
  },
});
