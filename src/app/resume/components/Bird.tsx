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
export type BirdVariant = 'sparrow' | 'chibi' | 'moe' | 'peach'

type Props = { activeIndex: number; phase: BirdPhase; variant?: BirdVariant }

// ── Chibi anime-style bird SVG ──────────────────────────────────────────────

function ChibiBird({ isPerched }: { isPerched: boolean }) {
  return (
    <svg width="64" height="48" viewBox="0 0 64 48" fill="none" style={{ overflow: 'visible' }}>
      {/* Far wing (behind body) — swept wing with primary feathers */}
      <motion.g
        animate={isPerched ? { rotate: 0 } : { rotate: [-1, 1, -1] }}
        transition={isPerched ? { duration: 0.4 } : { duration: 0.3, repeat: Infinity, ease: 'easeInOut' }}
        style={{ originX: 32, originY: 20 }}
      >
        <path d="M32 20 C24 8, 16 6, 12 12 C13 16, 14 18, 15 20 C14 19, 14 21, 16 22 C20 22, 24 22, 30 23 Z" fill="#7A5C10" />
      </motion.g>

      {/* Tail — tiny tuft */}
      <motion.g
        animate={{ rotate: [0, -1, 1, -1, 0] }}
        transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
        style={{ originX: 16, originY: 28 }}
      >
        <path d="M16 28 L8 24 L10 28 L7 31 L12 30 Z" fill="#8B6914" />
        <path d="M18 28 L10 26 L11 29 L9 31 L14 30 Z" fill="#A0782C" />
      </motion.g>

      {/* Near wing (front) — leading edge + primary feather divisions */}
      <motion.g
        animate={isPerched ? { rotate: 0 } : { rotate: [-1, 1, -1] }}
        transition={isPerched ? { duration: 0.4 } : { duration: 0.3, repeat: Infinity, ease: 'easeInOut' }}
        style={{ originX: 32, originY: 23 }}
      >
        {/* Main wing shape */}
        <path d="M32 23 C22 6, 12 4, 8 12 C9 16, 10 18, 11 21 C10 20, 9 22, 11 23 C10 22, 10 24, 12 24 C16 24, 22 25, 32 26 Z" fill="#7A5C10" />
        {/* Wing coverts — inner feathers near shoulder */}
        <path d="M32 24 C24 14, 18 12, 16 17 C18 21, 22 23, 30 25 Z" fill="#8B6914" opacity="0.7" />
      </motion.g>

      {/* Body — round chibi shape */}
      <ellipse cx="28" cy="30" rx="14" ry="11" fill="#8B6914" />
      <ellipse cx="28" cy="30" rx="12.5" ry="9.5" fill="#A0782C" />
      {/* Cream belly */}
      <ellipse cx="28" cy="34" rx="8" ry="5.5" fill="#F5E0C3" opacity="0.9" />

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
        <path d="M38 22 C38 18, 39 16, 39 15 L34 15 C33 18, 33 22, 32 25 Z" fill="#8B6914" />
        {/* Head tuft */}
        <path d="M42 10 C43 6, 46 4, 46 4 C44 5, 45 8, 44 9" fill="#7A5C10" />
        <path d="M46 9 C49 5, 51 4, 51 4 C49 5, 48 7, 47 9" fill="#8B6914" />
        {/* Head — big round chibi head */}
        <circle cx="44" cy="16" r="9" fill="#8B6914" />
        <circle cx="44" cy="16" r="8" fill="#A0782C" />
        {/* Anime eye — large with dual highlights */}
        <circle cx="47" cy="13.5" r="4.5" fill="white" />
        <circle cx="49" cy="13" r="2.8" fill="#1a1a2e" />
        <circle cx="50.2" cy="11.8" r="1.3" fill="white" />
        <circle cx="47.5" cy="14.5" r="0.6" fill="white" />
        {/* Pink cheek blush */}
        <ellipse cx="41" cy="18" rx="3" ry="1.8" fill="#FFB5C5" opacity="0.6" />
        {/* Tiny beak */}
        <path d="M52 15 L57 16 L52 18.5 Z" fill="#F59E0B" />
      </motion.g>

      {/* Feet — tiny */}
      <motion.g
        animate={isPerched ? { y: 0 } : { y: [0, 0.6, 0] }}
        transition={
          isPerched
            ? { duration: 0.3 }
            : { duration: 0.5, repeat: Infinity, ease: 'easeInOut' }
        }
      >
        <path d="M23 40 L22 42 M22 42 L20 43.5 M22 42 L23 43.5" stroke="#F59E0B" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" opacity={isPerched ? 1 : 0.7} />
        <path d="M33 40 L32 42 M32 42 L30 43.5 M32 42 L33 43.5" stroke="#F59E0B" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" opacity={isPerched ? 1 : 0.7} />
      </motion.g>
    </svg>
  )
}

