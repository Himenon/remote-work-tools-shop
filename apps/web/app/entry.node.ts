import { serve } from "@hono/node-server";
import { serveStatic } from "@hono/node-server/serve-static";
import app from "./server";

app.use("/static/*", serveStatic({ root: "./dist" }));

const server = serve({ fetch: app.fetch, port: 3000 });

const EXIT_SUCCESS = 0;

const shutdown = () => {
  server.close(() => process.exit(EXIT_SUCCESS));
};

process.on("SIGTERM", shutdown);
process.on("SIGINT", shutdown);
