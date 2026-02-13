import { NextResponse } from "next/server";
import { ensureSchema, getPendingRegions } from "@/lib/db";
import { notifyChannelPendingRegions } from "@/lib/slack";
import { emailPendingRegions } from "@/lib/email";

export async function POST() {
  try {
    await ensureSchema();
    const pending = await getPendingRegions();

    if (pending.length === 0) {
      return NextResponse.json({
        message: "Nothing pending — all regions are synced",
        notified: false,
      });
    }

    // Try Slack first, fall back to email
    const slackSent = await notifyChannelPendingRegions(pending);
    if (slackSent) {
      return NextResponse.json({
        message: `Notified backend via Slack about ${pending.length} pending region(s)`,
        notified: true,
        method: "slack",
        regions: pending.map((v) => v.regionCode),
      });
    }

    const emailSent = await emailPendingRegions(pending);
    if (emailSent) {
      return NextResponse.json({
        message: `Notified backend via email about ${pending.length} pending region(s)`,
        notified: true,
        method: "email",
        regions: pending.map((v) => v.regionCode),
      });
    }

    return NextResponse.json({
      message:
        "Notification failed — check SLACK_BOT_TOKEN/SLACK_CHANNEL_ID or RESEND_API_KEY/NOTIFY_EMAIL",
      notified: false,
      regions: pending.map((v) => v.regionCode),
    });
  } catch (err) {
    console.error("Notify failed:", err);
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
