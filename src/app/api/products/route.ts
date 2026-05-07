import { NextResponse } from "next/server";
import { MOCK_PRODUCT_LIST } from "../../_mock/products";

export const GET = (): NextResponse => NextResponse.json(MOCK_PRODUCT_LIST);
