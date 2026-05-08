'use client'
import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import BearScene from './BearScene'
import SheepScene from './SheepScene'

// ── Seeded random ──────────────────────────────────────────────────────────

function sr(seed: number, n: number): number {
  const s = Math.sin(seed + n * 127.1) * 43758.5453
  return s - Math.floor(s)
}


// ── Floating particle ──────────────────────────────────────────────────────

function Particle({ idx }: { idx: number }) {
  const seed = idx * 0.37
  const x = 5 + (seed * 1000) % 90
  const size = 2 + (idx % 3)
  const dur = 3 + (idx % 4)
  const delay = (idx * 0.7) % 5
  return (
    <motion.div
      className="absolute rounded-full pointer-events-none"
      style={{
        left: `${x}%`, bottom: '40%', width: size, height: size,
        background: `rgba(251,191,36,${0.3 + (idx % 3) * 0.2})`,
        boxShadow: `0 0 ${size * 2}px rgba(251,191,36,0.4)`,
      }}
      animate={{ y: [0, -80, -160], opacity: [0, 0.9, 0], scale: [0, 1, 0.5] }}
      transition={{ duration: dur + 2, repeat: Infinity, delay, ease: 'easeOut' }}
    />
  )
}

// ── Per-species base animation params ─────────────────────────────────────
// period is the wing-beat duration at scale=1.0; bobAmp is in SVG px (scaled by container)

const BIRD_BASE = [
  { period: 0.25, bobAmp: 3 },   // Fledgling
  { period: 0.2,  bobAmp: 2 },   // Swallow
  { period: 0.35, bobAmp: 4 },   // Robin
  { period: 0.9,  bobAmp: 2.5 }, // Heron
  { period: 0.28, bobAmp: 3 },   // Parakeet
]

// ── Bird 1: Fledgling ─────────────────────────────────────────────────────
// Round baby bird — oversized head, huge eyes, tiny open beak, short wings

function Fledgling({ period }: { period: number }) {
  return (
    <svg width="64" height="48" viewBox="0 0 64 48" fill="none" style={{ overflow: 'visible' }}>
      <motion.g animate={{ rotate: [-2, 2, -2] }} transition={{ duration: period, repeat: Infinity, ease: 'easeInOut' }} style={{ originX: 30, originY: 22 }}>
        <path d="M30,22 Q18,14 12,18 L10,22 L9,24 Q16,24 30,24 Z" fill="#C87830" />
        <path d="M30,23 Q20,16 14,20 Q18,22 28,24 Z" fill="#D89040" opacity="0.6" />
      </motion.g>
      <motion.g animate={{ rotate: [0, -1.5, 1.5, -1.5, 0] }} transition={{ duration: period * 6, repeat: Infinity, ease: 'easeInOut' }} style={{ originX: 12, originY: 30 }}>
        <path d="M12,30 L4,26 L6,30 L4,34 L12,31 Z" fill="#B86820" />
        <path d="M14,30 L7,27 L8,30 L7,33 L14,31 Z" fill="#C87830" />
      </motion.g>
      <motion.g animate={{ rotate: [-2, 2, -2] }} transition={{ duration: period, repeat: Infinity, ease: 'easeInOut' }} style={{ originX: 30, originY: 24 }}>
        <path d="M30,24 Q16,10 8,16 L6,20 L4,23 L6,23 L5,25 Q14,26 30,26 Z" fill="#C87830" />
        <path d="M30,25 Q20,14 14,18 Q18,22 28,26 Z" fill="#D89040" opacity="0.7" />
      </motion.g>
      <ellipse cx="26" cy="30" rx="14" ry="13" fill="#C87830" />
      <ellipse cx="26" cy="30" rx="12.5" ry="11.5" fill="#D89040" />
      <ellipse cx="27" cy="34" rx="8" ry="5.5" fill="#F5D8A0" opacity="0.9" />
      <motion.g animate={{ y: [0, -0.8, 0], x: [0, 0.5, 0] }} transition={{ duration: period * 2, repeat: Infinity, ease: 'easeInOut' }}>
        <path d="M38,22 C38,20 39,18 40,17 L36,17 C35,18 34,20 32,23 Z" fill="#C87830" />
        <path d="M41,8 C42,5 44,3 44,3 C42,5 43,7 42,8" fill="#B86820" />
        <path d="M44,7 C45,4 47,3 47,3 C45,5 46,6 45,8" fill="#C87830" />
        <circle cx="43" cy="17" r="11" fill="#C87830" />
        <circle cx="43" cy="17" r="10" fill="#D89040" />
        <circle cx="47" cy="13" r="6.5" fill="white" />
        <circle cx="49" cy="12.5" r="4.2" fill="#1a0800" />
        <circle cx="50.4" cy="11.2" r="2" fill="white" />
        <circle cx="48" cy="14" r="1" fill="white" />
        <path d="M45,10 L45.4,11 L46,10.9 L45.4,10.8 L45,10" fill="white" opacity="0.9" />
        <ellipse cx="39" cy="18" rx="4" ry="2.5" fill="#FFB5C5" opacity="0.4" />
        <path d="M53,15 L58,14.5 L53,16.5 Z" fill="#F59E0B" />
        <path d="M53,16.5 L57,18 L53,18.5 Z" fill="#E8880C" />
        <ellipse cx="55" cy="17" rx="1.3" ry="0.9" fill="#FF8888" opacity="0.7" />
      </motion.g>
      <motion.g animate={{ y: [0, 0.6, 0] }} transition={{ duration: period * 2, repeat: Infinity, ease: 'easeInOut' }}>
        <path d="M21,42 L20,44 M20,44 L18,45.5 M20,44 L21,45.5" stroke="#F59E0B" strokeWidth="1" strokeLinecap="round" opacity="0.7" />
        <path d="M31,42 L30,44 M30,44 L28,45.5 M30,44 L31,45.5" stroke="#F59E0B" strokeWidth="1" strokeLinecap="round" opacity="0.7" />
      </motion.g>
    </svg>
  )
}