// ── Moe anime bird SVG (peach fledgling with sparkle eyes) ──────────────────

function MoeBird({ isPerched }: { isPerched: boolean }) {
  return (
    <svg width="64" height="48" viewBox="0 0 64 48" fill="none" style={{ overflow: 'visible' }}>
      {/* Far wing — simple swept wing with primary notches */}
      <motion.g
        animate={isPerched ? { rotate: 0 } : { rotate: [-1, 1, -1] }}
        transition={isPerched ? { duration: 0.4 } : { duration: 0.3, repeat: Infinity, ease: 'easeInOut' }}
        style={{ originX: 32, originY: 20 }}
      >
        {/* Motion trail ghost */}
        <path d="M32 20 Q18 8, 10 16 L8 20 L6 21 L7 20 L5 22 L7 22 Q16 22, 30 23 Z" fill="#FFDDBB" opacity="0.3" />
        {/* Main wing */}
        <path d="M32 20 Q18 8, 10 16 L8 20 L6 21 L7 20 L5 22 L7 22 Q16 22, 30 23 Z" fill="#FFBB99" />
        {/* Coverts */}
        <path d="M32 21 Q22 14, 16 18 Q20 20, 28 22 Z" fill="#FFCCAA" opacity="0.6" />
      </motion.g>

      {/* Tail — tiny peach tuft */}
      <motion.g
        animate={{ rotate: [0, -1, 1, -1, 0] }}
        transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
        style={{ originX: 16, originY: 28 }}
      >
        <path d="M16 28 L7 24 L9 28 L6 31 L11 30 Z" fill="#FFBB99" />
        <path d="M18 28 L9 26 L10 29 L8 31 L13 30 Z" fill="#FFCCAA" />
      </motion.g>

      {/* Near wing — swept wing with 3 primary feather notches */}
      <motion.g
        animate={isPerched ? { rotate: 0 } : { rotate: [-1, 1, -1] }}
        transition={isPerched ? { duration: 0.4 } : { duration: 0.3, repeat: Infinity, ease: 'easeInOut' }}
        style={{ originX: 32, originY: 23 }}
      >
        {/* Motion trail ghost */}
        <path d="M32 23 Q16 6, 8 14 L5 19 L4 21 L5 20 L3 23 L5 24 L4 25 L6 25 Q16 26, 32 27 Z" fill="#FFDDBB" opacity="0.25" />
        {/* Main wing */}
        <path d="M32 23 Q16 6, 8 14 L5 19 L4 21 L5 20 L3 23 L5 24 L4 25 L6 25 Q16 26, 32 27 Z" fill="#FFBB99" />
        {/* Coverts */}
        <path d="M32 24 Q22 14, 14 18 Q18 22, 28 25 Z" fill="#FFCCAA" opacity="0.7" />
        {/* Primary feather separators */}
        <line x1="12" y1="15" x2="5" y2="20" stroke="#FFAA77" strokeWidth="0.5" opacity="0.5" />
        <line x1="10" y1="17" x2="4" y2="23" stroke="#FFAA77" strokeWidth="0.5" opacity="0.5" />
      </motion.g>

      {/* Body — very round peach fledgling */}
      <ellipse cx="28" cy="30" rx="15" ry="12" fill="#FFBB99" />
      <ellipse cx="28" cy="30" rx="13.5" ry="10.5" fill="#FFCCAA" />
      {/* Cream belly */}
      <ellipse cx="28" cy="34" rx="9" ry="6" fill="#FFF5E0" opacity="0.85" />
      {/* Soft belly gradient */}
      <ellipse cx="28" cy="36" rx="6" ry="3.5" fill="#FFFBF0" opacity="0.5" />

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
        {/* Neck */}
        <path d="M38 22 C38 18, 39 16, 39 15 L33 15 C32 18, 33 22, 32 25 Z" fill="#FFBB99" />
        {/* Head tuft — cute ahoge */}
        <path d="M43 10 C44 5, 47 3, 46 3 C44 5, 46 8, 45 9" fill="#FFCCAA" />
        <path d="M46 9 C49 5, 52 3, 51 3 C49 5, 49 7, 48 9" fill="#FFBB99" />
        {/* Head */}
        <circle cx="44" cy="16" r="9.5" fill="#FFBB99" />
        <circle cx="44" cy="16" r="8.5" fill="#FFCCAA" />
        {/* Oversized moe eyes */}
        <circle cx="47.5" cy="13" r="5.2" fill="white" />
        <circle cx="49.5" cy="12.5" r="3.2" fill="#2a1a0a" />
        <circle cx="50.8" cy="11.2" r="1.5" fill="white" />
        <circle cx="48" cy="14" r="0.8" fill="white" />
        {/* Sparkle stars in eye */}
        <path d="M46 10.5 L46.3 11.3 L47 11.2 L46.3 11.1 L46 10.5" fill="white" opacity="0.9" />
        <path d="M52 11 L52.2 11.5 L52.6 11.4 L52.2 11.3 L52 11" fill="white" opacity="0.8" />
        {/* Rosy cheeks */}
        <ellipse cx="40" cy="18" rx="3.5" ry="2" fill="#FFB5C5" opacity="0.5" />
        {/* Tiny beak — open in a happy chirp */}
        <path d="M52.5 15 L57.5 14.5 L52.5 17 Z" fill="#F59E0B" />
        <path d="M52.5 18 L56.5 19 L52.5 20 Z" fill="#FBBF24" />
        {/* Tiny mouth interior */}
        <ellipse cx="54" cy="17.5" rx="1.5" ry="1" fill="#FF8888" opacity="0.6" />
      </motion.g>

      {/* Feet — tiny orange */}
      <motion.g
        animate={isPerched ? { y: 0 } : { y: [0, 0.6, 0] }}
        transition={
          isPerched
            ? { duration: 0.3 }
            : { duration: 0.5, repeat: Infinity, ease: 'easeInOut' }
        }
      >
        <path d="M23 41 L22 43 M22 43 L20 44.5 M22 43 L23 44.5" stroke="#F59E0B" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" opacity={isPerched ? 1 : 0.7} />
        <path d="M33 41 L32 43 M32 43 L30 44.5 M32 43 L33 44.5" stroke="#F59E0B" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" opacity={isPerched ? 1 : 0.7} />
      </motion.g>
    </svg>
  )
}

