import { createNodeConfig } from "@rwts/builder/node";

export default createNodeConfig({
  input: "app/entry.node.ts",
  output: { file: "dist/server/index.js" },
});
