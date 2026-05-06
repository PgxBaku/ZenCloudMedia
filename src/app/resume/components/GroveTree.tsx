'use client'
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'

// ── Simple Icons CDN (v14) slug map ───────────────────────────────────────

const ICON_SLUGS: Record<string, string> = {
  '.NET / C#': 'dotnet',
  Python: 'python',
  MuleSoft: 'mulesoft',
  'Amazon Connect': 'amazonwebservices',
  'Next.js': 'nextdotjs',
  Ollama: 'ollama',
  Claude: 'anthropic',
}

const ICON_CDN = 'https://cdn.jsdelivr.net/npm/simple-icons@14/icons'

// ── Text‑only badge abbreviations + colors ────────────────────────────────

const TEXT_BADGES: Record<string, { abbr: string; bg: string; fg: string }> = {
  'SQL Server': { abbr: 'SQL', bg: '#e53935', fg: '#fff' },
  SSRS: { abbr: 'SSR', bg: '#1565c0', fg: '#fff' },
  TFS: { abbr: 'TFS', bg: '#0078d4', fg: '#fff' },
  'CI/CD': { abbr: 'CI', bg: '#7b1fa2', fg: '#fff' },
  'CloudHub 2.0': { abbr: 'CH2', bg: '#00a1e4', fg: '#fff' },
  ADO: { abbr: 'ADO', bg: '#0078d4', fg: '#fff' },
  'Power BI': { abbr: 'PBI', bg: '#f2c811', fg: '#1a1a1a' },
  'EDI / BizTalk': { abbr: 'EDI', bg: '#5c2d91', fg: '#fff' },
  'Partner Manager': { abbr: 'PM', bg: '#00897b', fg: '#fff' },
  'MQ FIFO': { abbr: 'MQ', bg: '#d84315', fg: '#fff' },
  'Team Lead': { abbr: 'TL', bg: '#37474f', fg: '#fff' },
  'Azure Fabric': { abbr: 'AZF', bg: '#0078d4', fg: '#fff' },
  'AI / Copilot': { abbr: 'AI', bg: '#6a1b9a', fg: '#fff' },
  'C-Suite': { abbr: 'C', bg: '#4e342e', fg: '#fff' },
  Remotion: { abbr: 'REM', bg: '#8bc34a', fg: '#1a1a1a' },
  Codex: { abbr: 'CDX', bg: '#ff7043', fg: '#fff' },
  DeepSeek: { abbr: 'DS', bg: '#1e88e5', fg: '#fff' },
}

// ── Types ──────────────────────────────────────────────────────────────────

export interface BadgeDef {
  tech: string
  x: number
  y: number
  size?: number
}

interface Props {
  left: number
  bottom: number
  w: number
  h: number
  fill: string
  stroke: string
  grown: boolean
  showLabels: boolean
  badges: BadgeDef[]
}

// ── Tree SVG layers ───────────────────────────────────────────────────────

function TreeShape({ w, h, fill, stroke }: { w: number; h: number; fill: string; stroke: string }) {
  const cx = w / 2
  const trunkW = Math.max(3, w * 0.1)
  const trunkH = h * 0.22
  const trunkTop = h - trunkH

  const layer1Bottom = h * 0.82
  const layer1Top = h * 0.38
  const layer1Left = w * 0.04
  const layer1Right = w * 0.96

  const layer2Bottom = h * 0.62
  const layer2Top = h * 0.18
  const layer2Left = w * 0.14
  const layer2Right = w * 0.86

  const layer3Bottom = h * 0.42
  const layer3Top = h * 0.0
  const layer3Left = w * 0.24
  const layer3Right = w * 0.76

  return (
    <>
      <polygon
        points={`${cx},${layer1Top} ${layer1Left},${layer1Bottom} ${layer1Right},${layer1Bottom}`}
        fill={fill}
        stroke={stroke}
        strokeWidth={0.8}
        strokeLinejoin="round"
      />
      <polygon
        points={`${cx},${layer2Top} ${layer2Left},${layer2Bottom} ${layer2Right},${layer2Bottom}`}
        fill={fill}
        stroke={stroke}
        strokeWidth={0.6}
        strokeLinejoin="round"
        opacity={0.92}
      />
      <polygon
        points={`${cx},${layer3Top} ${layer3Left},${layer3Bottom} ${layer3Right},${layer3Bottom}`}
        fill={fill}
        stroke={stroke}
        strokeWidth={0.5}
        strokeLinejoin="round"
        opacity={0.85}
      />
      <rect
        x={cx - trunkW / 2}
        y={trunkTop}
        width={trunkW}
        height={trunkH}
        fill={stroke}
        rx={1}
      />
    </>
  )
}

// ── Tech badge (icon or text) ──────────────────────────────────────────────

