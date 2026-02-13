import { NextRequest, NextResponse } from "next/server";
import { ensureSchema, getPickVersions, savePicksForRegion } from "@/lib/db";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ region: string }> }
) {
  const { region } = await params;
  const regionCode = region.toUpperCase();
  const body = await request.json();
  const versionId: number = body.versionId;

  if (!versionId) {
    return NextResponse.json(
      { error: "versionId is required" },
      { status: 400 }
    );
  }

  await ensureSchema();

  const versions = await getPickVersions(regionCode, 100);
  const target = versions.find((v) => v.id === versionId);

  if (!target) {
    return NextResponse.json(
      { error: "Version not found" },
      { status: 404 }
    );
  }

  await savePicksForRegion(regionCode, target.productIds);

  return NextResponse.json({
    region: regionCode,
    productIds: target.productIds,
    restoredFromVersion: versionId,
  });
}
