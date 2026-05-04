"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { FaYoutube, FaTiktok, FaFacebookF } from "react-icons/fa6";
import type { ResolvedTrack } from "@/app/lib/reels";

const PLATFORM_ICONS = {
  youtube: FaYoutube,
  tiktok: FaTiktok,
  facebook: FaFacebookF,
} as const;

type Phase = "intro" | "cycle" | "rest" | "random";

const SPOTLIGHT_MS = 1500;
const CYCLE_ROUNDS = 2;
const REST_MS = 3 * 60 * 1000;

function shuffle(arr: number[]): number[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function ReelCardsGrid({ tracks }: { tracks: ResolvedTrack[] }) {
  const [phase, setPhase] = useState<Phase>("intro");
  const [activeIndex, setActiveIndex] = useState<number | null>(0);
  const [cycleOrder, setCycleOrder] = useState<number[]>([]);

  useEffect(() => {
    if (phase !== "intro") return;
    const t = setTimeout(() => {
      setActiveIndex(null);
      setCycleOrder(tracks.map((_, i) => i));
      setPhase("cycle");
    }, 2000);
    return () => clearTimeout(t);
  }, [phase, tracks]);

  useEffect(() => {
    if ((phase !== "cycle" && phase !== "random") || cycleOrder.length === 0) return;
    const sequence = Array.from({ length: CYCLE_ROUNDS }, () => cycleOrder).flat();
    let step = 1;
    const t0 = setTimeout(() => setActiveIndex(sequence[0]), 0);
    const id = setInterval(() => {
      if (step < sequence.length) {
        setActiveIndex(sequence[step++]);
      } else {
        clearInterval(id);
        setActiveIndex(null);
        setPhase("rest");
      }
    }, SPOTLIGHT_MS);
    return () => { clearTimeout(t0); clearInterval(id); };
  }, [phase, cycleOrder]);

  useEffect(() => {
    if (phase !== "rest") return;
    const t = setTimeout(() => {
      setCycleOrder(shuffle(tracks.map((_, i) => i)));
      setPhase("random");
    }, REST_MS);
    return () => clearTimeout(t);
  }, [phase, tracks]);

  return (
    <div className="mx-auto grid w-full grid-cols-3 gap-3">
      {tracks.map((track, index) => {
        const isIntro = phase === "intro" && index === 0;
        const isSpotlit = activeIndex === index;
        const PlatformIcon = PLATFORM_ICONS[track.platform];

        return (
          <div
            key={track.title}
            className={`relative aspect-[9/16] transition-transform duration-500 ${
              isIntro
                ? "reel-trump-intro"
                : isSpotlit
                ? "-translate-y-4"
                : index % 2 === 0
                ? "translate-y-8"
                : ""
            }`}
          >
            <a
              href={track.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Watch ${track.title}`}
              className={`reel-card group relative block size-full overflow-hidden rounded-[20px] border bg-white/10 shadow-2xl backdrop-blur transition duration-500 hover:-translate-y-2 hover:shadow-[#f6bc53]/20 ${
                isSpotlit
                  ? "scale-[1.04] border-white/55 shadow-[#f6bc53]/25"
                  : "border-white/20 hover:border-white/45"
              }`}
              style={{ animationDelay: `${index * 140}ms` }}
            >
              <Image
                src={track.image}
                alt={`${track.title} reel still`}
                fill
                sizes="(min-width: 1024px) 140px, 28vw"
                className="reel-card-image object-cover transition duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.1),rgba(0,0,0,0.18)_42%,rgba(0,0,0,0.78))] transition duration-500 group-hover:bg-[linear-gradient(180deg,rgba(0,0,0,0.02),rgba(0,0,0,0.1)_42%,rgba(0,0,0,0.66))]" />
              <div className="reel-card-shine absolute inset-y-0 -left-1/2 w-1/2 rotate-12 bg-white/18 blur-xl" />
              <div className="relative flex h-full flex-col justify-between p-3">
                <span className="flex items-start justify-between gap-2">
                  <span className="min-w-0 truncate rounded-full bg-black/45 px-1 py-1 text-[10px] font-semibold uppercase tracking-normal text-white/90 backdrop-blur transition duration-500 group-hover:bg-[#f6bc53] group-hover:text-[#141414]">
                    {track.tag}
                  </span>
                  <span
                    className={`grid shrink-0 size-7 place-items-center rounded-full opacity-95 shadow-sm ring-1 ring-white/40 transition duration-500 group-hover:scale-110 group-hover:opacity-100 ${track.platformClass}`}
                  >
                    <PlatformIcon className="size-3.5" aria-hidden="true" />
                    <ArrowUpRight
                      className="absolute -right-0.5 -top-0.5 size-3 rounded-full bg-[#141414] p-0.5 text-white transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                      aria-hidden="true"
                    />
                  </span>
                </span>
                <span className="mb-[5px]">
                  <span className="mb-1 block text-[10px] font-semibold uppercase tracking-[0.14em] text-[#f6bc53] transition duration-500 group-hover:text-white">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span className="block text-sm font-semibold leading-tight text-white drop-shadow">
                    {track.title}
                  </span>
                </span>
              </div>
            </a>
          </div>
        );
      })}
    </div>
  );
}
