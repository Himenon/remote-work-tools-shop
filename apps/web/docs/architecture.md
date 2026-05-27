# HonoX アーキテクチャ

```
app/
├── server.ts          # [規約] サーバーエントリポイント
├── client.ts          # [規約] クライアントエントリポイント（Islands ハイドレーション）
├── style.css          # [任意] CSS エントリポイント（Tailwind をここから import）
├── global.d.ts        # [規約] グローバル型定義
│
├── routes/            # [規約] ファイルベースルーティング（パスがそのまま URL になる）
│   ├── _renderer.tsx  # [規約] `_` プレフィックスはレイアウト・特殊ファイルの規約
│   ├── index.tsx      # [規約] GET /
│   ├── shop/
│   │   ├── bag/
│   │   │   └── index.tsx               # GET /shop/bag
│   │   ├── buy/
│   │   │   └── [productName]/          # [規約] `[param]` が動的セグメントの記法
│   │   │       └── index.tsx           # GET /shop/buy/:productName
│   │   └── checkout/
│   │       └── index.tsx               # GET /shop/checkout
│   └── api/                            # [任意] ディレクトリ名。routes/ 以下はすべてルーティング対象
│       ├── add/bag/index.ts            # POST /api/add/bag
│       ├── checkout/index.ts           # POST /api/checkout
│       ├── product/[productName]/
│       │   └── spec/index.ts           # GET /api/product/:productName/spec
│       ├── products/index.ts           # GET /api/products
│       └── show/bag/index.ts           # GET /api/show/bag
│
└── islands/           # [規約] デフォルト値 `/app/islands`（honox/vite プラグインで変更可能）
    ├── BuyFormConnector.tsx       # [任意] ファイル名
    └── CheckoutFormConnector.tsx  # [任意] ファイル名
```

## 規約の参考リンク

| 規約                                                                  | 参照箇所                                                                              |
| --------------------------------------------------------------------- | ------------------------------------------------------------------------------------- |
| `app/server.ts` のパス                                                | [HonoX README - Server Entry File](https://github.com/honojs/honox#server-entry-file) |
| `app/routes/` のファイルベースルーティング                            | [HonoX README - Routes](https://github.com/honojs/honox#routes)                       |
| `_renderer.tsx` / `_404.tsx` / `_error.tsx` の `_` プレフィックス     | [HonoX README - Renderer](https://github.com/honojs/honox#renderer)                   |
| `[param]` 動的セグメント記法                                          | [HonoX README - Routes](https://github.com/honojs/honox#routes)                       |
| `app/islands/` ディレクトリ名                                         | [HonoX README - Islands](https://github.com/honojs/honox#islands)                     |
| islands コンポーネントの命名規則（camelCase、`_` 不可、全大文字不可） | [HonoX README - Islands](https://github.com/honojs/honox#islands)                     |

## routes と islands の使い分け

|                  | routes            | islands                                              |
| ---------------- | ----------------- | ---------------------------------------------------- |
| 実行環境         | サーバー（SSR）   | サーバーでレンダリング後、ブラウザでハイドレーション |
| インタラクション | なし（静的 HTML） | あり（`useState` 等が使える）                        |
| ファイル拡張子   | `.ts` / `.tsx`    | `.tsx`                                               |
