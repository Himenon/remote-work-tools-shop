import { vi, describe, it, expect, beforeAll, afterAll, beforeEach } from "vitest";
import { createTestPrisma, clientMock, setTestPrisma, type QueryRecord, formatQuerySnapshot } from "#test-utils";
import { findAllBagItems } from "../findAllBagItems";

vi.mock("#client", () => clientMock);

const TEST_PRODUCT = {
  productId: "bag-test-product",
  name: "バッグテスト商品",
  price: 100_000,
  catchCopy: "バッグテスト用の商品です",
  category: "Laptop",
  spec: { meta: { specSortKey: [] }, categories: {} },
};

describe("findAllBagItems", () => {
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

  it("バッグに商品が1件も入っていないとき、空の配列を返す", async () => {
    const result = await findAllBagItems();
    expect(result).toEqual([]);
  });

  it("バッグに商品が1件入っているとき、そのバッグアイテムの一覧を返す", async () => {
    await clientMock.prisma.bagItem.create({
      data: { productId: "bag-test-product", specs: { color: "silver" }, count: 2 },
    });
    clearCapturedQueries();

    const result = await findAllBagItems();

    expect(result).toEqual([
      {
        product: { productId: "bag-test-product", specs: { color: "silver" } },
        count: 2,
      },
    ]);
    await expect(formatQuerySnapshot(capturedQueries)).toMatchFileSnapshot("./__snapshots__/findAllBagItems.sql");
  });
});
