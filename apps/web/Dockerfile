FROM node:24-slim AS native-builder

RUN apt-get update && apt-get install -y --no-install-recommends \
    python3 make g++ \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /build
RUN npm install better-sqlite3@12.9.0

# ── runner ────────────────────────────────────────────────────────────────────
FROM node:24-slim AS runner
WORKDIR /app

ADD apps/web/dist ./dist
COPY --from=native-builder \
    /build/node_modules/better-sqlite3/build/Release/better_sqlite3.node \
    ./dist/server/better_sqlite3.node

ADD packages/database/prisma/dev.db /data/db.sqlite

ENV NODE_ENV=production
ENV DATABASE_URL="file:/data/db.sqlite"

EXPOSE 3000

CMD ["node", "dist/server/index.js"]
