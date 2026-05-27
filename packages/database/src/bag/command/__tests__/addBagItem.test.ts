import { vi, describe, it, expect, beforeAll, afterAll, beforeEach } from "vitest";
import type { BagItem } from "@rwts/contract/client/product";
import { createTestPrisma, clientMock, setTestPrisma, type QueryRecord, formatQuerySnapshot } from "#test-utils";
import { addBagItem } from "../addBagItem";

vi.mock("#client", () => clientMock);

const TEST_PRODUCT = {
  productId: "add-test-product",
  name: "追加テスト商品",
  price: 100_000,
  catchCopy: "追加テスト用の商品です",
  category: "Laptop",
  spec: { meta: { specSortKey: [] }, categories: {} },
};

const TEST_BAG_ITEM: BagItem = {
  product: { productId: "add-test-product", specs: { color: "silver" } },
  count: 2,
};

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

describe("バッグに同じ商品が入っていないとき", () => {
  it("バッグに追加して成功を返す", async () => {
    const result = await addBagItem(TEST_BAG_ITEM);

    expect(result).toEqual({
      success: true,
      items: [{ product: { productId: "add-test-product", specs: { color: "silver" } }, count: 2 }],
    });
    await expect(formatQuerySnapshot(capturedQueries)).toMatchFileSnapshot("./__snapshots__/addBagItem-new.sql");
  });
});

describe("バッグに同じ商品が既に入っているとき", () => {
  it("個数を加算して成功を返す", async () => {
    await clientMock.prisma.bagItem.create({
      data: { productId: "add-test-product", specs: { color: "silver" }, count: 1 },
    });
    clearCapturedQueries();

    const result = await addBagItem(TEST_BAG_ITEM);

    expect(result).toEqual({
      success: true,
      items: [{ product: { productId: "add-test-product", specs: { color: "silver" } }, count: 3 }],
    });
    await expect(formatQuerySnapshot(capturedQueries)).toMatchFileSnapshot("./__snapshots__/addBagItem-update.sql");
  });
});

const BAG_MAX_KIND_COUNT = 10;

describe("バッグの商品種類が既に10種類入っているとき", () => {
  beforeEach(async () => {
    await Promise.all(
      Array.from(
        { length: BAG_MAX_KIND_COUNT },
        (_, i): Promise<unknown> =>
          clientMock.prisma.product.create({
            data: {
              productId: `prod-max-${i}`,
              name: `商品${i}`,
              price: 100_000,
              catchCopy: "テスト",
              category: "Laptop",
              spec: { meta: { specSortKey: [] }, categories: {} },
            },
          }),
      ),
    );
    await Promise.all(
      Array.from(
        { length: BAG_MAX_KIND_COUNT },
        (_, i): Promise<unknown> =>
          clientMock.prisma.bagItem.create({
            data: { productId: `prod-max-${i}`, specs: {}, count: 1 },
          }),
      ),
    );
    clearCapturedQueries();
  });

  it("exceeded_max_kindsを返す", async () => {
    const newItem: BagItem = {
      product: { productId: "add-test-product", specs: {} },
      count: 1,
    };
    const result = await addBagItem(newItem);

    expect(result).toEqual({ success: false, reason: "exceeded_max_kinds" });
  });
});
