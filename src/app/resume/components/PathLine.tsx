// src/app/resume/components/PathLine.tsx
'use client'
import { motion } from 'framer-motion'
import { ANIMATION_CONFIG, MILESTONES } from '../data/resume'

// Duration covers pathStartDelay through last milestone rising
const PATH_DURATION =
  ANIMATION_CONFIG.pathStartDelay +
  0.1 +
  (MILESTONES.length - 1) * ANIMATION_CONFIG.milestoneInterval

export default function PathLine() {
  return (
    <motion.svg
      className="absolute left-0 z-[5] overflow-visible"
      style={{ width: 2600, height: 4, bottom: 148 }}
      viewBox="0 0 2600 4"
      preserveAspectRatio="none"
    >
      <motion.line
        x1="310" y1="2" x2="2180" y2="2"
        stroke="rgba(255,255,255,0.55)"
        strokeWidth="2.5"
        strokeDasharray="8 5"
        initial={{ strokeDashoffset: 2200 }}
        animate={{ strokeDashoffset: 0 }}
        transition={{
          duration: PATH_DURATION,
          delay: ANIMATION_CONFIG.pathStartDelay,
          ease: 'linear',
        }}
      />
    </motion.svg>
  )
}
