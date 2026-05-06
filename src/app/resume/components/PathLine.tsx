// src/app/resume/components/PathLine.tsx
'use client'
import { motion } from 'framer-motion'
import { ANIMATION_CONFIG, MILESTONES } from '../data/resume'

// Duration covers pathStartDelay through last milestone rising
const PATH_DURATION =
  ANIMATION_CONFIG.pathStartDelay +
  0.1 +
  (MILESTONES.length - 1) * ANIMATION_CONFIG.milestoneInterval

// Milestone dot positions: { x: flagLeft, y: SVG y (0=top, 500=container bottom) }
type Pt = { x: number; y: number }

function getDotPositions(): Pt[] {
  return MILESTONES.map(m => ({
    x: m.flagLeft,
    y: 500 - (m.aboveGround ?? 140),
  }))
}

function buildPath(pts: Pt[], endX: number): string {
  // Start from left
  let d = `M 280 ${pts[0].y + 20}`

  // Arc toward each milestone dot with bezier curves
  const midY = (a: Pt, b: Pt) => {
    // Slight arc that dips or rises between points
    const mean = (a.y + b.y) / 2
    const sway = Math.abs(b.x - a.x) * 0.03
    return b.y > a.y ? mean + sway : mean - sway
  }

  for (let i = 0; i < pts.length; i++) {
    const prev: Pt = i === 0 ? { x: 280, y: pts[0].y + 20 } : pts[i - 1]
    const cur = pts[i]
    const c1x = prev.x + (cur.x - prev.x) * 0.35
    const c2x = prev.x + (cur.x - prev.x) * 0.65
    const my = midY(prev, cur)
    d += ` C ${c1x} ${my}, ${c2x} ${my}, ${cur.x} ${cur.y}`
  }

  // Continue past last milestone
  const last = pts[pts.length - 1]
  d += ` C ${last.x + 120} ${last.y - 5}, ${endX - 100} ${last.y - 15}, ${endX} ${last.y - 20}`

  return d
}

const pts = getDotPositions()
const pathD = buildPath(pts, 2400)

export default function PathLine() {
  return (
    <svg
      className="absolute left-0 z-[5] overflow-visible pointer-events-none"
      style={{ width: 2600, height: 500, bottom: 0 }}
      viewBox="0 0 2600 500"
      preserveAspectRatio="none"
    >
      <motion.path
        d={pathD}
        fill="none"
        stroke="rgba(255,255,255,0.55)"
        strokeWidth="2.5"
        strokeDasharray="8 5"
        strokeLinecap="round"
        pathLength={1}
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{
          duration: PATH_DURATION,
          delay: ANIMATION_CONFIG.pathStartDelay,
          ease: 'linear',
        }}
      />
    </svg>
  )
}
