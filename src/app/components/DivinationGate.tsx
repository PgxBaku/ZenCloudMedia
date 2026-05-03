"use client";

import { useState, useEffect } from "react";
import { SpiralPair, DiamondBand, StepBand, SnailSpiral } from "./PajNtaubDecor";
import { generateActionToken, getVideoForCategory, redeemCode } from "@/app/divination/actions";
import type { GateConfig } from "@/app/divination/actions";

const PAYPAL_URL = "https://www.paypal.com/ncp/payment/HN4UFYVXJ2ZVU";

function PayPalLogo({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 80 20" width="72" height="18" aria-label="PayPal" className={className}>
      {/* "Pay" in light blue */}
      <text x="0" y="15" fontFamily="Arial, Helvetica, sans-serif" fontWeight="800"
            fontStyle="italic" fontSize="17" fill="#009cde">Pay</text>
      {/* "Pal" in dark navy */}
      <text x="30" y="15" fontFamily="Arial, Helvetica, sans-serif" fontWeight="800"
            fontStyle="italic" fontSize="17" fill="#003087">Pal</text>
    </svg>
  );
}

const VIDEO_CATEGORIES = [
  { label: "Science", keyword: "Science" },
  { label: "Trump",   keyword: "Trump"   },
  { label: "World",   keyword: "World"   },
  { label: "AI",      keyword: "AI"      },
  { label: "Space",   keyword: "Space"   },
];

type ActionState = "idle" | "loading" | "code-ready";

