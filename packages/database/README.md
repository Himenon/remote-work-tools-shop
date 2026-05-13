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
│   ├── bag.ts             # バッグ操作
│   └── product.ts         # 商品操作
├── generated/             # prisma generate の出力先（gitignore対象）
├── prisma.config.ts       # Prisma CLI 設定（接続 URL など）
└── .env                   # ローカル開発用環境変数（gitignore対象）
```

## ローカル開発セットアップ

### 1. 依存パッケージをインストール

```bash
pnpm install
```

`better-sqlite3` はネイティブモジュールのため、初回インストール後にビルドが必要な場合があります。

### 2. Prisma Client を生成

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

| コマンド           | 内容                                               |
| ------------------ | -------------------------------------------------- |
| `pnpm db:generate` | Prisma Client を生成（スキーマ変更後に実行）       |
| `pnpm db:migrate`  | マイグレーションを作成・適用                       |
| `pnpm db:seed`     | 初期データを投入                                   |
| `pnpm db:reset`    | データベースをリセットしてマイグレーションを再実行 |

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