// ── Sparrow bird SVG (realistic) ────────────────────────────────────────────

function SparrowBird({ isPerched }: { isPerched: boolean }) {
  return (
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
        <path d="M38 20 C40 17, 42 15, 42 14 L36 14 C34 17, 33 20, 32 23 C32 23, 34 22, 38 20 Z" fill="#1e293b" />
        <circle cx="46" cy="15" r="7.5" fill="#1e293b" />
        <circle cx="46" cy="15" r="6.5" fill="#334155" />
        <circle cx="49.5" cy="12.5" r="2.8" fill="white" />
        <circle cx="51" cy="12" r="1.4" fill="#0f172a" />
        <circle cx="51.5" cy="11.5" r="0.5" fill="white" />
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
        <path d="M22 36 L21 39 M21 39 L18 41 M21 39 L20.5 41.5 M21 39 L22.5 41" stroke="#f59e0b" strokeWidth="0.9" strokeLinecap="round" strokeLinejoin="round" opacity={isPerched ? 1 : 0.7} />
        <path d="M34 36 L33 39 M33 39 L30 41 M33 39 L32.5 41.5 M33 39 L34.5 41" stroke="#f59e0b" strokeWidth="0.9" strokeLinecap="round" strokeLinejoin="round" opacity={isPerched ? 1 : 0.7} />
      </motion.g>
    </svg>
  )
}

// ── Peach fledgling (no neck, scalloped wings, sine-wave flap) ──────────────

