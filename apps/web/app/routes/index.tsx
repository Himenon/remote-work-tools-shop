import { createRoute } from "honox/factory";
import { findAllProducts } from "@rwts/server/database/product";

const TAX_RATE = 1.1;
const COMMA_LOCALE = "ja-JP";

const formatTaxIncludedPrice = (price: number): string => {
  const taxIncluded = Math.floor(price * TAX_RATE);
  return taxIncluded.toLocaleString(COMMA_LOCALE);
};

export default createRoute((c) => {
  const products = findAllProducts();

  return c.render(
    <div>
      <h1 className="mb-8 text-2xl font-bold">商品一覧</h1>
      <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-2">
        {products.map((product) => {
          const priceText = formatTaxIncludedPrice(product.price);

          return (
            <li
              key={product.productId}
              className="flex flex-col rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-900"
            >
              <div className="flex h-48 items-center justify-center rounded-t-xl bg-gray-100 dark:bg-gray-800">
                <span className="text-5xl">
                  {product.productId === "macbook-pro-16" && "💻"}
                  {product.productId === "iphone-15-pro" && "📱"}
                  {product.productId === "standing-desk-pro" && "🪑"}
                  {product.productId === "blue-yeti-pro" && "🎙️"}
                </span>
              </div>
              <div className="flex flex-1 flex-col gap-2 p-5">
                <h2 className="text-lg font-semibold">{product.name}</h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">{product.catchCopy}</p>
                <p className="mt-auto text-xl font-bold text-indigo-600">
                  ¥{priceText}
                  <span className="ml-1 text-sm font-normal text-gray-500">（税込）</span>
                </p>
                <a
                  href={`/shop/buy/${product.productId}`}
                  className="mt-2 block rounded-lg bg-indigo-600 px-4 py-2 text-center text-sm font-medium text-white hover:bg-indigo-700"
                >
                  購入する
                </a>
              </div>
            </li>
          );
        })}
      </ul>
    </div>,
    { title: "RemoteWork Tools Shop" },
  );
});
