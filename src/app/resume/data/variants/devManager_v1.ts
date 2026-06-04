// src/app/resume/data/variants/devManager_v1.ts
import type { VariantMeta } from './index'
import type { ResumeRole, SkillGroup } from '../resume'

export const VARIANT_META: VariantMeta = {
  slug: 'devManager_v1',
  headline:
    'Software Development Manager | DevEx AI Tools | Platform Automation | Agentic Engineering Workflows',
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
