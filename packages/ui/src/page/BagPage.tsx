import type { JSX } from "react";
import type { BagItem } from "@rwts/contract/client/product";

interface BagPageProps {
  items: BagItem[];
  findProductName: (productId: string) => string;
}

interface BagItemCardProps {
  item: BagItem;
  productName: string;
}

const EMPTY_LIST_LENGTH = 0;

const BagItemCard = ({ item, productName }: BagItemCardProps): JSX.Element => {
  const specEntries = Object.entries(item.product.specs);

  return (
    <li className="flex flex-col gap-3 rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-700 dark:bg-gray-900">
      <div className="flex items-start justify-between gap-4">
        <h2 className="font-semibold text-gray-900 dark:text-gray-100">{productName}</h2>
        <span className="shrink-0 text-sm text-gray-500 dark:text-gray-400">× {item.count}個</span>
      </div>
      {specEntries.length > EMPTY_LIST_LENGTH && (
        <dl className="flex flex-col gap-1">
          {specEntries.map(([key, value]) => (
            <div key={key} className="flex gap-2 text-sm">
              <dt className="text-gray-500 dark:text-gray-400">{key}:</dt>
              <dd className="text-gray-800 dark:text-gray-200">{value}</dd>
            </div>
          ))}
        </dl>
      )}
    </li>
  );
};

export default function BagPage({ items, findProductName }: BagPageProps): JSX.Element {
  if (items.length === EMPTY_LIST_LENGTH) {
    return (
      <div className="flex flex-col items-center gap-6 py-20 text-center">
        <p className="text-lg text-gray-500 dark:text-gray-400">バッグに商品が入っていません</p>
        <a href="/" className="rounded-lg bg-indigo-600 px-6 py-3 font-semibold text-white hover:bg-indigo-700">
          商品を探す
        </a>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8">
      <h1 className="text-2xl font-bold">バッグ</h1>
      <ul className="flex flex-col gap-4">
        {items.map((item, index) => (
          <BagItemCard key={`${item.product.productId}-${index}`} item={item} productName={findProductName(item.product.productId)} />
        ))}
      </ul>
      <div className="flex justify-end">
        <a href="/shop/checkout" className="rounded-lg bg-indigo-600 px-8 py-3 font-semibold text-white hover:bg-indigo-700">
          チェックアウトへ進む
        </a>
      </div>
    </div>
  );
}
