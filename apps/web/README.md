# @rwts/web

## 開発手順

```bash
# 依存パッケージをインストールする（リポジトリルートで実行）
pnpm install

# 開発サーバーを起動する
# Vite dev server（http://localhost:5173）が honox() プラグイン経由で Hono アプリを内包して起動する。
# ルーティング・SSR・静的ファイル配信をポート 5173 一本で処理する。
pnpm dev

# 本番用ビルドを生成する（サーバー → クライアントの順にビルド）
pnpm build

# ビルド済みサーバーを起動する
# @hono/node-server が独立した Node.js プロセスとして起動する（http://localhost:3000）。
pnpm start
```
