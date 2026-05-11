// src/app/resume/components/FixedHero.tsx
'use client'
import { motion } from 'framer-motion'
import { ANIMATION_CONFIG } from '../data/resume'

type Props = {
  zoomed: boolean
}

export default function FixedHero({ zoomed }: Props) {
  return (
    <motion.div
      className="absolute z-30 pointer-events-none"
      style={{
        left: 'clamp(20px, 6vw, 156px)',
        top: '20%',
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: zoomed ? 0 : 1 }}
      transition={{
        opacity: {
          duration: 1,
          delay: ANIMATION_CONFIG.heroFadeIn + 0.2,
        },
      }}
    >
      <div
        style={{
          color: '#1e3a5f',
          fontSize: 10,
          letterSpacing: 4,
          textTransform: 'uppercase',
          fontFamily: 'sans-serif',
          marginBottom: 8,
          opacity: 0.7,
        }}
      >
        The Journey of
      </div>
      <div
        style={{
          color: '#0f172a',
          fontSize: 'clamp(28px, 5vw, 40px)',
          fontWeight: 300,
          lineHeight: 1.05,
          marginBottom: 6,
        }}
      >
        Paul P.
        <br />
        <strong style={{ fontWeight: 700, color: '#1e40af' }}>Xiong</strong>
      </div>
      <div
        style={{
          color: '#334155',
          fontSize: 'clamp(11px, 1.5vw, 12px)',
          fontFamily: 'sans-serif',
          letterSpacing: 0.5,
          maxWidth: 260,
          lineHeight: 1.5,
        }}
      >
        Automation Architect
        <br />
        &amp; Engineering Leader
      </div>
    </motion.div>
  )
}
