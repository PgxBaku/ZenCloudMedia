/**
 * Integration tests for the divination_throws Supabase table.
 * Run: node scripts/test-divination-db.mjs
 *
 * Uses a synthetic IP ("__test__") so it never touches real user rows.
 * Cleans up after itself.
 */

import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "fs";
import { resolve } from "path";

// Load .env.local so this script works without a separate env setup
try {
  const env = readFileSync(resolve(process.cwd(), ".env.local"), "utf8");
  for (const line of env.split("\n")) {
    const eq = line.indexOf("=");
    if (eq > 0) process.env[line.slice(0, eq).trim()] = line.slice(eq + 1).trim();
  }
} catch { /* .env.local is optional */ }

const URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const KEY = process.env.SUPABASE_SECRET_KEY;

if (!URL || !KEY) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SECRET_KEY in .env.local");
  process.exit(1);
}

const TEST_IP = "__test__";
const DAILY_LIMIT = 6;

const db = createClient(URL, KEY);

// ── helpers ───────────────────────────────────────────────────────────────

let passed = 0;
let failed = 0;

function ok(label) {
  console.log(`  ✓  ${label}`);
  passed++;
}

function fail(label, detail) {
  console.error(`  ✗  ${label}`);
  if (detail) console.error(`     ${detail}`);
  failed++;
}

async function cleanup() {
  await db.from("divination_throws").delete().eq("ip", TEST_IP);
}

function today() {
  return new Date().toISOString().split("T")[0];
}

// ── table existence check ─────────────────────────────────────────────────

async function checkTable() {
  console.log("\n── Table check ─────────────────────────────────────────");
  const { error } = await db
    .from("divination_throws")
    .select("count")
    .limit(1);

  if (error) {
    fail("divination_throws exists", error.message);
    console.error(`
  Run this SQL in your Supabase SQL Editor to create the table:

  create table if not exists divination_throws (
    ip         text    not null,
    throw_date date    not null default current_date,
    count      integer not null default 0,
    unlocked   boolean not null default false,
    created_at timestamptz default now(),
    primary key (ip, throw_date)
  );
`);
    return false;
  }

  ok("divination_throws exists and is accessible");
  return true;
}

// ── core tests ────────────────────────────────────────────────────────────

async function testInsertFirstThrow() {
  console.log("\n── Test: first throw ───────────────────────────────────");

  const { error } = await db.from("divination_throws").upsert(
    { ip: TEST_IP, throw_date: today(), count: 1, unlocked: false },
    { onConflict: "ip,throw_date" },
  );

  if (error) return fail("upsert first throw", error.message);
  ok("upserted first throw row");

  const { data, error: e2 } = await db
    .from("divination_throws")
    .select("count, unlocked")
    .eq("ip", TEST_IP)
    .eq("throw_date", today())
    .single();

  if (e2) return fail("read back row", e2.message);
  if (data.count !== 1) return fail("count should be 1", `got ${data.count}`);
  if (data.unlocked !== false) return fail("unlocked should be false");
  ok("count=1, unlocked=false verified");
}

async function testIncrementToLimit() {
  console.log("\n── Test: increment to limit ────────────────────────────");

  for (let i = 2; i <= DAILY_LIMIT; i++) {
    const { error } = await db.from("divination_throws").upsert(
      { ip: TEST_IP, throw_date: today(), count: i, unlocked: false },
      { onConflict: "ip,throw_date" },
    );
    if (error) return fail(`increment to ${i}`, error.message);
  }

  const { data } = await db
    .from("divination_throws")
    .select("count")
    .eq("ip", TEST_IP)
    .eq("throw_date", today())
    .single();

  if (data.count !== DAILY_LIMIT)
    return fail(`count should be ${DAILY_LIMIT}`, `got ${data.count}`);
  ok(`count reached limit of ${DAILY_LIMIT}`);
}

async function testRateLimitBlocks() {
  console.log("\n── Test: rate limit enforcement ────────────────────────");

  const { data } = await db
    .from("divination_throws")
    .select("count, unlocked")
    .eq("ip", TEST_IP)
    .eq("throw_date", today())
    .single();

  const blocked = data.count >= DAILY_LIMIT && !data.unlocked;
  if (!blocked) return fail("should be blocked after limit", `count=${data.count} unlocked=${data.unlocked}`);
  ok("correctly identified as blocked");
}

async function testUnlockSession() {
  console.log("\n── Test: unlock session ────────────────────────────────");

  const { error } = await db.from("divination_throws").upsert(
    { ip: TEST_IP, throw_date: today(), count: DAILY_LIMIT, unlocked: true },
    { onConflict: "ip,throw_date" },
  );
  if (error) return fail("unlock upsert", error.message);

  const { data } = await db
    .from("divination_throws")
    .select("unlocked")
    .eq("ip", TEST_IP)
    .eq("throw_date", today())
    .single();

  if (!data.unlocked) return fail("unlocked should be true");
  ok("unlocked=true persisted");
}

async function testPostUnlockAllowed() {
  console.log("\n── Test: throw allowed after unlock ────────────────────");

  const { data } = await db
    .from("divination_throws")
    .select("count, unlocked")
    .eq("ip", TEST_IP)
    .eq("throw_date", today())
    .single();

  const allowed = data.count < DAILY_LIMIT || data.unlocked;
  if (!allowed) return fail("should be allowed after unlock");
  ok("throw allowed post-unlock");
}

async function testNewDayReset() {
  console.log("\n── Test: new day starts fresh ──────────────────────────");

  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yDate = yesterday.toISOString().split("T")[0];

  await db.from("divination_throws").upsert(
    { ip: TEST_IP, throw_date: yDate, count: DAILY_LIMIT, unlocked: false },
    { onConflict: "ip,throw_date" },
  );

  const { data } = await db
    .from("divination_throws")
    .select("count, unlocked")
    .eq("ip", TEST_IP)
    .eq("throw_date", today())
    .single();

  // Today's row should be independent of yesterday's
  const todayOk = data !== null;
  if (!todayOk) return fail("today row should still exist");
  ok("yesterday row independent of today row");

  const { data: ydData } = await db
    .from("divination_throws")
    .select("count")
    .eq("ip", TEST_IP)
    .eq("throw_date", yDate)
    .single();

  if (ydData.count !== DAILY_LIMIT) return fail("yesterday count should be preserved");
  ok("yesterday row preserved with count=6");
}

async function testCleanup() {
  console.log("\n── Cleanup ─────────────────────────────────────────────");
  const { error } = await db.from("divination_throws").delete().eq("ip", TEST_IP);
  if (error) return fail("delete test rows", error?.message);
  ok("test rows deleted");
}

// ── run ───────────────────────────────────────────────────────────────────

console.log("divination_throws — integration tests");
console.log(`Supabase project: ilbmixmkmdshxdxsyege`);
console.log(`Test IP:          ${TEST_IP}`);

const tableOk = await checkTable();

if (tableOk) {
  await cleanup(); // start clean
  await testInsertFirstThrow();
  await testIncrementToLimit();
  await testRateLimitBlocks();
  await testUnlockSession();
  await testPostUnlockAllowed();
  await testNewDayReset();
  await testCleanup();
}

console.log(`\n── Results ─────────────────────────────────────────────`);
console.log(`  passed: ${passed}  failed: ${failed}`);
if (failed > 0) process.exit(1);
