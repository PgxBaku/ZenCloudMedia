'use client'
import { motion } from 'framer-motion'
import { MILESTONES } from '../data/resume'

type Props = {
  birdTargetIndex: number
  activeIndex: number
}

// ── Branch layout definitions ───────────────────────────────────────────────

const STROKE_WIDTH = 3

interface BranchDef {
  index: number
  pathD: string
  twigD: string
  endX: number
  endY: number
  color: string
  colorLight: string
  bg: string
  textColor: string
  labelDir: 'left' | 'right' | 'top'
}

const BRANCHES: BranchDef[] = [
  {
    index: 0,
    pathD: 'M140,280 Q105,274 72,266 Q62,263 55,260',
    twigD: 'M72,266 Q64,270 58,274',
    endX: 58, endY: 274,
    color: '#64748b',
    colorLight: '#94a3b8',
    bg: '#f1f5f9',
    textColor: '#334155',
    labelDir: 'left',
  },
  {
    index: 1,
    pathD: 'M140,225 Q175,218 208,208 Q220,204 226,200',
    twigD: 'M208,208 Q216,212 222,215',
    endX: 222, endY: 215,
    color: '#6366f1',
    colorLight: '#818cf8',
    bg: '#eef2ff',
    textColor: '#3730a3',
    labelDir: 'right',
  },
  {
    index: 2,
    pathD: 'M140,170 Q95,161 58,152 Q48,148 40,145',
    twigD: 'M58,152 Q50,156 44,160',
    endX: 44, endY: 160,
    color: '#7c3aed',
    colorLight: '#a78bfa',
    bg: '#f5f3ff',
    textColor: '#5b21b6',
    labelDir: 'left',
  },
  {
    index: 3,
    pathD: 'M140,115 Q185,106 220,98 Q232,94 238,90',
    twigD: 'M220,98 Q226,101 230,105',
    endX: 230, endY: 105,
    color: '#a78bfa',
    colorLight: '#c4b5fd',
    bg: '#faf5ff',
    textColor: '#6d28d9',
    labelDir: 'right',
  },
  {
    index: 4,
    pathD: 'M140,60 Q140,46 140,32',
    twigD: 'M140,32 Q135,26 130,22 M140,32 Q145,26 150,22',
    endX: 140, endY: 22,
    color: '#f59e0b',
    colorLight: '#fbbf24',
    bg: '#fffbeb',
    textColor: '#92400e',
    labelDir: 'top',
  },
]

// ── Tag pill geometry ───────────────────────────────────────────────────────

// Approximate the pill rect from label text at font-size 6.5
function tagWidth(label: string): number {
  return Math.max(32, label.length * 4.8 + 14)
}

function getTagLayout(b: BranchDef, tags: string[]): { x: number; y: number; w: number; label: string }[] {
  if (b.labelDir === 'top') {
    // Fan out in 2 rows above the tree top
    const row1 = tags.slice(0, 4)
    const row2 = tags.slice(4)
    const out: { x: number; y: number; w: number; label: string }[] = []

    const row1Widths = row1.map(t => tagWidth(t))
    const row1Total = row1Widths.reduce((s, w) => s + w, 0) + (row1.length - 1) * 6
    let cx = b.endX - row1Total / 2
    row1.forEach((t, i) => {
      const w = row1Widths[i]
      out.push({ x: cx + w / 2, y: b.endY - 14, w, label: t })
      cx += w + 6
    })

    const row2Widths = row2.map(t => tagWidth(t))
    const row2Total = row2Widths.reduce((s, w) => s + w, 0) + (row2.length - 1) * 6
    cx = b.endX - row2Total / 2
    row2.forEach((t, i) => {
      const w = row2Widths[i]
      out.push({ x: cx + w / 2, y: b.endY - 28, w, label: t })
      cx += w + 6
    })

    return out
  }

  if (b.labelDir === 'left') {
    return tags.map((t, i) => {
      const w = tagWidth(t)
      return { x: b.endX - w / 2 - 12, y: b.endY - tags.length * 8 + i * 15, w, label: t }
    })
  }

  // right
  return tags.map((t, i) => {
    const w = tagWidth(t)
    return { x: b.endX + w / 2 + 12, y: b.endY - tags.length * 8 + i * 15, w, label: t }
  })
}

// ── Foliage cluster ─────────────────────────────────────────────────────────

function Foliage({ cx, cy, color, active, delay }: { cx: number; cy: number; color: string; active: boolean; delay: number }) {
  // 4–6 small circles scattered around the center point
  const dots = [
    { dx: 0, dy: 0, r: 7 },
    { dx: 5, dy: -3, r: 5 },
    { dx: -5, dy: 2, r: 6 },
    { dx: 3, dy: 4, r: 4.5 },
    { dx: -4, dy: -4, r: 5 },
    { dx: 7, dy: 1, r: 4 },
  ]
  return (
    <motion.g
      initial={{ opacity: 0, scale: 0 }}
      animate={active ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0 }}
      transition={{ duration: 0.35, delay, ease: 'easeOut' }}
    >
      {dots.map((d, i) => (
        <circle key={i} cx={cx + d.dx} cy={cy + d.dy} r={d.r} fill={color} opacity={0.18 + i * 0.03} />
      ))}
    </motion.g>
  )
}

