import { useEffect, useRef, useState, type PointerEvent, type ReactNode } from 'react'

/**
 * Zoomable, pannable viewer: mouse wheel, pinch, drag, and +/− buttons.
 * Content is laid out at the container's full width with the given aspect ratio.
 */
export function ZoomPan({
  children,
  aspect,
  maxZoom = 5,
  className = '',
}: {
  children: ReactNode
  aspect: number
  maxZoom?: number
  className?: string
}) {
  const [view, setView] = useState({ z: 1, x: 0, y: 0 })
  const [held, setHeld] = useState(false)
  const box = useRef<HTMLDivElement>(null)
  const pointers = useRef(new Map<number, { x: number; y: number }>())
  const pinch = useRef<{ dist: number; z: number } | null>(null)

  const clamp = (v: { z: number; x: number; y: number }) => {
    const el = box.current
    const z = Math.min(maxZoom, Math.max(1, v.z))
    if (!el) return { ...v, z }
    const w = el.clientWidth
    const h = el.clientHeight
    const maxX = (w * (z - 1)) / 2
    const maxY = (h * (z - 1)) / 2
    return { z, x: Math.min(maxX, Math.max(-maxX, v.x)), y: Math.min(maxY, Math.max(-maxY, v.y)) }
  }

  const zoomAt = (factor: number, cx = 0, cy = 0) => {
    setView((v) => {
      const z = Math.min(maxZoom, Math.max(1, v.z * factor))
      const k = z / v.z
      // Keep the point under the cursor (cx, cy relative to centre) fixed.
      return clamp({ z, x: cx - (cx - v.x) * k, y: cy - (cy - v.y) * k })
    })
  }

  const rel = (clientX: number, clientY: number) => {
    const r = box.current!.getBoundingClientRect()
    return [clientX - r.left - r.width / 2, clientY - r.top - r.height / 2] as const
  }

  // Native, non-passive wheel listener so zooming doesn't also scroll the page.
  const zoomRef = useRef(zoomAt)
  useEffect(() => {
    zoomRef.current = zoomAt
  })
  useEffect(() => {
    const el = box.current
    if (!el) return
    const onWheel = (e: globalThis.WheelEvent) => {
      e.preventDefault()
      const r = el.getBoundingClientRect()
      zoomRef.current(e.deltaY < 0 ? 1.15 : 1 / 1.15, e.clientX - r.left - r.width / 2, e.clientY - r.top - r.height / 2)
    }
    el.addEventListener('wheel', onWheel, { passive: false })
    return () => el.removeEventListener('wheel', onWheel)
  }, [])

  const onDown = (e: PointerEvent) => {
    ;(e.currentTarget as HTMLElement).setPointerCapture(e.pointerId)
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY })
    setHeld(true)
    if (pointers.current.size === 2) {
      const [a, b] = [...pointers.current.values()]
      pinch.current = { dist: Math.hypot(a.x - b.x, a.y - b.y), z: view.z }
    }
  }

  const onMove = (e: PointerEvent) => {
    const prev = pointers.current.get(e.pointerId)
    if (!prev) return
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY })
    if (pointers.current.size === 2 && pinch.current) {
      const [a, b] = [...pointers.current.values()]
      const dist = Math.hypot(a.x - b.x, a.y - b.y)
      const target = pinch.current.z * (dist / pinch.current.dist)
      setView((v) => clamp({ ...v, z: target }))
    } else if (pointers.current.size === 1) {
      setView((v) => clamp({ ...v, x: v.x + e.clientX - prev.x, y: v.y + e.clientY - prev.y }))
    }
  }

  const onUp = (e: PointerEvent) => {
    pointers.current.delete(e.pointerId)
    if (pointers.current.size < 2) pinch.current = null
    if (pointers.current.size === 0) setHeld(false)
  }

  return (
    <div className={`relative ${className}`}>
      <div
        ref={box}
        className="relative w-full touch-none overflow-hidden rounded-2xl bg-navy-deep"
        style={{ aspectRatio: aspect, cursor: view.z > 1 ? 'grab' : 'zoom-in' }}
        onPointerDown={onDown}
        onPointerMove={onMove}
        onPointerUp={onUp}
        onPointerCancel={onUp}
        onDoubleClick={(e) => {
          const [cx, cy] = rel(e.clientX, e.clientY)
          zoomAt(view.z >= maxZoom * 0.8 ? 1 / maxZoom : 2, cx, cy)
        }}
      >
        <div
          className="absolute inset-0 origin-center"
          style={{
            transform: `translate(${view.x}px, ${view.y}px) scale(${view.z})`,
            transition: held ? 'none' : 'transform 0.12s ease-out',
          }}
        >
          {children}
        </div>
      </div>
      <div className="absolute right-2 bottom-2 flex gap-2">
        <button type="button" className="icon-btn" aria-label="Zoom out" onClick={() => zoomAt(1 / 1.5)}>
          <span className="text-xl font-bold leading-none">−</span>
        </button>
        <button type="button" className="icon-btn" aria-label="Zoom in" onClick={() => zoomAt(1.5)}>
          <span className="text-xl font-bold leading-none">+</span>
        </button>
      </div>
      {view.z === 1 && (
        <div className="pointer-events-none absolute top-2 left-2 rounded-full bg-black/50 px-3 py-1 text-xs font-bold text-white">
          Pinch, scroll or tap + to zoom
        </div>
      )}
    </div>
  )
}
