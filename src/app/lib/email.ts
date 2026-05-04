"use server";

import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

const FROM     = "ZenCloudMedia <codes@zencloudweb.com>";
const ALERT_TO = "zen1cloud1@gmail.com";
const BASE_URL = "https://zencloudweb.com/divination";

// ── Shared helpers ────────────────────────────────────────────────────────────

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

// ── User-facing emails ────────────────────────────────────────────────────────

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

// ── Error alert ───────────────────────────────────────────────────────────────

export type ErrorAlertContext = {
  fn:      string;           // server action or function name
  action?: string;           // e.g. "donate" | "video" | "redeemCode"
  ip?:     string;           // user IP if available
  code?:   string;           // ZCM code involved if any
  extra?:  Record<string, unknown>;  // any other relevant fields
};

export async function sendErrorAlert(
  err:     unknown,
  ctx:     ErrorAlertContext,
): Promise<void> {
  const ts      = new Date().toISOString();
  const env     = process.env.VERCEL_ENV ?? process.env.NODE_ENV ?? "unknown";
  const message = err instanceof Error ? err.message : String(err);
  const stack   = err instanceof Error && err.stack
    ? err.stack.replace(/</g, "&lt;").replace(/>/g, "&gt;")
    : "No stack available";

  const extraRows = ctx.extra
    ? Object.entries(ctx.extra)
        .map(([k, v]) => `<tr><td style="padding:4px 12px 4px 0;opacity:0.5;white-space:nowrap;">${k}</td><td style="padding:4px 0;font-family:monospace;">${JSON.stringify(v)}</td></tr>`)
        .join("")
    : "";

  const html = `
    <div style="font-family:sans-serif;max-width:680px;margin:0 auto;padding:32px 24px;background:#0a0a0a;color:#e5e5e5;">

      <p style="font-size:11px;letter-spacing:0.15em;text-transform:uppercase;color:#e55;margin:0 0 8px;">
        ZenCloudMedia · Error Alert
      </p>
      <h1 style="font-size:20px;font-weight:700;margin:0 0 4px;color:#ff6b6b;">
        ${ctx.fn}${ctx.action ? " &mdash; " + ctx.action : ""}
      </h1>
      <p style="font-size:12px;opacity:0.4;margin:0 0 24px;">${ts} &nbsp;&middot;&nbsp; env: ${env}</p>

      <!-- Error message -->
      <div style="background:#1a0a0a;border:1px solid #5a1a1a;padding:16px 20px;margin-bottom:24px;border-radius:4px;">
        <p style="font-family:monospace;font-size:14px;color:#ff9999;margin:0;word-break:break-all;">${message}</p>
      </div>

      <!-- Context table -->
      <h2 style="font-size:13px;text-transform:uppercase;letter-spacing:0.1em;opacity:0.5;margin:0 0 8px;">Context</h2>
      <table style="font-size:13px;margin-bottom:24px;width:100%;">
        <tr><td style="padding:4px 12px 4px 0;opacity:0.5;white-space:nowrap;">function</td><td style="padding:4px 0;font-family:monospace;">${ctx.fn}</td></tr>
        ${ctx.action  ? `<tr><td style="padding:4px 12px 4px 0;opacity:0.5;">action</td><td style="padding:4px 0;font-family:monospace;">${ctx.action}</td></tr>` : ""}
        ${ctx.ip      ? `<tr><td style="padding:4px 12px 4px 0;opacity:0.5;">ip</td><td style="padding:4px 0;font-family:monospace;">${ctx.ip}</td></tr>` : ""}
        ${ctx.code    ? `<tr><td style="padding:4px 12px 4px 0;opacity:0.5;">code</td><td style="padding:4px 0;font-family:monospace;">${ctx.code}</td></tr>` : ""}
        ${extraRows}
      </table>

      <!-- Stack trace -->
      <h2 style="font-size:13px;text-transform:uppercase;letter-spacing:0.1em;opacity:0.5;margin:0 0 8px;">Stack Trace</h2>
      <pre style="background:#111;border:1px solid #333;padding:16px;font-size:11px;line-height:1.6;overflow-x:auto;white-space:pre-wrap;word-break:break-all;color:#aaa;margin:0 0 28px;">${stack}</pre>

      <!-- Diagnostic guide for Claude -->
      <div style="background:#0a1a0a;border:1px solid #1a3a1a;padding:20px 24px;border-radius:4px;">
        <p style="font-size:11px;text-transform:uppercase;letter-spacing:0.1em;color:#4a9;margin:0 0 12px;">Diagnostic Guide</p>
        <p style="font-size:12px;line-height:1.8;color:#8c8;margin:0 0 8px;">
          <b>Project:</b> <code style="background:#111;padding:1px 5px;">C:\\git\\ZenCloudMedia</code>
        </p>
        <p style="font-size:12px;line-height:1.8;color:#8c8;margin:0 0 8px;">
          <b>Key files:</b><br>
          &nbsp;&nbsp;<code style="background:#111;padding:1px 5px;">src/app/divination/actions.ts</code> — throw gating, token gen, code redemption<br>
          &nbsp;&nbsp;<code style="background:#111;padding:1px 5px;">src/app/lib/email.ts</code> — Resend email delivery<br>
          &nbsp;&nbsp;<code style="background:#111;padding:1px 5px;">src/app/lib/supabase-server.ts</code> — DB client factory<br>
          &nbsp;&nbsp;<code style="background:#111;padding:1px 5px;">src/app/admin/actions.ts</code> — admin token management
        </p>
        <p style="font-size:12px;line-height:1.8;color:#8c8;margin:0 0 8px;">
          <b>Database:</b> Supabase project <code style="background:#111;padding:1px 5px;">ilbmixmkmdshxdxsyege</code><br>
          &nbsp;&nbsp;Tables: divination_tokens, divination_token_uses, divination_access, divination_throws, divination_config<br>
          &nbsp;&nbsp;Credentials: <code style="background:#111;padding:1px 5px;">C:\\git\\PythonCodeProjects\\_skill_build\\safe-subagent\\_Credentials\\supabase.md</code>
        </p>
        <p style="font-size:12px;line-height:1.8;color:#8c8;margin:0 0 8px;">
          <b>Steps to diagnose:</b><br>
          1. Open project in Claude Code: <code style="background:#111;padding:1px 5px;">cd C:\\git\\ZenCloudMedia</code><br>
          2. Run brain recall: <code style="background:#111;padding:1px 5px;">python3 .agent/tools/recall.py "${ctx.fn} error"</code><br>
          3. Check Vercel logs: <code style="background:#111;padding:1px 5px;">https://vercel.com/bakuretsu-2949s-projects/zencloudmedia</code><br>
          4. Check Supabase logs: <code style="background:#111;padding:1px 5px;">https://supabase.com/dashboard/project/ilbmixmkmdshxdxsyege/logs/edge-logs</code><br>
          5. Read memory: <code style="background:#111;padding:1px 5px;">C:\\Users\\pgx\\.claude\\projects\\C--git-ZenCloudMedia\\memory\\MEMORY.md</code>
        </p>
        <p style="font-size:12px;line-height:1.8;color:#8c8;margin:0;">
          <b>Wiki docs:</b> <a href="https://bakuretsu.visualstudio.com/OmegaLantern/_wiki/wikis/OmegaLantern.wiki/375/Documentation" style="color:#6c6;">Divination Documentation</a>
        </p>
      </div>

    </div>
  `;

  try {
    await resend.emails.send({
      from:    FROM,
      to:      ALERT_TO,
      subject: `[ZenCloudMedia ERROR] ${ctx.fn}${ctx.action ? " / " + ctx.action : ""} — ${message.slice(0, 80)}`,
      html,
    });
  } catch {
    // Never throw from the alert sender itself — just log
    console.error("[sendErrorAlert] Failed to send alert email");
  }
}
