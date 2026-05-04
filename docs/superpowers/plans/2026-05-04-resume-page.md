# Resume Page Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build `/resume` — a cinematic two-act page that animates a terrain journey through Paul's career, then reveals a paper resume below.

**Architecture:** A `'use client'` Next.js page containing two sections: `TerrainScene` (full-viewport animated landscape orchestrated with Framer Motion) and `PaperResume` (static paper document that fades in after the zoom-out completes). All animation timings are driven by a single `ANIMATION_CONFIG` constant so they can be tuned without touching component code.

**Tech Stack:** Next.js 16, React 19, TypeScript, Tailwind v4, Framer Motion

---

## File Map

```
src/app/resume/
├── page.tsx                        # Page shell — wires terrain + paper, manages state
├── components/
│   ├── ResumeHeader.tsx            # Fixed top bar: name + animated progress bar
│   ├── TerrainScene.tsx            # Full-viewport landscape, animation orchestrator
│   ├── PathLine.tsx                # Animated SVG dashed path drawn by Framer Motion
│   ├── MilestoneFlag.tsx           # Single flag pole + label + hover detail card
│   ├── PaperResume.tsx             # Paper document: header band, metrics, body, sidebar
│   └── MobileTimeline.tsx          # Vertical timeline fallback for mobile (<768px)
└── data/
    └── resume.ts                   # ANIMATION_CONFIG + all typed resume data
```

**Modified files:**
- `src/app/sitemap.ts` — add `/resume` route

---

## Phase 1 — Foundation: Data + Dependencies

### Task 1: Install Framer Motion

**Files:**
- Modify: `package.json`

- [ ] **Install the dependency**

```bash
npm install framer-motion
```

- [ ] **Verify it installed**

```bash
npm list framer-motion
```

Expected output includes: `framer-motion@X.X.X`

- [ ] **Verify build still passes**

```bash
npm run build
```

Expected: no errors.

- [ ] **Commit**

```bash
git add package.json package-lock.json
git commit -m "feat(resume): add framer-motion dependency"
```

---

### Task 2: Create resume data file

**Files:**
- Create: `src/app/resume/data/resume.ts`

- [ ] **Create the file with all typed data**

