import { createRoute } from "honox/factory";
import { findAllBagItems } from "@rwts/server/repository/bag";
import type { ProductsInBag } from "@rwts/contract/client/product";

export default createRoute(async (c) => {
  const response: ProductsInBag = { items: await findAllBagItems() };
  return c.json(response);
});
