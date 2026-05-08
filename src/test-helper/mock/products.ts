import type { ProductListItem, ProductSpec } from "#schema/client/product";
import type { BuyFormProduct } from "#ui/form/BuyForm";
import productListData from "../../../data/product-list.json";
import productSpecsData from "../../../data/product-specs.json";

export const MOCK_PRODUCT_LIST = productListData as unknown as ProductListItem[];
export const MOCK_PRODUCT_SPECS = productSpecsData as unknown as ProductSpec[];

export const MOCK_BUY_FORM_PRODUCTS: BuyFormProduct[] = MOCK_PRODUCT_SPECS.map((spec) => ({
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
