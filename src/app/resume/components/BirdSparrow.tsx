'use client'
import { useMemo, useEffect, useRef } from 'react'
import { motion, useAnimate } from 'framer-motion'
import { MILESTONES } from '../data/resume'

const STAR = { x: 2200, y: 420 + 40 + 4 }

function getFlagTop(idx: number): { x: number; y: number } {
  if (idx >= MILESTONES.length) return STAR
  const m = MILESTONES[idx]
  return { x: m.flagLeft, y: (m.aboveGround ?? 140) + m.poleHeight + 12 }
}

type Pt = { x: number; y: number }

/** Generate 3 random waypoints between a and b for a swooping flight path */
function generateWaypoints(a: Pt, b: Pt, seed: number): Pt[] {
  const dx = b.x - a.x
  const dy = b.y - a.y
  const dist = Math.sqrt(dx * dx + dy * dy) || 1
  const perpX = -dy / dist
  const perpY = dx / dist

  const r = (n: number) => {
    const s = Math.sin(seed + n * 127.1) * 43758.5453
    return s - Math.floor(s)
  }

  const sway = 35 + r(1) * 120
  const dir = r(2) > 0.5 ? 1 : -1
  const arc = (r(3) - 0.5) * 90

  const wp1: Pt = {
    x: a.x + dx * 0.28 + perpX * sway * dir * (0.5 + r(4) * 0.5),
    y: a.y + dy * 0.28 + perpY * sway * dir * (0.3 + r(5) * 0.4) + arc,
  }
  const wp2: Pt = {
    x: a.x + dx * 0.55 - perpX * sway * dir * (0.3 + r(6) * 0.5),
    y: a.y + dy * 0.55 - perpY * sway * dir * (0.2 + r(7) * 0.4) + arc * 0.5,
  }
  const wp3: Pt = {
    x: a.x + dx * 0.8 + perpX * sway * dir * (0.1 + r(8) * 0.2),
    y: a.y + dy * 0.8 + perpY * sway * dir * (0.1 + r(9) * 0.15),
  }

  return [wp1, wp2, wp3, b]
}

export type BirdPhase = 'flying' | 'circling' | 'perched'

const FLIGHT_SEED = Math.floor(Date.now() % 100000)

type Props = { activeIndex: number; phase: BirdPhase }