function TechBadge({ tech, size = 32, isHovered }: { tech: string; size?: number; isHovered: boolean }) {
  const slug = ICON_SLUGS[tech]
  const textBadge = TEXT_BADGES[tech]

  const s = isHovered ? size * 1.2 : size

  if (slug) {
    return (
      <motion.div
        animate={{ width: s, height: s }}
        transition={{ duration: 0.2 }}
        style={{
          width: s,
          height: s,
          borderRadius: '50%',
          background: 'white',
          boxShadow: isHovered
            ? '0 2px 8px rgba(0,0,0,0.35)'
            : '0 1px 4px rgba(0,0,0,0.2)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
        }}
      >
        <Image
          src={`${ICON_CDN}/${slug}.svg`}
          alt={tech}
          width={Math.round(s * 0.55)}
          height={Math.round(s * 0.55)}
          style={{ objectFit: 'contain' }}
          onError={(e) => {
            ;(e.target as HTMLImageElement).style.display = 'none'
          }}
        />
        <span
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: Math.max(5, s * 0.27),
            fontWeight: 700,
            fontFamily: 'sans-serif',
            color: '#333',
          }}
        >
          {tech.slice(0, 3)}
        </span>
      </motion.div>
    )
  }

  if (textBadge) {
    return (
      <motion.div
        animate={{ width: s, height: s }}
        transition={{ duration: 0.2 }}
        style={{
          width: s,
          height: s,
          borderRadius: '50%',
          background: textBadge.bg,
          boxShadow: isHovered
            ? '0 2px 8px rgba(0,0,0,0.35)'
            : '0 1px 4px rgba(0,0,0,0.25)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <span
          style={{
            fontSize: Math.max(5.5, s * 0.33),
            fontWeight: 700,
            fontFamily: 'sans-serif',
            color: textBadge.fg,
            lineHeight: 1,
            letterSpacing: -0.2,
          }}
        >
          {textBadge.abbr}
        </span>
      </motion.div>
    )
  }

  return (
    <motion.div
      animate={{ width: s, height: s }}
      transition={{ duration: 0.2 }}
      style={{
        width: s,
        height: s,
        borderRadius: '50%',
        background: '#555',
        boxShadow: isHovered
          ? '0 2px 8px rgba(0,0,0,0.35)'
          : '0 1px 4px rgba(0,0,0,0.25)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <span style={{ fontSize: Math.max(5, s * 0.27), fontWeight: 700, fontFamily: 'sans-serif', color: '#fff' }}>
        {tech.slice(0, 2)}
      </span>
    </motion.div>
  )
}

// ── Bubble tooltip ─────────────────────────────────────────────────────────

function Bubble({ tech, visible, delay = 0 }: { tech: string; visible: boolean; delay?: number }) {
  return (
    <motion.div
      className="absolute pointer-events-none"
      style={{ left: '50%', bottom: '100%', translateX: '-50%', marginBottom: 4 }}
      initial={{ opacity: 0, y: 2 }}
      animate={visible ? { opacity: 1, y: 0 } : { opacity: 0, y: 2 }}
      transition={{ duration: 0.18, delay }}
    >
      <span
        style={{
          display: 'block',
          whiteSpace: 'nowrap',
          fontSize: 12,
          fontFamily: 'sans-serif',
          fontWeight: 600,
          color: '#1e293b',
          background: 'rgba(255,255,255,0.92)',
          backdropFilter: 'blur(4px)',
          borderRadius: 3,
          padding: '4px 10px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.18)',
          lineHeight: 1.3,
        }}
      >
        {tech}
      </span>
    </motion.div>
  )
}

// ── Component ──────────────────────────────────────────────────────────────

export default function GroveTree({ left, bottom, w, h, fill, stroke, grown, showLabels, badges }: Props) {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null)
  const [autoReveal, setAutoReveal] = useState(false)

  useEffect(() => {
    if (showLabels) {
      queueMicrotask(() => setAutoReveal(true))
      const t = setTimeout(() => setAutoReveal(false), 3000)
      return () => clearTimeout(t)
    }
    return undefined
  }, [showLabels])

  return (
    <motion.div
      className="absolute z-[4]"
      style={{ left, bottom, width: w, height: h, transformOrigin: 'bottom center' }}
      initial={{ scaleY: 0 }}
      animate={{ scaleY: grown ? 1 : 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
    >
      {/* Tree SVG */}
      <svg
        width={w}
        height={h}
        viewBox={`0 0 ${w} ${h}`}
        fill="none"
        style={{ display: 'block', transformOrigin: 'bottom center' }}
      >
        <TreeShape w={w} h={h} fill={fill} stroke={stroke} />
      </svg>

      {/* Badge group */}
      <div className="absolute inset-0">
        {badges.map((b, i) => {
          const hovered = hoveredIdx === i
          return (
            <motion.div
              key={b.tech}
              className="absolute"
              style={{
                left: b.x - (b.size ?? 32) / 2,
                top: b.y - (b.size ?? 32) / 2,
                pointerEvents: 'auto',
                cursor: 'default',
              }}
              initial={{ opacity: 0, scale: 0, rotate: 0 }}
              animate={
                showLabels
                  ? { opacity: 1, scale: [0, 1.3, 1], rotate: [0, 180, 360] }
                  : { opacity: 0, scale: 0, rotate: 0 }
              }
              transition={
                showLabels
                  ? { duration: 1.2, delay: i * 0.08 + 0.2, times: [0, 0.25, 1], ease: 'easeOut' }
                  : { duration: 0.2 }
              }
              onMouseEnter={() => setHoveredIdx(i)}
              onMouseLeave={() => setHoveredIdx(null)}
            >
              <TechBadge tech={b.tech} size={b.size ?? 32} isHovered={hovered} />
            </motion.div>
          )
        })}
      </div>

      {/* Bubbles — separate non-rotating layer so text stays upright */}
      {badges.map((b, i) => {
        const showBubble = hoveredIdx === i || autoReveal
        return (
          <div
            key={'bubble-' + b.tech}
            className="absolute pointer-events-none"
            style={{
              left: b.x,
              top: b.y - (b.size ?? 32) / 2 - 6,
              transform: 'translateX(-50%)',
            }}
          >
            <Bubble tech={b.tech} visible={showBubble} delay={autoReveal ? i * 0.08 : 0} />
          </div>
        )
      })}
    </motion.div>
  )
}
