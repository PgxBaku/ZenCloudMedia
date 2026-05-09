// src/app/resume/components/TerrainScene.tsx
'use client'
import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import PathLine from './PathLine'
import MilestoneFlag from './MilestoneFlag'
import Bird, { type BirdPhase } from './Bird'
import GroveTree from './GroveTree'
import CardModal from './CardModal'
import FixedHero from './FixedHero'
import { ANIMATION_CONFIG, MILESTONES } from '../data/resume'

const USE_FIXED_HERO = false // flip to true to use fixed-position hero

type Props = {
  onResumeReveal: () => void
  onProgress: (pct: number, label: string) => void
}

export default function TerrainScene({ onResumeReveal, onProgress }: Props) {
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768
  const [zoomed, setZoomed] = useState(false)
  const [activeIndex, setActiveIndex] = useState(-1)
  const [birdTargetIndex, setBirdTargetIndex] = useState(-1)
  const [seenIndices, setSeenIndices] = useState<Set<number>>(new Set())
  const [showAllCards, setShowAllCards] = useState(false)
  const [starVisible, setStarVisible] = useState(false)
  const [birdPhase, setBirdPhase] = useState<BirdPhase>('flying')
  const [skipMode, setSkipMode] = useState(false)
  const [focusedMilestone, setFocusedMilestone] = useState<number | null>(null)
  const [scale, setScale] = useState(() =>
    typeof window === 'undefined' ? 1 : window.innerWidth / 2600
  )
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([])

  // Pan target tracks the bird — adapts to any viewport size
  const panTarget = (() => {
    if (birdTargetIndex < 0) return 0
    const idx = Math.min(birdTargetIndex, MILESTONES.length)
    const x = idx >= MILESTONES.length ? 2200 : MILESTONES[idx].flagLeft
    return Math.max(0, x - window.innerWidth * 0.55)
  })()

  function skipToEnd() {
    timersRef.current.forEach(clearTimeout)
    timersRef.current = []
    const allSeen = new Set(MILESTONES.map((_, i) => i))
    setSeenIndices(allSeen)
    setActiveIndex(MILESTONES.length - 1)
    setBirdTargetIndex(MILESTONES.length)
    setBirdPhase('perched')
    setZoomed(true)
    setStarVisible(true)
    setShowAllCards(true)
    setSkipMode(true)
    onResumeReveal()
  }

  // Auto-skip via URL hash: /resume#skipanimation
  useEffect(() => {
    if (window.location.hash === '#skipanimation') {
      queueMicrotask(() => skipToEnd())
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    const activeTimers: ReturnType<typeof setTimeout>[] = []
    timersRef.current = activeTimers
    const addTimer = (fn: () => void, ms: number) => {
      activeTimers.push(setTimeout(fn, ms))
    }
    if (isMobile) {
      onProgress(100, 'Full resume')
      return
    }

    const updateScale = () => setScale(window.innerWidth / 2600)

    window.addEventListener('resize', updateScale)
    const cfg = ANIMATION_CONFIG

    // Bird flights — lead cards by ~1s so the viewer sees something coming
    MILESTONES.forEach((_, i) => {
      const cardMs = (cfg.pathStartDelay + 0.1 + i * cfg.milestoneInterval) * 1000
      const birdMs = Math.max(0.15, cardMs - 1000)
      addTimer(() => setBirdTargetIndex(i), birdMs)
    })

    // Progress + active card for each milestone
    MILESTONES.forEach((m, i) => {
      const ms = (cfg.pathStartDelay + 0.1 + i * cfg.milestoneInterval) * 1000
      addTimer(() => {
        onProgress(Math.round(((i + 1) / MILESTONES.length) * 80), m.year)
        setActiveIndex(i)
        setSeenIndices(prev => new Set(prev).add(i))
      }, ms)
    })

    // Star appears alongside the last milestone (starAppearDelay offset from it)
    const starShowMs = (cfg.pathStartDelay + 0.1 + (MILESTONES.length - 1) * cfg.milestoneInterval + cfg.starAppearDelay) * 1000
    addTimer(() => setStarVisible(true), starShowMs)

    // Zoom-out trigger
    const lastMs = (cfg.pathStartDelay + 0.1 + (MILESTONES.length - 1) * cfg.milestoneInterval) * 1000
    const zoomMs = lastMs + cfg.zoomOutDelay * 1000
    addTimer(() => {
      onProgress(92, 'Summit reached')
      setZoomed(true)
    }, zoomMs)

    // Reveal resume + show all cards
    const revealMs = zoomMs + (cfg.zoomOutDuration + cfg.resumeRevealDelay) * 1000
    addTimer(() => {
      onProgress(100, 'Full resume')
      setShowAllCards(true)
      onResumeReveal()
    }, revealMs)

    // Bird flies to the star when it appears
    const destSec = cfg.pathStartDelay + 0.1 + (MILESTONES.length - 1) * cfg.milestoneInterval + cfg.zoomOutDelay * 0.4
    const starMs = destSec * 1000
    addTimer(() => setBirdTargetIndex(MILESTONES.length), starMs)
    addTimer(() => setBirdPhase('circling'), starMs + 800)
    addTimer(() => setBirdPhase('perched'), starMs + 3000)

    return () => {
      window.removeEventListener('resize', updateScale)
      activeTimers.forEach(clearTimeout)
    }
  }, [onProgress, onResumeReveal])

  if (isMobile) return null

  const milestoneDelays = MILESTONES.map(
    (_, i) => ANIMATION_CONFIG.pathStartDelay + 0.1 + i * ANIMATION_CONFIG.milestoneInterval
  )

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
          transform: zoomed
            ? `scale(${scale})`
            : panTarget > 0
              ? `translateX(-${panTarget}px)`
              : 'scale(1)',
          transition: zoomed
            ? `transform ${ANIMATION_CONFIG.zoomOutDuration}s cubic-bezier(0.77,0,0.175,1)`
            : 'transform 1.5s ease-in-out',
        }}
      >
        {/* Sun — rotating with pulsing glow */}
        <motion.div
          className="absolute"
          style={{
            right: 260, top: 20, width: 88, height: 88,
            background: 'radial-gradient(circle at 40% 35%,#fefce8,#fef3c7 30%,#fde68a 60%,#f59e0b 100%)',
            borderRadius: '50%',
          }}
          animate={{
            rotate: 360,
            boxShadow: [
              '0 0 50px rgba(251,191,36,0.5),0 0 140px rgba(251,191,36,0.15)',
              '0 0 70px rgba(251,191,36,0.7),0 0 180px rgba(251,191,36,0.25)',
              '0 0 50px rgba(251,191,36,0.5),0 0 140px rgba(251,191,36,0.15)',
            ],
          }}
          transition={{
            rotate: { duration: 30, repeat: Infinity, ease: 'linear' },
            boxShadow: { duration: 3, repeat: Infinity, ease: 'easeInOut' },
          }}
        />

        {/* Sun rays */}
        <motion.div
          className="absolute"
          style={{
            right: 262, top: 22, width: 84, height: 84,
            borderRadius: '50%',
            background: 'conic-gradient(from 0deg,transparent 0deg,rgba(253,224,71,0.3) 15deg,transparent 30deg,transparent 90deg,rgba(253,224,71,0.3) 105deg,transparent 120deg,transparent 180deg,rgba(253,224,71,0.3) 195deg,transparent 210deg,transparent 270deg,rgba(253,224,71,0.3) 285deg,transparent 300deg,transparent 360deg)',
          }}
          animate={{ rotate: 360 }}
          transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
        />

        {/* Clouds */}
        {[
          // Left bleed
          { w: 64, h: 22, top: 72, left: -180, op: 0.5 },
          { w: 80, h: 26, top: 58, left: 100, op: 0.55 },
          // Main clouds
          { w: 88, h: 28, top: 65, left: 420, op: 0.75 },
          { w: 56, h: 20, top: 55, left: 462, op: 0.7 },
          { w: 72, h: 24, top: 80, left: 720, op: 0.5 },
          { w: 96, h: 30, top: 52, left: 1120, op: 0.6 },
          { w: 60, h: 22, top: 66, left: 1172, op: 0.55 },
          { w: 76, h: 26, top: 75, left: 1650, op: 0.4 },
          { w: 52, h: 18, top: 86, left: 1920, op: 0.45 },
          // Right bleed
          { w: 70, h: 24, top: 60, left: 2300, op: 0.45 },
          { w: 88, h: 28, top: 78, left: 2500, op: 0.35 },
          { w: 56, h: 20, top: 68, left: 2720, op: 0.3 },
          { w: 74, h: 25, top: 55, left: 2950, op: 0.25 },
        ].map((c, i) => (
          <div key={i} className="absolute" style={{
            width: c.w, height: c.h, top: c.top, left: c.left,
            background: 'white', borderRadius: 50, opacity: c.op,
          }} />
        ))}

        {/* Far mountains */}
        <svg className="absolute" style={{ width: 3400, height: 280, bottom: 118, left: -400 }}
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
        <svg className="absolute" style={{ width: 3400, height: 210, bottom: 98, left: -400 }}
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
        <svg className="absolute" style={{ width: 3400, height: 190, bottom: 0, left: -400 }}
          viewBox="0 0 2600 190" preserveAspectRatio="none">
          <path
            d="M0,190 L0,138 C86,132 162,148 258,136 S410,106 518,118 S648,152 776,138 S938,100 1076,112 S1240,148 1380,126 S1566,84 1730,100 S1920,142 2072,116 S2272,72 2440,90 S2550,106 2600,96 L2600,190 Z"
            fill="#5a8ab0"
          />
          <rect x="0" y="158" width="2600" height="32" fill="#4a7a9f" />
        </svg>

        {/* Background grove trees — tall pines that grow as bird reaches each milestone */}
        {(() => {
          const TREES = [
            // ── Milestone 0: 2017 Sr Engineer ──
            { left: 410, bottom: 100, w: 72, h: 550, fill: '#2d5b3f', stroke: '#1d3a2e', milestone: 0, badges: [
              { tech: 'CI/CD', x: 22, y: 42 },
              { tech: '.NET / C#', x: 48, y: 74 },
              { tech: 'SQL Server', x: 28, y: 115 },
            ]},
            // ── Milestone 1: 2020 Solutions Architect ──
            { left: 710, bottom: 98, w: 80, h: 210, fill: '#2d4a3e', stroke: '#1d3a2e', milestone: 1, badges: [
              { tech: 'Power BI', x: 22, y: 52 },
              { tech: 'ADO', x: 54, y: 82 },
              { tech: 'MuleSoft', x: 32, y: 115 },
              { tech: 'CloudHub 2.0', x: 56, y: 132 },
            ]},
            // ── Milestone 2: 2022 Lead Architect ──
            { left: 1060, bottom: 102, w: 76, h: 350, fill: '#3d6b4f', stroke: '#2d4a3e', milestone: 2, badges: [
              { tech: 'Team Lead', x: 28, y: 56 },
              { tech: 'EDI / BizTalk', x: 18, y: 92 },
              { tech: 'MQ FIFO', x: 52, y: 96 },
            ]},
            // ── Milestone 3: 2025 Dev Manager ──
            { left: 1430, bottom: 96, w: 84, h: 220, fill: '#1d3a2e', stroke: '#142a20', milestone: 3, badges: [
              { tech: 'AI / Copilot', x: 34, y: 56 },
              { tech: 'Amazon Connect', x: 22, y: 96 },
              { tech: 'Azure Fabric', x: 62, y: 100 },
              { tech: 'C-Suite', x: 42, y: 142 },
            ]},
            // ── Milestone 4: Zen Cloud ──
            { left: 1940, bottom: 100, w: 78, h: 210, fill: '#2d5b3f', stroke: '#1d3a2e', milestone: 4, badges: [
              { tech: 'Codex', x: 28, y: 52 },
              { tech: 'Python', x: 20, y: 86 },
              { tech: 'Claude', x: 56, y: 90 },
              { tech: 'Remotion', x: 40, y: 132 },
            ]},
            { left: 2100, bottom: 98, w: 74, h: 350, fill: '#2d4a3e', stroke: '#1d3a2e', milestone: 4, badges: [
              { tech: 'Next.js', x: 30, y: 46 },
              { tech: 'Ollama', x: 22, y: 86 },
              { tech: 'DeepSeek', x: 50, y: 92 },
            ]},
          ]
          return TREES.map((t, i) => (
            <GroveTree
              key={i}
              left={t.left}
              bottom={t.bottom}
              w={t.w}
              h={t.h}
              fill={t.fill}
              stroke={t.stroke}
              grown={birdTargetIndex >= t.milestone}
              showLabels={activeIndex >= t.milestone}
              instant={skipMode}
              badges={t.badges}
            />
          ))
        })()}

        {/* Animated path */}
        <PathLine key={`path-${skipMode}`} instant={skipMode} />


        {/* Hero — original (inside panned world) */}
        {!USE_FIXED_HERO && (
          <motion.div
            className="absolute z-20"
            style={{ left: 156, top: '25%', translateY: '-60%' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, x: zoomed ? 0 : panTarget }}
            transition={{
              opacity: { duration: 1, delay: ANIMATION_CONFIG.heroFadeIn + 0.2 },
              x: { duration: 1.5, ease: 'easeInOut' },
            }}
          >
            <div style={{ color: '#1e3a5f', fontSize: 10, letterSpacing: 4, textTransform: 'uppercase', fontFamily: 'sans-serif', marginBottom: 8, opacity: 0.7 }}>
              The Journey of
            </div>
            <div style={{ color: '#0f172a', fontSize: 40, fontWeight: 300, lineHeight: 1.05, marginBottom: 6 }}>
              Paul P.<br />
              <strong style={{ fontWeight: 700, color: '#1e40af' }}>Xiong</strong>
            </div>
            <div style={{ color: '#334155', fontSize: 12, fontFamily: 'sans-serif', letterSpacing: 0.5, maxWidth: 250, lineHeight: 1.5 }}>
              Enterprise Architect<br />&amp; AI Engineering Leader
            </div>
          </motion.div>
        )}

        {/* Milestone flags */}
        {MILESTONES.map((m, i) => (
          <MilestoneFlag key={`${m.id}-${skipMode}`} milestone={m} delay={milestoneDelays[i]} isActive={activeIndex === i} seen={seenIndices.has(i)} showAll={showAllCards} instant={skipMode} onClick={() => setFocusedMilestone(i)} />
        ))}

        {/* Bird — flies between milestones */}
        <Bird activeIndex={birdTargetIndex} phase={birdPhase} />

        {/* Destination — positioned just past the ZenCloud flag */}
        <motion.div
          className="absolute z-20 text-center"
          style={{ left: 2200, bottom: 420 }}
          initial={{ opacity: 0 }}
          animate={{ opacity: starVisible ? 1 : 0 }}
          transition={{ opacity: { duration: 0.8 } }}
        >
          {/* Twinkling star */}
          <motion.div
            style={{ width: 80, height: 80, margin: '0 auto 12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            animate={{
              scale: [1, 1.18, 0.94, 1.12, 1],
              filter: [
                'drop-shadow(0 0 8px rgba(251,191,36,0.7)) drop-shadow(0 0 20px rgba(251,191,36,0.3))',
                'drop-shadow(0 0 14px rgba(253,224,71,0.9)) drop-shadow(0 0 32px rgba(251,191,36,0.5))',
                'drop-shadow(0 0 6px rgba(251,191,36,0.5)) drop-shadow(0 0 16px rgba(251,191,36,0.2))',
                'drop-shadow(0 0 12px rgba(253,224,71,0.8)) drop-shadow(0 0 28px rgba(251,191,36,0.4))',
                'drop-shadow(0 0 8px rgba(251,191,36,0.7)) drop-shadow(0 0 20px rgba(251,191,36,0.3))',
              ],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: 0.3,
            }}
          >
            <span style={{
              fontSize: 42,
              color: '#fbbf24',
              textShadow: '0 0 10px rgba(253,224,71,0.8), 0 0 30px rgba(251,191,36,0.4)',
            }}>★</span>
          </motion.div>
          <div style={{ color: '#92400e', fontSize: 10, letterSpacing: 3, fontFamily: 'sans-serif', textTransform: 'uppercase' }}>Next Summit</div>
          <div style={{ color: '#78350f', fontSize: 12, fontWeight: 600, marginTop: 4, lineHeight: 1.4 }}>
            Engineering Manager<br />with AI Expertise
          </div>
        </motion.div>
      </div>

      {/* Fixed hero — sits outside the panned world, always visible */}
      {USE_FIXED_HERO && <FixedHero zoomed={zoomed} />}

      {/* Skip arrow — bounce at bottom, click to jump to resume */}
      {!showAllCards && (
        <motion.div
          className="absolute bottom-8 left-1/2 z-50 flex flex-col items-center gap-1"
          style={{ translateX: '-50%' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, y: [0, -8, 0] }}
          transition={{
            opacity: { delay: 1.5, duration: 0.6 },
            y: { duration: 1.2, repeat: Infinity, ease: 'easeInOut' },
          }}
        >
          <span
            style={{
              color: '#fbbf24',
              fontSize: 9,
              letterSpacing: 1.5,
              fontFamily: 'sans-serif',
              textTransform: 'uppercase',
              background: 'rgba(2,6,23,0.75)',
              backdropFilter: 'blur(6px)',
              borderRadius: 4,
              padding: '3px 10px',
            }}
          >
            Skip Animation
          </span>
          <motion.button
            className="cursor-pointer border-0 bg-transparent p-1"
            whileHover={{ scale: 1.15 }}
            whileTap={{ scale: 0.95 }}
            onClick={skipToEnd}
            aria-label="Skip to resume"
          >
            <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
              <motion.circle
                cx="20" cy="20" r="18"
                fill="none"
                stroke="#fbbf24"
                strokeWidth="2"
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
              />
              <path
                d="M20 10 L20 28 M12 22 L20 30 L28 22"
                stroke="#fbbf24"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </motion.button>
        </motion.div>
      )}

      {/* Expanded card modal — renders outside the scaled world */}
      {focusedMilestone !== null && (
        <CardModal
          milestone={MILESTONES[focusedMilestone]}
          onClose={() => setFocusedMilestone(null)}
        />
      )}
    </section>
  )
}
