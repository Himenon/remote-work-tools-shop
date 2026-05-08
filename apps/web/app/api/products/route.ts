import { NextResponse } from "next/server";
import { findAllProducts } from "@rwts/server/database/product";

export const GET = (): NextResponse => NextResponse.json(findAllProducts());
