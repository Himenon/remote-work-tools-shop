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

export interface ProductSpec {
  productId: string;
  price: number;
  name: string;
  spec: {
    meta: { specSortKey: string[] };
    categories: Record<string, SpecCategory>;
  };
}
