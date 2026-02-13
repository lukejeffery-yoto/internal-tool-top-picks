import { NextRequest, NextResponse } from "next/server";
import { getPicksForRegion, savePicksForRegion, ensureSchema } from "@/lib/db";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ region: string }> }
) {
  const { region } = await params;
  await ensureSchema();
  const productIds = await getPicksForRegion(region.toUpperCase());
  return NextResponse.json({ region: region.toUpperCase(), productIds });
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ region: string }> }
) {
  const { region } = await params;
  const body = await request.json();
  const productIds: string[] = body.productIds;

  if (!Array.isArray(productIds)) {
    return NextResponse.json(
      { error: "productIds must be an array" },
      { status: 400 }
    );
  }

  await ensureSchema();
  await savePicksForRegion(region.toUpperCase(), productIds);
  return NextResponse.json({ region: region.toUpperCase(), productIds });
}
