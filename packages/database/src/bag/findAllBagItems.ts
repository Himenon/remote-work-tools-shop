import { BagItemSchema, type BagItem } from "@rwts/contract/client/product";
import { prisma } from "../client";

export const findAllBagItems = async (): Promise<BagItem[]> => {
  const rows = await prisma.bagItem.findMany();
  return rows.map((row): BagItem => BagItemSchema.parse({ product: { productId: row.productId, specs: row.specs }, count: row.count }));
};
