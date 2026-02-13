import { PickVersion } from "./types";

const SLACK_API = "https://slack.com/api";

function getToken(): string | null {
  return process.env.SLACK_BOT_TOKEN || null;
}

function getChannelId(): string | null {
  return process.env.SLACK_CHANNEL_ID || null;
}

async function slackPost(method: string, body: Record<string, unknown>) {
  const token = getToken();
  if (!token) return null;
  const res = await fetch(`${SLACK_API}/${method}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
  return res.json();
}

export async function notifyChannelPendingRegions(
  versions: PickVersion[]
): Promise<boolean> {
  const channelId = getChannelId();
  if (!channelId || !getToken()) return false;

  try {
    const lines = versions.map((v) => {
      const date = new Date(v.publishedAt).toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
        hour: "2-digit",
        minute: "2-digit",
      });
      return `• *${v.regionCode}* — ${v.productIds.length} picks, published by ${v.publishedBy || "unknown"} on ${date}`;
    });

    const text = `🔔 *Top Picks ready for sync*\n\n${lines.join("\n")}\n\nPlease run the sync script, then mark each region as Live in the curation tool.`;

    const result = await slackPost("chat.postMessage", {
      channel: channelId,
      text,
    });
    return result?.ok === true;
  } catch (err) {
    console.error("Slack notify error:", err);
    return false;
  }
}

export async function lookupSlackUserId(
  email: string
): Promise<string | null> {
  if (!getToken()) return null;
  try {
    const result = await slackPost("users.lookupByEmail", { email });
    return result?.ok ? result.user?.id ?? null : null;
  } catch {
    return null;
  }
}

export async function sendSlackDM(
  userId: string,
  text: string
): Promise<boolean> {
  if (!getToken()) return false;
  try {
    const openResult = await slackPost("conversations.open", {
      users: userId,
    });
    if (!openResult?.ok) return false;
    const channelId = openResult.channel?.id;
    const msgResult = await slackPost("chat.postMessage", {
      channel: channelId,
      text,
    });
    return msgResult?.ok === true;
  } catch {
    return false;
  }
}