// ── Bird 2: Swallow ───────────────────────────────────────────────────────
// Sleek, forked tail, long narrow wings, tiny head, rust throat patch

function Swallow({ period }: { period: number }) {
  return (
    <svg width="64" height="48" viewBox="0 0 64 48" fill="none" style={{ overflow: 'visible' }}>
      {/* Far wing — long swept */}
      <motion.g animate={{ rotate: [-2, 2, -2] }} transition={{ duration: period, repeat: Infinity, ease: 'easeInOut' }} style={{ originX: 28, originY: 30 }}>
        <path d="M28,30 C21,25 10,24 5,27 C5,29 10,30 17,31 C21,31 26,31 28,31 Z" fill="#1E2E66" />
        <path d="M28,31 C21,26 12,25 8,27 C8,29 12,30 19,31 Z" fill="#2A3E88" opacity="0.5" />
      </motion.g>
      {/* FORKED tail — most distinctive swallow feature */}
      <motion.g animate={{ rotate: [0, -1, 1, -1, 0] }} transition={{ duration: period * 9, repeat: Infinity, ease: 'easeInOut' }} style={{ originX: 14, originY: 31 }}>
        <path d="M14,29 L2,20 L8,26 Z" fill="#1E2E66" />
        <path d="M13,29 L1,21 L7,27 Z" fill="#2A3E88" />
        <path d="M14,33 L2,42 L8,36 Z" fill="#1E2E66" />
        <path d="M13,33 L1,41 L7,35 Z" fill="#2A3E88" />
        <path d="M12,29 L8,31 L12,33 Z" fill="#1E2E66" />
      </motion.g>
      {/* Near wing — long swept */}
      <motion.g animate={{ rotate: [-2, 2, -2] }} transition={{ duration: period, repeat: Infinity, ease: 'easeInOut' }} style={{ originX: 28, originY: 32 }}>
        <path d="M28,32 C21,27 10,26 5,29 C5,31 10,32 17,33 C21,33 26,33 28,33 Z" fill="#1E2E66" />
        <path d="M28,33 C21,28 12,27 8,29 C8,31 12,32 19,33 Z" fill="#2A3E88" opacity="0.5" />
      </motion.g>
      {/* Streamlined body */}
      <ellipse cx="23" cy="31" rx="17" ry="7" fill="#1E2E66" />
      <ellipse cx="23" cy="31" rx="16" ry="6" fill="#2A3E88" />
      <ellipse cx="26" cy="32" rx="12" ry="4.5" fill="#EEF2FF" />
      {/* Rust/chestnut throat patch */}
      <ellipse cx="36" cy="28" rx="5" ry="3.5" fill="#B84020" opacity="0.85" />
      {/* Small round head */}
      <motion.g animate={{ y: [0, -0.6, 0], x: [0, 0.4, 0] }} transition={{ duration: period * 2, repeat: Infinity, ease: 'easeInOut' }}>
        <path d="M38,26 C40,23 42,21 42,21 L40,21 C38,23 36,24 34,27 Z" fill="#1E2E66" />
        <circle cx="44" cy="21" r="6.5" fill="#14224A" />
        <circle cx="44" cy="21" r="5.8" fill="#1E2E66" />
        <circle cx="47" cy="19" r="3.5" fill="white" />
        <circle cx="48.5" cy="18.5" r="2" fill="#0a0a14" />
        <circle cx="49.3" cy="17.8" r="0.9" fill="white" />
        <path d="M50,19.5 L63,18.5 L50,20.5 Z" fill="#D4A020" />
        <path d="M50,20.5 L61,21 L50,21.5 Z" fill="#B08010" />
      </motion.g>
      <motion.g animate={{ y: [0, 0.5, 0] }} transition={{ duration: period * 2, repeat: Infinity, ease: 'easeInOut' }}>
        <path d="M22,38 L21,40 M21,40 L19,41.5 M21,40 L22,41.5" stroke="#D4A020" strokeWidth="0.9" strokeLinecap="round" opacity="0.6" />
        <path d="M30,38 L29,40 M29,40 L27,41.5 M29,40 L30,41.5" stroke="#D4A020" strokeWidth="0.9" strokeLinecap="round" opacity="0.6" />
      </motion.g>
    </svg>
  )
}