```typescript
// src/app/resume/data/resume.ts

export const ANIMATION_CONFIG = {
  heroFadeIn: 0,
  pathStartDelay: 0.4,
  milestoneInterval: 0.9,
  zoomOutDelay: 0.9,
  zoomOutDuration: 1.8,
  resumeRevealDelay: 1.4,
} as const

export type FlagStyle = 'slate' | 'indigo' | 'violet' | 'peak' | 'amber'

export type Milestone = {
  id: string
  year: string
  dateRange: string
  role: string
  company: string
  tags: string[]
  metric: string
  flagLeft: number
  poleHeight: number
  flagStyle: FlagStyle
  aboveGround?: number
}

export type SkillVariant = 'default' | 'ai' | 'infra'

export type SkillGroup = {
  name: string
  items: string[]
  variant: SkillVariant
}

export type ResumeRole = {
  role: string
  dateRange: string
  company: string
  bullets: string[]
}

export const MILESTONES: Milestone[] = [
  {
    id: 'sr-engineer',
    year: '2017',
    dateRange: '2017 — 2020',
    role: 'Senior Software Engineer',
    company: 'ConvergeOne',
    tags: ['.NET / C#', 'SQL Server', 'TFS', 'SSRS', 'CI/CD'],
    metric: '⚡ Authored the core .NET Middle-Tier Framework',
    flagLeft: 520,
    poleHeight: 52,
    flagStyle: 'slate',
  },
  {
    id: 'solutions-architect',
    year: '2020',
    dateRange: '2020 — 2022',
    role: 'Solutions Architect',
    company: 'ConvergeOne',
    tags: ['MuleSoft', 'CloudHub 2.0', 'ADO', 'Power BI'],
    metric: '🗺️ Mapped 90 namespaces for CloudHub migration',
    flagLeft: 920,
    poleHeight: 70,
    flagStyle: 'indigo',
  },
  {
    id: 'lead-architect',
    year: '2022',
    dateRange: '2022 — 2025',
    role: 'Lead Architect & Developer',
    company: 'ConvergeOne',
    tags: ['EDI / BizTalk', 'Partner Manager', 'MQ FIFO', 'Team Lead'],
    metric: '🔄 BizTalk sunset · 100+ integrations migrated',
    flagLeft: 1320,
    poleHeight: 90,
    flagStyle: 'violet',
  },
  {
    id: 'dev-manager',
    year: '2025',
    dateRange: '2025 — Present',
    role: 'Software Dev Manager & API Manager',
    company: 'ConvergeOne · $2M budget · 10+ team',
    tags: ['Amazon Connect', 'Azure Fabric', 'AI / Copilot', 'C-Suite'],
    metric: '🏔️ 50%+ Time-to-Production improvement',
    flagLeft: 1760,
    poleHeight: 114,
    flagStyle: 'peak',
  },
  {
    id: 'zen-cloud',
    year: 'ZEN CLOUD',
    dateRange: 'Side Project · Ongoing',
    role: 'Zen Cloud Media',
    company: 'Founder & Lead Developer',
    tags: ['Remotion', 'Python', 'Claude', 'Next.js'],
    metric: '🎬 AI-automated video production pipeline',
    flagLeft: 1760,
    poleHeight: 18,
    flagStyle: 'amber',
    aboveGround: 280,
  },
]

export const RESUME_ROLES: ResumeRole[] = [
  {
    role: 'Software Dev Manager & API Manager',
    dateRange: 'Apr 2025 — Present',
    company: 'ConvergeOne',
    bullets: [
      'Ultimate technical escalation point for global developers across US and India.',
      'Orchestrates high-availability API layers connecting core systems to Amazon Connect and Azure Fabric.',
      'Manages $2M annual budget; reports on infrastructure ROI and talent performance to C-suite.',
      'Implementing GitHub Copilot and AI-driven CI/CD automated code reviews across the team.',
    ],
  },
  {
    role: 'Solutions Architect & Lead Developer',
    dateRange: 'Jun 2022 — Apr 2025',
    company: 'ConvergeOne',
    bullets: [
      'Architected the complete sunset of BizTalk EDI, transitioning all vendor integrations to MuleSoft Partner Manager.',
      'Directed porting of 25 business processes into governed MuleSoft assets using modular shared patterns.',
      'Architected and co-developed 100+ integration processes using the proprietary middle-tier framework.',
    ],
  },
  {
    role: 'Solutions Architect',
    dateRange: 'Mar 2020 — Jun 2022',
    company: 'ConvergeOne',
    bullets: [
      'Established Priority/Complexity Matrix to group 90 namespaces for phased CloudHub 2.0 migration.',
      "Founded the IT Development Wiki — maintained for 8+ years as the company's primary technical database.",
      'Migrated TFS to Azure DevOps and hired DevOps engineers to support the growing team.',
    ],
  },
  {
    role: 'Senior Software Engineer',
    dateRange: 'Jun 2017 — Mar 2020',
    company: 'ConvergeOne',
    bullets: [
      'Authored the core .NET Middle-Tier Framework (C#, MEF, Async Queues) — backbone of 50%+ Time-to-Production improvement.',
      'Managed database reporting via SQL Server and SSRS across 90+ core business processes.',
      'Created and organized the company SDLC and CI/CD process using TFS.',
    ],
  },
]

export const SKILL_GROUPS: SkillGroup[] = [
  {
    name: 'Integration & Cloud',
    variant: 'default',
    items: ['MuleSoft', 'BizTalk EDI', 'Azure Fabric', 'Amazon Connect', 'CloudHub 2.0', 'MQ FIFO'],
  },
  {
    name: 'AI & Engineering',
    variant: 'ai',
    items: ['Claude', 'Copilot', 'Gemini', 'LLMOps', '.NET / C#', 'Python', 'Next.js', 'Supabase'],
  },
  {
    name: 'Leadership',
    variant: 'infra',
    items: ['C-Suite Roadmaps', 'Budget Mgmt', 'Talent Lifecycle', 'ADO / KPI'],
  },
]

export const METRICS = [
  { value: '50%+', label: 'Time-to-Prod Gain' },
  { value: '90', label: 'Core Processes' },
  { value: '10+', label: 'Engineers Led' },
  { value: '$2M', label: 'Annual Budget' },
]

export const PROJECTS = [
  { name: 'Zen Cloud Media', desc: 'Automated AI video pipeline: Python, Remotion, Claude, Gemini — geopolitical news to MP4, end-to-end.' },
  { name: '7pace + ADO KPI Dashboards', desc: 'Custom ADO widgets correlating time-tracking data with developer velocity metrics.' },
]
```

