# Resume Variants Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add dynamic tailored resume variants at `/pgx/resume/[variant]` with per-variant data files, cookie-based redirect gate, and ATS text endpoints.

**Architecture:** Dynamic Next.js route `[variant]/page.tsx` looks up slugs in a registry, loads variant data, and renders the existing PaperResume component with overridden headline/summary/roles/skills. A `resume_variant` cookie (30-day, path `/`) set on first variant visit bounces general `/resume` and `/pgx/resume` visitors back to their variant.

**Tech Stack:** Next.js 16 App Router, TypeScript, React 19, cookies() from next/headers, framer-motion

**Design spec:** `docs/superpowers/specs/2026-06-04-resume-variants-design.md`

---

### Task 1: Create variant types and registry

**Files:**
- Create: `src/app/resume/data/variants/index.ts`

- [ ] **Step 1: Write the variant registry with types**

```typescript
// src/app/resume/data/variants/index.ts
import type { ResumeRole, SkillGroup } from '../resume'

export interface VariantMeta {
  slug: string
  headline: string
  description: string
  targetRole: string
  targetCompany: string
}

export interface VariantData {
  meta: VariantMeta
  headline: string
  summary: string
  targetRoles: string
  roles: ResumeRole[]
  skillGroups: SkillGroup[]
}

export interface VariantModule {
  VARIANT_META: VariantMeta
  VARIANT_HEADLINE: string
  VARIANT_SUMMARY: string
  VARIANT_TARGET_ROLES: string
  RESUME_ROLES: ResumeRole[]
  SKILL_GROUPS: SkillGroup[]
}

export const VARIANTS: Record<string, () => Promise<VariantModule>> = {
  // devManager_v1 will be added in Task 2
}
```

- [ ] **Step 2: Verify TypeScript compiles**

Run: `npx tsc --noEmit`
Expected: No errors

- [ ] **Step 3: Commit**

```bash
git add src/app/resume/data/variants/index.ts
git commit -m "feat: add variant registry types and empty registry"
```

---

### Task 2: Create devManager_v1 variant data

**Files:**
- Create: `src/app/resume/data/variants/devManager_v1.ts`
- Modify: `src/app/resume/data/variants/index.ts`

- [ ] **Step 1: Write the variant data file**

