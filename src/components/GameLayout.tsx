import type { ReactNode } from 'react'
import { levelMeta } from '../data/levels'
import { useProgress } from '../state/progress'
import { SoundButtons } from './AudioManager'

const BULBS = ['#EA4335', '#F9C846', '#8BCDF2', '#18865B', '#EA4335', '#F9C846', '#8BCDF2', '#18865B']

/** Eight Christmas lights: one lights up for each solved level. */
export function ProgressLights({ level }: { level: number }) {
  const { progress } = useProgress()
  return (
    <svg viewBox="0 0 184 30" className="h-6 w-auto sm:h-7" role="img" aria-label={`${progress.completed.length} of 8 clues solved`}>
      <path d="M2 6 Q46 18 92 6 Q138 18 182 6" fill="none" stroke="#2B3A2E" strokeWidth="2" />
      {BULBS.map((c, i) => {
        const x = 12 + i * 22.5
        const y = 9 + Math.sin(((i + 0.5) / 4) * Math.PI) * 2.5
        const lit = progress.completed.includes(i + 1)
        const current = i + 1 === level && !lit
        return (
          <g key={i}>
            <rect x={x - 2.5} y={y - 2} width={5} height={5} rx={1} fill="#3A4A3E" />
            <ellipse
              cx={x}
              cy={y + 10}
              rx={5.5}
              ry={8}
              fill={lit ? c : '#53627a'}
              opacity={lit ? 1 : current ? 0.9 : 0.55}
              stroke={current ? '#fff' : 'none'}
              strokeWidth={1.5}
            />
            {lit && <ellipse cx={x} cy={y + 10} rx={9} ry={11} fill={c} opacity={0.25} />}
          </g>
        )
      })}
    </svg>
  )
}

export function GameLayout({ level, onHome, children }: { level: number; onHome: () => void; children: ReactNode }) {
  const meta = levelMeta(level)
  return (
    <div className="flex h-full flex-col bg-navy-deep">
      <header className="relative z-30 flex items-center justify-between gap-2 px-3 pt-[max(0.5rem,env(safe-area-inset-top))] pb-2 text-white sm:px-5">
        <div className="flex min-w-0 items-center gap-3">
          <button type="button" className="icon-btn !bg-white/15 !text-white" aria-label="Main menu" onClick={onHome}>
            <svg width="20" height="20" viewBox="0 0 20 20" aria-hidden>
              <path
                d="M3 10 L10 3.5 L17 10 M5.5 8 V16.5 H14.5 V8"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinejoin="round"
                strokeLinecap="round"
              />
            </svg>
          </button>
          <div className="min-w-0 leading-tight">
            <div className="font-display text-[0.7rem] font-semibold tracking-[0.2em] text-gold uppercase">Level {level} of 8</div>
            <div className="truncate font-display text-base font-semibold sm:text-lg">{meta.title}</div>
          </div>
        </div>
        <div className="hidden sm:block">
          <ProgressLights level={level} />
        </div>
        <SoundButtons dark />
      </header>
      <main className="relative min-h-0 flex-1">{children}</main>
    </div>
  )
}
