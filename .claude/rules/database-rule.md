# `@rwts/database` (`packages/database/`) アーキテクチャルール

## ディレクトリ構成

```
packages/database/src/
├── client.ts                   # PrismaClient シングルトン（唯一の例外）
└── {tableName}/
    ├── {queryName}.ts          # 読み取り操作（1ファイル1クエリ）
    ├── {commandName}.ts        # 書き込み操作（1ファイル1コマンド）
    └── index.ts                # 再エクスポートのみ
```

### 実例

```
src/
├── client.ts
├── product/
│   ├── findAllProducts.ts
│   ├── findProductSpec.ts
│   └── index.ts
└── bag/
    ├── findAllBagItems.ts
    ├── addBagItem.ts
    ├── clearBag.ts
    └── index.ts
```

## ファイル分割ルール

- **1ファイル1クエリまたは1コマンド**。複数の関数を1ファイルにまとめない
- ファイル名は関数名と一致させる（例: `findAllProducts.ts` → `export const findAllProducts`）
- テーブル名のディレクトリ名はモデル名の先頭小文字キャメルケース（例: `BagItem` → `bag/`）

## クエリ（読み取り）

- DB からデータを読み取る操作
- 関数名は `find` / `get` / `list` で始める

## コマンド（書き込み）

- DB のデータを変更する操作（追加・更新・削除）
- 操作結果を表す型定義も同じファイルに置く（例: `AddBagItemResult`, `AddBagItemError`）
- 関数名は `add` / `update` / `delete` / `clear` で始める

## index.ts

- `{queryName}.ts` / `{commandName}.ts` からの再エクスポートのみ書く
- ロジックを書かない

## client.ts

- `PrismaClient` のシングルトンを export するだけ
- テーブルごとのディレクトリには置かず `src/` 直下に置く

## 共通ルール

- すべての関数は `async` で定義し、戻り値の型を明示する
- `apps/web` など上位パッケージから直接インポートしてはいけない。必ず `@rwts/server` の repository 層を経由すること
