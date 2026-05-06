'use client'
import { useEffect } from 'react'

export default function DivinationError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('[divination] unhandled error:', error)
  }, [error])

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0d1210] text-white">
      <div className="text-center max-w-md mx-auto px-6">
        <h2 className="text-xl font-semibold mb-3">Something went wrong</h2>
        <p className="text-white/60 text-sm mb-6">
          The divination page encountered an error. Please try again.
        </p>
        <button
          onClick={reset}
          className="px-5 py-2.5 rounded-lg bg-amber-600 hover:bg-amber-500 text-sm font-medium transition"
        >
          Try again
        </button>
      </div>
    </div>
  )
}
