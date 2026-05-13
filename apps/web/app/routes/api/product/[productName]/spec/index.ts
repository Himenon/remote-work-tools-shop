import { createRoute } from "honox/factory";
import { findProductSpec } from "@rwts/server/repository/product";

const HTTP_NOT_FOUND = 404;

export default createRoute(async (c) => {
  const productName = c.req.param("productName");
  if (!productName) {
    return c.json({ error: "商品名が指定されていません" }, HTTP_NOT_FOUND);
  }
  const spec = await findProductSpec(productName);

  if (!spec) {
    return c.json({ error: "指定された商品が見つかりません" }, HTTP_NOT_FOUND);
  }

  return c.json(spec);
});
