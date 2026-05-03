"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createServerClient } from "@/app/lib/supabase-server";

// ── Auth ──────────────────────────────────────────────────────────────────

export async function adminLogin(formData: FormData) {
  const password   = formData.get("password") as string;
  const adminPass  = process.env.ADMIN_PASSWORD ?? "";

  if (!adminPass || password !== adminPass) {
    redirect("/admin/login?error=1");
  }

  const jar = await cookies();
  jar.set("admin_session", "1", {
    httpOnly: true,
    secure:   true,
    sameSite: "lax",
    maxAge:   60 * 60 * 8, // 8 hours
    path:     "/",
  });

  redirect("/admin");
}

export async function adminLogout() {
  const jar = await cookies();
  jar.delete("admin_session");
  redirect("/admin/login");
}

// ── Config ────────────────────────────────────────────────────────────────

export type AccessRow = { ip: string; expires_at: string; tier: string };

export async function listActiveAccess(): Promise<AccessRow[]> {
  const db = createServerClient();
  const { data } = await db
    .from("divination_access")
    .select("ip, expires_at, tier")
    .gt("expires_at", new Date().toISOString())
    .order("expires_at", { ascending: false });
  return (data ?? []) as AccessRow[];
}

export async function getAdminConfig(): Promise<Record<string, string>> {
  const db = createServerClient();
  const { data } = await db.from("divination_config").select("key, value");
  const out: Record<string, string> = {};
  for (const r of data ?? []) out[r.key] = r.value;
  return out;
}

export async function updateConfig(key: string, value: string) {
  const db = createServerClient();
  await db
    .from("divination_config")
    .upsert({ key, value }, { onConflict: "key" });
}

export async function updateConfigFromForm(formData: FormData) {
  const key   = formData.get("key")   as string;
  const value = formData.get("value") as string;
  await updateConfig(key, value);
  redirect("/admin");
}

// ── Tokens ────────────────────────────────────────────────────────────────

export type TokenRow = {
  id:               string;
  code:             string;
  label:            string;
  token_type:       string;
  grant_days:       number | null;
  grant_throws:     number | null;
  max_uses:         number | null;
  use_count:        number;
  expires_at:       string | null;
  active:           boolean;
  created_at:       string;
  activeAccessUntil: string | null; // populated for spent access tokens with a live grant
};

export async function listTokens(): Promise<TokenRow[]> {
  const db = createServerClient();
  const { data } = await db
    .from("divination_tokens")
    .select("*")
    .order("created_at", { ascending: false });

  const tokens = (data ?? []) as (Omit<TokenRow, "activeAccessUntil">)[];

  // For spent access tokens, look up whether their granted access is still active
  const spentAccessIds = tokens
    .filter((t) => t.token_type === "access" && t.max_uses != null && t.use_count >= t.max_uses)
    .map((t) => t.id);

  const activeUntilMap: Record<string, string> = {};

  if (spentAccessIds.length) {
    const { data: uses } = await db
      .from("divination_token_uses")
      .select("token_id, ip")
      .in("token_id", spentAccessIds);

    if (uses?.length) {
      const ips = [...new Set(uses.map((u: { ip: string }) => u.ip))];
      const { data: access } = await db
        .from("divination_access")
        .select("ip, expires_at")
        .in("ip", ips)
        .gt("expires_at", new Date().toISOString());

      for (const row of access ?? []) {
        const matchingIds = (uses as { ip: string; token_id: string }[])
          .filter((u) => u.ip === row.ip)
          .map((u) => u.token_id);
        for (const tokenId of matchingIds) {
          activeUntilMap[tokenId] = row.expires_at as string;
        }
      }
    }
  }

  return tokens.map((t) => ({
    ...t,
    activeAccessUntil: activeUntilMap[t.id] ?? null,
  }));
}

export async function createToken(formData: FormData) {
  const db = createServerClient();

  const code       = (formData.get("code") as string).toUpperCase().trim();
  const label      = formData.get("label")       as string;
  const tokenType  = formData.get("token_type")  as string;
  const grantDays  = formData.get("grant_days")  ? parseInt(formData.get("grant_days")  as string, 10) : null;
  const grantThrows= formData.get("grant_throws")? parseInt(formData.get("grant_throws")as string, 10) : null;
  const maxUsesRaw = formData.get("max_uses") ? parseInt(formData.get("max_uses") as string, 10) : null;
  const maxUses    = maxUsesRaw !== null ? Math.max(1, maxUsesRaw) : null;
  const expiresRaw = formData.get("expires_at")  as string;
  const expiresAt  = expiresRaw ? new Date(expiresRaw).toISOString() : null;

  await db.from("divination_tokens").insert({
    code,
    label,
    token_type:   tokenType,
    grant_days:   tokenType === "access"  ? grantDays   : null,
    grant_throws: tokenType === "throws"  ? grantThrows : null,
    max_uses:     maxUses,
    expires_at:   expiresAt,
    active:       true,
  });
  redirect("/admin");
}

export async function revokeToken(id: string) {
  const db = createServerClient();
  await db.from("divination_tokens").update({ active: false }).eq("id", id);
}

export async function deleteToken(id: string) {
  const db = createServerClient();
  await db.from("divination_tokens").delete().eq("id", id);
}

export async function topUpToken(formData: FormData) {
  const id          = formData.get("id")           as string;
  const grantThrows = formData.get("grant_throws") as string;
  const grantDays   = formData.get("grant_days")   as string;
  const reactivate  = formData.get("reactivate")   === "on";
  const resetIPs    = formData.get("reset_ips")    === "on";

  const db = createServerClient();
  const update: Record<string, unknown> = {};

  if (grantThrows) update.grant_throws = parseInt(grantThrows, 10);
  if (grantDays)   update.grant_days   = parseInt(grantDays,   10);
  if (reactivate)  { update.active = true; update.use_count = 0; }

  if (Object.keys(update).length > 0) {
    await db.from("divination_tokens").update(update).eq("id", id);
  }
  if (resetIPs) {
    await db.from("divination_token_uses").delete().eq("token_id", id);
  }
  redirect("/admin");
}

export async function clearAccessForIP(formData: FormData) {
  const ip = (formData.get("ip") as string).trim();
  if (!ip) redirect("/admin");
  const db = createServerClient();
  await db.from("divination_access").delete().eq("ip", ip);
  redirect("/admin");
}

export async function purgeSpentTokensFromForm(formData: FormData) {
  const days   = Math.max(1, parseInt(formData.get("days") as string, 10) || 7);
  const db     = createServerClient();
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - days);

  // Fetch candidates old enough that have a finite use limit
  const { data } = await db
    .from("divination_tokens")
    .select("id, use_count, max_uses")
    .lt("created_at", cutoff.toISOString())
    .not("max_uses", "is", null);

  const spentIds = (data ?? [])
    .filter((t) => t.use_count >= t.max_uses)
    .map((t) => t.id as string);

  if (spentIds.length) {
    await db.from("divination_tokens").delete().in("id", spentIds);
  }
  redirect("/admin");
}

export async function revokeTokenById(formData: FormData) {
  const id = formData.get("id") as string;
  await revokeToken(id);
  redirect("/admin");
}

export async function deleteTokenById(formData: FormData) {
  const id = formData.get("id") as string;
  await deleteToken(id);
  redirect("/admin");
}
