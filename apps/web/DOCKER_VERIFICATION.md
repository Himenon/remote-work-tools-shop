# Docker イメージ動作確認手順

`pnpm run build:image` でビルドした Docker イメージが正常に動作するかを確認する手順を記載する。

## 確認の目的

以下を一括で検証する。

- SSR レンダリングが動作し、全ページが HTML を返すこと
- SQLite データベースからシードデータを読み込めること
- 静的アセット（CSS・クライアント JS）が配信されること
- バッグへの商品追加・決済といった書き込み操作が正常に完了すること
- 存在しないリソースへのアクセスに対して適切なエラーが返ること

## 自動確認（推奨）

スモークテストスクリプトが上記を自動で検証する。

### ビルドからテストまで一括で実行する

```bash
./apps/web/scripts/smoke-test.sh --build
```

### ビルド済みイメージに対してテストのみ実行する

```bash
# 先にイメージをビルドしておく
pnpm run build:image

# テスト実行
./apps/web/scripts/smoke-test.sh
```

### 出力例

```
===== Docker スモークテスト: rwts-web =====

── コンテナの起動 ──
  → サーバーの起動を待機しています (最大 30s)...
  → サーバーが起動しました (3s)

── HTMLページ（SSRレンダリング確認）──
  ✓ GET /: HTTP 200
  ✓ GET /shop/bag: HTTP 200
  ✓ GET /shop/buy/macbook-pro-16: HTTP 200
  ✓ GET /shop/checkout: HTTP 200
  ✓ / に <!DOCTYPE html> が含まれる
  ✓ / に商品リストが含まれる

── 静的アセット ──
  ✓ GET /static/style.css: HTTP 200
  ✓ GET /static/client.js: HTTP 200
  ...

=========================================
  結果: 20 件合格 / 0 件失敗
=========================================
```

テストが1件でも失敗した場合、スクリプトはステータスコード 1 で終了する。

---

## 手動確認

スクリプトを使わず手動で確認する場合の手順。

### 前提

- Docker が起動していること
- `pnpm run build:image` が完了していること

### 1. コンテナを起動する

```bash
docker run --rm -p 3000:3000 --name rwts-web-test rwts-web
```

### 2. HTML ページが返るか確認する

ブラウザで `http://localhost:3000/` を開き、商品一覧が表示されることを確認する。
または curl で確認する。

```bash
# 商品一覧ページ（200 + HTMLが返ること）
curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/

# バッグページ
curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/shop/bag

# 商品購入ページ
curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/shop/buy/macbook-pro-16
```

いずれも `200` が返ること。

### 3. DB からデータを読み込めているか確認する

```bash
curl -s http://localhost:3000/api/products | head -c 200
```

`macbook-pro-16` を含む JSON 配列（4件）が返ること。

### 4. 静的アセットが配信されているか確認する

```bash
curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/static/style.css
curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/static/client.js
```

いずれも `200` が返ること。

### 5. 購入フローを確認する

```bash
# 商品をバッグに追加する（201 が返ること）
curl -s -o /dev/null -w "%{http_code}" \
  -X POST http://localhost:3000/api/add/bag \
  -H "Content-Type: application/json" \
  -d '{"product":{"productId":"macbook-pro-16","specs":{}},"count":1}'

# バッグの中身を確認する（macbook-pro-16 が含まれること）
curl -s http://localhost:3000/api/show/bag

# 決済する（200 が返ること）
curl -s -o /dev/null -w "%{http_code}" -X POST http://localhost:3000/api/checkout

# 決済後にバッグが空になっていることを確認する（"items":[] が含まれること）
curl -s http://localhost:3000/api/show/bag
```

### 6. コンテナを停止する

```bash
docker stop rwts-web-test
```

---

## 確認対象の一覧

| 対象                   | URL                                | メソッド | 期待する HTTP ステータス |
| ---------------------- | ---------------------------------- | -------- | ------------------------ |
| 商品一覧ページ         | `/`                                | GET      | 200                      |
| バッグページ           | `/shop/bag`                        | GET      | 200                      |
| 商品購入ページ         | `/shop/buy/macbook-pro-16`         | GET      | 200                      |
| チェックアウトページ   | `/shop/checkout`                   | GET      | 200                      |
| CSS アセット           | `/static/style.css`                | GET      | 200                      |
| クライアント JS        | `/static/client.js`                | GET      | 200                      |
| 商品一覧 API           | `/api/products`                    | GET      | 200                      |
| バッグ内容 API         | `/api/show/bag`                    | GET      | 200                      |
| 商品スペック API       | `/api/product/macbook-pro-16/spec` | GET      | 200                      |
| バッグ追加 API         | `/api/add/bag`                     | POST     | 201                      |
| 決済 API               | `/api/checkout`                    | POST     | 200                      |
| 空バッグでの決済       | `/api/checkout`                    | POST     | 422                      |
| 存在しない商品スペック | `/api/product/nonexistent/spec`    | GET      | 404                      |

---

## トラブルシューティング

### コンテナが起動しない

`docker logs rwts-web-test` でログを確認する。

よくある原因:

- `DATABASE_URL` が未設定（コンテナ内では `/data/db.sqlite` を参照するよう設定済みのため、通常は発生しない）
- `better_sqlite3.node` がコンテナのアーキテクチャと一致しない（M1/M2 Mac でビルドしたイメージを x86 環境で動かす場合など）

### スタイルが適用されていない

`/static/style.css` が 200 を返すか確認する。

```bash
curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/static/style.css
```

404 の場合、`pnpm run build:image` が `vite build --mode client` まで完了しているか確認する。

### 商品データが表示されない

`/api/products` の応答を確認する。空配列 `[]` が返る場合、DB ファイルのシードが正しく適用されていない。

```bash
curl -s http://localhost:3000/api/products
```

`packages/database/prisma/dev.db` が存在するか、および Dockerfile の COPY ステップが成功しているか確認する。
