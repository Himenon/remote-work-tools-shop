import { reactRenderer } from "@hono/react-renderer";
import { Script } from "honox/server";

export default reactRenderer(({ children, title }) => (
  <html lang="ja">
    <head>
      <meta charSet="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>{title ?? "RemoteWork Tools Shop"}</title>
      <meta name="description" content="リモートワークのための厳選商品を取り揃えたオンラインショップ" />
      <Script src="/app/client.ts" async />
    </head>
    <body className="min-h-screen bg-gray-50 text-gray-900 dark:bg-gray-950 dark:text-gray-100">
      <header className="border-b border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4">
          <a href="/" className="text-xl font-bold tracking-tight text-indigo-600">
            RemoteWork Tools Shop
          </a>
          <a href="/shop/bag" className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700">
            バッグを見る
          </a>
        </div>
      </header>
      <main className="mx-auto max-w-5xl px-4 py-8">{children}</main>
    </body>
  </html>
));
