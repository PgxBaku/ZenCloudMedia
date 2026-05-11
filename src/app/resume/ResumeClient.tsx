'use client'
import { useState, useRef, useCallback, useEffect } from 'react'
import dynamic from 'next/dynamic'
import ResumeHeader from './components/ResumeHeader'
import MobileResumeStory from './components/MobileResumeStory'

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
  const [isMobileStory, setIsMobileStory] = useState<boolean | null>(null)
  const paperRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const media = window.matchMedia('(max-width: 767px)')
    const sync = () => setIsMobileStory(media.matches)
    sync()
    media.addEventListener('change', sync)
    return () => media.removeEventListener('change', sync)
  }, [])

  const handleProgress = useCallback((pct: number, lbl: string) => {
    setProgress(pct)
    setLabel(lbl)
  }, [])

  const handleResumeReveal = useCallback(() => {
    setTimeout(() => {
      paperRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 200)
  }, [])

  return (
    <>
      <ResumeHeader progress={progress} label={label} />
      <main>
        {isMobileStory === null ? (
          <div className="h-screen bg-slate-950" />
        ) : isMobileStory ? (
          <MobileResumeStory onResumeReveal={handleResumeReveal} onProgress={handleProgress} />
        ) : (
          <TerrainScene onResumeReveal={handleResumeReveal} onProgress={handleProgress} />
        )}
        <div ref={paperRef}>
          <PaperResume />
        </div>
      </main>
    </>
  )
}
