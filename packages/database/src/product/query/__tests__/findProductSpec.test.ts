import { vi, describe, it, expect, beforeAll, afterAll, beforeEach } from "vitest";
import { createTestPrisma, clientMock, setTestPrisma, type QueryRecord, formatQuerySnapshot } from "#test-utils";
import { findProductSpec } from "../findProductSpec";

vi.mock("#client", () => clientMock);

const TEST_PRODUCT = {
  productId: "prod-spec-test",
  name: "スペックテスト商品",
  price: 150000,
  catchCopy: "スペックテスト用のキャッチコピーです",
  category: "Laptop",
  spec: {
    meta: { specSortKey: ["memory"] },
    categories: {
      memory: {
        name: "メモリ",
        view: "radio",
        specs: [{ category: "memory", name: "16GB", cost: 0 }],
      },
    },
  },
};

describe("findProductSpec", () => {
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

  it("指定した商品IDに一致する商品が存在するとき、その商品のスペックを返す", async () => {
    await clientMock.prisma.product.create({ data: TEST_PRODUCT });
    clearCapturedQueries();

    const result = await findProductSpec("prod-spec-test");

    expect(result).toEqual({
      productId: "prod-spec-test",
      name: "スペックテスト商品",
      price: 150000,
      category: "Laptop",
      spec: {
        meta: { specSortKey: ["memory"] },
        categories: {
          memory: {
            name: "メモリ",
            view: "radio",
            specs: [{ category: "memory", name: "16GB", cost: 0 }],
          },
        },
      },
    });
    await expect(formatQuerySnapshot(capturedQueries)).toMatchFileSnapshot("./__snapshots__/findProductSpec.sql");
  });

  it("指定した商品IDに一致する商品が存在しないとき、undefinedを返す", async () => {
    const result = await findProductSpec("not-exist-product");
    expect(result).toBeUndefined();
  });
});
