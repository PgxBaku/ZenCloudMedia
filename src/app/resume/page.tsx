// src/app/resume/page.tsx
'use client'
import { useState, useRef, useCallback } from 'react'
import TerrainScene from './components/TerrainScene'
import PaperResume from './components/PaperResume'
import ResumeHeader from './components/ResumeHeader'

export default function ResumePage() {
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