export default function DivinationGate({
  onUnlock,
  config,
}: {
  onUnlock: () => void;
  config:   GateConfig;
}) {
  const [videoExpanded, setVideoExpanded] = useState(false);
  const [actionState,   setActionState]   = useState<ActionState>("idle");
  const [codeValue,     setCodeValue]     = useState("");
  const [codeMessage,   setCodeMessage]   = useState("");
  const [codeError,     setCodeError]     = useState("");
  const [applyingCode,  setApplyingCode]  = useState(false);
  const [loadingCat,    setLoadingCat]    = useState<string | null>(null);
  const [donateEmail, setDonateEmail] = useState(() =>
    typeof window !== "undefined" ? sessionStorage.getItem("zcm-gate-email") ?? "" : ""
  );

  useEffect(() => {
    if (donateEmail) sessionStorage.setItem("zcm-gate-email", donateEmail);
  }, [donateEmail]);

  const busy = actionState === "loading" || applyingCode;

  // ── Action handlers ───────────────────────────────────────────────────

  async function handleDonate() {
    setActionState("loading");
    const email = donateEmail.trim() || undefined;
    const code  = await generateActionToken("donate", email);
    window.open(PAYPAL_URL, "_blank");
    setCodeValue(code);
    setCodeMessage(
      email
        ? `Thank you! Your code is below and has been sent to ${email} (check Promotions if using Gmail). It grants ${config.donateAccessDays} days of access.`
        : `Thank you! Your code is ready below — it grants ${config.donateAccessDays} days of access.`,
    );
    setCodeError("");
    setActionState("code-ready");
  }

  async function handleVideo(keyword: string) {
    setLoadingCat(keyword);
    const email = donateEmail.trim() || undefined;
    const [url, code] = await Promise.all([
      getVideoForCategory(keyword),
      generateActionToken("video", email),
    ]);
    window.open(url, "_blank");
    setCodeValue(code);
    setCodeMessage(
      email
        ? `Enjoy the video! Your code (+${config.videoBonusThrows} throws) has been sent to ${email} (check Promotions if using Gmail) — enter it below.`
        : `Enjoy the video! Your code adds +${config.videoBonusThrows} throws — enter it below.`,
    );
    setCodeError("");
    setLoadingCat(null);
    setActionState("code-ready");
    setVideoExpanded(false);
  }

  // ── Code redemption ───────────────────────────────────────────────────

  async function handleApply() {
    if (!codeValue.trim()) return;
    setApplyingCode(true);
    setCodeError("");
    const { success, message } = await redeemCode(codeValue);
    if (success) {
      setCodeMessage(message);
      setTimeout(onUnlock, 800);
    } else {
      setCodeError(message);
      setApplyingCode(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-sm px-4 py-8 overflow-y-auto">
      <div className="max-w-sm w-full flex flex-col gap-5 border border-current/20 bg-[var(--background)] p-8 my-auto">

        {/* Header */}
        <div className="flex flex-col items-center gap-3 text-center">
          <SpiralPair size={36} opacity={0.65} />
          <h2 className="text-xl font-bold tracking-tight">The spirits are at rest</h2>
          <p className="text-sm opacity-55 leading-relaxed">
            You&rsquo;ve reached today&rsquo;s limit. Support the channel to
            receive an access code, then enter it below to continue.
          </p>
        </div>

        <DiamondBand opacity={0.35} className="w-full" />

        {/* ── Email capture ─────────────────────────────────────────── */}
        <div className="flex flex-col gap-2 border border-[var(--zcm-quote)]/30 bg-[var(--zcm-quote)]/5 px-5 py-4">
          <p className="text-[10px] uppercase tracking-widest opacity-50">Get your code by email</p>
          <p className="text-xs opacity-60 leading-relaxed">
            Enter your email and we&rsquo;ll send your access code instantly —
            so you never lose it.
          </p>
          <div className="flex items-center gap-2 border border-current/20 bg-[var(--background)] px-3 py-2 mt-1">
            <svg viewBox="0 0 20 16" width="16" height="12" aria-hidden="true" className="shrink-0 opacity-35">
              <rect x="0" y="0" width="20" height="16" rx="2" fill="none" stroke="currentColor" strokeWidth="1.5"/>
              <polyline points="0,0 10,9 20,0" fill="none" stroke="currentColor" strokeWidth="1.5"/>
            </svg>
            <input
              type="email"
              value={donateEmail}
              onChange={(e) => setDonateEmail(e.target.value)}
              placeholder="your@email.com"
              disabled={busy}
              className="flex-1 bg-transparent text-sm placeholder:opacity-30 focus:outline-none disabled:opacity-40"
            />
          </div>
        </div>

        {/* ── Donate ────────────────────────────────────────────────── */}
        <div className="flex flex-col border border-[#009cde]/40">
          <div className="border-t border-[#009cde]/20" />

          {/* Donate button */}
          <button
            onClick={handleDonate}
            disabled={busy}
            className="w-full flex items-center gap-4 px-5 py-4 hover:bg-[#009cde]/5 transition-colors text-left disabled:opacity-40"
          >
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                {actionState === "loading" && codeValue === ""
                  ? <p className="text-sm font-bold opacity-60">Generating…</p>
                  : <><p className="text-sm font-bold">Donate with</p><PayPalLogo /></>
                }
              </div>
              <p className="text-xs opacity-50 mt-0.5">
                {config.donateAccessDays}-day full access · secure checkout
              </p>
            </div>
          </button>
        </div>

        {/* ── Watch a Video ─────────────────────────────────────────── */}
        <div className="border border-current/15 px-5 py-4 flex flex-col gap-3">
          <button
            onClick={() => setVideoExpanded((v) => !v)}
            disabled={busy}
            className="flex items-center gap-4 hover:opacity-70 transition-opacity text-left w-full disabled:opacity-40"
          >
            <SnailSpiral size={20} opacity={0.65} />
            <div className="flex-1">
              <p className="text-sm font-bold">Watch a Video</p>
              <p className="text-xs opacity-50">
                Receive a code for +{config.videoBonusThrows} throws today
              </p>
            </div>
            <span className="text-[10px] opacity-35">{videoExpanded ? "▲" : "▼"}</span>
          </button>

          {videoExpanded && (
            <div className="flex flex-wrap gap-2 pt-1 border-t border-current/10">
              {VIDEO_CATEGORIES.map(({ label, keyword }) => (
                <button
                  key={keyword}
                  onClick={() => handleVideo(keyword)}
                  disabled={busy || loadingCat !== null}
                  className="text-[11px] uppercase tracking-widest border border-current/25 px-3 py-1.5 hover:border-[var(--zcm-quote)]/60 hover:text-[var(--zcm-quote)] transition-colors disabled:opacity-30 min-w-[60px] text-center"
                >
                  {loadingCat === keyword ? "…" : label}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* ── T-shirt (coming soon) ─────────────────────────────────── */}
        <div className="relative border border-current/10 px-5 py-4 opacity-35 select-none">
          <div className="flex items-center gap-4">
            <SnailSpiral size={20} opacity={0.5} />
            <div>
              <p className="text-sm font-bold">Buy a T-Shirt</p>
              <p className="text-xs opacity-50">
                Receive a code for {config.shirtAccessDays}-day full access
              </p>
            </div>
          </div>
          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[9px] uppercase tracking-widest border border-current/25 px-2 py-0.5">
            Coming Soon
          </span>
        </div>

        <StepBand opacity={0.2} className="w-full" />

        {/* ── Code entry ────────────────────────────────────────────── */}
        <div className="flex flex-col gap-3">
          <p className="text-[10px] uppercase tracking-widest opacity-40">
            Enter your code
          </p>

          {codeMessage && (
            <p className="text-xs text-[var(--zcm-quote)] opacity-80 leading-snug">
              {codeMessage}
            </p>
          )}
          {codeError && (
            <p className="text-xs text-rose-400 leading-snug">{codeError}</p>
          )}

          <div className="flex gap-2">
            <input
              type="text"
              value={codeValue}
              onChange={(e) => {
                setCodeValue(e.target.value.toUpperCase());
                setCodeError("");
              }}
              onKeyDown={(e) => e.key === "Enter" && handleApply()}
              placeholder="ZCM-XXXXXX"
              spellCheck={false}
              className="flex-1 bg-transparent border border-current/25 px-3 py-2 text-sm font-mono uppercase tracking-widest placeholder:opacity-25 focus:outline-none focus:border-[var(--zcm-quote)]/50"
            />
            <button
              onClick={handleApply}
              disabled={!codeValue.trim() || applyingCode}
              className="border border-current/30 px-4 py-2 text-xs uppercase tracking-widest hover:opacity-70 transition-opacity disabled:opacity-25"
            >
              {applyingCode ? "…" : "Apply"}
            </button>
          </div>
        </div>

        <StepBand opacity={0.15} className="w-full" />

        <p className="text-center text-[10px] uppercase tracking-widest opacity-25">
          Or return tomorrow for {config.dailyLimit} free throws
        </p>
      </div>
    </div>
  );
}