```typescript
// src/app/resume/data/variants/devManager_v1.ts
import type { VariantMeta, VariantModule } from './index'
import type { ResumeRole, SkillGroup } from '../resume'

export const VARIANT_META: VariantMeta = {
  slug: 'devManager_v1',
  headline: 'Software Development Manager | DevEx AI Tools | Platform Automation | Agentic Engineering Workflows',
  description:
    'Engineering manager with 8+ years leading enterprise integration modernization, CI/CD governance, AI-assisted delivery, and platform engineering. Tailored for Figma DevEx AI Tools Manager role.',
  targetRole: 'Engineering Manager, DevEx AI Tools',
  targetCompany: 'Figma',
}

export const VARIANT_HEADLINE =
  'Software Development Manager | DevEx AI Tools | Platform Automation | Agentic Engineering Workflows'

export const VARIANT_SUMMARY =
  'Engineering manager and platform architect with 8+ years leading enterprise integration modernization, reusable platform engineering, CI/CD governance, and AI-assisted delivery across distributed teams. Rolled out GitHub Copilot and AI-assisted CI/CD code review practices across 10+ engineer API teams. Owned production integration platforms, managed $2M budgets, and built review, governance, and adoption practices for AI engineering tooling. Currently building hands-on AI automation workflows using Python, browser automation, LLM-assisted scripting, Next.js, Supabase, and production deployment patterns. Available for engineering leadership roles in DevEx AI tools, platform engineering, and developer productivity.'

export const VARIANT_TARGET_ROLES =
  'Engineering Manager, DevEx AI Tools · Platform Engineering Manager · Developer Productivity Lead · AI-Assisted Engineering Lead'

export const RESUME_ROLES: ResumeRole[] = [
  {
    role: 'Founder & Principal AI Automation Engineer',
    dateRange: 'Apr 2026 — Present',
    company: 'ZenCloudMedia',
    bullets: [
      'Built ZenCloudMedia as a hands-on AI automation studio for short-form media, publishing workflows, and agentic engineering systems — demonstrating builder-level depth in AI-assisted workflows.',
      'Built a production Next.js and Supabase web app with public resume, reels hub, trust pages, backend data flows, Vercel deployment, sitemap, and crawlable policy surface.',
      'Automated short-form video production workflows using Python, Remotion, browser automation, LLM-assisted scripting, captions, and publishing-ready outputs.',
      'Published machine-readable resume, reels, trust pages, sitemap, and crawler-ready content surfaces as a public proof system for AI workflow orchestration.',
    ],
  },
  {
    role: 'Software Development Manager & API Manager',
    dateRange: 'Apr 2025 — Apr 2026',
    company: 'ConvergeOne',
    bullets: [
      'Final technical escalation owner for global developers across US and India, resolving production integration blockers and architecture failures across distributed teams.',
      'Led high-availability API layers connecting core systems to Amazon Connect, Microsoft Fabric, Data Lake, managed services, and professional services workflows.',
      'Rolled out GitHub Copilot and AI-assisted CI/CD code review practices across a 10+ engineer API team, improving developer productivity while establishing review, governance, and adoption practices.',
      'Managed $2M annual budget across infrastructure, staffing, delivery planning, and executive ROI reporting.',
      'Defined KPI dashboards and delivery metrics to evaluate engineering productivity, delivery speed, platform adoption, and operational impact.',
    ],
  },
  {
    role: 'Solutions Architect & Lead Developer',
    dateRange: 'Jun 2022 — Apr 2025',
    company: 'ConvergeOne',
    bullets: [
      'Led the complete BizTalk EDI sunset, transitioning vendor integrations to MuleSoft Partner Manager with governed modular shared patterns.',
      'Evaluated vendor, platform, and custom-build options across integration, automation, and developer tooling initiatives — making thoughtful build-versus-buy decisions.',
      'Co-developed 100+ integration processes using a proprietary middle-tier framework and reusable delivery patterns, establishing repeatable engineering governance.',
    ],
  },
  {
    role: 'Solutions Architect',
    dateRange: 'Mar 2020 — Jun 2022',
    company: 'ConvergeOne',
    bullets: [
      'Established Priority/Complexity Matrix to group 90 namespaces for phased CloudHub 2.0 migration — managing risk across a large-scale platform modernization.',
      "Founded the IT Development Wiki — maintained for 8+ years as the company's primary technical knowledge base and developer documentation platform.",
      'Migrated TFS to Azure DevOps and hired DevOps engineers to support the growing team.',
    ],
  },
  {
    role: 'Senior Software Engineer',
    dateRange: 'Jun 2017 — Mar 2020',
    company: 'ConvergeOne',
    bullets: [
      'Authored the core .NET Middle-Tier Framework (C#, MEF, Async Queues) — backbone of 50%+ Time-to-Production improvement across integration delivery.',
      'Managed database reporting via SQL Server and SSRS across 90+ core business processes.',
      'Created the company SDLC and CI/CD process using TFS, establishing repeatable delivery governance for integration work.',
    ],
  },
  {
    role: 'Earlier Career',
    dateRange: '2003 — 2012',
    company: 'C.H. Robinson (Jr. Developer, 2003–2006) · LPS (Sr. Developer, 2008–2012)',
    bullets: [],
  },
]

export const SKILL_GROUPS: SkillGroup[] = [
  {
    name: 'DevEx & AI Tooling',
    variant: 'ai',
    items: [
      'GitHub Copilot',
      'LLMOps',
      'Agentic Workflows',
      'CI/CD Automation',
      'AI-Assisted Code Review',
      'Workflow Orchestration',
      'Developer Productivity',
      'Platform Reliability',
    ],
  },
  {
    name: 'Platform & Integration',
    variant: 'default',
    items: [
      'MuleSoft',
      'Microsoft Fabric',
      'Data Lake',
      'Amazon Connect',
      'CloudHub 2.0',
      'BizTalk EDI',
      '.NET / C#',
      'Supabase',
    ],
  },
  {
    name: 'Engineering Leadership',
    variant: 'infra',
    items: [
      'Team Building & Hiring',
      'Budget Management ($2M)',
      'KPI Dashboards',
      'Build-vs-Buy Decisions',
      'Evaluation Frameworks',
      'Cross-Functional Delivery',
    ],
  },
]
```

