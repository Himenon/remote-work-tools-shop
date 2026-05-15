# @rwts/contract

アプリケーション全体の入出力スキーマを一元管理するパッケージです。
クライアント・サーバー間のすべてのデータ境界において、[Zod](https://zod.dev/) を用いた型安全なバリデーションと型定義を提供します。

## ディレクトリ構造

```
packages/contract/
├── client/          # サーバーからの応答スキーマ
│   └── product.ts
├── server/          # クライアントからのリクエストスキーマ
│   └── product.ts
└── form/            # UIフォームの入力バリデーションスキーマ
    ├── BuyFormSchema.ts
    ├── CheckoutFormSchema.ts
    └── ExampleFormSchema.ts
```

## 3層の責務分担

### `client/` — サーバー応答の検証

サーバーがクライアントへ返すレスポンスの形状を定義します。
型定義と Zod スキーマの両方をエクスポートし、受信したJSONを安全に扱えるようにします。

```ts
import type { ProductListItem, ProductSpec } from "@rwts/contract/client/product";
```

| エクスポート                                | 説明                                 |
| ------------------------------------------- | ------------------------------------ |
| `ProductListItemSchema` / `ProductListItem` | 商品一覧の1件分                      |
| `ProductSpecSchema` / `ProductSpec`         | 商品詳細（カテゴリ別の判別ユニオン） |
| `ProductsInBagSchema` / `ProductsInBag`     | バッグ内の商品一覧                   |
| `BagItemSchema` / `BagItem`                 | バッグ内の1件分                      |

### `server/` — HTTPリクエストの検証

クライアントがサーバーへ送信するペイロードとURLパラメータを定義します。
APIミドルウェアでのリクエストバリデーションに使用します。

```ts
import { AddBagPayloadSchema } from "@rwts/contract/server/product";
```

| エクスポート                                  | 説明                             |
| --------------------------------------------- | -------------------------------- |
| `ProductSpecParamSchema` / `ProductSpecParam` | 商品詳細取得時のURLパラメータ    |
| `AddBagPayloadSchema` / `AddBagPayload`       | バッグへの商品追加リクエスト本文 |

### `form/` — UIフォーム入力の検証

ユーザーがフォームに値を入力する段階のバリデーションを定義します。
`z.input<Schema>` で未入力（`null`）を許容し、`z.infer<Schema>` で送信時の確定型を表現します。

```ts
import { BuyFormSchema, DEFAULT_COUNT, WRAPPING_OPTIONS } from "@rwts/contract/form/BuyFormSchema";
```

| ファイル             | 説明                                               |
| -------------------- | -------------------------------------------------- |
| `BuyFormSchema`      | 購入フォーム（数量・スペック選択・ラッピング設定） |
| `CheckoutFormSchema` | 決済フォーム（拡張予定）                           |
| `ExampleFormSchema`  | サーバー設定フォームのサンプル                     |

## インポートルール

このパッケージは **層を明示してインポート**します。
どの境界のスキーマかが呼び出し元のコードから一目でわかります。

```ts
// ✅ 層を明示
import type { ProductSpec } from "@rwts/contract/client/product";
import { AddBagPayloadSchema } from "@rwts/contract/server/product";
import { BuyFormSchema } from "@rwts/contract/form/BuyFormSchema";

// ❌ barrel import は存在しない
import { ... } from "@rwts/contract";
```

## 依存関係

- **zod** のみ。ビルド成果物ではなく `.ts` ファイルを直接エクスポートするため、`tsc` によるビルドステップは不要です。
