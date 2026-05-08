import { NextResponse } from "next/server";
import { findAllBagItems } from "@rwts/server/database/bag";
import type { ProductsInBag } from "@rwts/contract/client/product";

export const GET = (): NextResponse => {
  const response: ProductsInBag = { items: findAllBagItems() };
  return NextResponse.json(response);
};