- [ ] **Verify TypeScript compiles**

```bash
npm run build
```

Expected: no type errors.

- [ ] **Commit**

```bash
git add src/app/resume/data/resume.ts
git commit -m "feat(resume): add typed resume data and ANIMATION_CONFIG"
```

---

## Phase 2 — Terrain Components

### Task 3: ResumeHeader component

**Files:**
- Create: `src/app/resume/components/ResumeHeader.tsx`

- [ ] **Create the component**

```typescript
// src/app/resume/components/ResumeHeader.tsx
'use client'

type Props = {
  progress: number   // 0–100
  label: string
}

export default function ResumeHeader({ progress, label }: Props) {
  return (
    <header className="fixed top-0 left-0 right-0 z-[300] flex items-center gap-6 px-8 py-2.5"
      style={{ background: 'rgba(10,10,20,0.88)', backdropFilter: 'blur(12px)', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
      <div>
        <div className="text-slate-200 text-sm font-light tracking-[3px] uppercase">Paul Xiong</div>
        <div className="text-slate-500 text-[10px] tracking-[2px] uppercase" style={{ fontFamily: 'sans-serif' }}>
          Engineering Manager · AI-Capable
        </div>
      </div>
      <div className="flex-1 h-[2px] rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.07)' }}>
        <div
          className="h-full rounded-full"
          style={{
            width: `${progress}%`,
            background: 'linear-gradient(90deg,#6366f1,#a78bfa)',
            transition: 'width 0.4s ease',
          }}
        />
      </div>
      <div className="text-slate-500 text-[10px] tracking-[1px]" style={{ fontFamily: 'sans-serif' }}>
        {label}
      </div>
    </header>
  )
}
```

- [ ] **Verify build**

```bash
npm run build
```

- [ ] **Commit**

```bash
git add src/app/resume/components/ResumeHeader.tsx
git commit -m "feat(resume): add ResumeHeader with animated progress bar"
```

---

### Task 4: PathLine component

**Files:**
- Create: `src/app/resume/components/PathLine.tsx`

- [ ] **Create the component**

```typescript
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
    <svg
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
    </svg>
  )
}
```

- [ ] **Verify build**

```bash
npm run build
```

- [ ] **Commit**

```bash
git add src/app/resume/components/PathLine.tsx
git commit -m "feat(resume): add PathLine with Framer Motion stroke-dashoffset animation"
```

---

### Task 5: MilestoneFlag component

**Files:**
- Create: `src/app/resume/components/MilestoneFlag.tsx`

- [ ] **Create the component**

```typescript
// src/app/resume/components/MilestoneFlag.tsx
'use client'
import { motion } from 'framer-motion'
import { Milestone } from '../data/resume'

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

const THEMES: Record<string, FlagTheme> = {
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
    poleBg: 'rgba(245,158,11,0.35)',
    flagBg: 'rgba(245,158,11,0.15)', flagText: '#fbbf24',
    flagBorder: '1px solid rgba(245,158,11,0.4)',
    dotBg: '#f59e0b', dotBorder: '#fbbf24',
    dotShadow: '0 0 8px rgba(245,158,11,0.5)',
    fontSize: 9,
  },
}

type Props = {
  milestone: Milestone
  delay: number
}

export default function MilestoneFlag({ milestone, delay }: Props) {
  const theme = THEMES[milestone.flagStyle]

  return (
    <motion.div
      className="absolute flex flex-col items-center z-10 cursor-pointer group"
      style={{ left: milestone.flagLeft, bottom: milestone.aboveGround ?? 140 }}
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay, ease: 'easeOut' }}
    >
      {/* Hover card */}
      <div
        className="absolute bottom-full mb-3 w-56 opacity-0 translate-y-1.5 pointer-events-none z-20
          group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-200"
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
```

- [ ] **Verify build**

```bash
npm run build
```

- [ ] **Commit**

```bash
git add src/app/resume/components/MilestoneFlag.tsx
git commit -m "feat(resume): add MilestoneFlag with hover card and theme system"
```

---

## Phase 3 — Animation Orchestration