// ── Bird 3: Robin ─────────────────────────────────────────────────────────
// Plump, warm brown, huge orange-red breast patch — most distinctive robin feature

function Robin({ period }: { period: number }) {
  return (
    <svg width="64" height="48" viewBox="0 0 64 48" fill="none" style={{ overflow: 'visible' }}>
      <motion.g animate={{ rotate: [-1, 1, -1] }} transition={{ duration: period, repeat: Infinity, ease: 'easeInOut' }} style={{ originX: 30, originY: 22 }}>
        <path d="M30,22 C24,12 14,10 10,16 C10,20 14,22 20,24 C24,24 28,24 30,24 Z" fill="#4A2C14" />
        <path d="M30,23 C24,14 16,12 12,16 C12,20 16,22 22,24 Z" fill="#6A4228" opacity="0.5" />
      </motion.g>
      <motion.g animate={{ rotate: [0, -1, 1, -1, 0] }} transition={{ duration: period * 4.6, repeat: Infinity, ease: 'easeInOut' }} style={{ originX: 12, originY: 30 }}>
        <path d="M12,28 L4,24 L6,28 L4,32 L12,31 Z" fill="#3A1C08" />
        <path d="M14,30 L6,26 L8,30 L6,34 L14,31 Z" fill="#4A2C14" />
      </motion.g>
      <motion.g animate={{ rotate: [-1, 1, -1] }} transition={{ duration: period, repeat: Infinity, ease: 'easeInOut' }} style={{ originX: 30, originY: 24 }}>
        <path d="M30,24 C24,14 14,12 10,18 C10,22 14,24 20,26 C24,26 28,26 30,26 Z" fill="#4A2C14" />
        <path d="M30,25 C24,16 16,14 12,18 C12,22 16,24 22,26 Z" fill="#6A4228" opacity="0.5" />
      </motion.g>
      {/* Round plump body */}
      <ellipse cx="26" cy="29" rx="15" ry="14" fill="#4A2C14" />
      <ellipse cx="26" cy="29" rx="13.5" ry="12.5" fill="#6A4228" />
      {/* ROBIN BREAST — the defining feature */}
      <ellipse cx="29" cy="33" rx="12" ry="10" fill="#CC5010" opacity="0.95" />
      <ellipse cx="30" cy="34" rx="9" ry="7.5" fill="#E07030" opacity="0.85" />
      <ellipse cx="29" cy="38" rx="6" ry="4" fill="#F8E0D0" opacity="0.5" />
      {/* Head */}
      <motion.g animate={{ y: [0, -0.8, 0], x: [0, 0.4, 0] }} transition={{ duration: period * 2, repeat: Infinity, ease: 'easeInOut' }}>
        <path d="M38,22 C39,18 40,16 41,15 L37,15 C35,18 34,21 32,24 Z" fill="#4A2C14" />
        <circle cx="44" cy="16" r="8.5" fill="#3A1C08" />
        <circle cx="44" cy="16" r="7.5" fill="#4A2C14" />
        {/* Alert bright eye */}
        <circle cx="47" cy="13" r="4.5" fill="white" />
        <circle cx="49" cy="12.5" r="2.8" fill="#080400" />
        <circle cx="50" cy="11.5" r="1.3" fill="white" />
        <circle cx="47.5" cy="14" r="0.7" fill="white" />
        <circle cx="47" cy="13" r="4.8" fill="none" stroke="#806040" strokeWidth="0.5" opacity="0.4" />
        {/* Short stubby beak */}
        <path d="M52,14 L56,14.5 L52,16 Z" fill="#E8A030" />
        <path d="M52,16 L55,17 L52,17.5 Z" fill="#C07820" />
      </motion.g>
      <motion.g animate={{ y: [0, 0.6, 0] }} transition={{ duration: period * 2, repeat: Infinity, ease: 'easeInOut' }}>
        <path d="M22,42 L21,44 M21,44 L19,45.5 M21,44 L22,45.5" stroke="#C07820" strokeWidth="1" strokeLinecap="round" opacity="0.7" />
        <path d="M32,42 L31,44 M31,44 L29,45.5 M31,44 L32,45.5" stroke="#C07820" strokeWidth="1" strokeLinecap="round" opacity="0.7" />
      </motion.g>
    </svg>
  )
}

