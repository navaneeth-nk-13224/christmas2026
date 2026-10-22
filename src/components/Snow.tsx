import { useMemo, type CSSProperties } from 'react'
import { rng } from '../art/props'

/** Lightweight HTML snowfall overlay (CSS-animated, no JS per frame). */
export function Snow({ count = 40, seed = 3, className = '' }: { count?: number; seed?: number; className?: string }) {
  const flakes = useMemo(() => {
    const r = rng(seed)
    return Array.from({ length: count }, () => ({
      left: r() * 100,
      size: 3 + r() * 6,
      duration: 7 + r() * 9,
      delay: -r() * 16,
      drift: (r() - 0.5) * 80,
      opacity: 0.55 + r() * 0.45,
    }))
  }, [count, seed])

  return (
    <div className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`} aria-hidden>
      {flakes.map((f, i) => (
        <span
          key={i}
          className="flake"
          style={
            {
              left: `${f.left}%`,
              width: f.size,
              height: f.size,
              opacity: f.opacity,
              animationDuration: `${f.duration}s`,
              animationDelay: `${f.delay}s`,
              '--drift': `${f.drift}px`,
            } as CSSProperties
          }
        />
      ))}
    </div>
  )
}
