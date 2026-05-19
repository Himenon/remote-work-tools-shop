import type { OutputOptions, RolldownOptions } from "rolldown";
import { betterSqlite3Plugin } from "./better-sqlite3-plugin.ts";
import { importMetaGlobPlugin } from "./import-meta-glob-plugin.ts";
import { importMetaEnvPlugin } from "./import-meta-env-plugin.ts";

export function createNodeConfig({ input, output }: { input: string; output: OutputOptions }): RolldownOptions {
  return {
    input,
    platform: "node",
    output: {
      format: "esm",
      sourcemap: true,
      codeSplitting: false,
      ...output,
    },
    plugins: [importMetaEnvPlugin(), importMetaGlobPlugin(), betterSqlite3Plugin()],
  };
}
