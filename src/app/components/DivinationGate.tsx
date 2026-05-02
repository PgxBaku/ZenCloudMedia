"use client";

import { useState } from "react";
import { SpiralPair, DiamondBand, StepBand, SnailSpiral } from "./PajNtaubDecor";
import { unlockSession, getVideoForCategory } from "@/app/divination/actions";

// ── Update this to your actual PayPal.me link ─────────────────────────────
const PAYPAL_URL = "https://paypal.me/ZenCloudMedia";

const VIDEO_CATEGORIES = [
  { label: "Science", keyword: "Science" },
  { label: "Trump",   keyword: "Trump"   },
  { label: "World",   keyword: "World"   },
  { label: "AI",      keyword: "AI"      },
  { label: "Space",   keyword: "Space"   },
];

export default function DivinationGate({ onUnlock }: { onUnlock: () => void }) {
  const [videoExpanded, setVideoExpanded]     = useState(false);
  const [loadingKeyword, setLoadingKeyword]   = useState<string | null>(null);
  const [donating, setDonating]               = useState(false);

  async function handleDonate() {
    setDonating(true);
    window.open(PAYPAL_URL, "_blank");
    await unlockSession();
    onUnlock();
  }

  async function handleVideo(keyword: string) {
    setLoadingKeyword(keyword);
    const url = await getVideoForCategory(keyword);
    window.open(url, "_blank");
    await unlockSession();
    setLoadingKeyword(null);
    onUnlock();
  }

  const busy = donating || loadingKeyword !== null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-sm px-4">
      <div className="max-w-sm w-full flex flex-col gap-5 border border-current/20 bg-[var(--background)] p-8">

        {/* Header */}
        <div className="flex flex-col items-center gap-3 text-center">
          <SpiralPair size={36} opacity={0.65} />
          <h2 className="text-xl font-bold tracking-tight">The spirits are at rest</h2>
          <p className="text-sm opacity-55 leading-relaxed">
            You have reached today&rsquo;s limit. Support the channel to continue
            your reading, or return tomorrow.
          </p>
        </div>

        <DiamondBand opacity={0.35} className="w-full" />

        {/* ── Donate ─────────────────────────────────────────────────── */}
        <button
          onClick={handleDonate}
          disabled={busy}
          className="w-full flex items-center gap-4 border border-[var(--zcm-quote)]/40 px-5 py-4 hover:bg-[var(--zcm-quote)]/5 transition-colors text-left disabled:opacity-40"
        >
          <SnailSpiral size={20} opacity={0.75} />
          <div className="flex-1">
            <p className="text-sm font-bold text-[var(--zcm-quote)]">
              {donating ? "Opening PayPal…" : "Donate via PayPal"}
            </p>
            <p className="text-xs opacity-50">Any amount keeps the spirits talking</p>
          </div>
        </button>

        {/* ── Watch a Video ───────────────────────────────────────────── */}
        <div className="border border-current/15 px-5 py-4 flex flex-col gap-3">
          <button
            onClick={() => setVideoExpanded((v) => !v)}
            disabled={busy}
            className="flex items-center gap-4 hover:opacity-70 transition-opacity text-left w-full disabled:opacity-40"
          >
            <SnailSpiral size={20} opacity={0.65} />
            <div className="flex-1">
              <p className="text-sm font-bold">Watch a Video</p>
              <p className="text-xs opacity-50">Choose a topic — watch a short reel</p>
            </div>
            <span className="text-[10px] opacity-35">{videoExpanded ? "▲" : "▼"}</span>
          </button>

          {videoExpanded && (
            <div className="flex flex-wrap gap-2 pt-1 border-t border-current/10">
              {VIDEO_CATEGORIES.map(({ label, keyword }) => (
                <button
                  key={keyword}
                  onClick={() => handleVideo(keyword)}
                  disabled={busy}
                  className="text-[11px] uppercase tracking-widest border border-current/25 px-3 py-1.5 hover:border-[var(--zcm-quote)]/60 hover:text-[var(--zcm-quote)] transition-colors disabled:opacity-30 min-w-[60px] text-center"
                >
                  {loadingKeyword === keyword ? "…" : label}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* ── T-Shirt placeholder ─────────────────────────────────────── */}
        <div className="relative border border-current/10 px-5 py-4 opacity-35 select-none">
          <div className="flex items-center gap-4">
            <SnailSpiral size={20} opacity={0.5} />
            <div>
              <p className="text-sm font-bold">ZenCloudMedia T-Shirt</p>
              <p className="text-xs opacity-50">Wear your support</p>
            </div>
          </div>
          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[9px] uppercase tracking-widest border border-current/25 px-2 py-0.5">
            Coming Soon
          </span>
        </div>

        <StepBand opacity={0.2} className="w-full" />

        {/* ── Come back tomorrow ──────────────────────────────────────── */}
        <p className="text-center text-[10px] uppercase tracking-widest opacity-25">
          Or return tomorrow for 6 more free throws
        </p>

      </div>
    </div>
  );
}
