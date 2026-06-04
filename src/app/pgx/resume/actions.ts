'use server'

import { cookies } from 'next/headers'

export async function setVariantCookie(slug: string) {
  const cookieStore = await cookies()
  cookieStore.set('resume_variant', slug, {
    path: '/',
    maxAge: 30 * 24 * 60 * 60,
    sameSite: 'lax',
    httpOnly: true,
    secure: true,
  })
}
