import { ProductListItemSchema, ProductSpecSchema, type ProductListItem, type ProductSpec } from "@rwts/contract/client/product";
import productListData from "./product-list.json";
import productSpecsData from "./product-specs.json";

const productListResult = ProductListItemSchema.array().safeParse(productListData);
if (!productListResult.success) {
  throw new Error(`製品一覧のパースに失敗しました: ${productListResult.error.message}`);
}
const productSpecsResult = ProductSpecSchema.array().safeParse(productSpecsData);
if (!productSpecsResult.success) {
  throw new Error(`製品スペックのパースに失敗しました: ${productSpecsResult.error.message}`);
}

export const MOCK_PRODUCT_LIST: ProductListItem[] = productListResult.data;
export const MOCK_PRODUCT_SPECS: ProductSpec[] = productSpecsResult.data;

export const MOCK_BUY_FORM_PRODUCTS = MOCK_PRODUCT_SPECS.map((spec) => ({
  name: spec.name,
  price: spec.price,
  specSortKeys: spec.spec.meta.specSortKey,
  categories: Object.fromEntries(
    Object.entries(spec.spec.categories).map(([key, category]) => [
      key,
      {
        name: category.name,
        view: category.view,
        specs: category.specs.map(({ name, cost }) => ({ name, cost })),
      },
    ]),
  ),
}));
