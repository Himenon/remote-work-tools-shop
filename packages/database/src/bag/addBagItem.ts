import { type BagItem } from "@rwts/contract/client/product";
import { prisma } from "../client";
import { findAllBagItems } from "./findAllBagItems";

const MAX_BAG_ITEM_KINDS = 10;

export interface AddBagItemResult {
  success: true;
  items: BagItem[];
}

export interface AddBagItemError {
  success: false;
  reason: "exceeded_max_kinds";
}

export const addBagItem = async (item: BagItem): Promise<AddBagItemResult | AddBagItemError> => {
  const existing = await prisma.bagItem.findUnique({
    where: { productId: item.product.productId },
  });

  if (existing) {
    await prisma.bagItem.update({
      where: { productId: item.product.productId },
      data: { count: existing.count + item.count },
    });
  } else {
    const count = await prisma.bagItem.count();
    if (count >= MAX_BAG_ITEM_KINDS) {
      return { success: false, reason: "exceeded_max_kinds" };
    }
    await prisma.bagItem.create({
      data: {
        productId: item.product.productId,
        specs: item.product.specs,
        count: item.count,
      },
    });
  }

  const items = await findAllBagItems();
  return { success: true, items };
};
