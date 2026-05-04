"use server";

import { headers, cookies } from "next/headers";
import { createServerClient } from "@/app/lib/supabase-server";
import { fetchYouTubeVideos, findVideo } from "@/app/lib/fetchYouTubeVideos";
import { sendDivinationCode, sendThrowsCode, sendErrorAlert } from "@/app/lib/email";

const CHANNEL_FALLBACK = "https://www.youtube.com/@ZenCloud1Media/shorts";

// ── Types ─────────────────────────────────────────────────────────────────

export type GateConfig = {
  dailyLimit:        number;
  accessDailyLimit:  number;
  donateAccessDays:  number;
  shirtAccessDays:   number;
  videoBonusThrows:  number;
};

export type SessionStatus = {
  mode:              "bypass" | "access" | "free";
  throwsToday:       number;
  throwsLimit:       number | null;  // null = unlimited
  throwsLeft:        number | null;  // null = unlimited
  bonusThrowsToday:  number;
  // Most recently redeemed code (any type) — shown as primary label
  lastCode?:         string;
  lastCodeType?:     "access" | "throws";
  // Active multi-day access (may differ from lastCode if a throws token was applied more recently)
  accessExpiresAt?:  string;
  accessDaysLeft?:   number;
};

// ── Helpers ───────────────────────────────────────────────────────────────

async function getClientIP(): Promise<string> {
  const h = await headers();
  return (
    h.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    h.get("x-real-ip") ??
    "unknown"
  );
}

function today(): string {
  return new Date().toISOString().split("T")[0];
}

async function hasBypass(): Promise<boolean> {
  const jar = await cookies();
  return (
    jar.get("divination_bypass")?.value       === "1" ||
    jar.get("divination_token_active")?.value === "1"
  );
}

async function hasMultiDayAccess(ip: string): Promise<boolean> {
  const db = createServerClient();
  const { data } = await db
    .from("divination_access")
    .select("expires_at")
    .eq("ip", ip)
    .gt("expires_at", new Date().toISOString())
    .maybeSingle();
  return !!data;
}

function generateCode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "ZCM-";
  for (let i = 0; i < 6; i++) code += chars[Math.floor(Math.random() * chars.length)];
  return code;
}

// ── Config ────────────────────────────────────────────────────────────────

export async function getGateConfig(): Promise<GateConfig> {
  const db = createServerClient();
  const { data } = await db.from("divination_config").select("key, value");
  const map = Object.fromEntries((data ?? []).map((r) => [r.key, r.value]));
  return {
    dailyLimit:       parseInt(map["daily_limit"]         ?? "6",    10),
    accessDailyLimit: parseInt(map["access_daily_limit"]  ?? "1000", 10),
    donateAccessDays: parseInt(map["donate_access_days"]  ?? "3",    10),
    shirtAccessDays:  parseInt(map["shirt_access_days"]   ?? "3",    10),
    videoBonusThrows: parseInt(map["video_bonus_throws"]  ?? "6",    10),
  };
}

// ── Throw gating ──────────────────────────────────────────────────────────

export async function getThrowStatus(): Promise<{
  count: number;
  unlocked: boolean;
  limited: boolean;
}> {
  if (await hasBypass()) return { count: 0, unlocked: true, limited: false };

  const ip           = await getClientIP();
  const db           = createServerClient();
  const config       = await getGateConfig();
  const isAccessUser = await hasMultiDayAccess(ip);

  const { data } = await db
    .from("divination_throws")
    .select("count, unlocked, bonus")
    .eq("ip", ip)
    .eq("throw_date", today())
    .maybeSingle();

  const count    = data?.count    ?? 0;
  const unlocked = data?.unlocked ?? false;
  const bonus    = data?.bonus    ?? 0;
  const limit    = isAccessUser ? config.accessDailyLimit : (config.dailyLimit + bonus);
  const limited  = count >= limit && !unlocked;
  return { count, unlocked, limited };
}

