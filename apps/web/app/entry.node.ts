import { serve } from "@hono/node-server";
import { serveStatic } from "@hono/node-server/serve-static";
import app from "./server";

app.use("/static/*", serveStatic({ root: "./dist" }));

serve({ fetch: app.fetch, port: 3000 });
