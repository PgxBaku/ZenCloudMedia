'use client'
import { useEffect, useRef, useState } from 'react'

const WALK_FRAMES   = 9
const TURN_FRAMES   = 6
const MS_PER_FRAME  = 200
const WALK_PX       = 3   // pixels moved per walk frame

// All frames padded to 150×145 with bear body anchored consistently
// Display at 80%: 120×116
const BEAR_W = 120
const BEAR_H = 120

const IMG_W = 120
const IMG_H = 116

// dir: 1 = face left (no flip), -1 = face right (flip)
type Dir = 1 | -1

type Phase =
  | { kind: 'walk';    dir: Dir; totalFrames: number }
  | { kind: 'turnIn';  dir: Dir }
  | { kind: 'hold';    dir: Dir; ticks: number }
  | { kind: 'turnOut'; dir: Dir }

function lcg(seed: number) {
  let s = seed >>> 0
  return () => { s = (Math.imul(s, 1664525) + 1013904223) >>> 0; return s / 4294967296 }
}

function buildSequence(seed: number): Phase[] {
  const r = lcg(seed)
  const phases: Phase[] = []
  let dir: Dir = r() > 0.5 ? 1 : -1

  for (let i = 0; i < 12; i++) {
    const cycles = 1 + Math.floor(r() * 4)
    phases.push({ kind: 'walk',    dir, totalFrames: cycles * WALK_FRAMES })
    phases.push({ kind: 'turnIn',  dir })
    phases.push({ kind: 'hold',    dir, ticks: 2 + Math.floor(r() * 6) })
    const nextDir: Dir = r() > 0.5 ? 1 : -1
    phases.push({ kind: 'turnOut', dir: nextDir })
    dir = nextDir
  }
  return phases
}

interface DisplayState {
  src: string
  scaleX: number
  x: number
}

export default function BearScene() {
  const seq      = useRef<Phase[]>([])
  const phaseIdx = useRef(0)
  const frame    = useRef(0)
  const xPos     = useRef(500)

  const [disp, setDisp] = useState<DisplayState>({
    src: '/bear-frames/frame0.png', scaleX: -1, x: 500,
  })

  useEffect(() => {
    const minX = 60
    const maxX = (window.innerWidth ?? 1280) - 180
    xPos.current = minX + Math.floor(Math.random() * (maxX - minX))
    seq.current = buildSequence(Date.now() % 100000)

    const tick = () => {
      const phases = seq.current
      const pi     = phaseIdx.current % phases.length
      const phase  = phases[pi]
      const f      = frame.current
      let src  = '/bear-frames/frame0.png'
      let sx   = 1
      let done = false

      if (phase.kind === 'walk') {
        src = `/bear-frames/frame${f % WALK_FRAMES}.png`
        sx  = phase.dir
        const prevX = xPos.current
        xPos.current = Math.max(60, Math.min((window?.innerWidth ?? 1280) - 180,
          xPos.current + -phase.dir * WALK_PX))
        done = f >= phase.totalFrames - 1 || xPos.current === prevX
      } else if (phase.kind === 'turnIn') {
        src  = `/bear-frames/turn_front${Math.min(f, TURN_FRAMES - 1)}.png`
        sx   = phase.dir
        done = f >= TURN_FRAMES - 1
      } else if (phase.kind === 'hold') {
        src  = `/bear-frames/turn_front${TURN_FRAMES - 1}.png`
        sx   = phase.dir
        done = f >= phase.ticks - 1
      } else if (phase.kind === 'turnOut') {
        if (f === 0) {
          const w = window.innerWidth ?? 1280
          const pos = xPos.current / w
          const probLeft = pos < 0.25 ? 0.15 : pos > 0.75 ? 0.85 : 0.5
          const newDir: Dir = Math.random() < probLeft ? 1 : -1
          phase.dir = newDir
          const len = phases.length
          for (const offset of [1, 2, 3]) {
            const p = phases[(pi + offset) % len]
            if (p.kind === 'walk' || p.kind === 'turnIn' || p.kind === 'hold') p.dir = newDir
          }
        }
        src  = `/bear-frames/turn_front${TURN_FRAMES - 1 - Math.min(f, TURN_FRAMES - 1)}.png`
        sx   = phase.dir
        done = f >= TURN_FRAMES - 1
      }

      setDisp({ src, scaleX: sx, x: xPos.current })
      if (done) { phaseIdx.current++; frame.current = 0 }
      else       { frame.current++ }
    }

    const id = setInterval(tick, MS_PER_FRAME)
    return () => clearInterval(id)
  }, [])

  return (
    <div style={{
      position: 'absolute',
      bottom: '4%',
      left: disp.x,
      width: BEAR_W,
      height: BEAR_H,
      transform: 'translateX(-50%)',
      zIndex: 40,
      pointerEvents: 'none',
    }}>
      <img
        src={disp.src}
        alt=""
        width={IMG_W}
        height={IMG_H}
        style={{
          display: 'block',
          imageRendering: 'pixelated',
          transform: `scaleX(${disp.scaleX})`,
          position: 'absolute',
          bottom: 0,
          left: '50%',
          marginLeft: `${-IMG_W / 2}px`,
        }}
      />
    </div>
  )
}
