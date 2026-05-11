import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import { METRICS, PROJECTS, RESUME_ROLES, SKILL_GROUPS } from '../../../resume/data/resume'
import { PROFILE, RESUME_ATS_PATH } from '../../../resume/data/machine-readable'

export const metadata: Metadata = {
  title: 'Paul P. Xiong ATS Resume | AI Automation & Enterprise Integration',
  description:
    'Plain-text, ATS-friendly resume for Paul P. Xiong covering AI automation, software development management, enterprise integration, Supabase, Next.js, MuleSoft, .NET, Microsoft Fabric, Data Lake, and Amazon Connect.',
  alternates: {
    canonical: RESUME_ATS_PATH,
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function AtsResumePage() {
  return (
    <main className="mx-auto max-w-3xl bg-white px-6 py-10 text-slate-950 sm:px-10">
      <header>
        <h1 className="text-3xl font-semibold tracking-normal">{PROFILE.name}</h1>
        <p className="mt-2 text-lg font-medium">{PROFILE.title}</p>
        <p className="mt-2 text-sm">{PROFILE.location}</p>
        <p className="text-sm">{PROFILE.email}</p>
        <p className="text-sm">Website: https://zencloudweb.com</p>
        <p className="text-sm">GitHub: https://github.com/PgxBaku/ZenCloudMedia</p>
      </header>

      <ResumeSection title="Professional Summary">
        <p>{PROFILE.description}</p>
        <p>{PROFILE.availability}</p>
      </ResumeSection>

      <ResumeSection title="Target Roles">
        <ul>
          {PROFILE.targetRoles.map((role) => (
            <li key={role}>{role}</li>
          ))}
        </ul>
      </ResumeSection>

      <ResumeSection title="Key Metrics">
        <ul>
          {METRICS.map((metric) => (
            <li key={metric.label}>
              {metric.value} {metric.label}
            </li>
          ))}
        </ul>
      </ResumeSection>

      <ResumeSection title="Experience">
        {RESUME_ROLES.map((role) => (
          <article key={`${role.role}-${role.dateRange}`} className="mb-6">
            <h3 className="text-base font-semibold">{role.role}</h3>
            <p className="text-sm font-medium">{role.company}</p>
            <p className="text-sm">{role.dateRange}</p>
            {role.bullets.length > 0 && (
              <ul>
                {role.bullets.map((bullet) => (
                  <li key={bullet}>{bullet}</li>
                ))}
              </ul>
            )}
          </article>
        ))}
      </ResumeSection>

      <ResumeSection title="Skills">
        {SKILL_GROUPS.map((group) => (
          <p key={group.name}>
            <strong>{group.name}:</strong> {group.items.join(', ')}
          </p>
        ))}
      </ResumeSection>

      <ResumeSection title="Projects">
        {PROJECTS.map((project) => (
          <article key={project.name} className="mb-4">
            <h3 className="text-base font-semibold">{project.name}</h3>
            <p>{project.desc}</p>
            {'url' in project && project.url && <p>{project.url}</p>}
          </article>
        ))}
      </ResumeSection>

      <ResumeSection title="Education">
        <p>B.A. Computer Science - University of St. Thomas</p>
        <p>Saint Paul, MN. International study in China and Japan.</p>
      </ResumeSection>
    </main>
  )
}

function ResumeSection({
  children,
  title,
}: Readonly<{
  children: ReactNode
  title: string
}>) {
  return (
    <section className="mt-8">
      <h2 className="border-b border-slate-300 pb-2 text-xl font-semibold tracking-normal">
        {title}
      </h2>
      <div className="mt-3 space-y-2 text-sm leading-6 [&_ul]:list-disc [&_ul]:pl-5">
        {children}
      </div>
    </section>
  )
}
