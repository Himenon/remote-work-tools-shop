---
paths:
  - "apps/web/app/**/*.ts"
  - "apps/web/app/**/*.tsx"
  - "packages/ui/src/**/*.ts"
  - "packages/ui/src/**/*.tsx"
  - "packages/server/**/*.ts"
  - "packages/contract/**/*.ts"
---

# `@rwts/web` (`apps/web/`)

## 責務

- HTTPルーティングの定義（`app/routes/`）
- SSRレンダリング
- APIエンドポイントのリクエスト受付とレスポンス返却
- Islands によるクライアントサイドのインタラクション（`app/islands/`）

## してはいけないこと

- UIコンポーネントの実装（`@rwts/ui` の責務）
- DBへの直接アクセス（`@rwts/server` の責務）

# `@rwts/ui` (`packages/ui/`)

## 責務

- ユーザーに情報を表示すること
- ユーザーの入力を検証してアプリケーションに返却すること

## してはいけないこと

- サーバー側のドメインロジックを知っていること
- `apps/web` 起因で決まる型定義を参照すること

# `@rwts/server` (`packages/server/`)

## 責務

- DBアクセスおよびデータの永続化（`database/`）

## してはいけないこと

- HTTPリクエスト・レスポンスの処理
- UI表示

# `@rwts/contract` (`packages/contract/`)

## `contract/form/`

- ユーザーからの入力イベント発生時のバリデーション Schema の定義
- ユーザーの入力をアプリケーションに渡す前にすべて検証するための Schema がここで定義される

## `contract/server/`

- サーバー側のバリデーション Schema の定義。クライアントからの Payload を検証する。
- クライアント側の Request Schema に該当する。
- `zod` で Schema を定義し、`z.infer` で型定義を抽出すること。Validation のメッセージもこのときに作成する。

## `contract/client/`

- クライアント側のバリデーション Schema の定義。サーバーからの Payload を検証する。
- サーバー側の Response Schema に該当する。
- HTTP のレスポンスはこの Schema で検証される。
- `zod` で Schema を定義し、`z.infer` で型定義を抽出すること。Validation のメッセージもこのときに作成する。

# 共通の型定義

本ルールに記載のない型定義は定義してはいけない。
「共通」という概念は存在せず、必ずなにかのドメインに属する定義のみが存在する。
推測せず、判断できない場合はユーザーに問い合わせること。
