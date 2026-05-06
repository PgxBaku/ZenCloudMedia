// src/app/resume/components/MilestoneFlag.tsx
'use client'
import { motion } from 'framer-motion'
import { Milestone, FlagStyle } from '../data/resume'

type FlagTheme = {
  poleBg: string
  flagBg: string
  flagText: string
  flagBorder?: string
  flagShadow?: string
  dotBg: string
  dotBorder: string
  dotShadow?: string
  fontSize?: number
}

const THEMES: Record<FlagStyle, FlagTheme> = {
  slate: {
    poleBg: 'rgba(60,60,100,0.45)',
    flagBg: 'rgba(71,85,105,0.9)', flagText: '#e2e8f0',
    dotBg: '#64748b', dotBorder: '#94a3b8',
  },
  indigo: {
    poleBg: 'rgba(60,60,100,0.45)',
    flagBg: 'rgba(79,70,229,0.9)', flagText: '#e0e7ff',
    dotBg: '#6366f1', dotBorder: '#818cf8',
  },
  violet: {
    poleBg: 'rgba(60,60,100,0.45)',
    flagBg: 'rgba(109,40,217,0.9)', flagText: '#ede9fe',
    dotBg: '#7c3aed', dotBorder: '#a78bfa',
  },
  peak: {
    poleBg: 'rgba(60,60,100,0.45)',
    flagBg: 'linear-gradient(135deg,rgba(139,92,246,0.95),rgba(96,165,250,0.95))',
    flagText: 'white',
    flagShadow: '0 2px 14px rgba(139,92,246,0.4)',
    dotBg: 'linear-gradient(135deg,#a78bfa,#60a5fa)',
    dotBorder: '#c4b5fd',
    dotShadow: '0 0 10px rgba(167,139,250,0.7)',
  },
  amber: {
    poleBg: 'rgba(245,158,11,0.4)',
    flagBg: 'rgba(30,20,5,0.85)', flagText: '#fbbf24',
    flagBorder: '1px solid rgba(245,158,11,0.5)',
    dotBg: '#f59e0b', dotBorder: '#fbbf24',
    dotShadow: '0 0 8px rgba(245,158,11,0.5)',
    fontSize: 10,
  },
}

type Props = {
  milestone: Milestone
  delay: number
  isActive: boolean
  seen: boolean
  showAll: boolean
  onClick?: () => void
}

export default function MilestoneFlag({ milestone, delay, isActive, seen, showAll, onClick }: Props) {
  const theme = THEMES[milestone.flagStyle]
  const cardVisible = seen || isActive || showAll

  return (
    <motion.div
      className="absolute flex flex-col items-center z-10 cursor-pointer group"
      style={{ left: milestone.flagLeft, bottom: milestone.aboveGround ?? 140 }}
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay, ease: 'easeOut' }}
    >
      {/* Detail card — visible when active, after sequence, or on hover */}
      <div
        onClick={onClick}
        className={`absolute bottom-full mb-3 w-56 z-20 transition-all duration-200
          ${cardVisible ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 translate-y-1.5 group-hover:opacity-100 group-hover:translate-y-0 pointer-events-none group-hover:pointer-events-auto'}`}
        style={{
          background: 'rgba(8,10,24,0.96)',
          backdropFilter: 'blur(16px)',
          border: '1px solid rgba(99,102,241,0.35)',
          borderRadius: 10,
          padding: 14,
          boxShadow: '0 12px 40px rgba(0,0,0,0.55)',
        }}
      >
        <div style={{ color: '#6366f1', fontSize: 10, letterSpacing: 2, fontFamily: 'sans-serif', marginBottom: 4 }}>
          {milestone.dateRange}
        </div>
        <div style={{ color: '#f1f5f9', fontSize: 13, fontWeight: 600, marginBottom: 5 }}>{milestone.role}</div>
        <div style={{ color: '#94a3b8', fontSize: 11, fontFamily: 'sans-serif', marginBottom: 8 }}>{milestone.company}</div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginBottom: 8 }}>
          {milestone.tags.map(tag => (
            <span key={tag} style={{
              background: 'rgba(99,102,241,0.15)',
              border: '1px solid rgba(99,102,241,0.3)',
              color: 'rgba(165,180,252,0.9)',
              padding: '2px 7px', borderRadius: 3,
              fontSize: 9, fontFamily: 'sans-serif',
            }}>
              {tag}
            </span>
          ))}
        </div>
        <div style={{
          color: '#a78bfa', fontSize: 10, fontFamily: 'sans-serif',
          paddingTop: 8, borderTop: '1px solid rgba(255,255,255,0.06)',
        }}>
          {milestone.metric}
        </div>
        {/* Caret */}
        <div style={{
          position: 'absolute', top: '100%', left: '50%', transform: 'translateX(-50%)',
          borderWidth: 6, borderStyle: 'solid', borderColor: 'transparent',
          borderTopColor: 'rgba(99,102,241,0.35)',
        }} />
      </div>

      {/* Pole */}
      <div style={{ width: 2, height: milestone.poleHeight, background: theme.poleBg }} />

      {/* Flag label */}
      <div style={{
        padding: '4px 10px',
        borderRadius: 3,
        fontFamily: 'sans-serif',
        fontSize: theme.fontSize ?? 10,
        fontWeight: 700,
        letterSpacing: 1,
        textTransform: 'uppercase',
        marginBottom: 4,
        background: theme.flagBg,
        color: theme.flagText,
        border: theme.flagBorder,
        boxShadow: theme.flagShadow,
      }}>
        {milestone.year}
      </div>

      {/* Dot */}
      <div style={{
        width: 11,
        height: 11,
        borderRadius: '50%',
        marginTop: 4,
        background: theme.dotBg,
        border: `2px solid ${theme.dotBorder}`,
        boxShadow: theme.dotShadow,
      }} />
    </motion.div>
  )
}
