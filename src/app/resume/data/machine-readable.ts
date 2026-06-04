import { METRICS, PROJECTS, RESUME_ROLES, SKILL_GROUPS } from './resume'

export const SITE_URL = 'https://zencloudmedia.vercel.app'
export const RESUME_PATH = '/pgx/resume'
export const RESUME_ATS_PATH = '/pgx/resume/ats'
export const RESUME_STORY_PATH = '/pgx/resume/story'
export const RESUME_TEXT_PATH = '/pgx/resume/text'

export const PROFILE = {
  name: 'Paul P. Xiong',
  email: 'pgxiong@gmail.com',
  location: 'Orange County, CA and Twin Cities, MN',
  title: 'Founder and Principal AI Automation Engineer',
  headline:
    'AI automation engineer, software development manager, and enterprise integration architect.',
  description:
    'Software development manager and AI automation architect with 8+ years leading enterprise integration modernization across .NET, MuleSoft, Microsoft Fabric, Data Lake, Amazon Connect, and AI-assisted delivery. Built reusable platforms behind 100+ integrations, 50%+ faster delivery, $2M budget ownership, and 10+ engineer leadership. Currently building ZenCloudMedia as a public proof platform for Next.js, Supabase, Remotion, Python, browser automation, and LLM-enabled media workflows.',
  availability:
    'Available for AI automation, software development leadership, enterprise integration, and LLMOps architecture roles.',
  targetRoles: [
    'AI Solutions Architect',
    'Software Development Manager, AI/Automation',
    'LLMOps Lead',
    'Agentic Workflow Lead',
    'Enterprise Integration Architect',
  ],
  sameAs: ['https://zencloudweb.com', 'https://github.com/PgxBaku/ZenCloudMedia'],
} as const

export const ALL_SKILLS = Array.from(
  new Set(SKILL_GROUPS.flatMap((group) => group.items)),
)

export const RESUME_KEYWORDS = [
  ...ALL_SKILLS,
  'AI automation',
  'enterprise integration',
  'software development management',
  'API management',
  'systems architecture',
  'short-form media automation',
  'browser automation',
  'LLM-assisted scripting',
  'CI/CD',
  'Azure DevOps',
  'Microsoft Fabric',
  'Data Lake',
  'engineering leadership',
  'budget management',
  'vendor integrations',
  'MuleSoft Partner Manager',
]

export function absoluteUrl(path: string) {
  return new URL(path, SITE_URL).toString()
}

export function buildResumeJsonLd() {
  const currentRole = RESUME_ROLES[0]
  const priorRoles = RESUME_ROLES.slice(1).filter((role) => role.bullets.length > 0)

  return {
    '@context': 'https://schema.org',
    '@type': 'ProfilePage',
    '@id': `${absoluteUrl(RESUME_PATH)}#profile`,
    url: absoluteUrl(RESUME_PATH),
    name: `${PROFILE.name} Resume`,
    description: PROFILE.description,
    dateModified: '2026-05-11',
    mainEntity: {
      '@type': 'Person',
      '@id': `${absoluteUrl(RESUME_PATH)}#person`,
      name: PROFILE.name,
      email: PROFILE.email,
      url: absoluteUrl(RESUME_PATH),
      sameAs: PROFILE.sameAs,
      jobTitle: PROFILE.title,
      description: PROFILE.description,
      homeLocation: {
        '@type': 'Place',
        name: PROFILE.location,
      },
      worksFor: {
        '@type': 'Organization',
        name: currentRole.company,
        url: 'https://zencloudweb.com',
      },
      alumniOf: {
        '@type': 'CollegeOrUniversity',
        name: 'University of St. Thomas',
      },
      skills: RESUME_KEYWORDS,
      knowsAbout: RESUME_KEYWORDS,
      hasOccupation: [
        {
          '@type': 'Occupation',
          name: PROFILE.title,
          occupationLocation: {
            '@type': 'Country',
            name: 'United States',
          },
          skills: RESUME_KEYWORDS,
        },
        {
          '@type': 'Occupation',
          name: 'Software Development Manager',
          skills: [
            'engineering leadership',
            'API management',
            'enterprise integration',
            'AI-assisted software delivery',
          ],
        },
      ],
      memberOf: priorRoles.map((role) => ({
        '@type': 'OrganizationRole',
        roleName: role.role,
        memberOf: {
          '@type': 'Organization',
          name: role.company,
        },
        description: role.bullets.join(' '),
      })),
      subjectOf: PROJECTS.map((project) => ({
        '@type': 'CreativeWork',
        name: project.name,
        description: project.desc,
        ...('url' in project && project.url ? { url: project.url } : {}),
      })),
    },
  }
}

export function buildResumeText() {
  const lines = [
    PROFILE.name,
    PROFILE.title,
    PROFILE.location,
    PROFILE.email,
    'Website: https://zencloudweb.com',
    'GitHub: https://github.com/PgxBaku/ZenCloudMedia',
    '',
    'Professional Summary',
    PROFILE.description,
    PROFILE.availability,
    '',
    'Target Roles',
    ...PROFILE.targetRoles.map((role) => `- ${role}`),
    '',
    'Key Metrics',
    ...METRICS.map((metric) => `- ${metric.value} ${metric.label}`),
    '',
    'Experience',
    ...RESUME_ROLES.flatMap((role) => [
      `${role.role} | ${role.company} | ${role.dateRange}`,
      ...role.bullets.map((bullet) => `- ${bullet}`),
      '',
    ]),
    'Skills',
    ...SKILL_GROUPS.flatMap((group) => [
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
