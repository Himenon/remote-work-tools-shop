import { NextResponse } from "next/server";
import { AddBagPayloadSchema } from "@rwts/contract/server/product";
import { addBagItem } from "@rwts/server/database/bag";

export const POST = async (req: Request): Promise<NextResponse> => {
  const body: unknown = await req.json();
  const parsed = AddBagPayloadSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "リクエストの形式が不正です" }, { status: 400 });
  }

  const result = addBagItem({ product: parsed.data.product, count: parsed.data.count });

  if (!result.success) {
    return NextResponse.json({ error: "バッグに追加できる商品の種類数が上限（10種類）に達しています" }, { status: 422 });
  }

  return NextResponse.json({ items: result.items }, { status: 201 });
};
