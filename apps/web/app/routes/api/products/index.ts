import { createRoute } from "honox/factory";
import { findAllProducts } from "@rwts/server/database/product";

export default createRoute((c) => {
  return c.json(findAllProducts());
});