function PeachFledgling({ isPerched }: { isPerched: boolean }) {
  return (
    <svg width="64" height="48" viewBox="0 0 64 48" fill="none" style={{ overflow: 'visible' }}>
      {/* Tail — tiny peach tuft */}
      <motion.g
        animate={{ rotate: [0, -1, 1, -1, 0] }}
        transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
        style={{ originX: 12, originY: 30 }}
      >
        <path d="M12 30 L4 26 L6 30 L3 33 L8 32 Z" fill="#FFCCAA" stroke="#C49A7C" strokeWidth="0.6" />
        <path d="M14 30 L6 28 L7 31 L5 33 L9 32 Z" fill="#FFDDBB" stroke="#C49A7C" strokeWidth="0.6" />
      </motion.g>

      {/* Far wing (bird's right wing, behind body) — pivots from left-center of wing element */}
      <motion.g
        animate={isPerched ? { rotate: 0 } : { rotate: [-30, 40, -30] }}
        transition={isPerched ? { duration: 0.4 } : { duration: 0.55, repeat: Infinity, ease: 'easeInOut' }}
        style={{ originX: 0, originY: '50%' }}
      >
        <g transform="translate(26, 22)">
          <path
            d="M0 0 Q-8 -18, -20 -16 Q-24 -15, -26 -10 Q-24 -8, -22 -9 Q-20 -6, -22 -4 Q-24 -2, -22 0 Q-24 2, -22 4 Q-24 6, -22 8 Q-24 10, -20 12 Q-16 14, -10 13 Q-4 10, 0 2 Z"
            fill="#FFCCAA"
            stroke="#C49A7C"
            strokeWidth="0.7"
          />
          {/* Scallop line accents */}
          <path d="M-22 -9 Q-18 -7, -16 -8" stroke="#D4A07A" strokeWidth="0.4" fill="none" />
          <path d="M-22 0 Q-18 1, -16 0" stroke="#D4A07A" strokeWidth="0.4" fill="none" />
          <path d="M-22 8 Q-18 10, -14 9" stroke="#D4A07A" strokeWidth="0.4" fill="none" />
        </g>
      </motion.g>

      {/* Body — horizontal ovoid, no neck */}
      <ellipse cx="28" cy="31" rx="18" ry="12" fill="#FFCCAA" stroke="#C49A7C" strokeWidth="0.7" />
      <ellipse cx="28" cy="31" rx="17" ry="11" fill="#FFDDCC" />
      {/* Cream belly */}
      <ellipse cx="28" cy="35" rx="10" ry="6" fill="#FFF5E0" opacity="0.85" />
      <ellipse cx="28" cy="37" rx="7" ry="3.5" fill="#FFFBF5" opacity="0.5" />

      {/* Head — directly atop body, no neck separation */}
      <motion.g
        animate={
          isPerched
            ? { y: [0, -0.3, 0], x: [0, 0.2, 0] }
            : { y: [0, -0.6, 0], x: [0, 0.4, 0] }
        }
        transition={
          isPerched
            ? { duration: 1, repeat: Infinity, ease: 'easeInOut' }
            : { duration: 0.5, repeat: Infinity, ease: 'easeInOut' }
        }
      >
        {/* Head tuft — cute ahoge */}
        <path d="M43 7 C44 2, 47 0, 46 0 C44 2, 46 5, 45 6" fill="#FFCCAA" stroke="#C49A7C" strokeWidth="0.5" />
        <path d="M46 6 C49 2, 52 0, 51 0 C49 2, 49 4, 48 6" fill="#FFDDBB" stroke="#C49A7C" strokeWidth="0.5" />
        {/* Head circle — merges into body */}
        <circle cx="44" cy="16" r="9.5" fill="#FFCCAA" stroke="#C49A7C" strokeWidth="0.7" />
        <circle cx="44" cy="16" r="8.5" fill="#FFDDCC" />
        {/* Oversized moe eyes */}
        <circle cx="47.5" cy="13" r="5.2" fill="white" stroke="#C49A7C" strokeWidth="0.5" />
        <circle cx="49.5" cy="12.5" r="3.2" fill="#2a1a0a" />
        <circle cx="50.8" cy="11.2" r="1.5" fill="white" />
        <circle cx="48" cy="14" r="0.8" fill="white" />
        {/* Sparkle stars */}
        <path d="M46 10.5 L46.3 11.3 L47 11.2 L46.3 11.1 L46 10.5" fill="white" opacity="0.9" />
        <path d="M52 11 L52.2 11.5 L52.6 11.4 L52.2 11.3 L52 11" fill="white" opacity="0.8" />
        {/* Rosy cheeks */}
        <ellipse cx="40" cy="18" rx="3.5" ry="2" fill="#FFB5C5" opacity="0.5" />
        {/* Tiny triangle beak */}
        <path d="M52.5 15 L57.5 14.5 L52.5 17 Z" fill="#F59E0B" stroke="#C49A7C" strokeWidth="0.4" />
        <path d="M52.5 18 L56.5 19 L52.5 20 Z" fill="#FBBF24" stroke="#C49A7C" strokeWidth="0.4" />
        <ellipse cx="54" cy="17.5" rx="1.5" ry="1" fill="#FF8888" opacity="0.6" />
      </motion.g>

      {/* Near wing (bird's left wing, in front of body) — pivots from right-center of wing element */}
      <motion.g
        animate={isPerched ? { rotate: 0 } : { rotate: [-30, 40, -30] }}
        transition={isPerched ? { duration: 0.4 } : { duration: 0.55, repeat: Infinity, ease: 'easeInOut' }}
        style={{ originX: '100%', originY: '50%' }}
      >
        <g transform="translate(28, 24)">
          <path
            d="M0 0 Q-6 -16, -18 -14 Q-22 -13, -24 -8 Q-22 -6, -20 -7 Q-18 -4, -20 -2 Q-22 0, -20 2 Q-22 4, -20 6 Q-22 8, -20 10 Q-16 12, -10 11 Q-4 8, 0 1 Z"
            fill="#FFCCAA"
            stroke="#C49A7C"
            strokeWidth="0.7"
          />
          {/* Coverts */}
          <path d="M0 0 Q-4 -8, -10 -7 Q-2 -3, 0 2 Z" fill="#FFDDCC" opacity="0.6" />
          {/* Scallop line accents */}
          <path d="M-20 -7 Q-16 -5, -14 -6" stroke="#D4A07A" strokeWidth="0.4" fill="none" />
          <path d="M-20 2 Q-16 3, -14 2" stroke="#D4A07A" strokeWidth="0.4" fill="none" />
          <path d="M-20 10 Q-16 12, -12 10" stroke="#D4A07A" strokeWidth="0.4" fill="none" />
        </g>
      </motion.g>

      {/* Feet — tiny at bottom right of body */}
      <motion.g
        animate={isPerched ? { y: 0 } : { y: [0, 0.6, 0] }}
        transition={
          isPerched
            ? { duration: 0.3 }
            : { duration: 0.5, repeat: Infinity, ease: 'easeInOut' }
        }
      >
        <path d="M22 42 L21 44 M21 44 L19 45.5 M21 44 L22 45.5" stroke="#F59E0B" strokeWidth="0.9" strokeLinecap="round" strokeLinejoin="round" opacity={isPerched ? 1 : 0.7} />
        <path d="M32 42 L31 44 M31 44 L29 45.5 M31 44 L32 45.5" stroke="#F59E0B" strokeWidth="0.9" strokeLinecap="round" strokeLinejoin="round" opacity={isPerched ? 1 : 0.7} />
      </motion.g>
    </svg>
  )
}

