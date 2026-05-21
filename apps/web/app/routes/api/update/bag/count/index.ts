import { createRoute } from "honox/factory";
import { zValidator } from "@hono/zod-validator";
import { UpdateBagItemCountPayloadSchema } from "@rwts/contract/server/product";
import { updateBagItemCount } from "@rwts/server/repository/bag";

const HTTP_NO_CONTENT = 204;

export const POST = createRoute(zValidator("json", UpdateBagItemCountPayloadSchema), async (c) => {
  const { productId, count } = c.req.valid("json");
  await updateBagItemCount(productId, count);
  return c.body(null, HTTP_NO_CONTENT);
});
