import { NextRequest, NextResponse } from "next/server";
import { searchProducts } from "@/lib/products-api";

export async function GET(req: NextRequest) {
  const region = req.nextUrl.searchParams.get("region");
  const query = req.nextUrl.searchParams.get("q");

  if (!region || !query) {
    return NextResponse.json(
      { error: "region and q params required" },
      { status: 400 }
    );
  }

  const products = await searchProducts(region, query);
  return NextResponse.json(products);
}
