# @rwts/database

データベースアクセス層。Prisma ORM を使用して SQLite（ローカル開発）または PostgreSQL（本番）に接続します。

## ディレクトリ構成

```
packages/database/
├── prisma/
│   ├── schema.prisma      # データモデル定義
│   ├── migrations/        # マイグレーション履歴
│   ├── seed.ts            # 初期データ投入スクリプト
│   └── dev.db             # SQLite データベースファイル（gitignore対象）
├── src/
│   ├── client.ts          # PrismaClient シングルトン
│   ├── bag/
│   │   ├── query/         # 読み取りクエリ（findAllBagItems など）
│   │   └── command/       # 書き込みコマンド（addBagItem, clearBag）
│   └── product/
│       └── query/         # 読み取りクエリ（findAllProducts, findProductSpec）
├── generated/             # prisma generate の出力先（gitignore対象）
├── prisma.config.ts       # Prisma CLI 設定（接続 URL など）
└── .env                   # ローカル開発用環境変数（gitignore対象）
```

## ローカル開発セットアップ

### 1. 依存パッケージをインストール

```bash
pnpm install
```

### 2. better-sqlite3 ネイティブモジュールをビルド

`better-sqlite3` は C++ ネイティブモジュールです。Node.js のバージョンに合ったバイナリが存在しない場合、以下のコマンドでビルドしてください。

```bash
pnpm db:build-native
```

上記が機能しない場合（出力なしで終了するなどビルドが行われない場合）、`better-sqlite3` のディレクトリで `node-gyp` を直接実行してください。

```bash
cd node_modules/.pnpm/better-sqlite3@<バージョン>/node_modules/better-sqlite3
pnpm dlx node-gyp rebuild
```

バージョンは `node_modules/.pnpm/` 以下のディレクトリ名で確認できます。ビルド成功後に `build/Release/better_sqlite3.node` が生成されます。

### 3. Prisma Client を生成

```bash
pnpm db:generate
```

### 3. マイグレーションを実行

```bash
pnpm db:migrate
```

初回実行時に `prisma/dev.db` が作成されます。

### 4. 初期データを投入

```bash
pnpm db:seed
```

4 件の商品（MacBook Pro 16、iPhone 15 Pro、Standing Desk Pro、Blue Yeti Pro）が登録されます。

## スクリプト一覧

| コマンド               | 内容                                                                  |
| ---------------------- | --------------------------------------------------------------------- |
| `pnpm build`           | Prisma Client を生成（リリースビルド用。ルートの build から呼ばれる） |
| `pnpm db:build-native` | better-sqlite3 ネイティブバイナリをビルド（Node.js 更新後に実行）     |
| `pnpm db:generate`     | Prisma Client を生成（スキーマ変更後に手動実行）                      |
| `pnpm db:migrate`      | マイグレーションを作成・適用                                          |
| `pnpm db:seed`         | 初期データを投入                                                      |
| `pnpm db:reset`        | データベースをリセットしてマイグレーションを再実行                    |

## 環境変数

| 変数名         | 説明                 | デフォルト（未設定時）                  |
| -------------- | -------------------- | --------------------------------------- |
| `DATABASE_URL` | データベース接続 URL | `file:<パッケージルート>/prisma/dev.db` |

ローカル開発では `.env` に `DATABASE_URL="file:./prisma/dev.db"` が設定済みです。

## データモデル

### Product

商品情報。`productId` を主キーとして、名称・価格・キャッチコピー・カテゴリ・カスタマイズ可能なスペック定義を保持します。

### BagItem

ショッピングバッグの内容。`productId` で `Product` と関連付け、選択済みスペック（`specs`）と個数（`count`）を保持します。同一商品は `productId` で一意に管理されます。

## 注意事項

- このパッケージは直接 `apps/web` からインポートしてはいけません。必ず `@rwts/server` の repository 層を経由してください。
- `generated/` と `prisma/*.db` はリポジトリに含まれません。新規クローン後は必ず `db:generate` と `db:migrate` を実行してください。