### Task 6: TerrainScene component

**Files:**
- Create: `src/app/resume/components/TerrainScene.tsx`

- [ ] **Create the component**

```typescript
// src/app/resume/components/TerrainScene.tsx
'use client'
import { useState, useEffect, useRef, useCallback } from 'react'
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
  const [scale, setScale] = useState(1)
  const timers = useRef<ReturnType<typeof setTimeout>[]>([])

  const addTimer = useCallback((fn: () => void, ms: number) => {
    timers.current.push(setTimeout(fn, ms))
  }, [])

  useEffect(() => {
    setScale(window.innerWidth / 2600)
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

    return () => timers.current.forEach(clearTimeout)
  }, [addTimer, onProgress, onResumeReveal])

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
```

- [ ] **Verify build**

```bash
npm run build
```

- [ ] **Commit**

```bash
git add src/app/resume/components/TerrainScene.tsx
git commit -m "feat(resume): add TerrainScene with animation orchestration and zoom-out"
```

---

## Phase 4 — Paper Resume

### Task 7: PaperResume component

**Files:**
- Create: `src/app/resume/components/PaperResume.tsx`

- [ ] **Create the component**

```typescript
// src/app/resume/components/PaperResume.tsx
'use client'
import { motion } from 'framer-motion'
import { RESUME_ROLES, SKILL_GROUPS, METRICS, PROJECTS } from '../data/resume'

const SKILL_COLORS: Record<string, { bg: string; border: string; text: string }> = {
  default: { bg: '#eff6ff', border: '#bfdbfe', text: '#1e40af' },
  ai:      { bg: '#f5f3ff', border: '#ddd6fe', text: '#5b21b6' },
  infra:   { bg: '#ecfdf5', border: '#a7f3d0', text: '#065f46' },
}

type Props = { visible: boolean }

export default function PaperResume({ visible }: Props) {
  return (
    <div style={{ background: '#f1f3f8', padding: '60px 0 80px' }}>
      {/* Bridge arrow */}
      <motion.div
        className="text-center mb-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: visible ? 1 : 0 }}
        transition={{ duration: 0.6 }}
      >
        <div style={{ fontFamily: 'sans-serif', fontSize: 10, letterSpacing: 4, textTransform: 'uppercase', color: '#94a3b8', marginBottom: 8 }}>
          The full picture
        </div>
        <div style={{ fontSize: 20, color: '#6366f1' }}>↓</div>
      </motion.div>

      <motion.div
        style={{ maxWidth: 820, margin: '0 auto', background: '#fff', borderRadius: 2, overflow: 'hidden', boxShadow: '0 4px 6px rgba(0,0,0,0.05),0 20px 60px rgba(0,0,0,0.12)', fontFamily: 'Georgia, serif', fontSize: 13, color: '#1e293b', lineHeight: 1.6 }}
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: visible ? 1 : 0, y: visible ? 0 : 40 }}
        transition={{ duration: 0.9, ease: 'easeOut' }}
      >
        {/* Header band */}
        <div style={{ background: 'linear-gradient(135deg,#1e40af 0%,#312e81 100%)', padding: '36px 48px 28px', color: 'white' }}>
          <h1 style={{ fontSize: 32, fontWeight: 300, letterSpacing: 1, marginBottom: 4 }}>
            Paul P. <strong style={{ fontWeight: 700 }}>Xiong</strong>
          </h1>
          <div style={{ fontSize: 13, fontFamily: 'sans-serif', letterSpacing: 2, opacity: 0.85, marginBottom: 16, textTransform: 'uppercase' }}>
            Engineering Manager · AI-Capable Systems & Enterprise Integration
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 20, fontSize: 11, fontFamily: 'sans-serif', opacity: 0.8 }}>
            <span>📍 Minneapolis, MN</span>
            <span>✉ pgxiong@gmail.com</span>
            <span>📞 612-703-3200</span>
            <span>🌐 zencloudweb.com/resume</span>
          </div>
        </div>

        {/* Metrics band */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', background: '#f8faff', borderBottom: '1px solid #e2e8f0' }}>
          {METRICS.map((m, i) => (
            <div key={i} style={{ padding: '18px 20px', textAlign: 'center', borderRight: i < 3 ? '1px solid #e2e8f0' : undefined }}>
              <span style={{ fontSize: 22, fontWeight: 700, color: '#1e40af', display: 'block' }}>{m.value}</span>
              <div style={{ fontSize: 10, fontFamily: 'sans-serif', color: '#64748b', letterSpacing: 1, textTransform: 'uppercase', marginTop: 2 }}>{m.label}</div>
            </div>
          ))}
        </div>

        {/* Body */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 260px' }}>

          {/* Main column */}
          <div style={{ padding: '32px 36px', borderRight: '1px solid #e2e8f0' }}>
            <SectionLabel>Professional Summary</SectionLabel>
            <p style={{ marginBottom: 28, color: '#374151', fontSize: 12, lineHeight: 1.7 }}>
              Engineering Manager with 8+ years at ConvergeOne delivering enterprise integration at scale —
              from authoring the .NET middle-tier framework to leading the BizTalk → MuleSoft EDI transformation
              and managing cross-functional teams through AI adoption. Built Zen Cloud Media on the side: a fully
              automated AI video production pipeline. Targeting leadership roles where AI is the core capability, not the add-on.
            </p>

            <SectionLabel>Experience</SectionLabel>
            {RESUME_ROLES.map((r, i) => (
              <div key={i} style={{ marginBottom: i < RESUME_ROLES.length - 1 ? 24 : 0, paddingBottom: i < RESUME_ROLES.length - 1 ? 24 : 0, borderBottom: i < RESUME_ROLES.length - 1 ? '1px solid #f1f5f9' : undefined }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 4 }}>
                  <div style={{ fontSize: 14, fontWeight: 700, color: '#0f172a' }}>{r.role}</div>
                  <div style={{ fontFamily: 'sans-serif', fontSize: 10, color: '#94a3b8', letterSpacing: 1, whiteSpace: 'nowrap', marginLeft: 12 }}>{r.dateRange}</div>
                </div>
                <div style={{ fontFamily: 'sans-serif', fontSize: 11, color: '#6366f1', letterSpacing: 0.5, marginBottom: 8 }}>{r.company}</div>
                <ul style={{ paddingLeft: 0, listStyle: 'none' }}>
                  {r.bullets.map((b, j) => (
                    <li key={j} style={{ fontSize: 12, color: '#374151', lineHeight: 1.65, paddingLeft: 14, position: 'relative', marginBottom: 4 }}>
                      <span style={{ position: 'absolute', left: 0, color: '#6366f1', fontSize: 10, top: 2 }}>▸</span>
                      {b}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Sidebar */}
          <div style={{ padding: '32px 24px', background: '#fafbff' }}>
            <SectionLabel>Skills</SectionLabel>
            <div style={{ marginBottom: 28 }}>
              {SKILL_GROUPS.map((g, i) => (
                <div key={i} style={{ marginBottom: i < SKILL_GROUPS.length - 1 ? 12 : 0 }}>
                  <div style={{ fontFamily: 'sans-serif', fontSize: 10, fontWeight: 700, color: '#334155', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 6 }}>{g.name}</div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                    {g.items.map(item => {
                      const c = SKILL_COLORS[g.variant]
                      return (
                        <span key={item} style={{ background: c.bg, border: `1px solid ${c.border}`, color: c.text, padding: '2px 9px', borderRadius: 3, fontSize: 10, fontFamily: 'sans-serif' }}>
                          {item}
                        </span>
                      )
                    })}
                  </div>
                </div>
              ))}
            </div>

            <SectionLabel>Projects</SectionLabel>
            <div style={{ marginBottom: 28 }}>
              {PROJECTS.map((p, i) => (
                <div key={i} style={{ marginBottom: 14 }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: '#0f172a', marginBottom: 3 }}>{p.name}</div>
                  <div style={{ fontSize: 11, color: '#64748b', fontFamily: 'sans-serif', lineHeight: 1.5 }}>{p.desc}</div>
                </div>
              ))}
            </div>

            <SectionLabel>Education</SectionLabel>
            <div style={{ marginBottom: 28, fontSize: 12 }}>
              <div style={{ fontWeight: 700, color: '#0f172a' }}>University of St. Thomas</div>
              <div style={{ color: '#6366f1', fontFamily: 'sans-serif', fontSize: 11 }}>B.A. in Computer Science</div>
              <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 4, fontFamily: 'sans-serif' }}>International study — China & Japan</div>
            </div>

            <SectionLabel>Target Roles</SectionLabel>
            <div style={{ fontSize: 11, color: '#374151', lineHeight: 1.7, fontFamily: 'sans-serif' }}>
              Engineering / Dev Manager<br />
              AI-Capable Systems Lead<br />
              Software Dev Manager — AI<br />
              <span style={{ color: '#94a3b8' }}>Remote preferred · No sponsorship needed</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div style={{ background: '#f8faff', borderTop: '1px solid #e2e8f0', padding: '14px 48px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ fontFamily: 'sans-serif', fontSize: 10, color: '#94a3b8', letterSpacing: 1 }}>Minneapolis, MN · No sponsorship needed · CST</div>
          <div style={{ fontFamily: 'sans-serif', fontSize: 10, color: '#6366f1', letterSpacing: 1 }}>zencloudweb.com/resume</div>
        </div>
      </motion.div>
    </div>
  )
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ fontFamily: 'sans-serif', fontSize: 9, letterSpacing: 3, textTransform: 'uppercase', color: '#1e40af', borderBottom: '2px solid #1e40af', paddingBottom: 6, marginBottom: 16, fontWeight: 700 }}>
      {children}
    </div>
  )
}
```

