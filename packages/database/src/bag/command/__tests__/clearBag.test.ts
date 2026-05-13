import { vi, describe, it, expect, beforeAll, afterAll, beforeEach } from "vitest";
import { createTestPrisma, type QueryRecord } from "#test-utils";
import { clearBag } from "../clearBag";

type TestClient = Awaited<ReturnType<typeof createTestPrisma>>["prisma"];
let testPrisma!: TestClient;

vi.mock("../../../client", () => ({
  get prisma() {
    return testPrisma;
  },
}));

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

  it("バッグに商品が入っているとき、バッグを空にする", async () => {
    await testPrisma.bagItem.create({
      data: { productId: "clear-test-product", specs: { color: "silver" }, count: 3 },
    });
    clearCapturedQueries();

    await clearBag();

    expect(capturedQueries).toMatchSnapshot();
    const remaining = await testPrisma.bagItem.findMany();
    expect(remaining).toHaveLength(0);
  });
});
