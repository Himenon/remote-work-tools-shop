import path from "node:path";

import { storybookTest } from "@storybook/addon-vitest/vitest-plugin";
import { playwright } from "@vitest/browser-playwright";
import { defineConfig } from "vitest/config";

process.env.STORYBOOK_COMPONENT_PATHS = "";

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