- [ ] **Verify build**

```bash
npm run build
```

- [ ] **Commit**

```bash
git add src/app/resume/components/PaperResume.tsx
git commit -m "feat(resume): add PaperResume with metrics, experience, and skills"
```

---

### Task 8: Wire up page.tsx

**Files:**
- Create: `src/app/resume/page.tsx`

- [ ] **Create the page**

```typescript
// src/app/resume/page.tsx
'use client'
import { useState, useCallback, useRef } from 'react'
import ResumeHeader from './components/ResumeHeader'
import TerrainScene from './components/TerrainScene'
import PaperResume from './components/PaperResume'

export default function ResumePage() {
  const [progress, setProgress] = useState(0)
  const [progressLabel, setProgressLabel] = useState('—')
  const [showPaper, setShowPaper] = useState(false)
  const paperRef = useRef<HTMLDivElement>(null)

  const handleProgress = useCallback((pct: number, label: string) => {
    setProgress(pct)
    setProgressLabel(label)
  }, [])

  const handleResumeReveal = useCallback(() => {
    setShowPaper(true)
    setTimeout(() => {
      paperRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, 200)
  }, [])

  return (
    <main>
      <ResumeHeader progress={progress} label={progressLabel} />
      <TerrainScene onResumeReveal={handleResumeReveal} onProgress={handleProgress} />
      <div ref={paperRef}>
        <PaperResume visible={showPaper} />
      </div>
    </main>
  )
}
```

