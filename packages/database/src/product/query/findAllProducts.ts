import { ProductListItemSchema, type ProductListItem } from "@rwts/contract/client/product";
import { prisma } from "#client";

export const findAllProducts = async (): Promise<ProductListItem[]> => {
  const rows = await prisma.product.findMany({
    select: { productId: true, name: true, price: true, catchCopy: true },
  });
  return rows.map((row): ProductListItem => ProductListItemSchema.parse(row));
};
