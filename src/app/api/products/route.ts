import { NextResponse } from "next/server";
import { findAllProducts } from "../../_store/product";

export const GET = (): NextResponse => NextResponse.json(findAllProducts());
