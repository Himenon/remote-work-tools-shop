import type { JSX } from "react";
import { BagItemCountForm, type BagItemCountFormProps, type BagItemCountFormValues } from "@rwts/ui/form/BagItemCountForm";

interface BagItemProduct {
  productId: string;
  specs: Record<string, string>;
}

export interface BagItemCardItem {
  product: BagItemProduct;
  count: number;
}

export interface BagItemCardProps {
  item: BagItemCardItem;
  productName: string;
  onCountChange: (count: number) => Promise<void>;
}

const EMPTY_LIST_LENGTH = 0;

export const BagItemCard = ({ item, productName, onCountChange }: BagItemCardProps): JSX.Element => {
  const specEntries = Object.entries(item.product.specs);

  const bagItemCountFormProps: BagItemCountFormProps = {
    defaultValues: { count: item.count },
    onSubmit: async (values: BagItemCountFormValues): Promise<void> => {
      await onCountChange(values.count);
    },
  };

  return (
    <li className="flex flex-col gap-3 rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-700 dark:bg-gray-900">
      <h2 className="font-semibold text-gray-900 dark:text-gray-100">{productName}</h2>
      {specEntries.length > EMPTY_LIST_LENGTH && (
        <dl className="flex flex-col gap-1">
          {specEntries.map(
            ([key, value]): JSX.Element => (
              <div key={key} className="flex gap-2 text-sm">
                <dt className="text-gray-500 dark:text-gray-400">{key}:</dt>
                <dd className="text-gray-800 dark:text-gray-200">{value}</dd>
              </div>
            ),
          )}
        </dl>
      )}
      <BagItemCountForm {...bagItemCountFormProps} />
    </li>
  );
};

BagItemCard.displayName = "BagItemCard";
