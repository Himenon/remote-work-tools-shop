import { vi, describe, it, expect, beforeAll, afterAll, beforeEach } from "vitest";
import { createTestPrisma, clientMock, setTestPrisma, type QueryRecord, formatQuerySnapshot } from "#test-utils";
import { clearBag } from "../clearBag";

vi.mock("#client", () => clientMock);

const TEST_PRODUCT = {
  productId: "clear-test-product",
  name: "クリアテスト商品",
  price: 100000,
  catchCopy: "クリアテスト用の商品です",
  category: "Laptop",
  spec: { meta: { specSortKey: [] }, categories: {} },
};

describe("clearBag", () => {
  let capturedQueries: QueryRecord[];
  let clearCapturedQueries: () => void;

  beforeAll(async () => {
    const result = await createTestPrisma();
    setTestPrisma(result.prisma);
    capturedQueries = result.capturedQueries;
    clearCapturedQueries = result.clearCapturedQueries;
  });

  afterAll(async () => {
    await clientMock.prisma.$disconnect();
  });

  beforeEach(async () => {
    await clientMock.prisma.bagItem.deleteMany();
    await clientMock.prisma.product.deleteMany();
    await clientMock.prisma.product.create({ data: TEST_PRODUCT });
    clearCapturedQueries();
  });

  it("バッグに商品が入っているとき、バッグを空にする", async () => {
    await clientMock.prisma.bagItem.create({
      data: { productId: "clear-test-product", specs: { color: "silver" }, count: 3 },
    });
    clearCapturedQueries();

    await clearBag();

    await expect(formatQuerySnapshot(capturedQueries)).toMatchFileSnapshot("./__snapshots__/clearBag.sql");
    const remaining = await clientMock.prisma.bagItem.findMany();
    expect(remaining).toHaveLength(0);
  });
});
