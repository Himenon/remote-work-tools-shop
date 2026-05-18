FROM node:24-slim AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

# ─── builder ──────────────────────────────────────────────────────────────────
FROM base AS builder

# better-sqlite3 ネイティブアドオンのコンパイルに必要
RUN apt-get update && apt-get install -y --no-install-recommends \
    python3 make g++ \
    && rm -rf /var/lib/apt/lists/*

ENV CI=true

WORKDIR /repo
COPY . .
RUN pnpm install --frozen-lockfile
RUN pnpm --filter @rwts/web build:image

# ─── runner ───────────────────────────────────────────────────────────────────
FROM node:24-slim AS runner
WORKDIR /app

# dist/index.js + dist/better_sqlite3.node のみで完結する
COPY --from=builder /repo/apps/web/dist ./dist

# シードデータ入りの SQLite ファイルをデフォルトとして同梱
# 本番運用時は -v /host/path:/data でマウントして上書きすること
COPY --from=builder /repo/packages/database/prisma/dev.db /data/db.sqlite

ENV NODE_ENV=production
ENV DATABASE_URL="file:/data/db.sqlite"

EXPOSE 3000

CMD ["node", "dist/server/index.js"]