export default function Bird({ activeIndex, phase }: Props) {
  const [scope, animate] = useAnimate()
  const prevIndex = useRef(activeIndex)

  const positions = useMemo(
    () => [...MILESTONES.map((_, i) => getFlagTop(i)), STAR],
    [],
  )

  // Pre-generate all flight paths at mount time (different every page load)
  const flightPaths = useMemo(() => {
    const all: Pt[][] = []
    // Offscreen → first flag
    all.push(generateWaypoints({ x: -60, y: positions[0].y }, positions[0], FLIGHT_SEED))
    // Between each consecutive position
    for (let i = 0; i < positions.length - 1; i++) {
      all.push(generateWaypoints(positions[i], positions[i + 1], FLIGHT_SEED + i + 1))
    }
    return all
  }, [positions])

  const isPerched = phase === 'perched'
  const isCircling = phase === 'circling'

  const target =
    activeIndex < 0
      ? { x: -60, y: positions[0]?.y ?? 180 }
      : positions[activeIndex] ?? positions[positions.length - 1]

  const prevPosIdx = activeIndex < 0 ? 0 : Math.max(0, activeIndex - 1)
  const facingRight = activeIndex < 0 || target.x >= positions[prevPosIdx].x

  // Animate position through waypoints when activeIndex changes
  useEffect(() => {
    // Set initial offscreen position on mount (no animation)
    if (prevIndex.current === -1 && activeIndex === -1) {
      animate(scope.current, { left: -96, bottom: (positions[0]?.y ?? 180) + 8 }, { duration: 0 })
      return
    }

    if (activeIndex < 0) return

    const pathIdx = activeIndex === 0 ? 0 : activeIndex
    const path = flightPaths[pathIdx]
    if (!path) return

    const yOff = isPerched ? 0 : 8
    const leftKF = path.map(w => w.x - 32)
    const bottomKF = path.map(w => w.y + yOff)

    animate(
      scope.current,
      { left: leftKF, bottom: bottomKF },
      {
        duration: 0.9 + Math.sin(activeIndex * 2.3 + 0.7) * 0.4,
        ease: [0.22, 0.61, 0.36, 1],
      },
    )

    prevIndex.current = activeIndex
  }, [activeIndex]) // eslint-disable-line react-hooks/exhaustive-deps

  // Adjust bottom offset when perch state changes
  useEffect(() => {
    if (activeIndex < 0) return
    const t = positions[activeIndex] ?? positions[positions.length - 1]
    animate(scope.current, { bottom: t.y + (isPerched ? 0 : 8) }, { duration: 0.35 })
  }, [isPerched]) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <motion.div
      ref={scope}
      className="absolute z-30 pointer-events-none"
      style={{ width: 64, height: 48 }}
    >
      {/* Circling orbit — active only during circling phase */}
      <motion.div
        animate={
          isCircling
            ? {
                x: [0, 40, 12, -36, -12, 0],
                y: [0, -14, -42, -8, 32, 0],
              }
            : { x: 0, y: 0 }
        }
        transition={
          isCircling
            ? { duration: 2.2, ease: 'easeInOut' }
            : { duration: 0.3 }
        }
      >
        {/* Flight bob / perch settle */}
        <motion.div
          animate={
            isPerched
              ? { y: [0, -2, 0] }
              : isCircling
                ? { y: [0, -5, 0, -4, 0] }
                : { y: [0, -7, 0, -5, 0, -6, 0] }
          }
          transition={
            isPerched
              ? { duration: 1.2, repeat: Infinity, ease: 'easeInOut' }
              : isCircling
                ? { duration: 0.6, repeat: Infinity, ease: 'easeInOut' }
                : { duration: 0.9, repeat: Infinity, ease: 'easeInOut' }
          }
          style={{ transform: facingRight ? 'scaleX(1)' : 'scaleX(-1)' }}
        >
          <svg width="64" height="48" viewBox="0 0 64 48" fill="none" style={{ overflow: 'visible' }}>
            {/* Far wing (behind body) */}
            <motion.g
              animate={isPerched ? { rotate: 0 } : { rotate: [-1, 1, -1] }}
              transition={isPerched ? { duration: 0.4 } : { duration: 0.3, repeat: Infinity, ease: 'easeInOut' }}
              style={{ originX: 32, originY: 20 }}
            >
              <path d="M32 20 C24 4, 14 0, 10 6 C14 14, 20 19, 28 23 Z" fill="#1e293b" />
            </motion.g>

            {/* Tail feathers */}
            <motion.g
              animate={{ rotate: [0, -1, 1, -1, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
              style={{ originX: 14, originY: 26 }}
            >
              <path d="M14 26 L3 19 L6 25 L1 29 L8 28 Z" fill="#0f172a" />
              <path d="M16 26 L6 22 L7 27 L4 30 L10 28 Z" fill="#1e293b" />
              <path d="M18 26 L9 24 L9 28 L7 30 L12 28 Z" fill="#334155" opacity="0.7" />
            </motion.g>

            {/* Near wing (front, at shoulder) */}
            <motion.g
              animate={isPerched ? { rotate: 0 } : { rotate: [-1, 1, -1] }}
              transition={isPerched ? { duration: 0.4 } : { duration: 0.3, repeat: Infinity, ease: 'easeInOut' }}
              style={{ originX: 32, originY: 21 }}
            >
              <path d="M32 21 C20 2, 10 -2, 6 4 C10 12, 18 18, 30 23 Z" fill="#0f172a" />
              <path d="M32 22 C22 6, 14 2, 10 6 C14 14, 20 19, 30 23 Z" fill="#1e293b" opacity="0.55" />
            </motion.g>

            {/* Body */}
            <ellipse cx="28" cy="26" rx="16" ry="10" fill="#1e293b" />
            <ellipse cx="28" cy="27" rx="14.5" ry="8.5" fill="#334155" />
            {/* Belly */}
            <ellipse cx="28" cy="30" rx="9" ry="5" fill="#475569" opacity="0.45" />

            {/* Head + neck */}
            <motion.g
              animate={
                isPerched
                  ? { y: [0, -0.4, 0], x: [0, 0.3, 0] }
                  : { y: [0, -0.8, 0], x: [0, 0.5, 0] }
              }
              transition={
                isPerched
                  ? { duration: 1, repeat: Infinity, ease: 'easeInOut' }
                  : { duration: 0.5, repeat: Infinity, ease: 'easeInOut' }
              }
            >
              {/* Neck fill */}
              <path d="M38 20 C40 17, 42 15, 42 14 L36 14 C34 17, 33 20, 32 23 C32 23, 34 22, 38 20 Z" fill="#1e293b" />
              {/* Head */}
              <circle cx="46" cy="15" r="7.5" fill="#1e293b" />
              <circle cx="46" cy="15" r="6.5" fill="#334155" />
              {/* Eye */}
              <circle cx="49.5" cy="12.5" r="2.8" fill="white" />
              <circle cx="51" cy="12" r="1.4" fill="#0f172a" />
              <circle cx="51.5" cy="11.5" r="0.5" fill="white" />
              {/* Beak */}
              <path d="M54 12.5 L66 10.5 L54 18.5 Z" fill="#f59e0b" />
            </motion.g>

            {/* Feet */}
            <motion.g
              animate={isPerched ? { y: 0 } : { y: [0, 0.6, 0] }}
              transition={
                isPerched
                  ? { duration: 0.3 }
                  : { duration: 0.5, repeat: Infinity, ease: 'easeInOut' }
              }
            >
              {/* Left foot */}
              <path d="M22 36 L21 39 M21 39 L18 41 M21 39 L20.5 41.5 M21 39 L22.5 41" stroke="#f59e0b" strokeWidth="0.9" strokeLinecap="round" strokeLinejoin="round" opacity={isPerched ? 1 : 0.7} />
              {/* Right foot */}
              <path d="M34 36 L33 39 M33 39 L30 41 M33 39 L32.5 41.5 M33 39 L34.5 41" stroke="#f59e0b" strokeWidth="0.9" strokeLinecap="round" strokeLinejoin="round" opacity={isPerched ? 1 : 0.7} />
            </motion.g>
          </svg>
        </motion.div>
      </motion.div>
    </motion.div>
  )
}
