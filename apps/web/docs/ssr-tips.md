# HonoX SSR セットアップ手順

参考ドキュメント:

- [HonoX README](https://github.com/honojs/honox)
- [@hono/react-renderer](https://github.com/honojs/middleware/tree/main/packages/react-renderer)
- [Tailwind CSS v4](https://tailwindcss.com/docs/installation/framework-guides/vite)

---

## セットアップ手順

- `package.json` に `"type": "module"` を追加する

  > `@hono/vite-build/node` が ESM only のため、省略すると Vite が config 読み込み時に `require()` でエラーになる

- `app/server.ts` を作成し `createApp()` をデフォルトエクスポートする

- `app/client.ts` を作成し `createClient()` に `hydrate` / `createElement` を渡す

  > `@hono/react-renderer` 使用時は HonoX の内部型 (`Node`) と React の型 (`ReactNode` / `ReactElement`) が一致しないため型キャストが必要

- `app/style.css` を作成し CSS を import する

- `app/routes/_renderer.tsx` を作成し `reactRenderer()` でレイアウトを定義する
  - CSS は `Link` コンポーネント（`honox/server`）で読み込む
  - `<link>` タグ直書きでは本番ビルド後のハッシュ付きファイル名に解決されないため `Link` を使う

- `vite.config.ts` の `honox()` に `client.input` を明示し `style.css` を含める

  ```ts
  honox({ client: { input: ["/app/client.ts", "/app/style.css"] } });
  ```

- `tsconfig.json` に `"jsxImportSource": "react"` と `"types": ["vite/client"]` を追加する

- React 19 ではグローバル `JSX` namespace が廃止されているため `app/global.d.ts` で再宣言する
