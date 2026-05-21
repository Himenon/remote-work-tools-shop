import { prisma } from "#client";

export const updateBagItemCount = async (productId: string, count: number): Promise<void> => {
  await prisma.bagItem.update({
    where: { productId },
    data: { count },
  });
};
