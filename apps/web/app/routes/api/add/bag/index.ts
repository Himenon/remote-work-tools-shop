import { createRoute } from "honox/factory";
import { AddBagPayloadSchema } from "@rwts/contract/server/product";
import { addBagItem } from "@rwts/server/database/bag";

export const POST = createRoute(async (c) => {
  const body: unknown = await c.req.json();
  const parsed = AddBagPayloadSchema.safeParse(body);

  if (!parsed.success) {
    return c.json({ error: "リクエストの形式が不正です" }, 400);
  }

  const result = addBagItem({ product: parsed.data.product, count: parsed.data.count });

  if (!result.success) {
    return c.json({ error: "バッグに追加できる商品の種類数が上限（10種類）に達しています" }, 422);
  }

  return c.json({ items: result.items }, 201);
});
