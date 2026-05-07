import { NextResponse } from "next/server";
import type { AddBagPayload } from "#types/product";
import { addBagItem } from "../../../_store/bag";

const isAddBagPayload = (value: unknown): value is AddBagPayload => {
  if (typeof value !== "object" || value === null) {
    return false;
  }
  const v = value as Record<string, unknown>;
  if (typeof v["count"] !== "number") {
    return false;
  }
  if (typeof v["product"] !== "object" || v["product"] === null) {
    return false;
  }
  const product = v["product"] as Record<string, unknown>;
  return typeof product["productId"] === "string";
};

export const POST = async (req: Request): Promise<NextResponse> => {
  const body: unknown = await req.json();

  if (!isAddBagPayload(body)) {
    return NextResponse.json({ error: "リクエストの形式が不正です" }, { status: 400 });
  }

  const result = addBagItem({ product: body.product, count: body.count });

  if (!result.success) {
    return NextResponse.json({ error: "バッグに追加できる商品の種類数が上限（10種類）に達しています" }, { status: 422 });
  }

  return NextResponse.json({ items: result.items }, { status: 201 });
};
