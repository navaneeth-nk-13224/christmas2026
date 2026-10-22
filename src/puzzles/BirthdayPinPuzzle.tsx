import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { C } from '../art/props'
import { playSfx } from '../audio/sound'

export const PIN = '812'

/* ---------- The wall calendar ---------- */

const MARKS: Record<number, { icon: string; note: string; color: string; shape: 'circle' | 'cross' | 'box' }> = {
  8: { icon: '🎂', note: "Boss's Birthday", color: C.red, shape: 'circle' },
  18: { icon: '📦', note: 'Delivery Due', color: '#2F6F9E', shape: 'box' },
  25: { icon: '❌', note: 'Christmas Delivery Cancelled', color: C.redDark, shape: 'cross' },
}

/** December laid out Monday-first, starting on a Tuesday. */
const FIRST_WEEKDAY = 1

export function WallCalendar() {
  const cells: (number | null)[] = [...Array(FIRST_WEEKDAY).fill(null), ...Array.from({ length: 31 }, (_, i) => i + 1)]
  while (cells.length % 7) cells.push(null)
  return (
    <div className="mx-auto max-w-xl overflow-hidden rounded-lg bg-white shadow-[0_10px_30px_rgba(0,0,0,0.3)]">
      {/* spiral binding */}
      <div className="flex justify-around bg-[#E9EDF2] py-1.5">
        {Array.from({ length: 12 }, (_, i) => (
          <span key={i} className="h-3 w-1.5 rounded-full bg-[#8A96A6]" />
        ))}
      </div>
      <div className="relative h-24 overflow-hidden bg-[#2C3E63] sm:h-32">
        <svg viewBox="0 0 600 130" preserveAspectRatio="xMidYMid slice" className="absolute inset-0 h-full w-full" aria-hidden>
          <rect width={600} height={130} fill="#2C3E63" />
          <path d="M0 100 Q150 70 300 96 T600 90 V130 H0 Z" fill="#E4EEF8" />
          {[60, 140, 480, 540].map((x) => (
            <path key={x} d={`M${x} 100 l18 -40 l18 40 z`} fill="#1E5A54" />
          ))}
          <g transform="translate(210 106) scale(0.32)">
            <rect x={-260} y={-250} width={360} height={200} rx={8} fill="#F8FBFF" />
            <rect x={-260} y={-120} width={360} height={14} fill={C.red} />
            <path d="M100 -190 H170 Q196 -190 206 -160 L224 -112 Q230 -98 230 -80 V-50 H100 Z" fill="#2F6F9E" />
            <circle cx={-180} cy={-40} r={32} fill="#24354B" />
            <circle cx={160} cy={-40} r={32} fill="#24354B" />
          </g>
        </svg>
        <div className="absolute right-3 bottom-2 font-display text-xs font-semibold tracking-[0.2em] text-white/80 uppercase">
          North Star Logistics
        </div>
      </div>
      <div className="p-3 sm:p-5">
        <div className="mb-2 font-display text-3xl font-bold tracking-[0.15em] text-navy">DECEMBER</div>
        <div className="grid grid-cols-7 gap-px overflow-hidden rounded-md bg-[#D6DEE8] text-navy">
          {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((d) => (
            <div key={d} className="bg-[#F1F4F8] py-1 text-center text-[0.65rem] font-extrabold tracking-wider uppercase opacity-70 sm:text-xs">
              {d}
            </div>
          ))}
          {cells.map((day, i) => {
            const mark = day ? MARKS[day] : undefined
            return (
              <div key={i} className="relative min-h-14 bg-white p-1 sm:min-h-[4.5rem] sm:p-1.5">
                {day && <span className={`text-sm font-extrabold sm:text-base ${i % 7 >= 5 ? 'text-xred/80' : ''}`}>{day}</span>}
                {mark && (
                  <>
                    <svg className="pointer-events-none absolute inset-0 h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden>
                      {mark.shape === 'circle' && (
                        <path
                          d="M8 26 C4 6 40 2 58 10 C80 18 70 44 38 44 C12 44 4 30 14 14"
                          fill="none"
                          stroke={mark.color}
                          strokeWidth={4}
                          strokeLinecap="round"
                        />
                      )}
                      {mark.shape === 'box' && (
                        <path d="M6 8 L54 6 L56 40 L8 42 Z" fill="none" stroke={mark.color} strokeWidth={3.5} strokeLinejoin="round" />
                      )}
                      {mark.shape === 'cross' && (
                        <path d="M10 10 L88 90 M88 12 L12 88" stroke={mark.color} strokeWidth={5} strokeLinecap="round" opacity={0.75} />
                      )}
                    </svg>
                    <div
                      className="relative mt-0.5 font-hand text-[0.68rem] leading-[0.95] font-bold [overflow-wrap:anywhere] sm:text-[1rem]"
                      style={{ color: mark.color }}
                    >
                      <span className="text-[0.75rem] sm:text-sm">{mark.icon}</span> {mark.note}
                    </div>
                  </>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

/* ---------- The three-digit keypad ---------- */

export function Keypad({ onUnlock }: { onUnlock: () => void }) {
  const [code, setCode] = useState('')
  const [state, setState] = useState<'idle' | 'error' | 'ok'>('idle')
  const [shake, setShake] = useState(0)

  const press = (k: string) => {
    if (state === 'ok') return
    playSfx('key')
    if (state === 'error') setState('idle')
    if (k === 'C') setCode('')
    else if (k === 'OK') submit()
    else if (code.length < 3) setCode((c) => c + k)
  }

  const submit = () => {
    if (code.length !== 3) {
      setState('error')
      setShake((s) => s + 1)
      playSfx('error')
      return
    }
    if (code === PIN) {
      setState('ok')
      playSfx('unlock')
      setTimeout(onUnlock, 1300)
    } else {
      setState('error')
      setShake((s) => s + 1)
      playSfx('error')
      setTimeout(() => setCode(''), 600)
    }
  }

  // Physical keyboard support.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.target as HTMLElement | null)?.tagName === 'BUTTON' && (e.key === 'Enter' || e.key === ' ')) return
      if (/^[0-9]$/.test(e.key)) press(e.key)
      else if (e.key === 'Backspace') {
        playSfx('key')
        setCode((c) => c.slice(0, -1))
      } else if (e.key === 'Enter') press('OK')
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  })

  const keys = ['1', '2', '3', '4', '5', '6', '7', '8', '9', 'C', '0', 'OK']
  return (
    <div className="mx-auto w-full max-w-[19rem]">
      <div
        key={shake}
        className={`rounded-[1.6rem] bg-[#2B3442] p-4 shadow-[inset_0_2px_0_rgba(255,255,255,0.08),0_12px_30px_rgba(0,0,0,0.4)] ${state === 'error' ? 'shake' : ''}`}
      >
        <div
          className={`mb-4 flex h-16 items-center justify-center gap-3 rounded-xl font-term text-5xl tracking-[0.3em] transition-colors ${
            state === 'ok' ? 'bg-[#16A34A] text-white' : state === 'error' ? 'bg-[#3B1D1D] text-[#FF8A80]' : 'bg-[#0B1A14] text-[#3DDC97]'
          }`}
          aria-live="polite"
          aria-label={state === 'ok' ? 'Unlocked' : `${code.length} of 3 digits entered`}
        >
          {state === 'ok' ? 'OPEN' : [0, 1, 2].map((i) => <span key={i}>{code[i] ?? '–'}</span>)}
        </div>
        <div className="grid grid-cols-3 gap-2.5">
          {keys.map((k) => (
            <motion.button
              key={k}
              type="button"
              whileTap={{ scale: 0.92 }}
              onClick={() => press(k)}
              className={`h-14 cursor-pointer rounded-xl font-display text-2xl font-bold shadow-[0_3px_0_rgba(0,0,0,0.35)] ${
                k === 'OK' ? 'bg-evergreen text-white' : k === 'C' ? 'bg-[#6B7A8F] text-white' : 'bg-[#E9EDF2] text-navy'
              }`}
              aria-label={k === 'C' ? 'Clear' : k === 'OK' ? 'Enter' : k}
            >
              {k === 'OK' ? '✓' : k}
            </motion.button>
          ))}
        </div>
        <div className="mt-3 flex items-center justify-center gap-2">
          <span className={`h-2.5 w-2.5 rounded-full ${state === 'ok' ? 'bg-[#22C55E] shadow-[0_0_10px_#22C55E]' : 'bg-[#3A4556]'}`} />
          <span className={`h-2.5 w-2.5 rounded-full ${state === 'error' ? 'bg-[#EF4444] shadow-[0_0_10px_#EF4444]' : 'bg-[#3A4556]'}`} />
        </div>
      </div>
      <p className="mt-3 h-6 text-center font-display text-lg font-semibold text-xred" aria-live="assertive">
        {state === 'error' ? 'Incorrect PIN.' : ''}
      </p>
    </div>
  )
}
