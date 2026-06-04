import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { cookies } from 'next/headers'
import PaperResume from '../../../resume/components/PaperResume'
import type { PaperResumeVariant } from '../../../resume/components/PaperResume'
import { VARIANTS, type VariantModule } from '../../../resume/data/variants'

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
      title: 'Paul P. Xiong Resume',
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
