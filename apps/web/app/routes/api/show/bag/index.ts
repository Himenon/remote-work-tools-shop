import { createRoute } from "honox/factory";
import { findAllBagItems } from "@rwts/database/bag";
import type { ProductsInBag } from "@rwts/contract/client/product";

export default createRoute((c) => {
  const response: ProductsInBag = { items: findAllBagItems() };
  return c.json(response);
});
