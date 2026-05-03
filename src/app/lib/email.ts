"use server";

import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

const FROM = "ZenCloudMedia <codes@zencloudweb.com>";

const BASE_URL = "https://zencloudweb.com/divination";

function codeBlock(code: string) {
  return `
    <div style="background:#1a1a1a;border:1px solid #333;padding:20px 24px;text-align:center;margin-bottom:28px;">
      <p style="font-family:monospace;font-size:26px;font-weight:700;letter-spacing:0.2em;margin:0;color:#e5e5e5;">
        ${code}
      </p>
    </div>`;
}

function footer() {
  return `
    <p style="font-size:12px;opacity:0.35;line-height:1.6;margin:0;">
      Enter this code at <a href="${BASE_URL}" style="color:#888;">${BASE_URL}</a>.
      Valid for 7 days. One use only.
    </p>`;
}

export async function sendDivinationCode(
  to:   string,
  code: string,
  days: number,
): Promise<void> {
  await resend.emails.send({
    from:    FROM,
    to,
    subject: "Your ZenCloudMedia Access Code",
    html: `
      <div style="font-family:sans-serif;max-width:480px;margin:0 auto;padding:32px 24px;background:#0a0a0a;color:#e5e5e5;">
        <p style="font-size:11px;letter-spacing:0.15em;text-transform:uppercase;opacity:0.4;margin:0 0 24px;">
          ZenCloudMedia · Divination
        </p>
        <h1 style="font-size:22px;font-weight:700;margin:0 0 8px;">Your access code</h1>
        <p style="font-size:13px;opacity:0.55;margin:0 0 28px;line-height:1.6;">
          Thank you for your donation. Enter the code below to unlock
          ${days} day${days !== 1 ? "s" : ""} of full access.
        </p>
        ${codeBlock(code)}
        ${footer()}
      </div>
    `,
  });
}

export async function sendThrowsCode(
  to:     string,
  code:   string,
  throws: number,
): Promise<void> {
  await resend.emails.send({
    from:    FROM,
    to,
    subject: "Your ZenCloudMedia Throw Bonus Code",
    html: `
      <div style="font-family:sans-serif;max-width:480px;margin:0 auto;padding:32px 24px;background:#0a0a0a;color:#e5e5e5;">
        <p style="font-size:11px;letter-spacing:0.15em;text-transform:uppercase;opacity:0.4;margin:0 0 24px;">
          ZenCloudMedia · Divination
        </p>
        <h1 style="font-size:22px;font-weight:700;margin:0 0 8px;">Your bonus code</h1>
        <p style="font-size:13px;opacity:0.55;margin:0 0 28px;line-height:1.6;">
          Thanks for watching! Enter this code to add +${throws} throw${throws !== 1 ? "s" : ""} to today&rsquo;s session.
        </p>
        ${codeBlock(code)}
        ${footer()}
      </div>
    `,
  });
}
