"use client";

import { useState, useCallback, useEffect } from "react";
import Link from "next/link";
import { DiamondBand, StepBand, SpiralPair, SnailSpiral } from "./PajNtaubDecor";
import {
  ANATOMY,
  INTERPRETATIONS,
  CATEGORY_LABEL,
  SEVERITY_COLOR,
  type Outcome,
} from "@/app/lib/divination";
import { recordThrow, redeemCode, lookupCode, type GateConfig, type SessionStatus } from "@/app/divination/actions";
import DivinationGate from "./DivinationGate";

// ── Local types ───────────────────────────────────────────────────────────

type ThrowState = "idle" | "throwing" | "landed";
type HornFace   = "inside" | "outside" | "edge";

type ThrowResult = {
  outcome: Outcome;
  h1: HornFace;
  h2: HornFace;
};

type LandPos = { cx: number; cy: number; rot: number; z: number };

// ── Outcome generation ────────────────────────────────────────────────────

function randomOutcome(): ThrowResult {
  const r = Math.random();
  const coin = (): HornFace => (Math.random() < 0.5 ? "inside" : "outside");

  if (r < 0.22) return { outcome: "inside-inside",     h1: "inside",  h2: "inside"  };
  if (r < 0.44) return { outcome: "outside-outside",   h1: "outside", h2: "outside" };
  if (r < 0.60) return { outcome: "mixed",             h1: "inside",  h2: "outside" };
  if (r < 0.65) return { outcome: "zoo-siab",          h1: "inside",  h2: "outside" };
  if (r < 0.71) return { outcome: "soul-door-open",    h1: "inside",  h2: "outside" };
  if (r < 0.76) return { outcome: "crossed",           h1: "inside",  h2: "outside" };
  if (r < 0.81) return { outcome: "touching",          h1: "outside", h2: "outside" };
  if (r < 0.86) return { outcome: "one-standing",      h1: "edge",    h2: coin()    };
  if (r < 0.90) return { outcome: "both-standing",     h1: "edge",    h2: "edge"    };
  if (r < 0.94) return { outcome: "house-spirit",      h1: "outside", h2: "inside"  };
  if (r < 0.97) return { outcome: "ancestor-paternal", h1: "outside", h2: "outside" };
  return               { outcome: "ancestor-maternal", h1: "inside",  h2: "inside"  };
}

// ── Horn SVG ──────────────────────────────────────────────────────────────

// Wide base on left, both edges curve to a single tip on the right.
const HORN_PATH = "M 12,20 C 62,2 156,14 180,47 C 156,78 62,90 12,74 C 7,72 7,22 12,20 Z";

// Half-dimensions of the rendered SVG (170 × 84) — used for centering
const HW = 85;
const HH = 42;

