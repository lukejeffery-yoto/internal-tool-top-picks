import { NextRequest, NextResponse } from "next/server";
import { ensureSchema, getPicksForRegion, publishPicks } from "@/lib/db";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ region: string }> }
) {
  try {
    const { region } = await params;
    const regionCode = region.toUpperCase();
    const body = await request.json().catch(() => ({}));
    const note: string = body.note || "";
    const publishedBy: string = body.publishedBy || "";

    await ensureSchema();

    const productIds = await getPicksForRegion(regionCode);

    if (productIds.length === 0) {
      return NextResponse.json(
        { error: "Cannot publish empty picks" },
        { status: 400 }
      );
    }

    const version = await publishPicks(regionCode, productIds, note, publishedBy);

    return NextResponse.json({ version });
  } catch (err) {
    console.error("Publish failed:", err);
    return NextResponse.json(
      { error: String(err) },
      { status: 500 }
    );
  }
}