// ── Bird 4: Heron ─────────────────────────────────────────────────────────
// Elegant, visible S-neck, very long dagger beak, large slow-beating wings

function Heron({ period }: { period: number }) {
  return (
    <svg width="64" height="48" viewBox="0 0 64 48" fill="none" style={{ overflow: 'visible' }}>
      {/* Far wing — same pivot/curve formula, x-span scaled 1.5× for heron wingspan */}
      <motion.g animate={{ rotate: [-1, 1, -1] }} transition={{ duration: period, repeat: Infinity, ease: 'easeInOut' }} style={{ originX: 27, originY: 22 }}>
        <path d="M27,22 C20,17 9,16 3,19 C3,21 6,23 12,24 C18,25 24,24 27,24 Z" fill="#6A8CAA" />
        <path d="M27,23 C20,18 11,17 5,20 C5,22 8,24 14,25 Z" fill="#8AACCB" opacity="0.6" />
      </motion.g>
      {/* Short drooping tail */}
      <motion.g animate={{ rotate: [0, -1, 1, -1, 0] }} transition={{ duration: period * 2.2, repeat: Infinity, ease: 'easeInOut' }} style={{ originX: 14, originY: 28 }}>
        <path d="M14,26 L5,28 L9,30 L5,32 L14,30 Z" fill="#5A7C98" />
        <path d="M12,26 L3,29 L7,31 Z" fill="#6A8CAA" />
      </motion.g>
      {/* Near wing — same 1.5× span, 2px lower */}
      <motion.g animate={{ rotate: [-1, 1, -1] }} transition={{ duration: period, repeat: Infinity, ease: 'easeInOut' }} style={{ originX: 27, originY: 24 }}>
        <path d="M27,24 C20,19 9,18 3,21 C3,23 6,25 12,26 C18,27 24,26 27,26 Z" fill="#6A8CAA" />
        <path d="M27,25 C20,20 11,19 5,22 C5,24 8,26 14,27 Z" fill="#8AACCB" opacity="0.6" />
      </motion.g>
      {/* Lean body, positioned higher */}
      <ellipse cx="24" cy="26" rx="12" ry="8" fill="#6A8CAA" />
      <ellipse cx="24" cy="26" rx="10.5" ry="7" fill="#8AACCB" />
      <ellipse cx="26" cy="27" rx="7" ry="5" fill="#D8EEF8" opacity="0.8" />
      {/* S-curve neck — visible heron feature */}
      <path d="M36,22 C38,18 39,15 40,13 L37,13 C36,15 34,18 32,22 Z" fill="#7A9CBB" />
      <path d="M37,22 C39,18 40,15 41,13 L40,13 C39,15 37,18 35,22 Z" fill="#C8E0F0" opacity="0.4" />
      {/* Small head atop long neck */}
      <motion.g animate={{ y: [0, -0.5, 0], x: [0, 0.3, 0] }} transition={{ duration: period * 2, repeat: Infinity, ease: 'easeInOut' }}>
        <path d="M42,7 C43,4 45,2 45,2 C43,4 44,6 43,7" fill="#4A6C88" />
        <path d="M44,6 C46,3 48,1 48,1 C46,3 47,5 46,6" fill="#5A7C98" />
        <circle cx="44" cy="13" r="6.5" fill="#6A8CAA" />
        <circle cx="44" cy="13" r="5.8" fill="#8AACCB" />
        <circle cx="47" cy="11" r="3.8" fill="#F0F4F8" />
        <circle cx="48.5" cy="10.5" r="2.2" fill="#14140A" />
        <circle cx="49.3" cy="9.8" r="1" fill="white" />
        {/* VERY long dagger beak */}
        <path d="M50,11 L68,9.5 L50,12.5 Z" fill="#4A6A84" />
        <path d="M50,11 L64,9.8 L50,11.8 Z" fill="#A0C0D8" opacity="0.4" />
      </motion.g>
      <motion.g animate={{ y: [0, 0.4, 0] }} transition={{ duration: period * 2, repeat: Infinity, ease: 'easeInOut' }}>
        <path d="M22,34 L20,38 M20,38 L18,40 M20,38 L22,40" stroke="#7A9CBB" strokeWidth="1" strokeLinecap="round" opacity="0.6" />
        <path d="M30,34 L28,38 M28,38 L26,40 M28,38 L30,40" stroke="#7A9CBB" strokeWidth="1" strokeLinecap="round" opacity="0.6" />
      </motion.g>
    </svg>
  )
}