export async function getSessionStatus(): Promise<SessionStatus> {
  const config = await getGateConfig();

  if (await hasBypass()) {
    return { mode: "bypass", throwsToday: 0, throwsLimit: null, throwsLeft: null, bonusThrowsToday: 0 };
  }

  const ip = await getClientIP();
  const db = createServerClient();

  // Multi-day access row (null if none)
  const { data: accessRow } = await db
    .from("divination_access")
    .select("expires_at")
    .eq("ip", ip)
    .gt("expires_at", new Date().toISOString())
    .maybeSingle();

  const isAccessUser = !!accessRow;

  // Today's throw row
  const { data: throwRow } = await db
    .from("divination_throws")
    .select("count, bonus, unlocked")
    .eq("ip", ip)
    .eq("throw_date", today())
    .maybeSingle();

  const throwsToday = throwRow?.count    ?? 0;
  const bonus       = throwRow?.bonus    ?? 0;
  const unlocked    = throwRow?.unlocked ?? false;
  const limit       = isAccessUser ? config.accessDailyLimit : config.dailyLimit + bonus;
  const throwsLeft  = unlocked ? null : Math.max(0, limit - throwsToday);

  // Most recently redeemed code (any type) for this IP
  let lastCode: string | undefined;
  let lastCodeType: "access" | "throws" | undefined;
  try {
    const { data: latestUse } = await db
      .from("divination_token_uses")
      .select("token_id")
      .eq("ip", ip)
      .order("used_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (latestUse) {
      const { data: tok } = await db
        .from("divination_tokens")
        .select("code, token_type")
        .eq("id", latestUse.token_id)
        .maybeSingle();
      if (tok) {
        lastCode     = tok.code;
        lastCodeType = tok.token_type as "access" | "throws";
      }
    }
  } catch {}

  if (isAccessUser && accessRow) {
    const expiresAt = accessRow.expires_at as string;
    const daysLeft  = Math.ceil(
      (new Date(expiresAt).getTime() - Date.now()) / (1000 * 60 * 60 * 24),
    );
    return {
      mode: "access",
      throwsToday,
      throwsLimit:      config.accessDailyLimit,
      throwsLeft,
      bonusThrowsToday: bonus,
      lastCode,
      lastCodeType,
      accessExpiresAt:  expiresAt,
      accessDaysLeft:   daysLeft,
    };
  }

  return {
    mode: "free",
    throwsToday,
    throwsLimit:      config.dailyLimit + bonus,
    throwsLeft,
    bonusThrowsToday: bonus,
    lastCode,
    lastCodeType,
  };
}

export async function lookupCode(
  code: string,
): Promise<{ found: false } | {
  found:      true;
  active:     boolean;
  expired:    boolean;
  spent:      boolean;
  useCount:   number;
  maxUses:    number | null;
  tokenType:  string;
  grantDays:  number | null;
  grantThrows: number | null;
  expiresAt:  string | null;
}> {
  const db = createServerClient();
  const { data } = await db
    .from("divination_tokens")
    .select("active, use_count, max_uses, expires_at, token_type, grant_days, grant_throws")
    .eq("code", code.toUpperCase().trim())
    .maybeSingle();

  if (!data) return { found: false };

  const expired = !!data.expires_at && new Date(data.expires_at) < new Date();
  const spent   = data.max_uses !== null && data.use_count >= data.max_uses;

  return {
    found:       true,
    active:      !!data.active,
    expired,
    spent,
    useCount:    data.use_count,
    maxUses:     data.max_uses,
    tokenType:   data.token_type,
    grantDays:   data.grant_days   ?? null,
    grantThrows: data.grant_throws ?? null,
    expiresAt:   data.expires_at   ?? null,
  };
}

export async function recordThrow(): Promise<{
  allowed: boolean;
  count:   number;
}> {
  if (await hasBypass()) return { allowed: true, count: 0 };

  const ip = await getClientIP();
  try {
    const db           = createServerClient();
    const config       = await getGateConfig();
    const date         = today();
    const isAccessUser = await hasMultiDayAccess(ip);

    const { data } = await db
      .from("divination_throws")
      .select("count, unlocked, bonus")
      .eq("ip", ip)
      .eq("throw_date", date)
      .maybeSingle();

    const count    = data?.count    ?? 0;
    const unlocked = data?.unlocked ?? false;
    const bonus    = data?.bonus    ?? 0;
    const limit    = isAccessUser ? config.accessDailyLimit : (config.dailyLimit + bonus);

    if (count >= limit && !unlocked) {
      return { allowed: false, count };
    }

    const newCount = count + 1;
    await db.from("divination_throws").upsert(
      { ip, throw_date: date, count: newCount, unlocked, bonus },
      { onConflict: "ip,throw_date" },
    );
    return { allowed: true, count: newCount };
  } catch (err) {
    await sendErrorAlert(err, { fn: "recordThrow", ip, extra: { date: today() } });
    return { allowed: false, count: 0 };
  }
}

// ── Token generation (one per action click) ───────────────────────────────

