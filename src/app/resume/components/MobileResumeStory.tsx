'use client'

import { useEffect, useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ChevronLeft, ChevronRight, FileText, Printer } from 'lucide-react'
import { MILESTONES } from '../data/resume'

type Props = {
  onResumeReveal: () => void
  onProgress: (pct: number, label: string) => void
}

const variants = {
  enter: (direction: number) => ({
    opacity: 0,
    x: direction > 0 ? 56 : -56,
    scale: 0.98,
  }),
  center: {
    opacity: 1,
    x: 0,
    scale: 1,
  },
  exit: (direction: number) => ({
    opacity: 0,
    x: direction > 0 ? -56 : 56,
    scale: 0.98,
  }),
}

export default function MobileResumeStory({ onProgress, onResumeReveal }: Props) {
  const [[index, direction], setSlide] = useState<[number, number]>([0, 0])
  const milestone = MILESTONES[index]
  const progress = useMemo(
    () => Math.round(((index + 1) / MILESTONES.length) * 100),
    [index],
  )

  useEffect(() => {
    onProgress(progress, milestone.year)
  }, [milestone.year, onProgress, progress])

  const goTo = (nextIndex: number) => {
    const clamped = Math.max(0, Math.min(MILESTONES.length - 1, nextIndex))
    if (clamped === index) return
    setSlide([clamped, clamped > index ? 1 : -1])
  }

  return (
    <section
      className="relative min-h-screen overflow-hidden bg-[radial-gradient(circle_at_30%_10%,#1e3a5f_0%,#0f172a_48%,#070b16_100%)] px-4 pb-10 pt-24 text-white"
      aria-label="Mobile resume story"
    >
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(135deg,transparent_0%,rgba(255,255,255,0.08)_52%,transparent_53%),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[length:100%_100%,44px_44px] opacity-45" />

      <div className="relative mx-auto flex min-h-[calc(100vh-8rem)] w-full max-w-md flex-col">
        <div className="mb-5">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-sky-200">
            Career Story
          </p>
          <h1 className="mt-2 text-3xl font-semibold tracking-normal text-white">
            Paul P. Xiong
          </h1>
          <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/12">
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-amber-300 to-sky-300"
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.28, ease: 'easeOut' }}
            />
          </div>
        </div>

        <div className="relative flex flex-1 items-center">
          <motion.div
            className="pointer-events-none absolute right-1 top-[-22px] z-20"
            animate={{
              x: [0, -18, 8, 0],
              y: [0, -10, 4, 0],
              rotate: [0, -6, 4, 0],
            }}
            transition={{ duration: 3.2, repeat: Infinity, ease: 'easeInOut' }}
          >
            <MobileBird />
          </motion.div>

          <AnimatePresence mode="wait" custom={direction}>
            <motion.article
              key={milestone.id}
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.24, ease: 'easeOut' }}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.18}
              onDragEnd={(_, info) => {
                if (info.offset.x < -56) goTo(index + 1)
                if (info.offset.x > 56) goTo(index - 1)
              }}
              className="w-full rounded-lg border border-white/14 bg-white/[0.08] p-5 shadow-2xl shadow-black/30 backdrop-blur-xl"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-200">
                    {milestone.dateRange}
                  </p>
                  <h2 className="mt-3 text-2xl font-semibold leading-tight tracking-normal text-white">
                    {milestone.role}
                  </h2>
                </div>
                <span className="rounded-full border border-white/15 bg-white/10 px-3 py-1 text-sm font-semibold text-sky-100">
                  {milestone.year}
                </span>
              </div>

              <p className="mt-3 text-sm font-medium text-sky-100">{milestone.company}</p>
              <p className="mt-5 border-t border-white/10 pt-5 text-sm leading-6 text-slate-100">
                {milestone.metric}
              </p>

              <div className="mt-5 flex flex-wrap gap-2">
                {milestone.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded border border-sky-200/20 bg-sky-100/10 px-2.5 py-1 text-xs font-medium text-sky-100"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </motion.article>
          </AnimatePresence>
        </div>

        <div className="relative mt-5">
          <div className="mb-4 flex justify-center gap-2">
            {MILESTONES.map((m, dotIndex) => (
              <button
                key={m.id}
                type="button"
                aria-label={`Show ${m.role}`}
                onClick={() => goTo(dotIndex)}
                className={`h-2.5 rounded-full transition-all ${
                  dotIndex === index ? 'w-8 bg-amber-200' : 'w-2.5 bg-white/25'
                }`}
              />
            ))}
          </div>

          <div className="grid grid-cols-[44px_1fr_44px] items-center gap-3">
            <button
              type="button"
              aria-label="Previous milestone"
              onClick={() => goTo(index - 1)}
              disabled={index === 0}
              className="flex h-11 w-11 items-center justify-center rounded border border-white/14 bg-white/8 text-white disabled:opacity-35"
            >
              <ChevronLeft size={20} aria-hidden="true" />
            </button>

            <button
              type="button"
              onClick={onResumeReveal}
              className="flex h-11 items-center justify-center gap-2 rounded bg-white text-sm font-semibold text-slate-950 shadow-lg shadow-black/20"
            >
              <FileText size={17} aria-hidden="true" />
              View Full Resume
            </button>

            <button
              type="button"
              aria-label="Next milestone"
              onClick={() => goTo(index + 1)}
              disabled={index === MILESTONES.length - 1}
              className="flex h-11 w-11 items-center justify-center rounded border border-white/14 bg-white/8 text-white disabled:opacity-35"
            >
              <ChevronRight size={20} aria-hidden="true" />
            </button>
          </div>

          <button
            type="button"
            onClick={() => window.print()}
            className="mt-3 flex h-10 w-full items-center justify-center gap-2 rounded border border-white/14 bg-white/8 text-sm font-medium text-slate-100"
          >
            <Printer size={16} aria-hidden="true" />
            Print or Save PDF
          </button>
        </div>
      </div>
    </section>
  )
}

function MobileBird() {
  return (
    <svg width="84" height="64" viewBox="0 0 84 64" fill="none" aria-hidden="true">
      <motion.path
        d="M36 30 C24 12, 10 10, 6 22 C14 26, 24 30, 38 35 Z"
        fill="#fbbf24"
        animate={{ rotate: [-8, 16, -8] }}
        transition={{ duration: 0.7, repeat: Infinity, ease: 'easeInOut' }}
        style={{ originX: 0.45, originY: 0.5 }}
      />
      <motion.path
        d="M38 34 C28 52, 14 54, 8 42 C18 38, 28 35, 40 31 Z"
        fill="#f59e0b"
        animate={{ rotate: [10, -14, 10] }}
        transition={{ duration: 0.7, repeat: Infinity, ease: 'easeInOut' }}
        style={{ originX: 0.45, originY: 0.5 }}
      />
      <ellipse cx="43" cy="34" rx="18" ry="13" fill="#fde68a" />
      <circle cx="58" cy="27" r="12" fill="#fcd34d" />
      <circle cx="62" cy="24" r="3.2" fill="#0f172a" />
      <circle cx="63" cy="23" r="1" fill="white" />
      <path d="M69 27 L80 31 L69 35 Z" fill="#fb923c" />
      <path d="M26 39 L13 47 L20 36 Z" fill="#d97706" />
    </svg>
  )
}