- [ ] **Step 2: Register the variant in the registry**

Edit `src/app/resume/data/variants/index.ts` — replace the empty registry:

```typescript
export const VARIANTS: Record<string, () => Promise<VariantModule>> = {
  devManager_v1: () => import('./devManager_v1'),
}
```

- [ ] **Step 3: Verify TypeScript compiles**

Run: `npx tsc --noEmit`
Expected: No errors

- [ ] **Step 4: Commit**

```bash
git add src/app/resume/data/variants/devManager_v1.ts src/app/resume/data/variants/index.ts
git commit -m "feat: add devManager_v1 variant data (Figma DevEx AI Tools Manager)"
```

---

### Task 3: Update PaperResume to accept variant data

**Files:**
- Modify: `src/app/resume/components/PaperResume.tsx`

- [ ] **Step 1: Add VariantData interface and update component signature**

Add the interface above the component and update the function signature. Replace this:

```typescript
// src/app/resume/components/PaperResume.tsx
'use client'
import { motion } from 'framer-motion'
import { Sparkles } from 'lucide-react'
import { RESUME_ROLES, SKILL_GROUPS, METRICS, PROJECTS } from '../data/resume'

export default function PaperResume() {
```

With this:

```typescript
// src/app/resume/components/PaperResume.tsx
'use client'
import { motion } from 'framer-motion'
import { Sparkles } from 'lucide-react'
import { RESUME_ROLES, SKILL_GROUPS, METRICS, PROJECTS, type ResumeRole, type SkillGroup } from '../data/resume'

export interface PaperResumeVariant {
  headline: string
  summary: string
  targetRoles: string
  roles: ResumeRole[]
  skillGroups: SkillGroup[]
}

interface PaperResumeProps {
  variant?: PaperResumeVariant
}

export default function PaperResume({ variant }: PaperResumeProps) {
  const headline = variant?.headline ?? 'Software Development Manager | AI Automation &amp; Enterprise Integration Architect'
  const summary = variant?.summary ??
    'Software development manager and AI automation architect with 8+ years leading ' +
    'enterprise integration modernization across .NET, MuleSoft, Microsoft Fabric, ' +
    'Data Lake, Amazon Connect, and AI-assisted delivery. Built reusable platforms ' +
    'behind 100+ integrations, 50%+ faster delivery, $2M budget ownership, and 10+ ' +
    'engineer leadership. Currently building ZenCloudMedia as a public proof platform ' +
    'for Next.js, Supabase, Remotion, Python, browser automation, and LLM-enabled media ' +
    'workflows. Available for AI automation, software development leadership, ' +
    'enterprise integration, and LLMOps architecture roles.'
  const targetRoles = variant?.targetRoles ??
    'AI Solutions Architect · Software Development Manager, AI/Automation · LLMOps / Agentic Workflow Lead · Enterprise Integration Architect'
  const roles = variant?.roles ?? RESUME_ROLES
  const skillGroups = variant?.skillGroups ?? SKILL_GROUPS
  const showStoryLink = !variant
```

- [ ] **Step 2: Replace the hardcoded headline (line 66)**

Replace:
```tsx
            Software Development Manager | AI Automation &amp; Enterprise Integration Architect
```
With:
```tsx
            {headline}
```

- [ ] **Step 3: Replace the hardcoded summary (lines 109-118)**

Replace the summary `<p>` block content:
```tsx
              {summary}
```

- [ ] **Step 4: Replace RESUME_ROLES with `roles` (line 121)**

Change:
```tsx
            {RESUME_ROLES.map((role, i) => (
              <div key={i} style={{ marginBottom: i < RESUME_ROLES.length - 1 ? 20 : 0 }}>
```
To:
```tsx
            {roles.map((role, i) => (
              <div key={i} style={{ marginBottom: i < roles.length - 1 ? 20 : 0 }}>
```

- [ ] **Step 5: Replace SKILL_GROUPS with `skillGroups` (line 161)**

Change:
```tsx
            {SKILL_GROUPS.map(g => (
```
To:
```tsx
            {skillGroups.map(g => (
```

