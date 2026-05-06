'use client'
import { motion } from 'framer-motion'
import type { Milestone } from '../data/resume'

type Props = {
  milestone: Milestone
  onClose: () => void
}

export default function CardModal({ milestone, onClose }: Props) {
  return (
    <motion.div
      className="fixed inset-0 z-[400] flex items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

      {/* Card */}
      <motion.div
        className="relative max-w-lg w-[90vw] z-10"
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        transition={{ duration: 0.25, ease: 'easeOut' }}
        onClick={(e) => e.stopPropagation()}
        style={{
          background: 'rgba(8,10,24,0.98)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(99,102,241,0.4)',
          borderRadius: 14,
          padding: 28,
          boxShadow: '0 20px 60px rgba(0,0,0,0.7)',
        }}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-4 cursor-pointer border-0 bg-transparent"
          aria-label="Close"
          style={{ padding: 4, lineHeight: 0 }}
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M5 5L15 15M15 5L5 15" stroke="rgba(255,255,255,0.55)" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </button>

        {/* Date range */}
        <div style={{ color: '#6366f1', fontSize: 11, letterSpacing: 2.5, fontFamily: 'sans-serif', marginBottom: 6, textTransform: 'uppercase' }}>
          {milestone.dateRange}
        </div>

        {/* Role */}
        <div style={{ color: '#f1f5f9', fontSize: 20, fontWeight: 700, marginBottom: 6, lineHeight: 1.3 }}>
          {milestone.role}
        </div>

        {/* Company */}
        <div style={{ color: '#94a3b8', fontSize: 14, fontFamily: 'sans-serif', marginBottom: 14 }}>
          {milestone.company}
        </div>

        {/* Tags */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 14 }}>
          {milestone.tags.map(tag => (
            <span key={tag} style={{
              background: 'rgba(99,102,241,0.18)',
              border: '1px solid rgba(99,102,241,0.35)',
              color: 'rgba(165,180,252,0.95)',
              padding: '4px 10px',
              borderRadius: 5,
              fontSize: 12,
              fontFamily: 'sans-serif',
              fontWeight: 500,
            }}>
              {tag}
            </span>
          ))}
        </div>

        {/* Metric — hero stat */}
        <div style={{
          color: '#a78bfa',
          fontSize: 13,
          fontFamily: 'sans-serif',
          paddingTop: 14,
          borderTop: '1px solid rgba(255,255,255,0.08)',
          lineHeight: 1.5,
        }}>
          {milestone.metric}
        </div>
      </motion.div>
    </motion.div>
  )
}