// ── Bird 5: Parakeet ──────────────────────────────────────────────────────
// Green, large head, hooked beak, long graduated tail, cheek patches

function Parakeet({ period }: { period: number }) {
  return (
    <svg width="64" height="48" viewBox="0 0 64 48" fill="none" style={{ overflow: 'visible' }}>
      <motion.g animate={{ rotate: [-1.5, 1.5, -1.5] }} transition={{ duration: period, repeat: Infinity, ease: 'easeInOut' }} style={{ originX: 30, originY: 25 }}>
        <path d="M30,25 C22,13 12,11 8,17 C7,21 10,25 16,27 C22,27 28,27 30,27 Z" fill="#2E8040" />
        <path d="M30,26 C22,15 14,13 10,17 C9,21 12,25 18,27 Z" fill="#46A058" opacity="0.6" />
        <path d="M20,25 C18,17 14,15 12,17 C13,21 16,23 20,25 Z" fill="#1E6830" opacity="0.5" />
      </motion.g>
      {/* Long graduated tail — 3 distinct feathers */}
      <motion.g animate={{ rotate: [0, -1.5, 1.5, -1.5, 0] }} transition={{ duration: period * 5, repeat: Infinity, ease: 'easeInOut' }} style={{ originX: 14, originY: 30 }}>
        <path d="M14,28 L2,18 L7,24 Z" fill="#1E6830" />
        <path d="M12,30 L0,28 L4,31 Z" fill="#166028" />
        <path d="M14,32 L2,40 L7,36 Z" fill="#1E6830" />
        <path d="M13,28 L5,22 L8,25 Z" fill="#5ACC6A" opacity="0.35" />
        <path d="M11,30 L3,30 L5,32 Z" fill="#5ACC6A" opacity="0.35" />
        <path d="M13,32 L5,38 L8,35 Z" fill="#5ACC6A" opacity="0.35" />
      </motion.g>
      <motion.g animate={{ rotate: [-1.5, 1.5, -1.5] }} transition={{ duration: period, repeat: Infinity, ease: 'easeInOut' }} style={{ originX: 30, originY: 27 }}>
        <path d="M30,27 C22,15 12,13 8,19 C7,23 10,27 16,29 C22,29 28,29 30,29 Z" fill="#2E8040" />
        <path d="M30,28 C22,17 14,15 10,19 C9,23 12,27 18,29 Z" fill="#46A058" opacity="0.7" />
        <path d="M20,27 C18,19 14,17 12,19 C13,23 16,25 20,27 Z" fill="#1E6830" opacity="0.5" />
      </motion.g>
      {/* Round body */}
      <ellipse cx="26" cy="30" rx="14" ry="11" fill="#2E8040" />
      <ellipse cx="26" cy="30" rx="12.5" ry="9.5" fill="#46A058" />
      <ellipse cx="27" cy="33" rx="9" ry="7" fill="#B0E8BC" opacity="0.8" />
      {/* Belly barring */}
      <path d="M20,33 Q26,31 34,33" stroke="#2E8040" strokeWidth="0.8" fill="none" opacity="0.4" />
      <path d="M20,35 Q26,33 34,35" stroke="#2E8040" strokeWidth="0.8" fill="none" opacity="0.4" />
      {/* Head */}
      <motion.g animate={{ y: [0, -0.8, 0], x: [0, 0.5, 0] }} transition={{ duration: period * 2, repeat: Infinity, ease: 'easeInOut' }}>
        <path d="M38,22 C38,18 39,16 39,15 L35,15 C34,18 34,21 32,24 Z" fill="#2E8040" />
        <path d="M42,7 C43,4 45,3 45,3 C43,4 44,6 43,7" fill="#1E6830" />
        <path d="M44,6 C46,3 48,2 48,2 C46,3 47,5 46,6" fill="#2E8040" />
        <circle cx="44" cy="15" r="10" fill="#2E8040" />
        <circle cx="44" cy="15" r="9" fill="#46A058" />
        {/* Yellow-green forehead patch */}
        <ellipse cx="40" cy="11" rx="7" ry="4" fill="#88CC44" opacity="0.55" />
        <circle cx="47" cy="13" r="5" fill="white" />
        <circle cx="49" cy="12.5" r="3" fill="#14080A" />
        <circle cx="50.2" cy="11.5" r="1.4" fill="white" />
        <circle cx="47.5" cy="14" r="0.7" fill="white" />
        {/* Blue cheek patch */}
        <ellipse cx="40" cy="18" rx="4" ry="2.5" fill="#3A88CC" opacity="0.5" />
        {/* HOOKED curved beak — key parakeet feature */}
        <path d="M52,12 C55,11 59,13 58,16 C57,17 55,17 53,16 L52,14 Z" fill="#C8A020" />
        <path d="M52,15 C54,15 56,16 55,17 L52,16.5 Z" fill="#A88010" />
        <ellipse cx="52" cy="12.5" rx="2" ry="1.5" fill="#B09028" opacity="0.6" />
      </motion.g>
      <motion.g animate={{ y: [0, 0.6, 0] }} transition={{ duration: period * 2, repeat: Infinity, ease: 'easeInOut' }}>
        <path d="M22,40 L21,42 M21,42 L19,43.5 M21,42 L22,43.5" stroke="#C8A020" strokeWidth="1" strokeLinecap="round" opacity="0.7" />
        <path d="M32,40 L31,42 M31,42 L29,43.5 M31,42 L32,43.5" stroke="#C8A020" strokeWidth="1" strokeLinecap="round" opacity="0.7" />
      </motion.g>
    </svg>
  )
}

