'use client'

import { useEffect, useRef } from 'react'
import { setVariantCookie } from './actions'

export default function VariantCookieSetter({ slug }: { slug: string }) {
  const called = useRef(false)

  useEffect(() => {
    if (called.current) return
    called.current = true
    setVariantCookie(slug)
  }, [slug])

  return null
}