- [ ] **Step 6: Replace hardcoded target roles (line 207)**

Replace:
```tsx
              AI Solutions Architect · Software Development Manager, AI/Automation · LLMOps / Agentic Workflow Lead · Enterprise Integration Architect
```
With:
```tsx
              {targetRoles}
```

- [ ] **Step 7: Conditionally hide the story link (lines 15-29)**

Wrap the "View Story" link in a conditional:

```tsx
        {showStoryLink && (
        <a
          href="/pgx/resume/story"
          style={{
            display: 'inline-flex', alignItems: 'center', gap: 7,
            padding: '7px 14px', fontSize: 11, fontFamily: 'sans-serif',
            background: 'linear-gradient(135deg, rgba(251,191,36,0.18), rgba(30,64,175,0.10))',
            border: '1px solid rgba(30,64,175,0.22)',
            color: '#0f172a', borderRadius: 999, letterSpacing: 0.5, textDecoration: 'none',
            boxShadow: '0 6px 18px rgba(15,23,42,0.08)',
          }}
        >
          <Sparkles size={13} strokeWidth={2} aria-hidden="true" />
          View Story
        </a>
        )}
```

Note: The outer wrapper div with `justify-between` will still be fine since the download button remains on the right. The "View Story" link simply disappears for variants.

- [ ] **Step 8: Verify build compiles**

Run: `npx tsc --noEmit`
Expected: No errors

- [ ] **Step 9: Verify existing page still works**

Run: `npm run dev`
Visit: `http://localhost:3000/pgx/resume`
Expected: Existing resume renders identically (story link visible, default headline/summary/roles)

- [ ] **Step 10: Commit**

```bash
git add src/app/resume/components/PaperResume.tsx
git commit -m "feat: add optional variant prop to PaperResume for tailored content"
```

---

### Task 4: Create dynamic variant route [variant]/page.tsx

**Files:**
- Create: `src/app/pgx/resume/[variant]/page.tsx`

- [ ] **Step 1: Ensure directory exists**

```bash
mkdir -p src/app/pgx/resume/\[variant\]
```

- [ ] **Step 2: Write the variant page**

```typescript
// src/app/pgx/resume/[variant]/page.tsx
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { cookies } from 'next/headers'
import PaperResume from '../../../resume/components/PaperResume'
import type { PaperResumeVariant } from '../../../resume/components/PaperResume'
import { VARIANTS, type VariantModule } from '../../../resume/data/variants'
import { METRICS, PROJECTS } from '../../../resume/data/resume'

type Props = {
  params: Promise<{ variant: string }>
}

async function loadVariant(slug: string): Promise<VariantModule | null> {
  const loader = VARIANTS[slug]
  if (!loader) return null
  return loader()
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { variant: slug } = await params
  const mod = await loadVariant(slug)
  if (!mod) return {}

  return {
    title: `Paul P. Xiong — ${mod.VARIANT_META.headline}`,
    description: mod.VARIANT_META.description,
    robots: { index: false, follow: false },
    alternates: {
      canonical: `/pgx/resume/${slug}`,
    },
    openGraph: {
      title: `Paul P. Xiong — ${mod.VARIANT_META.headline}`,
      description: mod.VARIANT_META.description,
    },
    twitter: {
      card: 'summary_large_image',
      title: `Paul P. Xiong Resume`,
      description: mod.VARIANT_META.description,
    },
  }
}

export default async function VariantResumePage({ params }: Props) {
  const { variant: slug } = await params
  const mod = await loadVariant(slug)

  if (!mod) {
    notFound()
  }

  // Pin visitor to this variant for 30 days
  const cookieStore = await cookies()
  cookieStore.set('resume_variant', slug, {
    path: '/',
    maxAge: 30 * 24 * 60 * 60,
    sameSite: 'lax',
  })

  const variantData: PaperResumeVariant = {
    headline: mod.VARIANT_HEADLINE,
    summary: mod.VARIANT_SUMMARY,
    targetRoles: mod.VARIANT_TARGET_ROLES,
    roles: mod.RESUME_ROLES,
    skillGroups: mod.SKILL_GROUPS,
  }

  return <PaperResume variant={variantData} />
}
```

