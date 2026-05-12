'use client'

import { useEffect, useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ChevronLeft, ChevronRight, FileText, Printer } from 'lucide-react'
import { MILESTONES } from '../data/resume'
import { ResumeBirdArt } from './Bird'

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
            className="pointer-events-none absolute z-20"
            style={{ width: 64, height: 48 }}
            animate={{
              left: ['-10%', '66%', '92%', '22%', '-10%'],
              top: ['10%', '-2%', '34%', '62%', '10%'],
            }}
            transition={{
              duration: 9,
              ease: 'easeInOut',
              repeat: Infinity,
              repeatDelay: 1.2,
            }}
          >
            <motion.div
              animate={{
                y: [0, -10, 0, -7, 0],
                rotate: [0, -5, 4, -3, 0],
                scaleX: [1, 1, -1, -1, 1],
              }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
              className="scale-125"
            >
              <ResumeBirdArt variant="moe" />
            </motion.div>
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