export async function generateActionToken(
  action: "donate" | "video" | "shirt",
  email?: string,
): Promise<string> {
  try {
    const config = await getGateConfig();
    const db     = createServerClient();

    const isThrows  = action === "video";
    const grantDays = !isThrows
      ? (action === "shirt" ? config.shirtAccessDays : config.donateAccessDays)
      : null;
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    let code = generateCode();
    const { data: existing } = await db
      .from("divination_tokens")
      .select("id")
      .eq("code", code)
      .maybeSingle();
    if (existing) code = generateCode();

    await db.from("divination_tokens").insert({
      code,
      label:        `Auto: ${action}`,
      max_uses:     1,
      token_type:   isThrows ? "throws" : "access",
      grant_throws: isThrows ? config.videoBonusThrows : null,
      grant_days:   grantDays,
      expires_at:   expiresAt.toISOString(),
      active:       true,
      email:        email ?? null,
    });

    if (email) {
      try {
        if (isThrows) {
          await sendThrowsCode(email, code, config.videoBonusThrows);
        } else if (grantDays) {
          await sendDivinationCode(email, code, grantDays);
        }
      } catch (err) {
        await sendErrorAlert(err, {
          fn: "generateActionToken", action,
          extra: { emailProvided: !!email, code, grantDays, isThrows },
        });
      }
    }

    return code;
  } catch (err) {
    await sendErrorAlert(err, {
      fn: "generateActionToken", action,
      extra: { emailProvided: !!email },
    });
    throw err;
  }
}

// ── Code redemption ───────────────────────────────────────────────────────

export async function redeemCode(
  code: string,
): Promise<{ success: boolean; message: string }> {
  if (await hasBypass()) return { success: true, message: "Already unlocked." };

  const ip = await getClientIP();
  try {
    const db     = createServerClient();
    const config = await getGateConfig();

    const { data: token } = await db
      .from("divination_tokens")
      .select("id, active, max_uses, use_count, expires_at, token_type, grant_days, grant_throws")
      .eq("code", code.toUpperCase().trim())
      .maybeSingle();

    if (!token)                    return { success: false, message: "Invalid code." };
    if (!token.active)             return { success: false, message: "This code is no longer active." };
    if (token.expires_at && new Date(token.expires_at) < new Date())
                                   return { success: false, message: "This code has expired." };
    if (token.max_uses !== null && token.use_count >= token.max_uses)
                                   return { success: false, message: "This code has already been used." };

    const { data: alreadyUsed } = await db
      .from("divination_token_uses")
      .select("ip")
      .eq("token_id", token.id)
      .eq("ip", ip)
      .maybeSingle();
    if (alreadyUsed) return { success: false, message: "You have already redeemed this code." };

    await db.from("divination_token_uses").insert({ token_id: token.id, ip });
    await db.from("divination_tokens")
      .update({ use_count: token.use_count + 1 })
      .eq("id", token.id);

    if (token.token_type === "throws") {
      const date  = today();
      const { data: row } = await db
        .from("divination_throws")
        .select("count, unlocked, bonus")
        .eq("ip", ip)
        .eq("throw_date", date)
        .maybeSingle();

      const bonus = (row?.bonus ?? 0) + (token.grant_throws ?? config.videoBonusThrows);
      await db.from("divination_throws").upsert(
        { ip, throw_date: date, count: row?.count ?? 0, unlocked: row?.unlocked ?? false, bonus },
        { onConflict: "ip,throw_date" },
      );
      return {
        success: true,
        message: `+${token.grant_throws ?? config.videoBonusThrows} throws added — continue your reading.`,
      };
    } else {
      const days      = token.grant_days ?? config.donateAccessDays;
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + days);
      await db.from("divination_access").upsert(
        { ip, expires_at: expiresAt.toISOString(), tier: "token" },
        { onConflict: "ip" },
      );
      return {
        success: true,
        message: `Access granted for ${days} day${days !== 1 ? "s" : ""} — continue your reading.`,
      };
    }
  } catch (err) {
    await sendErrorAlert(err, {
      fn: "redeemCode", ip, code,
      extra: { date: today() },
    });
    return { success: false, message: "Something went wrong. Please try again." };
  }
}

// ── Video lookup ──────────────────────────────────────────────────────────

export async function getVideoForCategory(keyword: string): Promise<string> {
  const videos = await fetchYouTubeVideos();
  return findVideo(videos, keyword)?.url ?? CHANNEL_FALLBACK;
}
