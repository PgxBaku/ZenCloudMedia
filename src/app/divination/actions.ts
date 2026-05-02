"use server";

import { headers, cookies } from "next/headers";
import { createServerClient } from "@/app/lib/supabase-server";
import { fetchYouTubeVideos, findVideo } from "@/app/lib/fetchYouTubeVideos";

const DAILY_LIMIT = 6;
const CHANNEL_FALLBACK = "https://www.youtube.com/@ZenCloud1Media/shorts";

async function getClientIP(): Promise<string> {
  const h = await headers();
  return (
    h.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    h.get("x-real-ip") ??
    "unknown"
  );
}

async function hasBypass(): Promise<boolean> {
  const jar = await cookies();
  return jar.get("divination_bypass")?.value === "1";
}

function today(): string {
  return new Date().toISOString().split("T")[0];
}

export async function getThrowStatus(): Promise<{
  count: number;
  unlocked: boolean;
  limited: boolean;
}> {
  if (await hasBypass()) return { count: 0, unlocked: true, limited: false };

  const ip = await getClientIP();
  const db = createServerClient();

  const { data } = await db
    .from("divination_throws")
    .select("count, unlocked")
    .eq("ip", ip)
    .eq("throw_date", today())
    .single();

  const count    = data?.count    ?? 0;
  const unlocked = data?.unlocked ?? false;

  return { count, unlocked, limited: count >= DAILY_LIMIT && !unlocked };
}

export async function recordThrow(): Promise<{
  allowed: boolean;
  count: number;
}> {
  if (await hasBypass()) return { allowed: true, count: 0 };

  const ip = await getClientIP();
  const db = createServerClient();
  const date = today();

  const { data } = await db
    .from("divination_throws")
    .select("count, unlocked")
    .eq("ip", ip)
    .eq("throw_date", date)
    .single();

  const count    = data?.count    ?? 0;
  const unlocked = data?.unlocked ?? false;

  if (count >= DAILY_LIMIT && !unlocked) {
    return { allowed: false, count };
  }

  const newCount = count + 1;

  await db.from("divination_throws").upsert(
    { ip, throw_date: date, count: newCount, unlocked },
    { onConflict: "ip,throw_date" },
  );

  return { allowed: true, count: newCount };
}

export async function unlockSession(): Promise<void> {
  const ip = await getClientIP();
  const db = createServerClient();
  const date = today();

  const { data } = await db
    .from("divination_throws")
    .select("count")
    .eq("ip", ip)
    .eq("throw_date", date)
    .single();

  await db.from("divination_throws").upsert(
    { ip, throw_date: date, count: data?.count ?? 0, unlocked: true },
    { onConflict: "ip,throw_date" },
  );
}

export async function getVideoForCategory(keyword: string): Promise<string> {
  const videos = await fetchYouTubeVideos();
  return findVideo(videos, keyword)?.url ?? CHANNEL_FALLBACK;
}
