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
