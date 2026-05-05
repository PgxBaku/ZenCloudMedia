// src/app/resume/components/TerrainScene.tsx
'use client'
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import PathLine from './PathLine'
import MilestoneFlag from './MilestoneFlag'
import { ANIMATION_CONFIG, MILESTONES } from '../data/resume'

type Props = {
  onResumeReveal: () => void
  onProgress: (pct: number, label: string) => void
}

export default function TerrainScene({ onResumeReveal, onProgress }: Props) {
  const [zoomed, setZoomed] = useState(false)
  const [scale, setScale] = useState(() =>
    typeof window === 'undefined' ? 1 : window.innerWidth / 2600
  )

  useEffect(() => {
    const activeTimers: ReturnType<typeof setTimeout>[] = []
    const addTimer = (fn: () => void, ms: number) => {
      activeTimers.push(setTimeout(fn, ms))
    }
    const updateScale = () => setScale(window.innerWidth / 2600)

    window.addEventListener('resize', updateScale)
    const cfg = ANIMATION_CONFIG

    // Progress update for each milestone
    MILESTONES.forEach((m, i) => {
      const ms = (cfg.pathStartDelay + 0.1 + i * cfg.milestoneInterval) * 1000
      addTimer(() => onProgress(Math.round(((i + 1) / MILESTONES.length) * 80), m.year), ms)
    })

    // Zoom-out trigger
    const lastMs = (cfg.pathStartDelay + 0.1 + (MILESTONES.length - 1) * cfg.milestoneInterval) * 1000
    const zoomMs = lastMs + cfg.zoomOutDelay * 1000
    addTimer(() => {
      onProgress(92, 'Summit reached')
      setZoomed(true)
    }, zoomMs)

    // Reveal resume
    const revealMs = zoomMs + (cfg.zoomOutDuration + cfg.resumeRevealDelay) * 1000
    addTimer(() => {
      onProgress(100, 'Full resume')
      onResumeReveal()
    }, revealMs)

    return () => {
      window.removeEventListener('resize', updateScale)
      activeTimers.forEach(clearTimeout)
    }
  }, [onProgress, onResumeReveal])

  const milestoneDelays = MILESTONES.map(
    (_, i) => ANIMATION_CONFIG.pathStartDelay + 0.1 + i * ANIMATION_CONFIG.milestoneInterval
  )

  const destDelay =
    ANIMATION_CONFIG.pathStartDelay +
    0.1 +
    (MILESTONES.length - 1) * ANIMATION_CONFIG.milestoneInterval +
    ANIMATION_CONFIG.zoomOutDelay * 0.4

  return (
    <section
      className="relative h-screen overflow-hidden"
      style={{ background: 'linear-gradient(180deg,#bfdbfe 0%,#dbeafe 35%,#eff6ff 65%,#f0fdf4 85%,#dcfce7 100%)' }}
    >
      {/* 2600px world that zooms out */}
      <div
        style={{
          width: 2600,
          height: '100%',
          position: 'relative',
          transformOrigin: 'left center',
          willChange: 'transform',
          transform: zoomed ? `scale(${scale})` : 'scale(1)',
          transition: zoomed
            ? `transform ${ANIMATION_CONFIG.zoomOutDuration}s cubic-bezier(0.77,0,0.175,1)`
            : 'none',
        }}
      >
        {/* Sun */}
        <div className="absolute" style={{
          right: 280, top: 36, width: 56, height: 56,
          background: 'radial-gradient(circle,#fef3c7,#fde68a,#fbbf24)',
          borderRadius: '50%',
          boxShadow: '0 0 40px rgba(251,191,36,0.5),0 0 100px rgba(251,191,36,0.15)',
        }} />

        {/* Clouds */}
        {[
          { w: 88, h: 28, top: 65, left: 420, op: 0.75 },
          { w: 56, h: 20, top: 55, left: 462, op: 0.7 },
          { w: 72, h: 24, top: 80, left: 720, op: 0.5 },
          { w: 96, h: 30, top: 52, left: 1120, op: 0.6 },
          { w: 60, h: 22, top: 66, left: 1172, op: 0.55 },
          { w: 76, h: 26, top: 75, left: 1650, op: 0.4 },
          { w: 52, h: 18, top: 86, left: 1920, op: 0.45 },
        ].map((c, i) => (
          <div key={i} className="absolute" style={{
            width: c.w, height: c.h, top: c.top, left: c.left,
            background: 'white', borderRadius: 50, opacity: c.op,
          }} />
        ))}

        {/* Far mountains */}
        <svg className="absolute left-0" style={{ width: 2600, height: 280, bottom: 118 }}
          viewBox="0 0 2600 280" preserveAspectRatio="none">
          <polygon
            points="0,280 160,80 320,160 510,40 690,130 870,60 1060,150 1220,50 1400,120 1600,30 1770,100 1940,20 2100,90 2280,10 2450,70 2600,40 2600,280"
            fill="#c7d9f0" opacity="0.45"
          />
          <polygon
            points="0,280 210,120 400,180 580,90 740,160 950,80 1160,170 1320,70 1530,140 1680,50 1840,110 2010,40 2200,120 2400,60 2600,80 2600,280"
            fill="#b8cceb" opacity="0.35"
          />
        </svg>

        {/* Mid hills */}
        <svg className="absolute left-0" style={{ width: 2600, height: 210, bottom: 98 }}
          viewBox="0 0 2600 210" preserveAspectRatio="none">
          <path
            d="M0,210 C110,210 160,120 270,132 S430,188 540,168 S700,92 840,104 S1020,168 1130,148 S1300,72 1470,84 S1640,148 1770,116 S1960,50 2130,64 S2300,128 2470,86 S2560,52 2600,64 L2600,210 Z"
            fill="#9ab8d8" opacity="0.55"
          />
          <path
            d="M0,210 C86,210 130,158 216,162 S378,210 486,194 S624,136 754,148 S928,210 1040,188 S1192,126 1326,138 S1504,190 1634,168 S1802,106 1950,118 S2120,168 2270,148 S2440,96 2600,108 L2600,210 Z"
            fill="#7a9ec4" opacity="0.45"
          />
        </svg>

        {/* Near terrain */}
        <svg className="absolute left-0" style={{ width: 2600, height: 190, bottom: 0 }}
          viewBox="0 0 2600 190" preserveAspectRatio="none">
          <path
            d="M0,190 L0,138 C86,132 162,148 258,136 S410,106 518,118 S648,152 776,138 S938,100 1076,112 S1240,148 1380,126 S1566,84 1730,100 S1920,142 2072,116 S2272,72 2440,90 S2550,106 2600,96 L2600,190 Z"
            fill="#5a8ab0"
          />
          <rect x="0" y="158" width="2600" height="32" fill="#4a7a9f" />
        </svg>

        {/* Trees */}
        {[
          { left: 560, bottom: 100, w: 16, h: 32, fill: '#3d6b4f', op: 0.7 },
          { left: 584, bottom: 101, w: 12, h: 26, fill: '#3d6b4f', op: 0.6 },
          { left: 900, bottom: 104, w: 18, h: 36, fill: '#2d5b3f', op: 0.7 },
          { left: 1280, bottom: 108, w: 20, h: 40, fill: '#2d4a3e', op: 0.8 },
          { left: 1310, bottom: 107, w: 14, h: 28, fill: '#2d4a3e', op: 0.6 },
        ].map((t, i) => (
          <div key={i} className="absolute z-[6]" style={{ left: t.left, bottom: t.bottom }}>
            <svg width={t.w} height={t.h} viewBox={`0 0 ${t.w} ${t.h}`}>
              <polygon
                points={`${t.w/2},0 ${t.w},${t.h*0.55} ${t.w*0.72},${t.h*0.55} ${t.w*0.78},${t.h} ${t.w*0.22},${t.h} ${t.w*0.28},${t.h*0.55} 0,${t.h*0.55}`}
                fill={t.fill} opacity={t.op}
              />
            </svg>
          </div>
        ))}

        {/* Animated path */}
        <PathLine />

        {/* Hero */}
        <motion.div
          className="absolute z-20"
          style={{ left: 56, top: '50%', translateY: '-60%' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: ANIMATION_CONFIG.heroFadeIn + 0.2 }}
        >
          <div style={{ color: '#1e3a5f', fontSize: 10, letterSpacing: 4, textTransform: 'uppercase', fontFamily: 'sans-serif', marginBottom: 8, opacity: 0.7 }}>
            The Journey of
          </div>
          <div style={{ color: '#0f172a', fontSize: 40, fontWeight: 300, lineHeight: 1.05, marginBottom: 6 }}>
            Paul P.<br />
            <strong style={{ fontWeight: 700, color: '#1e40af' }}>Xiong</strong>
          </div>
          <div style={{ color: '#334155', fontSize: 12, fontFamily: 'sans-serif', letterSpacing: 0.5, maxWidth: 250, lineHeight: 1.5 }}>
            Engineering Manager<br />with deep AI capability
          </div>
        </motion.div>

        {/* Milestone flags */}
        {MILESTONES.map((m, i) => (
          <MilestoneFlag key={m.id} milestone={m} delay={milestoneDelays[i]} />
        ))}

        {/* Destination */}
        <motion.div
          className="absolute z-20 text-center"
          style={{ right: 90, top: '38%', translateY: '-50%' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: destDelay }}
        >
          <div style={{ width: 70, height: 70, borderRadius: '50%', background: 'radial-gradient(circle,rgba(251,191,36,0.35),transparent 70%)', margin: '0 auto 10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ fontSize: 28 }}>★</span>
          </div>
          <div style={{ color: '#92400e', fontSize: 10, letterSpacing: 3, fontFamily: 'sans-serif', textTransform: 'uppercase' }}>Next Summit</div>
          <div style={{ color: '#78350f', fontSize: 12, fontWeight: 600, marginTop: 4, lineHeight: 1.4 }}>
            Engineering Manager<br />with AI Expertise
          </div>
        </motion.div>
      </div>
    </section>
  )
}
