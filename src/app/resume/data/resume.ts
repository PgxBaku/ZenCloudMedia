// src/app/resume/data/resume.ts

export const ANIMATION_CONFIG = {
  heroFadeIn: 0,
  pathStartDelay: 0.4,
  milestoneInterval: 3.5,
  starAppearDelay: 0,
  zoomOutDelay: 14.0,
  zoomOutDuration: 1.8,
  resumeRevealDelay: 2.0,
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
    aboveGround: 140,
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
    aboveGround: 160,
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
    aboveGround: 185,
  },
  {
    id: 'dev-manager',
    year: '2025',
    dateRange: '2025 — 2026',
    role: 'Software Development Manager & API Manager',
    company: 'ConvergeOne · $2M budget · 10+ team',
    tags: ['Amazon Connect', 'Microsoft Fabric', 'Data Lake', 'GitHub Copilot'],
    metric: '🏔️ 50%+ Time-to-Production improvement',
    flagLeft: 1760,
    poleHeight: 114,
    flagStyle: 'peak',
    aboveGround: 215,
  },
  {
    id: 'zen-cloud',
    year: '2026',
    dateRange: 'Apr 2026 — Present',
    role: 'Founder & Principal AI Automation Engineer',
    company: 'ZenCloudMedia',
    tags: ['Remotion', 'Python', 'Browser Automation', 'LLMOps', 'Next.js', 'Vercel'],
    metric: '🎬 Building AI-native media and automation systems',
    flagLeft: 2000,
    poleHeight: 200,
    flagStyle: 'amber',
    aboveGround: 235,
  },
]

export const RESUME_ROLES: ResumeRole[] = [
  {
    role: 'Founder & Principal AI Automation Engineer',
    dateRange: 'Apr 2026 — Present',
    company: 'ZenCloudMedia',
    bullets: [
      'Built ZenCloudMedia as a hands-on AI automation studio for short-form media, publishing workflows, and agentic engineering systems.',
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
      'Final technical escalation owner for global developers across US and India, resolving production integration blockers and architecture failures.',
      'Led high-availability API layers connecting core systems to Amazon Connect, Microsoft Fabric, Data Lake, managed services, and professional services workflows.',
      'Managed $2M annual budget across infrastructure, staffing, delivery planning, and executive ROI reporting.',
      'Rolled out GitHub Copilot and AI-assisted CI/CD code review practices across a 10+ engineer API team.',
    ],
  },
  {
    role: 'Solutions Architect & Lead Developer',
    dateRange: 'Jun 2022 — Apr 2025',
    company: 'ConvergeOne',
    bullets: [
      'Led the complete BizTalk EDI sunset, transitioning vendor integrations to MuleSoft Partner Manager.',
      'Directed porting of 25 business processes into governed MuleSoft assets using modular shared patterns.',
      'Co-developed 100+ integration processes using a proprietary middle-tier framework and reusable delivery patterns.',
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
    name: 'Integration & Cloud',
    variant: 'default',
    items: ['MuleSoft', 'BizTalk EDI', 'Microsoft Fabric', 'Data Lake', 'Amazon Connect', 'CloudHub 2.0', 'MQ FIFO'],
  },
  {
    name: 'AI & Engineering',
    variant: 'ai',
    items: ['Copilot', 'LLMOps', 'Agentic Workflows', '.NET / C#', 'Python', 'Next.js', 'Remotion', 'Supabase'],
  },
  {
    name: 'Leadership',
    variant: 'infra',
    items: ['Executive Roadmaps', 'Budget Management', 'Engineering Hiring', 'Azure DevOps KPI Dashboards'],
  },
]

export const METRICS = [
  { value: '50%+', label: 'Faster Delivery' },
  { value: '100+', label: 'Integrations Built' },
  { value: '10+', label: 'Engineers Led' },
  { value: '$2M', label: 'Budget Managed' },
]

export const PROJECTS = [
  { name: 'ZenCloudMedia', desc: 'Automated short-form video workflow using Python, Remotion, browser automation, LLM-assisted scripting, captions, and publishing-ready outputs.', url: 'https://zencloudweb.com' },
  { name: 'ZenCloudMedia GitHub', desc: 'Public Next.js/Supabase site repo that backs the resume, reels hub, trust pages, backend workflows, and production Vercel deployment.', url: 'https://github.com/PgxBaku/ZenCloudMedia' },
  { name: 'Enterprise Integration Modernization', desc: 'BizTalk EDI sunset, Partner Manager transition, and 100+ integration processes delivered through governed reusable patterns.' },
  { name: '7pace + ADO KPI Dashboards', desc: 'Custom ADO widgets correlating time-tracking data with developer velocity metrics and engineering performance reporting.' },
]
