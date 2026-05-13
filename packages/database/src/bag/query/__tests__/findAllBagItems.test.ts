import { vi, describe, it, expect, beforeAll, afterAll, beforeEach } from "vitest";
import { createTestPrisma, type QueryRecord } from "#test-utils";
import { findAllBagItems } from "../findAllBagItems";

type TestClient = Awaited<ReturnType<typeof createTestPrisma>>["prisma"];
let testPrisma!: TestClient;

vi.mock("../../../client", () => ({
  get prisma() {
    return testPrisma;
  },
}));

const TEST_PRODUCT = {
  productId: "bag-test-product",
  name: "バッグテスト商品",
  price: 100000,
  catchCopy: "バッグテスト用の商品です",
  category: "Laptop",
  spec: { meta: { specSortKey: [] }, categories: {} },
};

describe("findAllBagItems", () => {
  let capturedQueries: QueryRecord[];
  let clearCapturedQueries: () => void;

  beforeAll(async () => {
    const result = await createTestPrisma();
    testPrisma = result.prisma;
    capturedQueries = result.capturedQueries;
    clearCapturedQueries = result.clearCapturedQueries;
  });

  afterAll(async () => {
    await testPrisma.$disconnect();
  });

  beforeEach(async () => {
    await testPrisma.bagItem.deleteMany();
    await testPrisma.product.deleteMany();
    await testPrisma.product.create({ data: TEST_PRODUCT });
    clearCapturedQueries();
  });

  it("バッグに商品が1件も入っていないとき、空の配列を返す", async () => {
    const result = await findAllBagItems();
    expect(result).toEqual([]);
  });

  it("バッグに商品が1件入っているとき、そのバッグアイテムの一覧を返す", async () => {
    await testPrisma.bagItem.create({
      data: {
        productId: "bag-test-product",
        specs: { color: "silver" },
        count: 2,
      },
    });
    clearCapturedQueries();

    const result = await findAllBagItems();

    expect(result).toEqual([
      {
        product: { productId: "bag-test-product", specs: { color: "silver" } },
        count: 2,
      },
    ]);
    expect(capturedQueries).toMatchSnapshot();
  });
});
