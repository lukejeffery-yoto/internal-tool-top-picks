import { NextRequest, NextResponse } from "next/server";
import {
  getPicksForRegion,
  savePicksForRegion,
  getLatestPublishedPicks,
  ensureSchema,
} from "@/lib/db";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ region: string }> }
) {
  const { region } = await params;
  const regionCode = region.toUpperCase();
  await ensureSchema();
  const [productIds, latestPublished] = await Promise.all([
    getPicksForRegion(regionCode),
    getLatestPublishedPicks(regionCode),
  ]);
  return NextResponse.json({
    region: regionCode,
    productIds,
    publishedProductIds: latestPublished?.productIds ?? null,
    lastPublishedAt: latestPublished?.publishedAt ?? null,
    lastPublishedBy: latestPublished?.publishedBy ?? null,
    syncedAt: latestPublished?.syncedAt ?? null,
  });
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
