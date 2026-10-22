import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useRef, useState, type PointerEvent as ReactPointerEvent } from 'react'
import { FootageFrame, FRAME_H, FRAME_W, FRAMES } from '../art/footage'
import { playSfx } from '../audio/sound'
import { FeedbackLine } from '../components/PuzzleContainer'
import { ZoomPan } from '../components/ZoomPan'
import { usePuzzleState } from '../state/progress'

function shuffled(): number[] {
  // A thorough shuffle that never starts out solved or nearly solved.
  for (;;) {
    const a = [0, 1, 2, 3, 4, 5].sort(() => Math.random() - 0.5)
    if (a.filter((v, i) => v === i).length <= 1) return a
  }
}

/** Sequential playback of the reconstructed footage, with static between frames. */
export function Playback({ onDone }: { onDone: () => void }) {
  const [i, setI] = useState(0)
  const [staticOn, setStaticOn] = useState(true)
  const doneRef = useRef(onDone)
  useEffect(() => {
    doneRef.current = onDone
  })
  useEffect(() => {
    const s = setTimeout(() => setStaticOn(false), 260)
    const t = setTimeout(() => {
      if (i < FRAMES.length - 1) {
        setStaticOn(true)
        playSfx('beep')
        setI(i + 1)
      } else doneRef.current()
    }, 1900)
    return () => {
      clearTimeout(s)
      clearTimeout(t)
    }
  }, [i])
  return (
    <div>
      <div className="relative overflow-hidden rounded-xl border-8 border-[#1E2530] bg-black" style={{ aspectRatio: FRAME_W / FRAME_H }}>
        <AnimatePresence>
          <motion.div
            key={i}
            className="absolute inset-0"
            initial={{ opacity: 0.2, scale: 1.02 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <FootageFrame index={i} className="h-full w-full" />
          </motion.div>
        </AnimatePresence>
        <div
          className={`static-noise pointer-events-none absolute inset-0 transition-opacity duration-200 ${staticOn ? 'opacity-90' : 'opacity-15'}`}
        />
        <div className="scanlines pointer-events-none absolute inset-0" />
        <div
          className="absolute bottom-0 left-0 h-1.5 bg-xred transition-[width] duration-[1900ms] ease-linear"
          style={{ width: `${((i + 1) / FRAMES.length) * 100}%` }}
        />
      </div>
      <p className="mt-3 text-center font-display text-lg text-white/90">
        <span className="font-term text-xl text-winter">{FRAMES[i].time}</span> — {FRAMES[i].caption}
      </p>
    </div>
  )
}

export function FootagePuzzle({ onSolved }: { onSolved: () => void }) {
  const [saved, setSaved] = usePuzzleState<number[]>('footage', shuffled)
  const [order, setOrder] = useState<number[]>(saved)
  const [selected, setSelected] = useState<number | null>(null)
  const [drag, setDrag] = useState<{ slot: number; x: number; y: number; dx: number; dy: number; moved: boolean } | null>(null)
  const [zoom, setZoom] = useState<number | null>(null)
  const [feedback, setFeedback] = useState<'error' | null>(null)
  const [shake, setShake] = useState(0)
  const [playing, setPlaying] = useState(false)
  const dragRef = useRef(drag)
  useEffect(() => {
    dragRef.current = drag
  })

  const swap = (a: number, b: number) => {
    if (a === b) return
    const next = [...order]
    ;[next[a], next[b]] = [next[b], next[a]]
    setOrder(next)
    setSaved(next)
    setFeedback(null)
    playSfx('snap')
  }

  // Window-level listeners so the card can follow the pointer anywhere, on mouse and touch alike.
  useEffect(() => {
    if (!drag) return
    const move = (e: PointerEvent) => {
      const d = dragRef.current
      if (!d) return
      const dx = e.clientX - d.x
      const dy = e.clientY - d.y
      setDrag({ ...d, dx, dy, moved: d.moved || Math.hypot(dx, dy) > 6 })
    }
    const up = (e: PointerEvent) => {
      const d = dragRef.current
      setDrag(null)
      if (!d) return
      if (!d.moved) {
        // A tap: select, or swap with the previously selected card.
        if (selected === null) setSelected(d.slot)
        else {
          swap(selected, d.slot)
          setSelected(null)
        }
        return
      }
      const target = document.elementFromPoint(e.clientX, e.clientY)?.closest<HTMLElement>('[data-slot]')
      if (target) swap(d.slot, Number(target.dataset.slot))
      setSelected(null)
    }
    window.addEventListener('pointermove', move)
    window.addEventListener('pointerup', up)
    window.addEventListener('pointercancel', up)
    return () => {
      window.removeEventListener('pointermove', move)
      window.removeEventListener('pointerup', up)
      window.removeEventListener('pointercancel', up)
    }
    // Re-binding on every drag tick is unnecessary; dragRef holds the latest values.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [drag !== null, selected, order])

  const play = () => {
    if (order.every((v, i) => v === i)) {
      playSfx('success')
      setPlaying(true)
    } else {
      setFeedback('error')
      setShake((s) => s + 1)
      playSfx('error')
    }
  }

  if (playing) return <Playback onDone={onSolved} />

  if (zoom !== null) {
    return (
      <div>
        <ZoomPan aspect={FRAME_W / FRAME_H} maxZoom={6}>
          <FootageFrame index={zoom} className="h-full w-full" />
        </ZoomPan>
        <div className="mt-3 flex justify-center">
          <button type="button" className="btn btn-light btn-sm" onClick={() => setZoom(null)}>
            ← Back to all footage
          </button>
        </div>
      </div>
    )
  }

  return (
    <div>
      <p className="mb-3 text-center font-term text-xl tracking-wide text-winter/80">&gt; RECOVERED FILE CORRUPTED · FRAMES OUT OF SEQUENCE</p>
      <div key={shake} className={`grid grid-cols-2 gap-2 sm:grid-cols-3 sm:gap-3 ${feedback ? 'shake' : ''}`}>
        {order.map((frame, slot) => {
          const dragging = drag?.slot === slot && drag.moved
          return (
            <div key={slot} data-slot={slot} className="relative rounded-xl bg-black/40 p-1">
              <div className="absolute -top-2 -left-2 z-10 grid h-7 w-7 place-items-center rounded-full bg-gold font-display text-sm font-bold text-navy shadow">
                {slot + 1}
              </div>
              <div
                role="button"
                tabIndex={0}
                aria-label={`Footage still in position ${slot + 1}`}
                aria-pressed={selected === slot}
                onPointerDown={(e: ReactPointerEvent) => {
                  if ((e.target as HTMLElement).closest('[data-zoom]')) return
                  e.preventDefault()
                  setDrag({ slot, x: e.clientX, y: e.clientY, dx: 0, dy: 0, moved: false })
                }}
                onKeyDown={(e) => {
                  if (e.key !== 'Enter' && e.key !== ' ') return
                  e.preventDefault()
                  if (selected === null) setSelected(slot)
                  else {
                    swap(selected, slot)
                    setSelected(null)
                  }
                }}
                className={`relative cursor-grab touch-none overflow-hidden rounded-lg ring-4 transition-shadow select-none ${
                  selected === slot ? 'ring-gold' : 'ring-transparent'
                }`}
                style={{
                  transform: dragging ? `translate(${drag.dx}px, ${drag.dy}px) scale(1.05)` : undefined,
                  zIndex: dragging ? 30 : undefined,
                  pointerEvents: dragging ? 'none' : undefined,
                  boxShadow: dragging ? '0 16px 30px rgba(0,0,0,0.5)' : undefined,
                  position: 'relative',
                }}
              >
                <FootageFrame index={frame} className="pointer-events-none w-full" />
                <button
                  type="button"
                  data-zoom
                  onClick={() => setZoom(frame)}
                  className="absolute right-1.5 bottom-1.5 grid h-8 w-8 place-items-center rounded-full bg-white/90 text-navy shadow"
                  aria-label="Enlarge this still"
                >
                  <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden>
                    <circle cx="7" cy="7" r="4.5" fill="none" stroke="currentColor" strokeWidth="2" />
                    <path d="M10.5 10.5 L14 14" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
                  </svg>
                </button>
              </div>
            </div>
          )
        })}
      </div>
      <div className="mt-4 flex flex-col items-center gap-1">
        <button type="button" className="btn btn-red px-10 text-lg" onClick={play}>
          ▶ Play
        </button>
        <FeedbackLine kind={feedback}>The footage is out of order.</FeedbackLine>
      </div>
    </div>
  )
}
