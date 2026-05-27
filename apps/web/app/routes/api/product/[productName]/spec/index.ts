import { createRoute } from "honox/factory";
import { zValidator } from "@hono/zod-validator";
import { ProductSpecParamSchema } from "@rwts/contract/server/product";
import { findProductSpec } from "@rwts/server/repository/product";

const HTTP_NOT_FOUND = 404;

export default createRoute(zValidator("param", ProductSpecParamSchema), async (c) => {
  const { productName } = c.req.valid("param");
  const spec = await findProductSpec(productName);

  if (!spec) {
    return c.json({ error: "指定された商品が見つかりません" }, HTTP_NOT_FOUND);
  }

  return c.json(spec);
});
