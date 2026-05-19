import { createNodeConfig } from "@rwts/builder/node";

/**
 * @type {import("rolldown").RolldownOptions}
 */
export default createNodeConfig({
  input: "app/entry.node.ts",
  output: { file: "dist/server/index.js" },
});
