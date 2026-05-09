import { createRoute } from "honox/factory";
import { findProductSpec } from "@rwts/server/database/product";

export default createRoute((c) => {
  const productName = c.req.param("productName");
  const spec = findProductSpec(productName);

  if (!spec) {
    return c.json({ error: "指定された商品が見つかりません" }, 404);
  }

  return c.json(spec);
});
