import { NextResponse } from "next/server";
import { MOCK_PRODUCT_SPECS } from "../../../../_mock/products";

interface RouteParams {
  params: Promise<{ productName: string }>;
}

export const GET = async (_req: Request, { params }: RouteParams): Promise<NextResponse> => {
  const { productName } = await params;
  const spec = MOCK_PRODUCT_SPECS.find((p) => p.productId === productName);

  if (!spec) {
    return NextResponse.json({ error: "指定された商品が見つかりません" }, { status: 404 });
  }

  return NextResponse.json(spec);
};
