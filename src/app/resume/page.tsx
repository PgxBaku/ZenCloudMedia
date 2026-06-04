// src/app/resume/page.tsx
import { permanentRedirect } from 'next/navigation'
import { cookies } from 'next/headers'
import { VARIANTS } from '../resume/data/variants'

export default async function ResumePage() {
  const cookieStore = await cookies()
  const variant = cookieStore.get('resume_variant')?.value

  if (variant && VARIANTS[variant]) {
    permanentRedirect(`/pgx/resume/${variant}`)
  }

  permanentRedirect('/pgx/resume')
}