- [ ] **Start dev server and verify the full sequence plays**

```bash
npm run dev
```

Open `http://localhost:3000/resume`. Watch:
1. Hero name fades in (left side)
2. Path draws left to right
3. Flags rise one by one (2017 → 2020 → 2022 → 2025 → ZEN CLOUD)
4. Destination star glows in
5. Terrain zooms out to show full journey
6. Page scrolls down
7. Paper resume fades in

- [ ] **Verify build**

```bash
npm run build
```

- [ ] **Commit**

```bash
git add src/app/resume/page.tsx
git commit -m "feat(resume): wire page with terrain scene and paper resume reveal"
```

---

## Phase 5 — Polish & Deploy

### Task 9: Mobile fallback

**Files:**
- Create: `src/app/resume/components/MobileTimeline.tsx`
- Modify: `src/app/resume/page.tsx`

- [ ] **Create MobileTimeline**

```typescript
// src/app/resume/components/MobileTimeline.tsx
'use client'
import { motion } from 'framer-motion'
import { MILESTONES, RESUME_ROLES } from '../data/resume'

export default function MobileTimeline() {
  return (
    <div style={{ background: 'linear-gradient(180deg,#bfdbfe,#eff6ff)', minHeight: '100vh', paddingTop: 72, paddingBottom: 40 }}>
      {/* Hero */}
      <motion.div
        initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}
        style={{ textAlign: 'center', padding: '32px 24px 40px' }}
      >
        <div style={{ color: '#1e3a5f', fontSize: 10, letterSpacing: 4, textTransform: 'uppercase', fontFamily: 'sans-serif', marginBottom: 8, opacity: 0.7 }}>The Journey of</div>
        <div style={{ color: '#0f172a', fontSize: 32, fontWeight: 300, lineHeight: 1.05, marginBottom: 6 }}>
          Paul P.<br /><strong style={{ fontWeight: 700, color: '#1e40af' }}>Xiong</strong>
        </div>
        <div style={{ color: '#334155', fontSize: 12, fontFamily: 'sans-serif' }}>Engineering Manager · AI-Capable</div>
      </motion.div>

      {/* Vertical timeline */}
      <div style={{ maxWidth: 480, margin: '0 auto', padding: '0 24px', position: 'relative' }}>
        <div style={{ position: 'absolute', left: 28, top: 0, bottom: 0, width: 2, background: 'rgba(99,102,241,0.2)' }} />
        {MILESTONES.map((m, i) => (
          <motion.div
            key={m.id}
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: i * 0.15 }}
            style={{ display: 'flex', gap: 20, marginBottom: 32, position: 'relative' }}
          >
            <div style={{ width: 14, height: 14, borderRadius: '50%', background: m.flagStyle === 'peak' ? 'linear-gradient(135deg,#a78bfa,#60a5fa)' : m.flagStyle === 'amber' ? '#f59e0b' : '#6366f1', border: '2px solid white', boxShadow: '0 0 0 2px rgba(99,102,241,0.3)', flexShrink: 0, marginTop: 2 }} />
            <div>
              <div style={{ fontFamily: 'sans-serif', fontSize: 10, color: '#6366f1', letterSpacing: 2, marginBottom: 2 }}>{m.dateRange}</div>
              <div style={{ fontSize: 14, fontWeight: 700, color: '#0f172a', marginBottom: 2 }}>{m.role}</div>
              <div style={{ fontFamily: 'sans-serif', fontSize: 11, color: '#64748b', marginBottom: 6 }}>{m.company}</div>
              <div style={{ fontFamily: 'sans-serif', fontSize: 10, color: '#a78bfa' }}>{m.metric}</div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
```

