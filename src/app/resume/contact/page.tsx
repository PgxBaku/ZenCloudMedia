'use client'
import { motion } from 'framer-motion'
import Link from 'next/link'

export default function ContactPage() {
  return (
    <main
      className="relative min-h-screen overflow-hidden"
      style={{ background: 'linear-gradient(180deg,#bfdbfe 0%,#dbeafe 35%,#eff6ff 65%,#f0fdf4 85%,#dcfce7 100%)' }}
    >
      {/* Sun */}
      <motion.div
        className="absolute"
        style={{
          right: '15%', top: '8%', width: 64, height: 64,
          background: 'radial-gradient(circle at 40% 35%,#fefce8,#fef3c7 30%,#fde68a 60%,#f59e0b 100%)',
          borderRadius: '50%',
        }}
        animate={{
          rotate: 360,
          boxShadow: [
            '0 0 40px rgba(251,191,36,0.4),0 0 100px rgba(251,191,36,0.1)',
            '0 0 55px rgba(251,191,36,0.6),0 0 130px rgba(251,191,36,0.2)',
            '0 0 40px rgba(251,191,36,0.4),0 0 100px rgba(251,191,36,0.1)',
          ],
        }}
        transition={{
          rotate: { duration: 30, repeat: Infinity, ease: 'linear' },
          boxShadow: { duration: 3, repeat: Infinity, ease: 'easeInOut' },
        }}
      />

      {/* Clouds */}
      {[
        { w: 70, h: 22, top: '12%', left: '10%', op: 0.6 },
        { w: 88, h: 26, top: '8%', left: '55%', op: 0.5 },
        { w: 56, h: 18, top: '18%', left: '75%', op: 0.45 },
        { w: 64, h: 20, top: '15%', left: '30%', op: 0.4 },
      ].map((c, i) => (
        <div
          key={i}
          className="absolute"
          style={{
            width: c.w, height: c.h, top: c.top, left: c.left,
            background: 'white', borderRadius: 50, opacity: c.op,
          }}
        />
      ))}

      {/* Hills */}
      <svg className="absolute bottom-0 w-full" style={{ height: '35%' }} viewBox="0 0 1200 300" preserveAspectRatio="none">
        <path
          d="M0,300 C80,300 130,180 230,190 S370,280 470,260 S580,150 710,160 S860,260 970,240 S1100,140 1200,150 L1200,300 Z"
          fill="#9ab8d8" opacity="0.55"
        />
        <path
          d="M0,300 C65,300 110,220 185,225 S310,300 400,280 S530,200 640,210 S770,290 880,270 S1010,190 1130,200 S1180,250 1200,240 L1200,300 Z"
          fill="#7a9ec4" opacity="0.45"
        />
        <path
          d="M0,300 L0,248 C70,242 130,256 210,244 S330,218 420,228 S530,262 640,248 S770,206 880,218 S1010,255 1130,236 S1180,198 1200,202 L1200,300 Z"
          fill="#5a8ab0"
        />
      </svg>

      {/* Trees */}
      {[
        { left: '8%', bottom: '28%', w: 40, h: 180 },
        { left: '14%', bottom: '30%', w: 36, h: 220 },
        { left: '72%', bottom: '26%', w: 42, h: 200 },
        { left: '80%', bottom: '29%', w: 34, h: 170 },
        { left: '88%', bottom: '27%', w: 38, h: 240 },
      ].map((t, i) => (
        <svg
          key={i}
          className="absolute"
          style={{ left: t.left, bottom: t.bottom, width: t.w, height: t.h }}
          viewBox={`0 0 ${t.w} ${t.h}`}
        >
          <polygon
            points={`${t.w / 2},0 ${t.w * 0.05},${t.h * 0.55} ${t.w * 0.95},${t.h * 0.55}`}
            fill="#2d5b3f"
            stroke="#1d3a2e"
            strokeWidth="0.5"
          />
          <polygon
            points={`${t.w / 2},${t.h * 0.12} ${t.w * 0.14},${t.h * 0.72} ${t.w * 0.86},${t.h * 0.72}`}
            fill="#2d5b3f"
            stroke="#1d3a2e"
            strokeWidth="0.4"
            opacity="0.92"
          />
          <polygon
            points={`${t.w / 2},${t.h * 0.28} ${t.w * 0.24},${t.h * 0.88} ${t.w * 0.76},${t.h * 0.88}`}
            fill="#2d5b3f"
            stroke="#1d3a2e"
            strokeWidth="0.3"
            opacity="0.85"
          />
          <rect
            x={t.w * 0.43}
            y={t.h * 0.88}
            width={t.w * 0.14}
            height={t.h * 0.12}
            fill="#1d3a2e"
            rx="1"
          />
        </svg>
      ))}

      {/* Bird */}
      <motion.div
        className="absolute z-10"
        style={{ top: '32%' }}
        animate={{ left: ['-5%', '105%'] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'linear', delay: 1 }}
      >
        <svg width="18" height="12" viewBox="0 0 18 12" fill="none">
          <path
            d="M2,6 Q6,0 9,6 Q12,0 16,6"
            stroke="#1e3a5f"
            strokeWidth="1.2"
            fill="none"
            strokeLinecap="round"
          />
        </svg>
      </motion.div>

      {/* Second bird — offset timing */}
      <motion.div
        className="absolute z-10"
        style={{ top: '38%' }}
        animate={{ left: ['10%', '-10%'] }}
        transition={{ duration: 7, repeat: Infinity, ease: 'linear', delay: 3 }}
      >
        <svg width="14" height="10" viewBox="0 0 14 10" fill="none">
          <path
            d="M1.5,5 Q4.5,0 7,5 Q9.5,0 12.5,5"
            stroke="#4a6a8a"
            strokeWidth="1"
            fill="none"
            strokeLinecap="round"
          />
        </svg>
      </motion.div>

      {/* Card */}
      <div className="absolute inset-0 flex items-center justify-center z-20 px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-center"
          style={{
            background: 'rgba(255,255,255,0.85)',
            backdropFilter: 'blur(12px)',
            border: '1px solid rgba(30,64,175,0.12)',
            borderRadius: 12,
            padding: '36px 44px',
            boxShadow: '0 8px 30px rgba(0,0,0,0.1),0 2px 6px rgba(0,0,0,0.06)',
          }}
        >
          <p
            className="mb-6"
            style={{
              color: '#1e3a5f',
              fontSize: 10,
              letterSpacing: 3,
              textTransform: 'uppercase',
              fontFamily: 'sans-serif',
            }}
          >
            Contact
          </p>
          <h1
            style={{
              fontSize: 'clamp(20px,4vw,28px)',
              fontWeight: 300,
              color: '#0f172a',
              marginBottom: 8,
            }}
          >
            Available Upon Request
          </h1>
          <p
            className="mb-8"
            style={{
              color: '#64748b',
              fontSize: 13,
              fontFamily: 'sans-serif',
              lineHeight: 1.6,
            }}
          >
            Please reach out via the email listed on the resume.
          </p>
          <Link
            href="/resume"
            className="inline-block no-underline"
            style={{
              color: '#1e40af',
              fontSize: 12,
              fontFamily: 'sans-serif',
              padding: '6px 16px',
              borderRadius: 4,
              border: '1px solid rgba(30,64,175,0.2)',
              background: 'rgba(30,64,175,0.04)',
            }}
          >
            &larr; Back to Resume
          </Link>
        </motion.div>
      </div>
    </main>
  )
}
