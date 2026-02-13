import { NextResponse } from "next/server";
import { ensureSchema, getPendingRegions } from "@/lib/db";

export async function GET() {
  try {
    await ensureSchema();
    const pending = await getPendingRegions();

    const payload = pending.map((v) => ({
      regionCode: v.regionCode,
      productIds: v.productIds,
      publishedBy: v.publishedBy,
      publishedAt: v.publishedAt,
    }));

    return new NextResponse(JSON.stringify(payload, null, 2), {
      headers: {
        "Content-Type": "application/json",
        "Content-Disposition": `attachment; filename="top-picks-pending.json"`,
      },
    });
  } catch (err) {
    console.error("Pending export failed:", err);
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
