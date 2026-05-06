'use client'
import { useState, useRef, useCallback } from 'react'
import dynamic from 'next/dynamic'
import ResumeHeader from './components/ResumeHeader'

const TerrainScene = dynamic(() => import('./components/TerrainScene'), {
  ssr: false,
  loading: () => <div className="h-screen" />,
})

const PaperResume = dynamic(() => import('./components/PaperResume'), {
  loading: () => <div className="min-h-screen" />,
})

export default function ResumeClient() {
  const [progress, setProgress] = useState(0)
  const [label, setLabel] = useState('2017')
  const [revealed, setRevealed] = useState(false)
  const paperRef = useRef<HTMLDivElement>(null)

  const handleProgress = useCallback((pct: number, lbl: string) => {
    setProgress(pct)
    setLabel(lbl)
  }, [])

  const handleResumeReveal = useCallback(() => {
    setRevealed(true)
    setTimeout(() => {
      paperRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 200)
  }, [])

  return (
    <>
      <ResumeHeader progress={progress} label={label} />
      <main>
        <TerrainScene onResumeReveal={handleResumeReveal} onProgress={handleProgress} />
        <div ref={paperRef}>
          {revealed ? <PaperResume /> : null}
        </div>
      </main>
    </>
  )
}
