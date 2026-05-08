import { NextResponse } from "next/server";
import { findAllBagItems } from "../../../_store/bag";
import type { ProductsInBag } from "#schema/client/product";

export const GET = (): NextResponse => {
  const response: ProductsInBag = { items: findAllBagItems() };
  return NextResponse.json(response);
};
