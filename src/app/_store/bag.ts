import type { BagItem } from "#schema/client/product";

const MAX_BAG_ITEM_KINDS = 10;
const NOT_FOUND_INDEX = -1;

// DBの代替となるサーバーサイドのインメモリストア
// Next.js のホットリロード時にリセットされる点はDB導入で解消する
declare global {
  // eslint-disable-next-line no-var
  var __mockBagItems: BagItem[] | undefined;
}

const getBagItems = (): BagItem[] => {
  globalThis.__mockBagItems ??= [];
  return globalThis.__mockBagItems;
};

export const findAllBagItems = (): BagItem[] => getBagItems();

export interface AddBagItemResult {
  success: true;
  items: BagItem[];
}

export interface AddBagItemError {
  success: false;
  reason: "exceeded_max_kinds";
}

export const addBagItem = (item: BagItem): AddBagItemResult | AddBagItemError => {
  const items = getBagItems();
  const existingIndex = items.findIndex((i) => i.product.productId === item.product.productId);

  if (existingIndex !== NOT_FOUND_INDEX) {
    const existing = items[existingIndex];
    if (existing) {
      existing.count += item.count;
    }
    return { success: true, items };
  }

  if (items.length >= MAX_BAG_ITEM_KINDS) {
    return { success: false, reason: "exceeded_max_kinds" };
  }

  items.push(item);
  return { success: true, items };
};

export const clearBag = (): void => {
  globalThis.__mockBagItems = [];
};
