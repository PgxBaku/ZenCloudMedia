// src/app/resume/data/variants/index.ts
import type { ResumeRole, SkillGroup } from '../resume'

export interface VariantMeta {
  slug: string
  headline: string
  description: string
  targetRole: string
  targetCompany: string
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
  // Variants will be registered here (Task 2)
}
