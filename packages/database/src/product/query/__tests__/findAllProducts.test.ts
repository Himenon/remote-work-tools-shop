import { vi, describe, it, expect, beforeAll, afterAll, beforeEach } from "vitest";
import { createTestPrisma, clientMock, setTestPrisma, type QueryRecord, formatQuerySnapshot } from "#test-utils";
import { findAllProducts } from "../findAllProducts";

vi.mock("#client", () => clientMock);

const TEST_PRODUCTS = [
  {
    productId: "prod-a",
    name: "商品A",
    price: 100000,
    catchCopy: "商品Aのキャッチコピーです",
    category: "Laptop",
    spec: { meta: { specSortKey: [] }, categories: {} },
  },
  {
    productId: "prod-b",
    name: "商品B",
    price: 200000,
    catchCopy: "商品Bのキャッチコピーです",
    category: "SmartPhone",
    spec: { meta: { specSortKey: [] }, categories: {} },
  },
];

describe("findAllProducts", () => {
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
    clearCapturedQueries();
  });

  it("商品が1件も存在しないとき、空の配列を返す", async () => {
    const result = await findAllProducts();
    expect(result).toEqual([]);
  });

  it("商品が2件存在するとき、2件の商品一覧を返す", async () => {
    for (const product of TEST_PRODUCTS) {
      await clientMock.prisma.product.create({ data: product });
    }
    clearCapturedQueries();

    const result = await findAllProducts();

    expect(result).toEqual([
      { productId: "prod-a", name: "商品A", price: 100000, catchCopy: "商品Aのキャッチコピーです" },
      { productId: "prod-b", name: "商品B", price: 200000, catchCopy: "商品Bのキャッチコピーです" },
    ]);
    await expect(formatQuerySnapshot(capturedQueries)).toMatchFileSnapshot("./__snapshots__/findAllProducts.sql");
  });
});