// ── Bird roster ────────────────────────────────────────────────────────────

const BIRD_TYPES: React.ComponentType<{ period: number }>[] = [Fledgling, Swallow, Robin, Heron, Parakeet]

// ── Per-bird flight config ─────────────────────────────────────────────────

type BirdConfig = {
  birdIndex: number
  leftKF: string[]
  topKF: string[]
  scale: number
  duration: number
  delay: number
  repeatDelay: number
  flipX: boolean
}

// ── Main page ──────────────────────────────────────────────────────────────

function makeBirds(seed: number): BirdConfig[] {
  return [0, 1, 2, 3, 4].map((i) => {
    const s = (n: number) => sr(seed + i * 13331, n)
    const leftToRight = s(0) > 0.5
    const leftKF = leftToRight
      ? ['-8%', `${18 + s(1) * 18}%`, `${42 + s(2) * 16}%`, `${64 + s(3) * 18}%`, '108%']
      : ['108%', `${64 + s(1) * 18}%`, `${42 + s(2) * 16}%`, `${18 + s(3) * 18}%`, '-8%']
    const topKF = [
      `${8  + s(4) * 34}%`,
      `${6  + s(5) * 36}%`,
      `${10 + s(6) * 32}%`,
      `${7  + s(7) * 35}%`,
      `${9  + s(8) * 33}%`,
    ]
    return {
      birdIndex: i,
      leftKF,
      topKF,
      scale: 0.55 + s(9) * 0.85,
      duration: 5 + s(10) * 4,
      delay: s(11) * 9,
      repeatDelay: 4 + s(12) * 8,
      flipX: !leftToRight,
    }
  })
}

