---
paths:
  - "src/**/*.ts"
  - "src/**/*.tsx"
---

# `packages/ui`

## 責務

- ユーザーに情報を表示すること
- ユーザーの情報を検証してアプリケーションに返却すること

## してはいけないこと

- サーバー側のドメインロジックを知っていること
- `src/app`起因で決まる型定義を参照すること

# `packages/app`

## 責務

- アプリケーションのルーティングを定めること
- APIの呼び出しエラーハンドリング
- データの受け渡し、変換を担う

## してはいけないこと

- UIの実装（`src/ui`の責務）
- DBへの保存

# `packages/contract`

## `packages/contract/form`

- ユーザーからの入力イベント発生時のバリデーションSchemaの定義
- ユーザーの入力をアプリケーションにわたす前にすべて検証するためのSchemaがここで定義される

## `packages/contract/server`

- サーバー側のバリデーションSchemaの定義。クライアントからPayloadを検証する。
- クライアント側のRequest Schemaに゙該当する。
- `zod`でSchemaを定義し、`z.infer`で型定義を抽出すること。Validationのメッセージもこのときに作成する。

## `packages/contract/client`

- クライアント側のバリデーションSchemaの定義。サーバーからのPayloadを検証する。
- サーバー側のResponse Schemaに゙該当する。
- WebSocketのレスポンスはこのSchemaで検証される。
- HTTPのレスポンスはこのSchemaで検証される。
- `zod`でSchemaを定義し、`z.infer`で型定義を抽出すること。Validationのメッセージもこのときに作成する。

# 共通の型定義

本ルールに記載のない型定義は定義してはいけない。
「共通」という概念は存在せず、必ずなにかのドメインに属する定義のみが存在する。
推測せず、判断できない場合はユーザーに問い合わせること。
