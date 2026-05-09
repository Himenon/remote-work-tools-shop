import { createRoute } from "honox/factory";
import { clearBag, findAllBagItems } from "@rwts/server/database/bag";

const EMPTY_BAG_LENGTH = 0;

export const POST = createRoute((c) => {
  const items = findAllBagItems();

  if (items.length === EMPTY_BAG_LENGTH) {
    return c.json({ error: "バッグに商品が入っていません" }, 422);
  }

  clearBag();

  return c.json({ message: "決済が完了しました" });
});
