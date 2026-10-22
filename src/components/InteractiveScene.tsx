import { useEffect, useLayoutEffect, useRef, useState, type KeyboardEvent, type ReactNode } from 'react'
import { playSfx } from '../audio/sound'

export const SCENE_W = 1600
export const SCENE_H = 900

/**
 * Renders a 1600×900 illustrated scene. On wide screens it is fitted to the
 * available space; on narrow/portrait screens it fills the height and can be
 * panned sideways, so small clues stay large enough to find and tap.
 */
export function InteractiveScene({
  children,
  bg = '#24354B',
  focusX = SCENE_W / 2,
  label,
  overlay,
}: {
  children: ReactNode
  bg?: string
  /** Scene x-coordinate to centre on when the scene is wider than the screen. */
  focusX?: number
  label: string
  /** HTML layered on top of the scene, positioned in scene coordinates (0–1600, 0–900). */
  overlay?: ReactNode
}) {
  const outer = useRef<HTMLDivElement>(null)
  const [box, setBox] = useState({ w: 0, h: 0 })
  const [hint, setHint] = useState(false)

  useLayoutEffect(() => {
    const el = outer.current
    if (!el) return
    const ro = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect
      setBox({ w: width, h: height })
    })
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  const aspect = SCENE_W / SCENE_H
  let w: number
  let h: number
  const panning = box.w > 0 && box.w / box.h < 1.25
  if (panning) {
    h = box.h
    w = h * aspect
  } else {
    w = Math.min(box.w, box.h * aspect)
    h = w / aspect
  }

  useEffect(() => {
    const el = outer.current
    if (!el || !panning) return
    el.scrollLeft = Math.max(0, (focusX / SCENE_W) * w - box.w / 2)
    setHint(true)
    const t = setTimeout(() => setHint(false), 3200)
    return () => clearTimeout(t)
    // Re-centre only when the layout mode or size changes, not on every render.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [panning, Math.round(w)])

  return (
    <div
      ref={outer}
      className={`relative h-full w-full no-scrollbar ${panning ? 'overflow-x-auto overflow-y-hidden' : 'overflow-hidden'}`}
      style={{ background: bg }}
      onScroll={() => hint && setHint(false)}
    >
      {box.w > 0 && (
        <div
          className="relative"
          style={{
            width: w,
            height: h,
            marginLeft: panning ? 0 : (box.w - w) / 2,
            marginTop: panning ? 0 : (box.h - h) / 2,
          }}
        >
          <svg viewBox={`0 0 ${SCENE_W} ${SCENE_H}`} width={w} height={h} role="img" aria-label={label} className="block select-none">
            {children}
          </svg>
          {overlay && (
            <div className="pointer-events-none absolute inset-0" style={{ fontSize: w / 100 }}>
              {overlay}
            </div>
          )}
        </div>
      )}
      {panning && hint && (
        <div className="pointer-events-none fixed left-1/2 top-24 z-20 -translate-x-1/2 rounded-full bg-navy/80 px-4 py-2 text-sm font-bold text-white">
          ← Swipe to look around →
        </div>
      )}
    </div>
  )
}

/** A clickable object inside a scene. Feedback is a gentle hover lift — never a glow or pulse. */
export function Hotspot({
  label,
  onClick,
  children,
  hit,
  disabled = false,
  sound = true,
}: {
  label: string
  onClick: () => void
  children: ReactNode
  /** Optional enlarged invisible tap area: [x, y, w, h] in scene units. */
  hit?: [number, number, number, number]
  disabled?: boolean
  sound?: boolean
}) {
  if (disabled) return <g>{children}</g>
  const activate = () => {
    if (sound) playSfx('click')
    onClick()
  }
  return (
    <g
      className="hotspot"
      role="button"
      tabIndex={0}
      aria-label={label}
      onClick={activate}
      onKeyDown={(e: KeyboardEvent) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          activate()
        }
      }}
    >
      {hit && <rect x={hit[0]} y={hit[1]} width={hit[2]} height={hit[3]} fill="transparent" />}
      {children}
    </g>
  )
}