export default function ContactPage() {
  const [birds, setBirds] = useState<BirdConfig[]>([])
  useEffect(() => {
    setBirds(makeBirds(Date.now() % 100000)) // eslint-disable-line react-hooks/set-state-in-effect
  }, [])

  return (
    <main
      className="relative min-h-screen overflow-hidden"
      style={{ background: 'linear-gradient(180deg,#bdd9f5 0%,#cfe2f7 25%,#e8f0f9 55%,#f0f4e8 78%,#e8eed5 100%)' }}
    >
      <motion.div
        className="absolute"
        style={{
          right: '18%', top: '6%', width: 80, height: 80,
          background: 'radial-gradient(circle at 42% 38%,#fefce8,#fef3c7 28%,#fde68a 55%,#f59e0b 100%)',
          borderRadius: '50%',
        }}
        animate={{ rotate: 360 }}
        transition={{ duration: 35, repeat: Infinity, ease: 'linear' }}
      />

      {[
        { w: 90,  h: 26, top: '10%', dur: 50, op: 0.55, leftStart: '5%' },
        { w: 72,  h: 21, top: '14%', dur: 40, op: 0.45, leftStart: '70%' },
        { w: 60,  h: 18, top: '8%',  dur: 55, op: 0.5,  leftStart: '35%' },
        { w: 84,  h: 24, top: '18%', dur: 45, op: 0.4,  leftStart: '90%' },
      ].map((c, i) => (
        <motion.div
          key={i}
          className="absolute"
          style={{ width: c.w, height: c.h, top: c.top, background: 'white', borderRadius: 50, opacity: c.op }}
          animate={{ left: [c.leftStart, '-20%'] }}
          transition={{ duration: c.dur, repeat: Infinity, ease: 'linear' }}
        />
      ))}

      <svg className="absolute bottom-0 w-full" style={{ height: '42%', minWidth: 900 }} viewBox="0 0 1200 340" preserveAspectRatio="none">
        <polygon points="0,340 120,130 250,190 370,80 490,160 600,95 720,170 850,70 970,140 1080,40 1200,100 1200,340" fill="#b8cceb" opacity="0.42" />
        <path d="M0,340 C90,340 150,220 260,230 S390,320 500,300 S630,200 760,210 S900,310 1020,290 S1140,190 1200,200 L1200,340 Z" fill="#8baed4" opacity="0.5" />
        <path d="M0,340 C60,340 100,260 190,265 S310,340 410,320 S540,230 660,240 S790,330 910,310 S1040,220 1160,230 S1200,270 1200,260 L1200,340 Z" fill="#6a99c4" opacity="0.55" />
        <path d="M0,340 L0,290 C55,284 120,298 200,286 S340,258 450,270 S580,294 710,280 S870,248 1000,260 S1120,284 1200,275 L1200,340 Z" fill="#5a8ab0" />
        <rect x="0" y="305" width="1200" height="35" fill="#4a7a9f" />
      </svg>

      {[
        { left: '5%',  bottom: '8%', w: 48, h: 280, delay: 0 },
        { left: '11%', bottom: '9%', w: 40, h: 320, delay: 0.15 },
        { left: '20%', bottom: '7%', w: 44, h: 260, delay: 0.3 },
        { left: '70%', bottom: '6%', w: 46, h: 290, delay: 0.2 },
        { left: '78%', bottom: '8%', w: 38, h: 330, delay: 0.1 },
        { left: '86%', bottom: '5%', w: 50, h: 270, delay: 0.25 },
        { left: '92%', bottom: '9%', w: 36, h: 300, delay: 0.35 },
      ].map((t, i) => (
        <motion.svg
          key={i}
          className="absolute"
          style={{ left: t.left, bottom: t.bottom, width: t.w, height: t.h, transformOrigin: 'bottom center' }}
          viewBox={`0 0 ${t.w} ${t.h}`}
          initial={{ scaleY: 0 }}
          animate={{ scaleY: 1 }}
          transition={{ duration: 0.7, delay: t.delay, ease: 'easeOut' }}
        >
          <polygon points={`${t.w/2},0 ${t.w*.04},${t.h*.52} ${t.w*.96},${t.h*.52}`} fill="#2d5b3f" stroke="#1d3a2e" strokeWidth="0.6" />
          <polygon points={`${t.w/2},${t.h*.10} ${t.w*.12},${t.h*.68} ${t.w*.88},${t.h*.68}`} fill="#2d5b3f" stroke="#1d3a2e" strokeWidth="0.5" opacity="0.93" />
          <polygon points={`${t.w/2},${t.h*.25} ${t.w*.22},${t.h*.85} ${t.w*.78},${t.h*.85}`} fill="#2d5b3f" stroke="#1d3a2e" strokeWidth="0.4" opacity="0.86" />
          <rect x={t.w*.42} y={t.h*.85} width={t.w*.16} height={t.h*.15} fill="#1d3a2e" rx="1.5" />
        </motion.svg>
      ))}

      {Array.from({ length: 10 }, (_, i) => <Particle key={i} idx={i} />)}

      {/* ── Bear ── */}
      <BearScene />

      {/* ── Leaf Sheep ── */}
      <SheepScene />

      {/* ── Flock ── */}
      {birds.map((bird) => {
        const BirdComp = BIRD_TYPES[bird.birdIndex]
        const base = BIRD_BASE[bird.birdIndex]
        const period = base.period * bird.scale
        return (
          <motion.div
            key={bird.birdIndex}
            className="absolute z-40 pointer-events-none"
            style={{ width: 64, height: 48, scale: bird.scale }}
            animate={{ left: bird.leftKF, top: bird.topKF }}
            transition={{
              duration: bird.duration,
              delay: bird.delay,
              ease: 'easeInOut',
              repeat: Infinity,
              repeatDelay: bird.repeatDelay,
              repeatType: 'loop',
            }}
          >
            <motion.div
              animate={{ y: [0, -base.bobAmp, 0, -(base.bobAmp * 0.7), 0] }}
              transition={{ duration: period * 2, repeat: Infinity, ease: 'easeInOut' }}
              style={{ scaleX: bird.flipX ? -1 : 1 }}
            >
              <BirdComp period={period} />
            </motion.div>
          </motion.div>
        )
      })}

      {/* ── Contact card ── */}
      <div className="absolute inset-0 flex flex-col items-center justify-center z-30 px-4" style={{ paddingTop: '2%' }}>
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4, ease: 'easeOut' }}
          style={{
            background: 'rgba(8,10,24,0.94)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(99,102,241,0.35)',
            borderRadius: 14,
            padding: '36px 48px',
            boxShadow: '0 20px 60px rgba(0,0,0,0.5), 0 0 40px rgba(99,102,241,0.08)',
            maxWidth: 400,
          }}
        >
          <div style={{
            display: 'inline-block',
            background: 'rgba(99,102,241,0.15)',
            border: '1px solid rgba(99,102,241,0.3)',
            color: 'rgba(165,180,252,0.9)',
            padding: '3px 12px', borderRadius: 4,
            fontSize: 9, fontFamily: 'sans-serif',
            letterSpacing: 2.5, textTransform: 'uppercase', marginBottom: 18,
          }}>Contact</div>
          <h1 style={{ color: '#f1f5f9', fontSize: 'clamp(18px,3.5vw,24px)', fontWeight: 600, lineHeight: 1.3, marginBottom: 10 }}>
            Available Upon Request
          </h1>
          <p style={{ color: '#94a3b8', fontSize: 12, fontFamily: 'sans-serif', lineHeight: 1.7, marginBottom: 22 }}>
            Please reach out via the email listed on the resume
          </p>
          <div style={{ width: 40, height: 1, background: 'rgba(255,255,255,0.06)', margin: '0 auto 20px' }} />
          <Link
            href="/resume"
            className="inline-block no-underline"
            style={{
              color: 'rgba(165,180,252,0.9)', fontSize: 11, fontFamily: 'sans-serif',
              letterSpacing: 1, padding: '7px 20px', borderRadius: 6,
              border: '1px solid rgba(99,102,241,0.25)', background: 'rgba(99,102,241,0.08)', transition: 'all 0.2s',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(99,102,241,0.16)'; e.currentTarget.style.borderColor = 'rgba(99,102,241,0.45)' }}
            onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(99,102,241,0.08)'; e.currentTarget.style.borderColor = 'rgba(99,102,241,0.25)' }}
          >
            &larr; Back to Resume
          </Link>
        </motion.div>
        <motion.div
          className="mt-6"
          style={{ color: '#64748b', fontSize: 9, fontFamily: 'sans-serif', letterSpacing: 2, textTransform: 'uppercase', opacity: 0.5 }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.5 }}
          transition={{ delay: 0.8, duration: 0.6 }}
        >
          Paul P. Xiong · zencloudweb.com
        </motion.div>
      </div>
    </main>
  )
}
