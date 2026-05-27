import { createRoute } from "honox/factory";
import { zValidator } from "@hono/zod-validator";
import { AddBagPayloadSchema } from "@rwts/contract/server/product";
import { addBagItem } from "@rwts/server/repository/bag";

const HTTP_UNPROCESSABLE_ENTITY = 422;
const HTTP_CREATED = 201;

export const POST = createRoute(zValidator("json", AddBagPayloadSchema), async (c) => {
  const { product, count } = c.req.valid("json");
  const result = await addBagItem({ product, count });

  if (!result.success) {
    return c.json({ error: "バッグに追加できる商品の種類数が上限（10種類）に達しています" }, HTTP_UNPROCESSABLE_ENTITY);
  }

  return c.json({ items: result.items }, HTTP_CREATED);
});