- [ ] **Step 3: Verify build compiles**

Run: `npx tsc --noEmit`
Expected: No errors

- [ ] **Step 4: Test dev server**

Run: `npm run dev`
Visit: `http://localhost:3000/pgx/resume/devManager_v1`
Expected: Tailored resume renders with variant headline, no story link, Figma-tailored bullets

Visit: `http://localhost:3000/pgx/resume/nonexistent`
Expected: 404 page

- [ ] **Step 5: Commit**

```bash
git add src/app/pgx/resume/\[variant\]/page.tsx
git commit -m "feat: add dynamic variant route for tailored resumes"
```

---

### Task 5: Create ATS text route for variants

**Files:**
- Create: `src/app/pgx/resume/[variant]/text/route.ts`

- [ ] **Step 1: Ensure directory exists**

```bash
mkdir -p src/app/pgx/resume/\[variant\]/text
```

- [ ] **Step 2: Write the text route**

```typescript
// src/app/pgx/resume/[variant]/text/route.ts
import { notFound } from 'next/navigation'
import { VARIANTS } from '../../../../resume/data/variants'
import { METRICS, PROJECTS } from '../../../../resume/data/resume'
import { PROFILE } from '../../../../resume/data/machine-readable'

function buildVariantResumeText(
  headline: string,
  summary: string,
  targetRoles: string,
  roles: { role: string; dateRange: string; company: string; bullets: string[] }[],
  skillGroups: { name: string; items: string[] }[],
) {
  const lines = [
    PROFILE.name,
    headline,
    PROFILE.location,
    PROFILE.email,
    'Website: https://zencloudweb.com',
    'GitHub: https://github.com/PgxBaku/ZenCloudMedia',
    '',
    'Professional Summary',
    summary,
    '',
    'Target Roles',
    targetRoles,
    '',
    'Key Metrics',
    ...METRICS.map((metric) => `- ${metric.value} ${metric.label}`),
    '',
    'Experience',
    ...roles.flatMap((role) => [
      `${role.role} | ${role.company} | ${role.dateRange}`,
      ...role.bullets.map((bullet) => `- ${bullet}`),
      '',
    ]),
    'Skills',
    ...skillGroups.flatMap((group) => [
      `${group.name}: ${group.items.join(', ')}`,
    ]),
    '',
    'Projects',
    ...PROJECTS.flatMap((project) => [
      `${project.name}`,
      project.desc,
      'url' in project && project.url ? project.url : '',
      '',
    ]),
    'Education',
    'B.A. Computer Science - University of St. Thomas',
    'Saint Paul, MN. International study in China and Japan.',
    '',
  ]

  return lines.filter((line, index, arr) => line !== '' || arr[index - 1] !== '').join('\n')
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ variant: string }> },
) {
  const { variant: slug } = await params
  const loader = VARIANTS[slug]
  if (!loader) {
    notFound()
  }

  const mod = await loader()

  return new Response(
    buildVariantResumeText(
      mod.VARIANT_HEADLINE,
      mod.VARIANT_SUMMARY,
      mod.VARIANT_TARGET_ROLES,
      mod.RESUME_ROLES,
      mod.SKILL_GROUPS,
    ),
    {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Cache-Control': 'public, max-age=3600, stale-while-revalidate=86400',
      },
    },
  )
}
```

- [ ] **Step 3: Verify build compiles**

Run: `npx tsc --noEmit`
Expected: No errors

- [ ] **Step 4: Test the text endpoint**

Visit: `http://localhost:3000/pgx/resume/devManager_v1/text`
Expected: Plain text resume with variant headline, summary, roles, and skills

- [ ] **Step 5: Commit**

```bash
git add src/app/pgx/resume/\[variant\]/text/route.ts
git commit -m "feat: add ATS plain-text route for resume variants"
```

---

### Task 6: Add cookie redirect check to /resume page

**Files:**
- Modify: `src/app/resume/page.tsx`

- [ ] **Step 1: Update the redirector to check for variant cookie**

Replace the entire file content:

```typescript
// src/app/resume/page.tsx
import { permanentRedirect } from 'next/navigation'
import { cookies } from 'next/headers'

export default async function ResumePage() {
  const cookieStore = await cookies()
  const variant = cookieStore.get('resume_variant')?.value

  if (variant) {
    permanentRedirect(`/pgx/resume/${variant}`)
  }

  permanentRedirect('/pgx/resume')
}
```

