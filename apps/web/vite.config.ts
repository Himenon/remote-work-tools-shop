import build from "@hono/vite-build/node";
import tailwindcss from "@tailwindcss/vite";
import honox from "honox/vite";
import { defineConfig } from "vite";

export default defineConfig(({ mode }) => {
  if (mode === "client") {
    return {
      plugins: [tailwindcss()],
      build: {
        rollupOptions: {
          input: ["./app/client.ts", "./app/style.css"],
          output: {
            entryFileNames: "static/client.js",
            chunkFileNames: "static/assets/[name]-[hash].js",
            assetFileNames: "static/[name].[ext]",
          },
        },
        emptyOutDir: false,
      },
    };
  }

  return {
    ssr: {
      external: ["react", "react-dom", "better-sqlite3", "@prisma/client", "@prisma/adapter-better-sqlite3", "@prisma/adapter-pg"],
    },
    plugins: [tailwindcss(), honox({ client: { input: ["/app/client.ts", "/app/style.css"] } }), build()],
  };
});
