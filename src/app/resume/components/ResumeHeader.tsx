// src/app/resume/components/ResumeHeader.tsx
'use client'

type Props = {
  progress: number   // 0–100
  label: string
}

export default function ResumeHeader({ progress, label }: Props) {
  return (
    <header className="fixed top-0 left-0 right-0 z-[300] flex items-center gap-6 px-8 py-2.5"
      style={{ background: 'rgba(10,10,20,0.88)', backdropFilter: 'blur(12px)', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
      <div>
        <div className="text-slate-200 text-sm font-light tracking-[3px] uppercase">Paul Xiong</div>
        <div className="text-slate-500 text-[10px] tracking-[2px] uppercase" style={{ fontFamily: 'sans-serif' }}>
          Engineering Manager · AI-Capable
        </div>
      </div>
      <div className="flex-1 h-[2px] rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.07)' }}>
        <div
          className="h-full rounded-full"
          style={{
            width: `${progress}%`,
            background: 'linear-gradient(90deg,#6366f1,#a78bfa)',
            transition: 'width 0.4s ease',
          }}
        />
      </div>
      <div className="text-slate-500 text-[10px] tracking-[1px]" style={{ fontFamily: 'sans-serif' }}>
        {label}
      </div>
    </header>
  )
}
