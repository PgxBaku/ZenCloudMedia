'use client'
import { useEffect } from 'react'

export default function ResumeError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('[resume] unhandled error:', error)
  }, [error])

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0f172a] text-white">
      <div className="text-center max-w-md mx-auto px-6">
        <h2 className="text-xl font-semibold mb-3">Something went wrong</h2>
        <p className="text-white/60 text-sm mb-6">
          The resume animation encountered an error. This is likely temporary.
        </p>
        <button
          onClick={reset}
          className="px-5 py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-sm font-medium transition"
        >
          Try again
        </button>
        <p className="mt-4 text-xs text-white/40">
          If this persists, try{' '}
          <a href="/resume#skipanimation" className="underline">
            skipping the animation
          </a>
          .
        </p>
      </div>
    </div>
  )
}
