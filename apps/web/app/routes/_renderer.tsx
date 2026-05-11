import { reactRenderer } from "@hono/react-renderer";
import { Link, Script } from "honox/server";
import Logo from "@rwts/ui/layout/Logo";
import DarkModeToggle from "../islands/DarkModeToggle";

// localStorage とシステム設定を参照し、HTML レンダリング前に .dark クラスを付与して FOUC を防ぐ。
const darkModeScript = `(function(){try{var t=localStorage.getItem('theme');if(t==='dark'||(!t&&matchMedia('(prefers-color-scheme: dark)').matches)){document.documentElement.classList.add('dark');}}catch(e){}})();`;

/**
 * HonoX の `_renderer.tsx` 規約に従い、全ページ共通のレイアウトを定義する。
 *
 * `Link` は本番ビルドで Vite マニフェストを参照しハッシュ付きファイル名に解決する。
 * `Script` は本番ビルドで Islands を含むページにのみスクリプトを出力する。
 *
 * @see {@link https://github.com/honojs/honox#renderer HonoX - Renderer}
 * @see {@link https://github.com/honojs/middleware/tree/main/packages/react-renderer @hono/react-renderer}
 * @see {@link https://github.com/honojs/honox#islands HonoX - Islands}
 */
export default reactRenderer(({ children, title }) => (
  <html lang="ja">
    <head>
      <meta charSet="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      {/* biome-ignore lint/security/noDangerouslySetInnerHtml: FOUC防止のためレンダリング前にdarkクラスを付与する必要があり、インラインスクリプトが唯一の手段 */}
      <script dangerouslySetInnerHTML={{ __html: darkModeScript }} />
      <title>{title ?? "RemoteWork Tools Shop"}</title>
      <meta name="description" content="リモートワークのための厳選商品を取り揃えたオンラインショップ" />
      <Link href="/app/style.css" rel="stylesheet" />
      <Script src="/app/client.ts" async />
    </head>
    <body className="min-h-screen bg-gray-50 text-gray-900 dark:bg-gray-950 dark:text-gray-100">
      <header className="border-b border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4">
          <a href="/" aria-label="RemoteWork Tools Shop">
            <Logo size={36} />
          </a>
          <div className="flex items-center gap-2">
            <DarkModeToggle />
            <a href="/shop/bag" className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700">
              バッグを見る
            </a>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-5xl px-4 py-8">{children}</main>
    </body>
  </html>
));