// ── Component ────────────────────────────────────────────────────────────────

export default function TechTree({ birdTargetIndex, activeIndex }: Props) {
  const trunkGrown = birdTargetIndex >= 0

  return (
    <svg
      className="absolute z-[6] pointer-events-none"
      style={{ left: 1020, bottom: 98, width: 320, height: 380 }}
      viewBox="0 0 320 380"
      fill="none"
    >
      {/* ── Trunk ──────────────────────────────────────────────────────── */}
      {/* Thick base */}
      <motion.path
        d="M160,380 Q158,260 160,60"
        stroke="#5c4332"
        strokeWidth={12}
        fill="none"
        strokeLinecap="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: trunkGrown ? 1 : 0 }}
        transition={{ duration: 0.8, delay: 0.3, ease: 'easeInOut' }}
      />
      {/* Tapered upper */}
      <motion.path
        d="M160,380 Q158,260 160,60"
        stroke="#6b4d3a"
        strokeWidth={6}
        fill="none"
        strokeLinecap="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: trunkGrown ? 1 : 0 }}
        transition={{ duration: 0.6, delay: 0.5, ease: 'easeInOut' }}
      />
      {/* Root flares */}
      <motion.path
        d="M152,380 Q155,370 158,358"
        stroke="#5c4332"
        strokeWidth={4}
        fill="none"
        strokeLinecap="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: trunkGrown ? 1 : 0 }}
        transition={{ duration: 0.4, delay: 0.7, ease: 'easeInOut' }}
      />
      <motion.path
        d="M168,380 Q165,370 162,358"
        stroke="#5c4332"
        strokeWidth={3.5}
        fill="none"
        strokeLinecap="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: trunkGrown ? 1 : 0 }}
        transition={{ duration: 0.4, delay: 0.75, ease: 'easeInOut' }}
      />

      {/* ── Branches ──────────────────────────────────────────────────── */}
      {BRANCHES.map(b => {
        const branchActive = birdTargetIndex >= b.index
        const labelsActive = activeIndex >= b.index
        const tags = MILESTONES[b.index].tags
        const tagLayouts = getTagLayout(b, tags)

        return (
          <g key={b.index}>
            {/* Main branch path */}
            <motion.path
              d={b.pathD}
              stroke={b.color}
              strokeWidth={STROKE_WIDTH}
              fill="none"
              strokeLinecap="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: branchActive ? 1 : 0 }}
              transition={{ duration: 0.7, ease: 'easeInOut' }}
            />
            {/* Twig offshoot */}
            <motion.path
              d={b.twigD}
              stroke={b.colorLight}
              strokeWidth={2}
              fill="none"
              strokeLinecap="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: branchActive ? 1 : 0 }}
              transition={{ duration: 0.4, delay: 0.3, ease: 'easeInOut' }}
            />
            {/* Foliage at endpoint */}
            <Foliage cx={b.endX} cy={b.endY} color={b.color} active={branchActive} delay={0.3} />
            {/* Year badge */}
            <motion.text
              x={b.labelDir === 'right' ? b.endX + 6 : b.endX - 6}
              y={b.endY + 3}
              textAnchor={b.labelDir === 'right' ? 'start' : 'end'}
              fill={b.color}
              fontSize={8}
              fontWeight={700}
              fontFamily="sans-serif"
              initial={{ opacity: 0 }}
              animate={{ opacity: labelsActive ? 1 : 0 }}
              transition={{ duration: 0.3 }}
            >
              {MILESTONES[b.index].year}
            </motion.text>
            {/* Tech tag pills */}
            <motion.g
              initial={{ opacity: 0 }}
              animate={{ opacity: labelsActive ? 1 : 0 }}
              transition={{ duration: 0.45, delay: 0.2 }}
            >
              {tagLayouts.map((t, i) => (
                <g key={i}>
                  <rect
                    x={t.x - t.w / 2}
                    y={t.y - 7}
                    width={t.w}
                    height={14}
                    rx={3}
                    fill={b.bg}
                    stroke={b.colorLight}
                    strokeWidth={0.4}
                    opacity={0.9}
                  />
                  <text
                    x={t.x}
                    y={t.y + 3}
                    textAnchor="middle"
                    fill={b.textColor}
                    fontSize={6.5}
                    fontFamily="sans-serif"
                    fontWeight={500}
                  >
                    {t.label}
                  </text>
                </g>
              ))}
            </motion.g>
          </g>
        )
      })}
    </svg>
  )
}
