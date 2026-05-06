'use client'
import { useEffect, useState } from 'react'
import { motion, useAnimate } from 'framer-motion'
import Link from 'next/link'

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
        left: `${x}%`,
        bottom: '40%',
        width: size,
        height: size,
        background: `rgba(251,191,36,${0.3 + (idx % 3) * 0.2})`,
        boxShadow: `0 0 ${size * 2}px rgba(251,191,36,0.4)`,
      }}
      animate={{ y: [0, -80, -160], opacity: [0, 0.9, 0], scale: [0, 1, 0.5] }}
      transition={{ duration: dur + 2, repeat: Infinity, delay, ease: 'easeOut' }}
    />
  )
}

// ── Crow phases ────────────────────────────────────────────────────────────

type CrowPhase = 'approaching' | 'impact' | 'dazed' | 'shaking' | 'flyingAway' | 'gone'

// ── Main page ──────────────────────────────────────────────────────────────

export default function ContactPage() {
  const [phase, setPhase] = useState<CrowPhase>('approaching')
  const [cardScope, animateCard] = useAnimate()

  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = []
    const t = (fn: () => void, ms: number) => { timers.push(setTimeout(fn, ms)) }

    t(() => setPhase('impact'), 1800)
    t(() => setPhase('dazed'), 2200)
    t(() => setPhase('shaking'), 3200)
    t(() => setPhase('flyingAway'), 4200)
    t(() => setPhase('gone'), 5500)
    t(() => {
      animateCard(cardScope.current, { opacity: 1, y: 0, scale: 1 }, { duration: 0.7, ease: 'easeOut' })
    }, 5800)

    return () => timers.forEach(clearTimeout)
  }, [animateCard, cardScope])

  return (
    <main
      className="relative min-h-screen overflow-hidden"
      style={{ background: 'linear-gradient(180deg,#bdd9f5 0%,#cfe2f7 25%,#e8f0f9 55%,#f0f4e8 78%,#e8eed5 100%)' }}
    >
      {/* ── Sun ── */}
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

      {/* ── Clouds — drifting ── */}
      {[
        { w: 90, h: 26, top: '10%', dur: 50, op: 0.55, leftStart: '5%' },
        { w: 72, h: 21, top: '14%', dur: 40, op: 0.45, leftStart: '70%' },
        { w: 60, h: 18, top: '8%', dur: 55, op: 0.5, leftStart: '35%' },
        { w: 84, h: 24, top: '18%', dur: 45, op: 0.4, leftStart: '90%' },
      ].map((c, i) => (
        <motion.div
          key={i}
          className="absolute"
          style={{
            width: c.w, height: c.h, top: c.top,
            background: 'white', borderRadius: 50, opacity: c.op,
          }}
          animate={{ left: [c.leftStart, '-20%'] }}
          transition={{ duration: c.dur, repeat: Infinity, ease: 'linear' }}
        />
      ))}

      {/* ── Mountains + hills ── */}
      <svg className="absolute bottom-0 w-full" style={{ height: '42%', minWidth: 900 }} viewBox="0 0 1200 340" preserveAspectRatio="none">
        <polygon
          points="0,340 120,130 250,190 370,80 490,160 600,95 720,170 850,70 970,140 1080,40 1200,100 1200,340"
          fill="#b8cceb" opacity="0.42"
        />
        <path
          d="M0,340 C90,340 150,220 260,230 S390,320 500,300 S630,200 760,210 S900,310 1020,290 S1140,190 1200,200 L1200,340 Z"
          fill="#8baed4" opacity="0.5"
        />
        <path
          d="M0,340 C60,340 100,260 190,265 S310,340 410,320 S540,230 660,240 S790,330 910,310 S1040,220 1160,230 S1200,270 1200,260 L1200,340 Z"
          fill="#6a99c4" opacity="0.55"
        />
        <path
          d="M0,340 L0,290 C55,284 120,298 200,286 S340,258 450,270 S580,294 710,280 S870,248 1000,260 S1120,284 1200,275 L1200,340 Z"
          fill="#5a8ab0"
        />
        <rect x="0" y="305" width="1200" height="35" fill="#4a7a9f" />
      </svg>

      {/* ── Trees ── */}
      {[
        { left: '5%', bottom: '30%', w: 48, h: 280, delay: 0 },
        { left: '11%', bottom: '31%', w: 40, h: 320, delay: 0.15 },
        { left: '20%', bottom: '29%', w: 44, h: 260, delay: 0.3 },
        { left: '70%', bottom: '28%', w: 46, h: 290, delay: 0.2 },
        { left: '78%', bottom: '30%', w: 38, h: 330, delay: 0.1 },
        { left: '86%', bottom: '27%', w: 50, h: 270, delay: 0.25 },
        { left: '92%', bottom: '31%', w: 36, h: 300, delay: 0.35 },
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
          <polygon
            points={`${t.w / 2},0 ${t.w * 0.04},${t.h * 0.52} ${t.w * 0.96},${t.h * 0.52}`}
            fill="#2d5b3f" stroke="#1d3a2e" strokeWidth="0.6"
          />
          <polygon
            points={`${t.w / 2},${t.h * 0.10} ${t.w * 0.12},${t.h * 0.68} ${t.w * 0.88},${t.h * 0.68}`}
            fill="#2d5b3f" stroke="#1d3a2e" strokeWidth="0.5" opacity="0.93"
          />
          <polygon
            points={`${t.w / 2},${t.h * 0.25} ${t.w * 0.22},${t.h * 0.85} ${t.w * 0.78},${t.h * 0.85}`}
            fill="#2d5b3f" stroke="#1d3a2e" strokeWidth="0.4" opacity="0.86"
          />
          <rect x={t.w * 0.42} y={t.h * 0.85} width={t.w * 0.16} height={t.h * 0.15} fill="#1d3a2e" rx="1.5" />
        </motion.svg>
      ))}

      {/* ── Floating particles ── */}
      {Array.from({ length: 10 }, (_, i) => (
        <Particle key={i} idx={i} />
      ))}

      {/* ── CROW ── */}
      {phase !== 'gone' && (
        <motion.div
          className="absolute z-40"
          style={{ width: 40, height: 28 }}
          animate={(() => {
            switch (phase) {
              case 'approaching':
                return {
                  left: ['-5%', '45%'],
                  top: ['35%', '22%'],
                  scale: [0.4, 1.8],
                  opacity: 1,
                }
              case 'impact':
                return {
                  left: '45%',
                  top: '24%',
                  scale: [1.8, 0.7, 2.2, 1.2],
                  opacity: 1,
                }
              case 'dazed':
                return {
                  left: '45%',
                  top: ['24%', '28%'],
                  scale: 1.2,
                  rotate: [0, 5, -3, 8, 0],
                  opacity: 1,
                }
              case 'shaking':
                return {
                  left: '45%',
                  top: '28%',
                  scale: 1.2,
                  rotate: [0, -12, 12, -8, 8, -4, 4, 0],
                  opacity: 1,
                }
              case 'flyingAway':
                return {
                  left: ['45%', '20%', '60%', '110%'],
                  top: ['28%', '18%', '40%', '5%'],
                  scale: [1.2, 0.9, 0.7, 0.4],
                  rotate: [0, -25, 35, -15],
                  opacity: 1,
                }
              default:
                return {}
            }
          })()}
          transition={(() => {
            switch (phase) {
              case 'approaching':
                return { duration: 1.8, ease: 'easeIn' }
              case 'impact':
                return { duration: 0.4, ease: 'easeOut' }
              case 'dazed':
                return { duration: 1.0, ease: 'easeInOut' }
              case 'shaking':
                return { duration: 1.0, ease: 'easeInOut' }
              case 'flyingAway':
                return { duration: 1.3, ease: 'easeOut' }
              default:
                return {}
            }
          })()}
        >
          {/* Crow SVG */}
          <svg width="40" height="28" viewBox="0 0 40 28" fill="none">
            {/* Body */}
            <ellipse cx="19" cy="16" rx="11" ry="8" fill="#1a1a1a" />
            {/* Head */}
            <circle cx="31" cy="9" r="6.5" fill="#1a1a1a" />
            {/* Beak */}
            <polygon points="37,7 45,8 37,10" fill="#f59e0b" />
            {/* Eye */}
            <circle cx="33" cy="8" r="1.8" fill="white" />
            <circle cx="33.5" cy="8" r="0.9" fill="#111" />
            {/* Tail feathers */}
            <polygon points="6,12 0,6 8,10" fill="#111" />
            <polygon points="6,14 0,18 8,15" fill="#1a1a1a" />
            {/* Wing */}
            <path d="M12,14 Q19,8 28,12 Q20,10 12,14Z" fill="#2a2a2a" />
            {/* Legs */}
            <line x1="16" y1="23" x2="15" y2="27" stroke="#333" strokeWidth="1" />
            <line x1="22" y1="23" x2="23" y2="27" stroke="#333" strokeWidth="1" />
          </svg>

          {/* Impact stars */}
          {phase === 'impact' && (
            <>
              {[30, 80, 140, 210, 300].map((angle, i) => (
                <motion.div
                  key={i}
                  className="absolute"
                  style={{
                    left: 20, top: 14,
                    width: 6, height: 2,
                    background: '#fbbf24',
                    borderRadius: 1,
                    transformOrigin: '0 50%',
                  }}
                  initial={{ rotate: angle, scale: 0, opacity: 0 }}
                  animate={{ rotate: angle, scale: [0, 1.5, 0], opacity: [0, 1, 0] }}
                  transition={{ duration: 0.5, delay: 0.05 * i, ease: 'easeOut' }}
                />
              ))}
            </>
          )}

          {/* Feathers flying off during shake */}
          {phase === 'shaking' && (
            <>
              {[-2, 2, -4, 4].map((dx, i) => (
                <motion.div
                  key={i}
                  className="absolute"
                  style={{
                    left: 10 + i * 6, top: 8 + i * 3,
                    width: 4, height: 2,
                    background: '#333',
                    borderRadius: 1,
                  }}
                  animate={{
                    x: [0, dx * 8],
                    y: [0, -15],
                    opacity: [1, 0],
                    rotate: [0, dx * 40],
                  }}
                  transition={{ duration: 0.8, delay: i * 0.1, ease: 'easeOut' }}
                />
              ))}
            </>
          )}

          {/* Dizzy stars when flying away */}
          {phase === 'flyingAway' && (
            <motion.div
              className="absolute"
              style={{ left: -5, top: -8 }}
              animate={{ opacity: [1, 0], scale: [0.6, 1.2] }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
            >
              {[0, 72, 144, 216, 288].map((angle, i) => (
                <motion.div
                  key={i}
                  className="absolute"
                  style={{
                    left: 20, top: 14,
                    width: 8, height: 8,
                    color: '#fbbf24',
                    fontSize: 8,
                    transformOrigin: 'center center',
                  }}
                  animate={{
                    x: Math.cos(angle * Math.PI / 180) * 16,
                    y: Math.sin(angle * Math.PI / 180) * 16,
                    opacity: [1, 0],
                    rotate: [0, 180],
                  }}
                  transition={{ duration: 0.7, delay: i * 0.06, ease: 'easeOut' }}
                >
                  ★
                </motion.div>
              ))}
            </motion.div>
          )}

          {/* Window crack on impact */}
          {phase === 'impact' && (
            <motion.div
              className="absolute"
              style={{ left: '50%', top: '30%', width: 120, height: 80, translateX: '-50%', translateY: '-50%' }}
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 0.5, 0] }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
            >
              <svg width="120" height="80" viewBox="0 0 120 80" fill="none">
                <path d="M50,0 L55,20 L70,15 L60,35 L75,55 L58,50 L52,70 L48,45 L35,55 L45,30 L30,15 L48,20 Z"
                  stroke="rgba(255,255,255,0.7)" strokeWidth="0.8" fill="none" />
                <path d="M60,10 L62,25 L75,22" stroke="rgba(255,255,255,0.5)" strokeWidth="0.5" fill="none" />
                <path d="M45,35 L40,48 L50,42" stroke="rgba(255,255,255,0.5)" strokeWidth="0.5" fill="none" />
              </svg>
            </motion.div>
          )}
        </motion.div>
      )}

      {/* ── THUD text ── */}
      {phase === 'impact' && (
        <motion.div
          className="absolute z-50 pointer-events-none"
          style={{
            left: '50%', top: '18%',
            translateX: '-50%',
            fontFamily: 'sans-serif',
            fontWeight: 900,
            fontSize: 'clamp(18px,4vw,32px)',
            color: '#1e3a5f',
            letterSpacing: 4,
            textTransform: 'uppercase',
          }}
          initial={{ opacity: 0, scale: 0.3 }}
          animate={{ opacity: [0, 1, 0], scale: [0.3, 1.4, 0.8] }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        >
          THUD
        </motion.div>
      )}

      {/* ── Contact card — appears after crow exits ── */}
      <div className="absolute inset-0 flex flex-col items-center justify-center z-30 px-4" style={{ paddingTop: '2%' }}>
        <motion.div
          ref={cardScope}
          className="text-center"
          initial={{ opacity: 0, y: 30, scale: 0.95 }}
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
            padding: '3px 12px',
            borderRadius: 4,
            fontSize: 9,
            fontFamily: 'sans-serif',
            letterSpacing: 2.5,
            textTransform: 'uppercase',
            marginBottom: 18,
          }}>
            Contact
          </div>

          <h1 style={{
            color: '#f1f5f9',
            fontSize: 'clamp(18px,3.5vw,24px)',
            fontWeight: 600,
            lineHeight: 1.3,
            marginBottom: 10,
          }}>
            Available Upon Request
          </h1>

          <p style={{
            color: '#94a3b8',
            fontSize: 12,
            fontFamily: 'sans-serif',
            lineHeight: 1.7,
            marginBottom: 22,
          }}>
            Please reach out via the email listed on the resume
          </p>

          <div style={{
            width: 40, height: 1,
            background: 'rgba(255,255,255,0.06)',
            margin: '0 auto 20px',
          }} />

          <Link
            href="/resume"
            className="inline-block no-underline"
            style={{
              color: 'rgba(165,180,252,0.9)',
              fontSize: 11,
              fontFamily: 'sans-serif',
              letterSpacing: 1,
              padding: '7px 20px',
              borderRadius: 6,
              border: '1px solid rgba(99,102,241,0.25)',
              background: 'rgba(99,102,241,0.08)',
              transition: 'all 0.2s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(99,102,241,0.16)'
              e.currentTarget.style.borderColor = 'rgba(99,102,241,0.45)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(99,102,241,0.08)'
              e.currentTarget.style.borderColor = 'rgba(99,102,241,0.25)'
            }}
          >
            &larr; Back to Resume
          </Link>
        </motion.div>

        <motion.div
          className="mt-6"
          style={{
            color: '#64748b',
            fontSize: 9,
            fontFamily: 'sans-serif',
            letterSpacing: 2,
            textTransform: 'uppercase',
            opacity: 0.5,
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.5 }}
          transition={{ delay: 6.5, duration: 0.6 }}
        >
          Paul P. Xiong · zencloudweb.com
        </motion.div>
      </div>
    </main>
  )
}
