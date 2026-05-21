import type { JSX, ReactNode } from "react";
import type { BagItem } from "@rwts/contract/client/product";

interface CheckoutPageProps {
  items: BagItem[];
  findProductName: (productId: string) => string;
  checkoutFormContainer: ReactNode;
}

interface CheckoutItemCardProps {
  item: BagItem;
  productName: string;
}

const EMPTY_LIST_LENGTH = 0;

const CheckoutItemCard = ({ item, productName }: CheckoutItemCardProps): JSX.Element => {
  const specEntries = Object.entries(item.product.specs);
  return (
    <li className="flex flex-col gap-2 py-3">
      <div className="flex items-center justify-between">
        <span className="font-medium text-gray-900 dark:text-gray-100">{productName}</span>
        <span className="text-sm text-gray-500 dark:text-gray-400">× {item.count}個</span>
      </div>
      {specEntries.length > EMPTY_LIST_LENGTH && (
        <dl className="flex flex-wrap gap-x-4 gap-y-1">
          {specEntries.map(([key, value]) => (
            <div key={key} className="flex gap-1 text-xs">
              <dt className="text-gray-400">{key}:</dt>
              <dd className="text-gray-600 dark:text-gray-300">{value}</dd>
            </div>
          ))}
        </dl>
      )}
    </li>
  );
};

export default function CheckoutPage({ items, findProductName, checkoutFormContainer }: CheckoutPageProps): JSX.Element {
  const isEmpty = items.length === EMPTY_LIST_LENGTH;

  return (
    <div className="mx-auto max-w-2xl flex flex-col gap-8">
      <h1 className="text-2xl font-bold">チェックアウト</h1>
      <section className="flex flex-col gap-4 rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-900">
        <h2 className="text-base font-semibold text-gray-900 dark:text-gray-100">注文内容の確認</h2>
        {isEmpty ? (
          <p className="text-sm text-gray-500 dark:text-gray-400">バッグに商品が入っていません</p>
        ) : (
          <ul className="flex flex-col divide-y divide-gray-100 dark:divide-gray-800">
            {items.map((item, index) => (
              <CheckoutItemCard key={`${item.product.productId}-${index}`} item={item} productName={findProductName(item.product.productId)} />
            ))}
          </ul>
        )}
      </section>
      {checkoutFormContainer}
      {isEmpty && (
        <a href="/" className="text-center text-sm text-indigo-600 underline hover:text-indigo-700">
          商品を探す
        </a>
      )}
    </div>
  );
}
