import type { Metadata } from "next";
import Link from "next/link";
import {
  ANATOMY,
  INTERPRETATIONS,
  BY_CATEGORY,
  CATEGORY_LABEL,
  SEVERITY_COLOR,
  SEVERITY_BORDER,
  type Outcome,
  type Category,
} from "@/app/lib/divination";
import { DiamondBand, StepBand, SpiralPair, SnailSpiral } from "@/app/components/PajNtaubDecor";

export const metadata: Metadata = {
  title: "Divination Dictionary — ZenCloudMedia",
  description: "Glossary of Hmong buffalo horn divination conditions (Khov Kuam Saib).",
};

const CATEGORY_ORDER: Category[] = ["answer", "diagnosis", "spirit"];

function ConditionCard({ outcome }: { outcome: Outcome }) {
  const d = INTERPRETATIONS[outcome];
  return (
    <div className={`border ${SEVERITY_BORDER[d.severity]} p-4 flex flex-col gap-2 h-full`}>
      <div className="flex items-start justify-between gap-2">
        <div className="flex flex-col gap-0.5 min-w-0">
          <p className={`text-sm font-bold leading-tight ${SEVERITY_COLOR[d.severity]}`}>
            {d.hmong}
          </p>
          <p className="text-xs font-semibold opacity-75 leading-snug">{d.label}</p>
        </div>
        <span className="text-[9px] uppercase tracking-wider opacity-35 border border-current/20 px-1.5 py-0.5 shrink-0">
          {d.severity}
        </span>
      </div>

      <p className="text-xs opacity-60 leading-relaxed">{d.meaning}</p>

      <div className="flex flex-col gap-1 mt-auto pt-2 border-t border-current/10">
        <p className="text-[10px] opacity-40 leading-snug">
          <span className="uppercase tracking-wider opacity-70">Position — </span>
          {d.position}
        </p>
        {d.offering && (
          <p className="text-[10px] text-amber-400/65">
            <span className="uppercase tracking-wider">Offering — </span>
            {d.offering}
          </p>
        )}
      </div>
    </div>
  );
}

export default function DivinationDictionaryPage() {
  return (
    <main className="min-h-screen px-6 py-16 max-w-4xl mx-auto">

      {/* Header row — title left, nav right */}
      <div className="flex items-start justify-between gap-6 mb-2 flex-wrap">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-3">
            <SpiralPair size={36} opacity={0.6} />
            <h1 className="text-3xl font-bold tracking-tight">Dictionary</h1>
          </div>
          <p className="text-sm opacity-50 leading-relaxed max-w-sm">
            Khov Kuam Saib — Hmong buffalo horn divination. All conditions,
            diagnoses, and spirit identifications.
          </p>
        </div>
        <Link
          href="/divination"
          className="text-[10px] uppercase tracking-widest opacity-35 hover:opacity-70 transition-opacity shrink-0 mt-1"
        >
          ← Back to Throw
        </Link>
      </div>

      <DiamondBand opacity={0.4} className="w-full my-8" />

      {/* Anatomy — 4-column horizontal strip */}
      <section className="mb-10">
        <div className="flex items-center gap-3 mb-4">
          <SnailSpiral size={18} opacity={0.45} />
          <h2 className="text-[10px] uppercase tracking-widest opacity-50">Horn Anatomy</h2>
          <SnailSpiral size={18} opacity={0.45} />
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {ANATOMY.map((a) => (
            <div
              key={a.hmong}
              className="border border-[var(--zcm-quote)]/20 p-3 flex flex-col gap-1"
            >
              <p className="text-xs font-bold text-[var(--zcm-quote)]">{a.hmong}</p>
              <p className="text-[11px] font-semibold opacity-60">{a.english}</p>
              <p className="text-[10px] opacity-40 leading-snug">{a.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <StepBand opacity={0.3} className="w-full mb-10" />

      {/* Conditions by category — 2-column cards */}
      {CATEGORY_ORDER.map((cat, i) => {
        const outcomes = BY_CATEGORY[cat];
        if (outcomes.length === 0) return null;
        return (
          <section key={cat} className="mb-10">
            <div className="flex items-center gap-3 mb-5">
              <SnailSpiral size={18} opacity={0.45} />
              <h2 className="text-[10px] uppercase tracking-widest opacity-50">
                {CATEGORY_LABEL[cat]}
              </h2>
              <SnailSpiral size={18} opacity={0.45} />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {outcomes.map((outcome) => (
                <ConditionCard key={outcome} outcome={outcome} />
              ))}
            </div>
            {i < CATEGORY_ORDER.length - 1 && (
              <StepBand opacity={0.2} className="w-full mt-10" />
            )}
          </section>
        );
      })}

      {/* Footer */}
      <DiamondBand opacity={0.3} className="w-full mt-4 mb-8" />
      <div className="flex items-center justify-between flex-wrap gap-4 opacity-35">
        <p className="text-[10px] uppercase tracking-widest leading-relaxed max-w-sm">
          Source: traditional shamanic teachings and
          &ldquo;Khov Kuam Saib — Hmong Shaman — Cow Horn Divination&rdquo;
        </p>
        <Link
          href="/divination"
          className="text-[10px] uppercase tracking-widest hover:opacity-70 transition-opacity"
        >
          ← Back to Throw
        </Link>
      </div>
    </main>
  );
}