function HornSVG({ face, uid }: { face: HornFace | null; uid: string }) {
  const insideId  = `gi-${uid}`;
  const outsideId = `go-${uid}`;
  const neutralId = `gn-${uid}`;
  const edgeId    = `ge-${uid}`;

  const isInside  = face === "inside";
  const isOutside = face === "outside";
  const isEdge    = face === "edge";
  const isNull    = face === null;

  const fillId = isNull ? neutralId : isInside ? insideId : isEdge ? edgeId : outsideId;

  return (
    <svg viewBox="0 0 194 96" width="170" height="84" aria-hidden="true">
      <defs>
        {/*
          Inside (concave face up): horn rests on curved underside — you look INTO the hollow.
          Rim/edges are highest and catch light; center is deepest and in shadow.
          Gradient runs dark center → bright rim.
        */}
        <radialGradient id={insideId} cx="42%" cy="44%" r="64%">
          <stop offset="0%"   stopColor="#1c0808" />
          <stop offset="32%"  stopColor="#562018" />
          <stop offset="65%"  stopColor="#a84838" />
          <stop offset="85%"  stopColor="#d07860" />
          <stop offset="100%" stopColor="#a05040" />
        </radialGradient>
        {/*
          Outside (convex face up): horn lies flat — you see the domed dark exterior.
          A slight light ridge runs along the top of the dome; edges fall into shadow.
        */}
        <radialGradient id={outsideId} cx="38%" cy="36%" r="65%">
          <stop offset="0%"   stopColor="#4e1c12" />
          <stop offset="30%"  stopColor="#2c0e08" />
          <stop offset="65%"  stopColor="#180808" />
          <stop offset="100%" stopColor="#0a0404" />
        </radialGradient>
        <linearGradient id={edgeId} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%"   stopColor="#3a1a10" />
          <stop offset="50%"  stopColor="#1a0c08" />
          <stop offset="100%" stopColor="#0e0604" />
        </linearGradient>
        <radialGradient id={neutralId} cx="38%" cy="48%" r="60%">
          <stop offset="0%"   stopColor="#606060" />
          <stop offset="100%" stopColor="#222" />
        </radialGradient>
      </defs>

      <path
        d={HORN_PATH}
        fill={`url(#${fillId})`}
        stroke={isInside ? "#5a2020" : isNull ? "#444" : "#180808"}
        strokeWidth={isInside ? "2" : "1.2"}
      />

      {/* Outside (convex dome) — ridge highlight runs along the curve's high point */}
      {isOutside && (
        <>
          <path d="M 24,36 C 74,16 154,24 176,47" fill="none" stroke="#8a3820" strokeWidth="2.2" opacity="0.45" />
          <path d="M 26,42 C 76,24 155,30 177,47" fill="none" stroke="#5a2010" strokeWidth="1"   opacity="0.3"  />
          <path d="M 20,64 C 66,50 153,50 175,51" fill="none" stroke="#2a0c08" strokeWidth="0.8" opacity="0.2"  />
        </>
      )}

      {/* Inside (concave) — bright rim catches light; dark hollow ellipse deepens the bowl */}
      {isInside && (
        <>
          {/* Hollow shadow — darkens the center to sell the depth */}
          <ellipse cx="96" cy="47" rx="66" ry="22" fill="#0e0606" opacity="0.4" />
          {/* Upper rim highlight */}
          <path d="M 14,22 C 64,4 156,16 180,47"  fill="none" stroke="#e8a888" strokeWidth="2"   opacity="0.5" />
          {/* Lower rim highlight */}
          <path d="M 14,72 C 64,88 156,76 180,47"  fill="none" stroke="#c07860" strokeWidth="1.4" opacity="0.35" />
        </>
      )}

      {isEdge && (
        <>
          <path d="M 14,35 C 70,22 152,26 178,47" fill="none" stroke="#5a2010" strokeWidth="1.2" opacity="0.5" />
          <path d="M 14,58 C 70,70 152,68 178,47" fill="none" stroke="#5a2010" strokeWidth="1.2" opacity="0.5" />
        </>
      )}

      {isNull && (
        <text x="86" y="54" textAnchor="middle" fill="#666" fontSize="22" fontFamily="serif">?</text>
      )}
    </svg>
  );
}

// ── Land position by outcome ──────────────────────────────────────────────

function computeLandPos(outcome: Outcome): { h1: LandPos; h2: LandPos } {
  const CX = 170;
  const CY = 100;
  const jitter = (n: number) => n + Math.round(Math.random() * 10 - 5);
  const rnd = (z: number): LandPos => ({
    cx:  HW + 10 + Math.round(Math.random() * 150),
    cy:  HH + 10 + Math.round(Math.random() * 100),
    rot: Math.round(Math.random() * 110 - 55),
    z,
  });
  const topZ = Math.random() < 0.5 ? 2 : 1;

  switch (outcome) {
    case "crossed":
      return {
        h1: { cx: jitter(CX - 18), cy: jitter(CY - 8),  rot: jitter(-44), z: 2 },
        h2: { cx: jitter(CX + 18), cy: jitter(CY + 8),  rot: jitter( 44), z: 1 },
      };
    case "touching":
      return {
        h1: { cx: jitter(CX - 78), cy: jitter(CY),      rot: jitter(-5),  z: 1 },
        h2: { cx: jitter(CX + 78), cy: jitter(CY + 4),  rot: jitter(175), z: 2 },
      };
    case "one-standing":
      return {
        h1: { cx: jitter(CX - 45), cy: jitter(CY - 8),  rot: jitter(86),  z: 2 },
        h2: { cx: jitter(CX + 52), cy: jitter(CY + 14), rot: Math.round(Math.random() * 60 - 30), z: 1 },
      };
    case "both-standing":
      return {
        h1: { cx: jitter(CX - 48), cy: jitter(CY - 6),  rot: jitter( 83), z: topZ     },
        h2: { cx: jitter(CX + 42), cy: jitter(CY + 8),  rot: jitter(-80), z: 3 - topZ },
      };
    case "ancestor-paternal":
      return {
        h1: { cx: jitter(CX - 62), cy: jitter(CY - 12), rot: jitter( 28), z: topZ     },
        h2: { cx: jitter(CX + 52), cy: jitter(CY - 12), rot: jitter(-28), z: 3 - topZ },
      };
    case "soul-door-open":
      return {
        h1: { cx: jitter(CX - 82), cy: jitter(CY - 8),  rot: jitter(170), z: 1 },
        h2: { cx: jitter(CX + 72), cy: jitter(CY + 8),  rot: jitter( -5), z: 2 },
      };
    default:
      return { h1: rnd(topZ), h2: rnd(3 - topZ) };
  }
}

