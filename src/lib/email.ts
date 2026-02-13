import { PickVersion } from "./types";

const RESEND_API = "https://api.resend.com/emails";

function getApiKey(): string | null {
  return process.env.RESEND_API_KEY || null;
}

function getFromEmail(): string {
  return process.env.RESEND_FROM_EMAIL || "onboarding@resend.dev";
}

function getNotifyEmail(): string | null {
  return process.env.NOTIFY_EMAIL || null;
}

function getAppUrl(): string {
  if (process.env.APP_URL) return process.env.APP_URL;
  if (process.env.VERCEL_PROJECT_PRODUCTION_URL)
    return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;
  return "https://yoto-internal-tool-manual-curation.vercel.app";
}

async function sendEmail(
  to: string,
  subject: string,
  html: string
): Promise<boolean> {
  const apiKey = getApiKey();
  if (!apiKey) return false;

  try {
    const res = await fetch(RESEND_API, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: getFromEmail(),
        to,
        subject,
        html,
      }),
    });
    const data = await res.json();
    return !!data.id;
  } catch (err) {
    console.error("Resend email error:", err);
    return false;
  }
}

export async function emailPendingRegions(
  versions: PickVersion[]
): Promise<boolean> {
  const notifyEmail = getNotifyEmail();
  if (!notifyEmail) return false;

  const rows = versions
    .map((v) => {
      const date = new Date(v.publishedAt).toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
        hour: "2-digit",
        minute: "2-digit",
      });
      return `<li><strong>${v.regionCode}</strong> — ${v.productIds.length} picks, published by ${v.publishedBy || "unknown"} on ${date}</li>`;
    })
    .join("");

  const appUrl = getAppUrl();
  const downloadUrl = `${appUrl}/api/picks/pending`;

  return sendEmail(
    notifyEmail,
    `Top Picks ready for sync (${versions.length} region${versions.length > 1 ? "s" : ""})`,
    `<h3>Top Picks ready for sync</h3>
<ul>${rows}</ul>
<p><a href="${downloadUrl}">Download pending picks (JSON)</a></p>
<p>Please run the sync script, then mark each region as Live in the <a href="${appUrl}">curation tool</a>.</p>`
  );
}

export async function emailPublisherLive(
  email: string,
  regionCode: string,
  pickCount: number
): Promise<boolean> {
  return sendEmail(
    email,
    `Your Top Picks for ${regionCode} are now live!`,
    `<p>Your Top Picks for <strong>${regionCode}</strong> are now live! (${pickCount} picks)</p>`
  );
}
