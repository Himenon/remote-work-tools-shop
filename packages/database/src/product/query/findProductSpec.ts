import { ProductSpecSchema, type ProductSpec } from "@rwts/contract/client/product";
import { prisma } from "#client";

export const findProductSpec = async (productId: string): Promise<ProductSpec | undefined> => {
  const row = await prisma.product.findUnique({ where: { productId } });
  if (!row) {
    return undefined;
  }
  return ProductSpecSchema.parse(row);
};
