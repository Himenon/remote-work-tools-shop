import { vi, describe, it, expect, beforeAll, afterAll, beforeEach } from "vitest";
import type { BagItem } from "@rwts/contract/client/product";
import { createTestPrisma, type QueryRecord } from "#test-utils";
import { addBagItem } from "../addBagItem";

type TestClient = Awaited<ReturnType<typeof createTestPrisma>>["prisma"];
let testPrisma!: TestClient;

vi.mock("../../../client", () => ({
  get prisma() {
    return testPrisma;
  },
}));

const TEST_PRODUCT = {
  productId: "add-test-product",
  name: "追加テスト商品",
  price: 100000,
  catchCopy: "追加テスト用の商品です",
  category: "Laptop",
  spec: { meta: { specSortKey: [] }, categories: {} },
};

const TEST_BAG_ITEM: BagItem = {
  product: { productId: "add-test-product", specs: { color: "silver" } },
  count: 2,
};

describe("addBagItem", () => {
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

  it("バッグに同じ商品が入っていないとき、バッグに追加して成功を返す", async () => {
    const result = await addBagItem(TEST_BAG_ITEM);

    expect(result).toEqual({
      success: true,
      items: [{ product: { productId: "add-test-product", specs: { color: "silver" } }, count: 2 }],
    });
    expect(capturedQueries).toMatchSnapshot();
  });

  it("バッグに同じ商品が既に入っているとき、個数を加算して成功を返す", async () => {
    await testPrisma.bagItem.create({
      data: { productId: "add-test-product", specs: { color: "silver" }, count: 1 },
    });
    clearCapturedQueries();

    const result = await addBagItem(TEST_BAG_ITEM);

    expect(result).toEqual({
      success: true,
      items: [{ product: { productId: "add-test-product", specs: { color: "silver" } }, count: 3 }],
    });
    expect(capturedQueries).toMatchSnapshot();
  });

  it("バッグの商品種類が10件のとき、exceeded_max_kindsを返す", async () => {
    for (let i = 0; i < 10; i++) {
      await testPrisma.product.create({
        data: {
          productId: `prod-max-${i}`,
          name: `商品${i}`,
          price: 100000,
          catchCopy: "テスト",
          category: "Laptop",
          spec: { meta: { specSortKey: [] }, categories: {} },
        },
      });
      await testPrisma.bagItem.create({
        data: { productId: `prod-max-${i}`, specs: {}, count: 1 },
      });
    }
    clearCapturedQueries();

    const newItem: BagItem = {
      product: { productId: "add-test-product", specs: {} },
      count: 1,
    };
    const result = await addBagItem(newItem);

    expect(result).toEqual({ success: false, reason: "exceeded_max_kinds" });
  });
});
