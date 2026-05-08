import fs from "node:fs";
import path from "node:path";
import { z } from "zod";
import { ProductListItemSchema, ProductSpecSchema, type ProductListItem, type ProductSpec } from "#schema/client/product";

const DATA_DIR = path.join(process.cwd(), "data");

const ProductListSchema = z.array(ProductListItemSchema);
const ProductSpecsSchema = z.array(ProductSpecSchema);

export const findAllProducts = (): ProductListItem[] => {
  const raw = fs.readFileSync(path.join(DATA_DIR, "product-list.json"), "utf8");
  return ProductListSchema.parse(JSON.parse(raw));
};

export const findProductSpec = (productId: string): ProductSpec | undefined => {
  const raw = fs.readFileSync(path.join(DATA_DIR, "product-specs.json"), "utf8");
  const specs = ProductSpecsSchema.parse(JSON.parse(raw));
  return specs.find((spec) => spec.productId === productId);
};
