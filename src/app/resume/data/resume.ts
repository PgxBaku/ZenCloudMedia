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
    dateRange: '2025 — Present',
    role: 'Software Dev Manager & API Manager',
    company: 'ConvergeOne · $2M budget · 10+ team',
    tags: ['Amazon Connect', 'Azure Fabric', 'AI / Copilot', 'C-Suite'],
    metric: '🏔️ 50%+ Time-to-Production improvement',
    flagLeft: 1760,
    poleHeight: 114,
    flagStyle: 'peak',
    aboveGround: 215,
  },
  {
    id: 'zen-cloud',
    year: 'ZEN CLOUD',
    dateRange: 'Side Project · Ongoing',
    role: 'Zen Cloud Media',
    company: 'Founder & Lead Developer',
    tags: ['Remotion', 'Python', 'Claude', 'Codex', 'Ollama', 'DeepSeek', 'Next.js'],
    metric: '🎬 AI-automated video production pipeline',
    flagLeft: 2000,
    poleHeight: 200,
    flagStyle: 'amber',
    aboveGround: 235,
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
