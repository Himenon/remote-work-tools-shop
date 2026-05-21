import type { JSX } from "react";
import { BagItemCard, type BagItemCardProps, type BagItemCardItem } from "./parts/BagItemCard";

export interface BagPageProps {
  items: BagItemCardItem[];
  findProductName: (productId: string) => string;
  onCountChange: (productId: string, count: number) => Promise<void>;
}

const EMPTY_LIST_LENGTH = 0;

export default function BagPage({ items, findProductName, onCountChange }: BagPageProps): JSX.Element {
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
        {items.map((item, index) => {
          const bagItemCardProps: BagItemCardProps = {
            item,
            productName: findProductName(item.product.productId),
            onCountChange: async (count: number): Promise<void> => {
              await onCountChange(item.product.productId, count);
            },
          };
          return <BagItemCard key={`${item.product.productId}-${index}`} {...bagItemCardProps} />;
        })}
      </ul>
      <div className="flex justify-end">
        <a href="/shop/checkout" className="rounded-lg bg-indigo-600 px-8 py-3 font-semibold text-white hover:bg-indigo-700">
          チェックアウトへ進む
        </a>
      </div>
    </div>
  );
}
