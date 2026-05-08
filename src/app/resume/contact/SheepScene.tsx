'use client'
import { useEffect, useRef, useState } from 'react'

const WALK_FRAMES  = 8
const MS_PER_FRAME = 150
const WALK_PX      = 2

// All frames normalized to 133×165, displayed at 75%
const SHEEP_W = 100
const SHEEP_H = 124
const IMG_W   = 100
const IMG_H   = 124

type Phase =
  | { kind: 'walkLeft';  totalFrames: number }
  | { kind: 'walkRight'; totalFrames: number }
  | { kind: 'hold';      ticks: number }

function lcg(seed: number) {
  let s = seed >>> 0
  return () => { s = (Math.imul(s, 1664525) + 1013904223) >>> 0; return s / 4294967296 }
}

function buildSequence(seed: number): Phase[] {
  const r = lcg(seed)
  const phases: Phase[] = []
  let goLeft = r() > 0.5

  for (let i = 0; i < 12; i++) {
    const cycles = 1 + Math.floor(r() * 4)
    phases.push(goLeft
      ? { kind: 'walkLeft',  totalFrames: cycles * WALK_FRAMES }
      : { kind: 'walkRight', totalFrames: cycles * WALK_FRAMES }
    )
    phases.push({ kind: 'hold', ticks: 2 + Math.floor(r() * 5) })
    goLeft = !goLeft
  }
  return phases
}

interface DisplayState { src: string; x: number }

export default function SheepScene() {
  const seq      = useRef<Phase[]>([])
  const phaseIdx = useRef(0)
  const frame    = useRef(0)
  const xPos     = useRef(300)

  const [disp, setDisp] = useState<DisplayState>({
    src: '/sheep-frames/walk_right_0.png', x: 300,
  })

  useEffect(() => {
    seq.current = buildSequence((Date.now() + 12345) % 100000)

    const tick = () => {
      const phases = seq.current
      const phase  = phases[phaseIdx.current % phases.length]
      const f      = frame.current
      let src  = '/sheep-frames/walk_down_0.png'
      let done = false

      if (phase.kind === 'walkLeft') {
        src  = `/sheep-frames/walk_left_${f % WALK_FRAMES}.png`
        xPos.current = Math.max(80, xPos.current - WALK_PX)
        done = f >= phase.totalFrames - 1
      } else if (phase.kind === 'walkRight') {
        src  = `/sheep-frames/walk_right_${f % WALK_FRAMES}.png`
        xPos.current = Math.min((window?.innerWidth ?? 1280) - 160, xPos.current + WALK_PX)
        done = f >= phase.totalFrames - 1
      } else if (phase.kind === 'hold') {
        src  = '/sheep-frames/walk_down_0.png'
        done = f >= phase.ticks - 1
      }

      setDisp({ src, x: xPos.current })
      if (done) { phaseIdx.current++; frame.current = 0 }
      else       { frame.current++ }
    }

    const id = setInterval(tick, MS_PER_FRAME)
    return () => clearInterval(id)
  }, [])

  return (
    <div style={{
      position:      'absolute',
      bottom:        '9%',
      left:          disp.x,
      width:         SHEEP_W,
      height:        SHEEP_H,
      transform:     'translateX(-50%)',
      zIndex:        40,
      pointerEvents: 'none',
    }}>
      <img
        src={disp.src}
        alt=""
        width={IMG_W}
        height={IMG_H}
        style={{
          display:        'block',
          imageRendering: 'pixelated',
          position:       'absolute',
          bottom:         0,
          left:           '50%',
          marginLeft:     `${-IMG_W / 2}px`,
        }}
      />
    </div>
  )
}
