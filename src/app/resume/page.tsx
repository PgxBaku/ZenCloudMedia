// src/app/resume/page.tsx
import { permanentRedirect } from 'next/navigation'
import { cookies } from 'next/headers'

export default async function ResumePage() {
  const cookieStore = await cookies()
  const variant = cookieStore.get('resume_variant')?.value

  if (variant) {
    permanentRedirect(`/pgx/resume/${variant}`)
  }

  permanentRedirect('/pgx/resume')
}
