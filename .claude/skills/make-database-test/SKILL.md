---
name: make-database-test
description: packages/database のテストを書くときに利用します。「databaseのテストを書いて」「DBのテストを実装して」で実行できます。
metadata:
  context: fork
  author: Himenon
  allowed-tools:
    - Read
    - Write
    - Bash
---

# `@rwts/database` テストの実装

## テスト実行コマンド

```bash
pnpm --filter @rwts/database test
```

## ファイル配置ルール

ルールファイル `.claude/rules/database-rule.md` に従い、各クエリ・コマンドファイルの隣に `__tests__/` ディレクトリを作成する。

```
src/
├── product/
│   └── query/
│       ├── findAllProducts.ts
│       └── __tests__/
│           ├── __snapshots__/
│           │   └── findAllProducts.sql   # SQL スナップショット
│           └── findAllProducts.test.ts
└── bag/
    └── command/
        ├── addBagItem.ts
        └── __tests__/
            ├── __snapshots__/
            │   ├── addBagItem-new.sql
            │   └── addBagItem-update.sql
            └── addBagItem.test.ts
```

## テストの3要件

1. 各ファイルの `__tests__/` ディレクトリに配置する
2. 発行される SQL の `toMatchFileSnapshot` スナップショットを記録する（`.sql` ファイルに保存）
3. インメモリ SQLite（テンポラリファイル）に実際にクエリを実行する

## 基本テンプレート

```typescript
import { vi, describe, it, expect, beforeAll, afterAll, beforeEach } from "vitest";
import {
  createTestPrisma,
  clientMock,
  setTestPrisma,
  type QueryRecord,
  formatQuerySnapshot,
} from "#test-utils";
import { findAllProducts } from "../findAllProducts";

// #client を clientMock に差し替える。vi.mock はホイストされるためゲッター参照が必要
vi.mock("#client", () => clientMock);

describe("findAllProducts", () => {
  let capturedQueries: QueryRecord[];
  let clearCapturedQueries: () => void;

  beforeAll(async () => {
    const result = await createTestPrisma();
    setTestPrisma(result.prisma);          // clientMock.prisma に注入
    capturedQueries = result.capturedQueries;
    clearCapturedQueries = result.clearCapturedQueries;
  });

  afterAll(async () => {
    await clientMock.prisma.$disconnect();
  });

  beforeEach(async () => {
    await clientMock.prisma.bagItem.deleteMany();
    await clientMock.prisma.product.deleteMany();
    clearCapturedQueries();
  });

  it("商品が1件も存在しないとき、空の配列を返す", async () => {
    const result = await findAllProducts();
    expect(result).toEqual([]);
  });

  it("商品が2件存在するとき、2件の商品一覧を返す", async () => {
    // テスト用データを直接 prisma で投入（テスト対象外）
    await clientMock.prisma.product.create({ data: { ... } });
    clearCapturedQueries();  // セットアップ時のクエリをリセット

    const result = await findAllProducts();

    expect(result).toEqual([...]);
    // SQL スナップショット（.sql ファイルに保存・シンタックスハイライト付き）
    await expect(formatQuerySnapshot(capturedQueries)).toMatchFileSnapshot(
      "./__snapshots__/findAllProducts.sql",
    );
  });
});
```

## `#test-utils` から使えるもの

| エクスポート                   | 役割                                                              |
| ------------------------------ | ----------------------------------------------------------------- |
| `createTestPrisma()`           | テンポラリ SQLite DB を作成して PrismaClient を返す               |
| `clientMock`                   | `vi.mock("#client", () => clientMock)` に渡すプロキシオブジェクト |
| `setTestPrisma(prisma)`        | `clientMock.prisma` に実際のクライアントを注入する                |
| `formatQuerySnapshot(queries)` | キャプチャしたクエリを読みやすい SQL 文字列にフォーマットする     |
| `QueryRecord`                  | `{ query: string; params: string }` 型                            |

## FK 制約がある場合

Prisma は SQLite でも外部キー制約を有効にする。
`BagItem` は `Product` を参照するため、bag テストでは `beforeEach` で親テーブルのデータも投入する。

```typescript
beforeEach(async () => {
  await clientMock.prisma.bagItem.deleteMany();
  await clientMock.prisma.product.deleteMany();
  await clientMock.prisma.product.create({ data: TEST_PRODUCT }); // FK 親を先に作成
  clearCapturedQueries();
});
```

## SQL スナップショットのファイル名

- 1 テストケースにつき 1 ファイル
- 複数のスナップショットがある場合はテスト内容を英語で表す（例: `addBagItem-new.sql`, `addBagItem-update.sql`）
- ファイルは `__tests__/__snapshots__/` 以下に配置する（`toMatchFileSnapshot` のパスは `__tests__/` からの相対パス）

## 動作確認

テスト実装後に `pnpm --filter @rwts/database test` を実行し、全テストが通ることを確認すること。
