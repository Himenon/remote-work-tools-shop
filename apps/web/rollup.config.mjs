import { createNodeConfig } from "@rwts/builder/node";

/**
 * @type {import("rollup").RollupOptions}
 */
export default createNodeConfig({
  input: "app/server.ts",
  output: { file: "dist/index.js" },
});