// ── Anatomy primer (right panel idle state) ───────────────────────────────

function AnatomyPrimer() {
  return (
    <div className="flex flex-col gap-5 w-full">
      <p className="text-[10px] uppercase tracking-widest opacity-35">Horn Anatomy</p>

      <div className="grid grid-cols-2 gap-3">
        {ANATOMY.map((a) => (
          <div key={a.hmong} className="flex flex-col gap-0.5 border border-current/10 p-3">
            <p className="text-xs font-bold text-[var(--zcm-quote)] opacity-80">{a.hmong}</p>
            <p className="text-[11px] opacity-50 leading-snug">{a.english}</p>
          </div>
        ))}
      </div>

      <p className="text-[11px] opacity-30 leading-relaxed">
        Throw the horns to receive the spirits&rsquo; reading.
      </p>

      <Link
        href="/divination/dictionary"
        className="text-[10px] uppercase tracking-widest opacity-25 hover:opacity-55 transition-opacity self-start"
      >
        Condition Dictionary →
      </Link>
    </div>
  );
}

// ── Component ─────────────────────────────────────────────────────────────

const SESSION_KEY = "divination-session";

export default function DivinationHorns({
  gateConfig,
  sessionStatus: initialStatus,
  forceGate = false,
}: {
  gateConfig:    GateConfig;
  sessionStatus: SessionStatus;
  forceGate?:    boolean;
}) {
  const [throwState,       setThrowState]       = useState<ThrowState>(() => {
    if (typeof window === "undefined") return "idle";
    try {
      const raw = sessionStorage.getItem(SESSION_KEY);
      if (raw) {
        const saved = JSON.parse(raw) as { history: ThrowResult[]; current: ThrowResult | null };
        if (Array.isArray(saved.history) && saved.history.length > 0 && saved.current) return "landed";
      }
    } catch {}
    return "idle";
  });
  const [current,          setCurrent]          = useState<ThrowResult | null>(() => {
    if (typeof window === "undefined") return null;
    try {
      const raw = sessionStorage.getItem(SESSION_KEY);
      if (raw) {
        const saved = JSON.parse(raw) as { history: ThrowResult[]; current: ThrowResult | null };
        return saved.current ?? null;
      }
    } catch {}
    return null;
  });
  const [history,          setHistory]          = useState<ThrowResult[]>(() => {
    if (typeof window === "undefined") return [];
    try {
      const raw = sessionStorage.getItem(SESSION_KEY);
      if (raw) {
        const saved = JSON.parse(raw) as { history: ThrowResult[]; current: ThrowResult | null };
        if (Array.isArray(saved.history)) return saved.history;
      }
    } catch {}
    return [];
  });
  const [throwCount,       setThrowCount]       = useState(() => {
    if (typeof window === "undefined") return 0;
    try {
      const raw = sessionStorage.getItem(SESSION_KEY);
      if (raw) {
        const saved = JSON.parse(raw) as { history: ThrowResult[] };
        if (Array.isArray(saved.history)) return saved.history.length;
      }
    } catch {}
    return 0;
  });
  const [showGate,         setShowGate]         = useState(forceGate);
  const sessionStatus                           = initialStatus;
  const [serverThrowCount, setServerThrowCount] = useState(initialStatus.throwsToday);

  // Corner code entry
  const [codeOpen,     setCodeOpen]     = useState(false);
  const [codeInput,    setCodeInput]    = useState("");
  const [codeApplying, setCodeApplying] = useState(false);
  const [codeChecking, setCodeChecking] = useState(false);
  const [codeMsg,      setCodeMsg]      = useState<{ ok: boolean; text: string } | null>(null);

  async function checkCornerCode() {
    if (!codeInput.trim() || codeChecking) return;
    setCodeChecking(true);
    setCodeMsg(null);
    const result = await lookupCode(codeInput);
    setCodeChecking(false);
    if (!result.found) {
      setCodeMsg({ ok: false, text: "Code not found." });
      return;
    }
    if (result.expired) {
      setCodeMsg({ ok: false, text: "Expired." });
      return;
    }
    if (!result.active) {
      setCodeMsg({ ok: false, text: "Inactive." });
      return;
    }
    if (result.spent) {
      setCodeMsg({ ok: false, text: `Spent — ${result.useCount}/${result.maxUses} uses.` });
      return;
    }
    const uses  = result.maxUses !== null ? `${result.useCount}/${result.maxUses} uses` : "unlimited uses";
    const grant = result.tokenType === "throws"
      ? `+${result.grantThrows} throws`
      : `${result.grantDays}-day access`;
    const exp   = result.expiresAt
      ? `expires ${new Date(result.expiresAt).toLocaleDateString()}`
      : "no expiry";
    setCodeMsg({ ok: true, text: `Active · ${grant} · ${uses} · ${exp}` });
  }

  async function applyCornerCode() {
    if (!codeInput.trim() || codeApplying) return;
    setCodeApplying(true);
    setCodeMsg(null);
    const { success, message } = await redeemCode(codeInput);
    setCodeMsg({ ok: success, text: message });
    setCodeApplying(false);
    if (success) {
      sessionStorage.removeItem(SESSION_KEY);
      window.location.reload();
      return;
    }
  }

  // Persist after every throw
  useEffect(() => {
    if (history.length === 0) return;
    try {
      sessionStorage.setItem(SESSION_KEY, JSON.stringify({ history, current }));
    } catch {}
  }, [history, current]);

  const [landPos,    setLandPos]    = useState<{ h1: LandPos; h2: LandPos }>({
    h1: { cx: 105, cy:  95, rot: -13, z: 1 },
    h2: { cx: 225, cy: 165, rot:   9, z: 2 },
  });

  const throwHorns = useCallback(async () => {
    if (throwState === "throwing") return;

    const { allowed, count } = await recordThrow();
    if (!allowed) {
      setShowGate(true);
      return;
    }
    setServerThrowCount(count);

    const result = randomOutcome();
    setThrowCount((c) => c + 1);
    setThrowState("throwing");
    setTimeout(() => {
      setCurrent(result);
      setHistory((prev) => [...prev, result]);
      setLandPos(computeLandPos(result.outcome));
      setThrowState("landed");
    }, 1200);
  }, [throwState]);

  const interp = current ? INTERPRETATIONS[current.outcome] : null;

  const total    = history.length;
  const positive = history.filter((r) => INTERPRETATIONS[r.outcome].severity === "positive").length;
  const serious  = history.filter((r) => INTERPRETATIONS[r.outcome].severity === "serious").length;
  const caution  = history.filter((r) => INTERPRETATIONS[r.outcome].severity === "caution").length;
  const neutral  = total - positive - serious - caution;

  const h1Face = throwState === "throwing" ? null : (current?.h1 ?? null);
  const h2Face = throwState === "throwing" ? null : (current?.h2 ?? null);

  const faceLabel = (f: HornFace | null) =>
    f === "inside" ? "Inside" : f === "outside" ? "Outside" : f === "edge" ? "Standing" : "";

  return (
    <>
    <div className="flex flex-col items-center gap-6 max-w-3xl mx-auto w-full">

      {/* Header */}
      <div className="flex flex-col items-center gap-3 text-center">
        <SpiralPair size={40} opacity={0.7} />
        <h1 className="text-3xl font-bold tracking-tight">Divination</h1>
        <p className="text-sm opacity-55 leading-relaxed max-w-xs">
          A Hmong ritual using a split pair of buffalo horns. Throw to receive
          the spirits&rsquo; answer.
        </p>
      </div>

      <DiamondBand opacity={0.45} className="w-full" />

      {/* Main 2-column layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-0 w-full items-start">

        {/* Left — throw stage */}
        <div className="flex flex-col items-center gap-5 py-4 md:pr-8">
          <div className="relative w-[340px] h-[210px] mx-auto overflow-visible">
            {(["h1", "h2"] as const).map((id) => {
              const pos  = landPos[id];
              const face = id === "h1" ? h1Face : h2Face;
              return (
                <div
                  key={id}
                  style={{
                    position: "absolute",
                    left: 0,
                    top: 0,
                    transform: `translate(${pos.cx - HW}px, ${pos.cy - HH}px) rotate(${pos.rot}deg)`,
                    transition: "transform 0.4s cubic-bezier(0.22,1,0.36,1)",
                    zIndex: pos.z,
                  }}
                >
                  <div
                    key={`${id}-${throwCount}`}
                    className={throwState === "throwing" ? "horn-spinning" : ""}
                    style={id === "h2" ? { animationDelay: "80ms" } : undefined}
                  >
                    <HornSVG face={face} uid={id} />
                  </div>
                  <div className="text-center mt-1">
                    <span className="text-[10px] uppercase tracking-widest opacity-70">
                      {faceLabel(face)}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          <button
            onClick={throwHorns}
            disabled={throwState === "throwing"}
            className="border border-current px-10 py-3 text-sm font-semibold tracking-widest uppercase transition-opacity duration-200 hover:opacity-60 disabled:opacity-25 disabled:cursor-not-allowed"
          >
            {throwState === "throwing" ? "Throwing…" : throwState === "idle" ? "Throw" : "Throw Again"}
          </button>
        </div>

        {/* Right — result / primer */}
        <div className="flex flex-col justify-start min-h-[260px] py-4 border-t border-current/10 md:border-t-0 md:border-l md:pl-8">
          {throwState === "idle" && <AnatomyPrimer />}

          {throwState === "throwing" && (
            <div className="flex flex-col items-center justify-center h-full gap-3 opacity-30">
              <SnailSpiral size={36} opacity={0.6} />
              <p className="text-xs uppercase tracking-widest">Reading…</p>
            </div>
          )}

          {throwState === "landed" && interp && (
            <div className="flex flex-col gap-3">
              {/* Category + severity row */}
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[10px] uppercase tracking-widest opacity-50 border border-current/25 px-2 py-0.5">
                  {CATEGORY_LABEL[interp.category]}
                </span>
                <span className="text-[10px] uppercase tracking-widest opacity-35">
                  {interp.severity}
                </span>
              </div>

              {/* Hmong term + label */}
              <div className="flex items-start gap-2">
                <SnailSpiral size={20} opacity={0.5} />
                <p className={`text-xl font-bold leading-snug ${SEVERITY_COLOR[interp.severity]}`}>
                  {interp.hmong}
                </p>
              </div>
              <p className="text-base font-semibold opacity-80 -mt-1">{interp.label}</p>

              {/* Meaning */}
              <p className="text-sm opacity-65 leading-relaxed">{interp.meaning}</p>

              {/* Offering */}
              {interp.offering && (
                <p className="text-xs text-amber-400/75">
                  Offering: {interp.offering}
                </p>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Full-width separator — fixed position, always aligned */}
      <StepBand opacity={0.35} className="w-full" />

      {/* Stats scoreboard — always present to prevent layout shift */}
      <div className="w-full grid grid-cols-4 gap-px border border-current/10">

        {/* ── Session status row ── */}
        {(() => {
          const liveLeft =
            sessionStatus.throwsLeft === null
              ? null
              : Math.max(0, (sessionStatus.throwsLimit ?? 0) - serverThrowCount);

          const { lastCode, lastCodeType, accessDaysLeft, bonusThrowsToday } = sessionStatus;
          const modeLabel = sessionStatus.mode === "bypass"
            ? "Admin"
            : [
                lastCode ?? (sessionStatus.mode === "free" ? "Free" : null),
                lastCodeType === "throws" && bonusThrowsToday > 0
                  ? `+${bonusThrowsToday} throws`
                  : null,
                sessionStatus.mode === "access" && lastCodeType === "throws" && accessDaysLeft != null
                  ? `access ${accessDaysLeft}d left`
                  : sessionStatus.mode === "access" && lastCodeType === "access" && accessDaysLeft != null
                  ? `${accessDaysLeft} day${accessDaysLeft !== 1 ? "s" : ""} left`
                  : null,
              ].filter(Boolean).join(" · ");

          const throwsLimit = sessionStatus.throwsLimit ?? 0;
          const throwsLabel =
            liveLeft === null
              ? "Unlimited"
              : sessionStatus.bonusThrowsToday > 0 && sessionStatus.mode !== "access"
              ? `${liveLeft} of ${throwsLimit} left today`
              : `${liveLeft} throw${liveLeft !== 1 ? "s" : ""} left today`;

          return (
            <div className="col-span-4 flex justify-between items-center px-4 py-2.5 border-b border-current/10 bg-current/[0.015]">
              <span className="text-[10px] uppercase tracking-widest opacity-40 font-mono">
                {modeLabel}
              </span>
              <span className="text-[10px] uppercase tracking-widest opacity-30">
                {throwsLabel}
              </span>
            </div>
          );
        })()}

        {[
          { count: positive, label: "Positive", color: "text-emerald-400"        },
          { count: caution,  label: "Caution",  color: "text-amber-400"          },
          { count: serious,  label: "Serious",  color: "text-rose-500"           },
          { count: neutral,  label: "Neutral",  color: "text-zinc-400"           },
        ].map(({ count, label, color }) => (
          <div key={label} className="flex flex-col items-center gap-1 py-4 bg-current/[0.02]">
            <span className={`text-3xl font-bold tabular-nums ${color}`}>{count}</span>
            <span className="text-[10px] uppercase tracking-widest opacity-40">{label}</span>
          </div>
        ))}
        <div className="col-span-4 flex justify-between items-center px-4 py-2 border-t border-current/10">
          <span className="text-[10px] uppercase tracking-widest opacity-25">{total} throws</span>
          <Link
            href="/divination/dictionary"
            className="text-[10px] uppercase tracking-widest opacity-25 hover:opacity-55 transition-opacity"
          >
            Condition Dictionary →
          </Link>
        </div>
      </div>
    </div>

    {/* ── Corner code entry ─────────────────────────────────────────────── */}
    <div className="fixed top-4 right-4 z-40 flex flex-col items-end gap-2">
      <button
        onClick={() => { setCodeOpen((v) => !v); setCodeMsg(null); }}
        className="text-[10px] uppercase tracking-widest opacity-50 hover:opacity-80 transition-opacity border border-current/40 px-3 py-1.5 bg-[var(--background)]"
      >
        {codeOpen ? "✕" : "↵ Code"}
      </button>

      {codeOpen && (
        <div className="flex flex-col gap-2 border border-current/20 bg-[var(--background)] p-3 w-64 max-w-[calc(100vw-32px)] shadow-lg">
          <div className="flex gap-2">
            <input
              type="text"
              value={codeInput}
              onChange={(e) => { setCodeInput(e.target.value.toUpperCase()); setCodeMsg(null); }}
              onKeyDown={(e) => e.key === "Enter" && applyCornerCode()}
              placeholder="ZCM-XXXXXX"
              spellCheck={false}
              autoFocus
              className="flex-1 min-w-0 bg-transparent border border-current/25 px-2 py-1.5 text-xs font-mono uppercase tracking-widest placeholder:opacity-25 focus:outline-none focus:border-[var(--zcm-quote)]/50"
            />
            <button
              onClick={checkCornerCode}
              disabled={!codeInput.trim() || codeChecking || codeApplying}
              className="border border-current/20 px-2 py-1.5 text-[10px] uppercase tracking-widest opacity-60 hover:opacity-90 transition-opacity disabled:opacity-20 shrink-0"
            >
              {codeChecking ? "…" : "?"}
            </button>
            <button
              onClick={applyCornerCode}
              disabled={!codeInput.trim() || codeApplying || codeChecking}
              className="border border-current/30 px-3 py-1.5 text-[10px] uppercase tracking-widest hover:opacity-70 transition-opacity disabled:opacity-25 shrink-0"
            >
              {codeApplying ? "…" : "Apply"}
            </button>
          </div>
          {codeMsg && (
            <p className={`text-[10px] leading-snug ${codeMsg.ok ? "text-emerald-400" : "text-rose-400"}`}>
              {codeMsg.text}
            </p>
          )}
        </div>
      )}
    </div>

    {showGate && (
      <DivinationGate
        onUnlock={() => window.location.reload()}
        onClose={() => forceGate ? window.history.back() : setShowGate(false)}
        config={gateConfig}
      />
    )}
    </>
  );
}
