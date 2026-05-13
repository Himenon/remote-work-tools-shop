import { ProductListItemSchema, ProductSpecSchema, type ProductListItem, type ProductSpec } from "@rwts/contract/client/product";
import { prisma } from "./client";

export const findAllProducts = async (): Promise<ProductListItem[]> => {
  const rows = await prisma.product.findMany({
    select: { productId: true, name: true, price: true, catchCopy: true },
  });
  return rows.map((row): ProductListItem => ProductListItemSchema.parse(row));
};

export const findProductSpec = async (productId: string): Promise<ProductSpec | undefined> => {
  const row = await prisma.product.findUnique({ where: { productId } });
  if (!row) return undefined;
  return ProductSpecSchema.parse(row);
};
