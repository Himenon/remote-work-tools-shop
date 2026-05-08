import { NextResponse } from "next/server";
import { findProductSpec } from "../../../../_store/product";

interface RouteParams {
  params: Promise<{ productName: string }>;
}

export const GET = async (_req: Request, { params }: RouteParams): Promise<NextResponse> => {
  const { productName } = await params;
  const spec = findProductSpec(productName);

  if (!spec) {
    return NextResponse.json({ error: "指定された商品が見つかりません" }, { status: 404 });
  }

  return NextResponse.json(spec);
};
