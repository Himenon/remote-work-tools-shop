import { NextResponse } from "next/server";
import { clearBag, findAllBagItems } from "../../_store/bag";

const EMPTY_BAG_LENGTH = 0;

export const POST = (): NextResponse => {
  const items = findAllBagItems();

  if (items.length === EMPTY_BAG_LENGTH) {
    return NextResponse.json({ error: "バッグに商品が入っていません" }, { status: 422 });
  }

  clearBag();

  return NextResponse.json({ message: "決済が完了しました" });
};
