export interface Spec {
  category: string;
  name: string;
  cost: number;
}

export type SpecSelectView = "radio" | "single-select" | "multi-select" | "indicator";

export interface SpecCategory {
  name: string;
  specs: Spec[];
  view: SpecSelectView;
}

export interface CustomizableSpec {
  meta: {
    specSortKey: string[];
  };
  categories: Record<string, SpecCategory>;
}

interface ProductBase {
  productId: string;
  price: number;
  name: string;
  spec: CustomizableSpec;
}

export interface Laptop extends ProductBase {
  category: "Laptop";
}

export interface SmartPhone extends ProductBase {
  category: "SmartPhone";
}

export interface Desk extends ProductBase {
  category: "Desk";
}

export interface Microphone extends ProductBase {
  category: "Microphone";
}

export type ProductSpec = Laptop | SmartPhone | Desk | Microphone;

export interface ProductListItem {
  productId: string;
  name: string;
  /** 税抜き価格 */
  price: number;
  /** 72字以内の販促文章 */
  catchCopy: string;
}

export interface CustomizedProduct {
  productId: string;
  specs: Record<string, string>;
}

export interface AddBagPayload {
  product: CustomizedProduct;
  count: number;
}

export interface BagItem {
  product: CustomizedProduct;
  count: number;
}

export interface ProductsInBag {
  items: BagItem[];
}
