import fs from "node:fs";
import path from "node:path";
import { ProductsInBagSchema, type BagItem } from "@rwts/contract/client/product";

const BAG_FILE = path.join(process.cwd(), "data", "bag.json");

const MAX_BAG_ITEM_KINDS = 10;
const NOT_FOUND_INDEX = -1;

const readItems = (): BagItem[] => {
  if (!fs.existsSync(BAG_FILE)) {
    return [];
  }
  const parsed = ProductsInBagSchema.safeParse(JSON.parse(fs.readFileSync(BAG_FILE, "utf8")));
  return parsed.success ? parsed.data.items : [];
};

const writeItems = (items: BagItem[]): void => {
  fs.mkdirSync(path.dirname(BAG_FILE), { recursive: true });
  fs.writeFileSync(BAG_FILE, JSON.stringify({ items }, null, 2), "utf8");
};

export const findAllBagItems = (): BagItem[] => readItems();

export interface AddBagItemResult {
  success: true;
  items: BagItem[];
}

export interface AddBagItemError {
  success: false;
  reason: "exceeded_max_kinds";
}

export const addBagItem = (item: BagItem): AddBagItemResult | AddBagItemError => {
  const items = readItems();
  const existingIndex = items.findIndex((i) => i.product.productId === item.product.productId);

  if (existingIndex !== NOT_FOUND_INDEX) {
    const existing = items[existingIndex];
    if (existing) {
      existing.count += item.count;
    }
    writeItems(items);
    return { success: true, items };
  }

  if (items.length >= MAX_BAG_ITEM_KINDS) {
    return { success: false, reason: "exceeded_max_kinds" };
  }

  items.push(item);
  writeItems(items);
  return { success: true, items };
};

export const clearBag = (): void => {
  writeItems([]);
};
