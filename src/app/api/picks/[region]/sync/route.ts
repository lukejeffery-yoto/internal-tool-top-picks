import { NextRequest, NextResponse } from "next/server";
import { ensureSchema, markVersionSynced } from "@/lib/db";
import { lookupSlackUserId, sendSlackDM } from "@/lib/slack";
import { emailPublisherLive } from "@/lib/email";

export async function POST(
  _request: NextRequest,
  { params }: { params: Promise<{ region: string }> }
) {
  try {
    const { region } = await params;
    const regionCode = region.toUpperCase();
    await ensureSchema();

    const version = await markVersionSynced(regionCode);
    if (!version) {
      return NextResponse.json(
        { error: "No published version found for this region" },
        { status: 404 }
      );
    }

    // Fire-and-forget: notify publisher via Slack DM, fall back to email
    if (version.publishedBy) {
      const email = version.publishedBy.includes("@")
        ? version.publishedBy
        : `${version.publishedBy}@yotoplay.com`;

      lookupSlackUserId(email).then(async (userId) => {
        if (userId) {
          const sent = await sendSlackDM(
            userId,
            `✅ Your Top Picks for *${regionCode}* are now live! (${version.productIds.length} picks)`
          );
          if (sent) return;
        }
        // Slack failed or unavailable — fall back to email
        emailPublisherLive(email, regionCode, version.productIds.length);
      });
    }

    return NextResponse.json({ version });
  } catch (err) {
    console.error("Sync failed:", err);
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