- [ ] **Add mobile detection to page.tsx**

Replace the `return` block in `src/app/resume/page.tsx` with:

```typescript
// Add this import at the top
import MobileTimeline from './components/MobileTimeline'
import { useEffect, useState as useStateAlias } from 'react'

// Add inside the component, before the return:
const [isMobile, setIsMobile] = useStateAlias(false)
useEffect(() => {
  setIsMobile(window.innerWidth < 768)
  const handler = () => setIsMobile(window.innerWidth < 768)
  window.addEventListener('resize', handler)
  return () => window.removeEventListener('resize', handler)
}, [])

// Replace return:
return (
  <main>
    <ResumeHeader progress={isMobile ? 100 : progress} label={isMobile ? 'Journey' : progressLabel} />
    {isMobile ? (
      <>
        <MobileTimeline />
        <div ref={paperRef}><PaperResume visible={true} /></div>
      </>
    ) : (
      <>
        <TerrainScene onResumeReveal={handleResumeReveal} onProgress={handleProgress} />
        <div ref={paperRef}><PaperResume visible={showPaper} /></div>
      </>
    )}
  </main>
)
```

- [ ] **Verify build**

```bash
npm run build
```

- [ ] **Commit**

```bash
git add src/app/resume/components/MobileTimeline.tsx src/app/resume/page.tsx
git commit -m "feat(resume): add mobile vertical timeline fallback"
```

---

### Task 10: Sitemap + final build

**Files:**
- Modify: `src/app/sitemap.ts`

- [ ] **Add /resume to sitemap**

Open `src/app/sitemap.ts` and add the resume route to the returned array. The existing file returns a `MetadataRoute.Sitemap` array — append one entry:

```typescript
{
  url: 'https://zencloudweb.com/resume',
  lastModified: new Date(),
  changeFrequency: 'monthly',
  priority: 0.8,
},
```

- [ ] **Run final build**

```bash
npm run build
```

Expected: no errors, `/resume` appears in the build output as a client route.

- [ ] **Commit**

```bash
git add src/app/sitemap.ts
git commit -m "feat(resume): add /resume to sitemap"
```

- [ ] **Deploy to Vercel**

```bash
git push origin main
```

Vercel will auto-deploy. Verify at `https://zencloudweb.com/resume`.
