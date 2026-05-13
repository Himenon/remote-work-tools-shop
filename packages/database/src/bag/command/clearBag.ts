import { prisma } from "../../client";

export const clearBag = async (): Promise<void> => {
  await prisma.bagItem.deleteMany();
};