- [ ] **Step 2: Verify TypeScript compiles**

Run: `npx tsc --noEmit`
Expected: No errors

- [ ] **Step 3: Test the redirect**

With `resume_variant=devManager_v1` cookie set (from visiting variant page):
Visit: `http://localhost:3000/resume`
Expected: Redirects to `/pgx/resume/devManager_v1` (not `/pgx/resume`)

Without cookie:
Visit: `http://localhost:3000/resume`
Expected: Redirects to `/pgx/resume` (existing behavior)

- [ ] **Step 4: Commit**

```bash
git add src/app/resume/page.tsx
git commit -m "feat: add variant cookie redirect check to /resume page"
```

---

### Task 7: Add cookie redirect check to /pgx/resume page

**Files:**
- Modify: `src/app/pgx/resume/page.tsx`

- [ ] **Step 1: Add cookie check before rendering**

Add the cookie import and make the component async. Replace the component:

```typescript
import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'
import PaperResume from '../../resume/components/PaperResume'
import { buildResumeJsonLd } from '../../resume/data/machine-readable'

export const metadata: Metadata = {
  title: 'Paul P. Xiong Resume | AI Automation & Enterprise Integration',
  description:
    'Software development manager and AI automation architect with Microsoft Fabric, Data Lake, Supabase, 100+ integrations, $2M budget ownership, and 10+ engineers led.',
  alternates: {
    canonical: '/pgx/resume',
  },
  openGraph: {
    title: 'Paul P. Xiong Resume | Software Development Manager',
    description:
      'ZenCloudMedia founder building AI automation systems, backed by enterprise integration leadership across MuleSoft, .NET, Amazon Connect, Microsoft Fabric, and Data Lake.',
    images: ['/zencloudmedia-logo.png'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Paul P. Xiong Resume',
    description:
      'Software development manager and AI automation architect with Microsoft Fabric, Data Lake, Supabase, and enterprise integration delivery.',
    images: ['/zencloudmedia-logo.png'],
  },
}

export default async function PgxResumePage() {
  const cookieStore = await cookies()
  const variant = cookieStore.get('resume_variant')?.value

  if (variant) {
    redirect(`/pgx/resume/${variant}`)
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(buildResumeJsonLd()) }}
      />
      <PaperResume />
    </>
  )
}
```

Key changes from original:
- Added `import { redirect } from 'next/navigation'`
- Added `import { cookies } from 'next/headers'`
- Changed `function PgxResumePage()` to `async function PgxResumePage()`
- Added cookie check before render

- [ ] **Step 2: Verify build compiles**

Run: `npx tsc --noEmit`
Expected: No errors

- [ ] **Step 3: Test the gate behavior**

With `resume_variant=devManager_v1` cookie set:
Visit: `http://localhost:3000/pgx/resume`
Expected: Redirects to `/pgx/resume/devManager_v1`

Without cookie:
Visit: `http://localhost:3000/pgx/resume`
Expected: Shows the main resume (existing behavior)

Visit: `http://localhost:3000/pgx/resume/story`
Expected: Story still works — NOT gated

- [ ] **Step 4: Commit**

```bash
git add src/app/pgx/resume/page.tsx
git commit -m "feat: add variant cookie redirect check to /pgx/resume page"
```

---

### Task 8: Production build verification

- [ ] **Step 1: Run full production build**

Run: `npm run build`
Expected: Build completes successfully, no type errors, no ESLint errors

- [ ] **Step 2: Verify all routes in build output**

Check the build output for these routes:
- `/pgx/resume` — should still be in output
- `/pgx/resume/[variant]` — should appear as a dynamic route
- `/pgx/resume/[variant]/text` — should appear as a dynamic API route

- [ ] **Step 3: Spot-check the production build locally**

Run: `npm run start`
Visit: `http://localhost:3000/pgx/resume/devManager_v1`
Expected: Variant resume renders with tailored content

- [ ] **Step 4: Final commit if any build fixes were needed**

```bash
git add -A
git commit -m "chore: production build verification and fixes"
```