const FLIGHT_SEED = Math.floor(Date.now() % 100000)

// ── Main Bird component ─────────────────────────────────────────────────────

export default function Bird({ activeIndex, phase, variant = 'moe' }: Props) {
  const [scope, animate] = useAnimate()
  const prevIndex = useRef(activeIndex)

  const positions = useMemo(
    () => [...MILESTONES.map((_, i) => getFlagTop(i)), STAR],
    [],
  )

  const flightPaths = useMemo(() => {
    const all: Pt[][] = []
    all.push(generateWaypoints({ x: -60, y: positions[0].y }, positions[0], FLIGHT_SEED))
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

  useEffect(() => {
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

  useEffect(() => {
    if (activeIndex < 0) return
    const t = positions[activeIndex] ?? positions[positions.length - 1]
    animate(scope.current, { bottom: t.y + (isPerched ? 0 : 8) }, { duration: 0.35 })
  }, [isPerched]) // eslint-disable-line react-hooks/exhaustive-deps

  const BirdArt = variant === 'sparrow' ? SparrowBird : variant === 'chibi' ? ChibiBird : variant === 'peach' ? PeachFledgling : MoeBird

  return (
    <motion.div
      ref={scope}
      className="absolute z-30 pointer-events-none"
      style={{ width: 64, height: 48 }}
    >
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
          <BirdArt isPerched={isPerched} />
        </motion.div>
      </motion.div>
    </motion.div>
  )
}
