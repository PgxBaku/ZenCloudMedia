import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'
import PaperResume from '../../resume/components/PaperResume'
import { buildResumeJsonLd } from '../../resume/data/machine-readable'
import { VARIANTS } from '../../resume/data/variants'

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

  if (variant && VARIANTS[variant]) {
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
