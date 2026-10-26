import { motion } from 'framer-motion'
import { useEffect, useMemo, useState } from 'react'
import { playMorse } from '../audio/sound'
import { AnswerForm, normalize } from '../components/PuzzleContainer'

/** Santa's message to the lab: MEET BY LAKE. Letters are separated by spaces, words by " / ". */
export const MORSE = '-- . . - / -... -.-- / .-.. .- -.- .'
const WORDS = MORSE.split(' / ').map((w) => w.split(' '))
const UNIT = 150

interface Step {
  word: number
  letter: number
  symbol: number
  on: boolean
  ms: number
}

// Standard Morse timing: dot 1, dash 3, gap 1 between symbols, 3 between letters, 7 between words.
function timeline(): Step[] {
  const steps: Step[] = []
  const gap = (ms: number) => steps.push({ word: -1, letter: -1, symbol: -1, on: false, ms })
  WORDS.forEach((letters, wi) => {
    letters.forEach((letter, li) => {
      ;[...letter].forEach((sym, si) => {
        steps.push({ word: wi, letter: li, symbol: si, on: true, ms: (sym === '.' ? 1 : 3) * UNIT })
        steps.push({ word: wi, letter: li, symbol: si, on: false, ms: UNIT })
      })
      gap(2 * UNIT)
    })
    gap(4 * UNIT)
  })
  gap(8 * UNIT)
  return steps
}

export function FrozenLakeMap({ reveal }: { reveal: boolean }) {
  return (
    <svg viewBox="0 0 520 300" className="block w-full" role="img" aria-label="Research map">
      <rect width={520} height={300} fill="#0B1A14" />
      {Array.from({ length: 13 }, (_, i) => (
        <line key={`v${i}`} x1={i * 40} y1={0} x2={i * 40} y2={300} stroke="#1E4A36" strokeWidth={1} />
      ))}
      {Array.from({ length: 8 }, (_, i) => (
        <line key={`h${i}`} x1={0} y1={i * 40} x2={520} y2={i * 40} stroke="#1E4A36" strokeWidth={1} />
      ))}
      <path d="M0 230 Q80 210 120 240 T260 250 T420 230 T520 250 V300 H0 Z" fill="#12402C" />
      <path d="M40 60 Q120 20 200 60 Q240 90 210 130 Q150 170 90 140 Q20 110 40 60 Z" fill="none" stroke="#3DDC97" strokeWidth={2} opacity={0.5} />
      {/* the lake */}
      <motion.path
        d="M300 90 Q360 50 430 80 Q480 110 450 160 Q400 200 330 180 Q270 150 300 90 Z"
        fill="#9FE6FF"
        fillOpacity={reveal ? 0.35 : 0.12}
        stroke="#9FE6FF"
        strokeWidth={2.5}
        initial={false}
        animate={{ fillOpacity: reveal ? 0.35 : 0.12 }}
      />
      {/* lab marker */}
      <rect x={120} y={196} width={14} height={14} fill="#3DDC97" />
      <text x={142} y={208} fill="#3DDC97" fontFamily="VT323, monospace" fontSize={18}>
        LAB (YOU ARE HERE)
      </text>
      <path d="M134 196 Q220 160 330 150" fill="none" stroke="#3DDC97" strokeWidth={2} strokeDasharray="6 6" opacity={reveal ? 0.9 : 0} />
      {reveal && (
        <motion.g initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 300, damping: 14 }}>
          <circle cx={372} cy={128} r={12} fill="none" stroke="#F9C846" strokeWidth={3} />
          <circle cx={372} cy={128} r={4} fill="#F9C846" />
          <rect x={270} y={34} width={240} height={46} fill="#0B1A14" stroke="#F9C846" strokeWidth={2} />
          <text x={390} y={53} textAnchor="middle" fill="#F9C846" fontFamily="VT323, monospace" fontSize={19}>
            FROZEN LAKE
          </text>
          <text x={390} y={72} textAnchor="middle" fill="#F9C846" fontFamily="VT323, monospace" fontSize={19}>
            MONITORING STATION
          </text>
        </motion.g>
      )}
    </svg>
  )
}

export function MorsePuzzle({ onSolved }: { onSolved: () => void }) {
  const steps = useMemo(() => timeline(), [])
  const [run, setRun] = useState(0)
  const [i, setI] = useState(0)
  const [audioOn, setAudioOn] = useState(false)
  const [solved, setSolved] = useState(false)

  useEffect(() => {
    if (solved) return
    if (i === 0 && audioOn) playMorse(MORSE, UNIT)
    const t = setTimeout(() => setI((n) => (n + 1) % steps.length), steps[i].ms)
    return () => clearTimeout(t)
  }, [i, run, steps, audioOn, solved])

  const replay = () => {
    setI(0)
    setRun((r) => r + 1)
  }

  const step = steps[i]
  const lampOn = step.on && !solved

  return (
    <div className="relative overflow-hidden rounded-2xl border-[10px] border-[#2B3442] bg-[#07130E] p-4 shadow-inner sm:p-6">
      <div className="scanlines pointer-events-none absolute inset-0" />
      {solved ? (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <p className="mb-2 font-term text-2xl text-[#3DDC97]">&gt; SIGNAL DECODED: MEET BY LAKE</p>
          <div className="overflow-hidden rounded-lg border-2 border-[#1E4A36]">
            <FrozenLakeMap reveal />
          </div>
        </motion.div>
      ) : (
        <>
          <div className="flex items-center justify-between gap-3">
            <p className="font-term text-xl tracking-wider text-[#3DDC97] sm:text-2xl">&gt; INCOMING SIGNAL — REPEATING</p>
            <div
              className="h-9 w-9 shrink-0 rounded-full border-4 border-[#1E4A36] transition-[background,box-shadow] duration-75"
              style={{ background: lampOn ? '#F9C846' : '#2B2A14', boxShadow: lampOn ? '0 0 24px 6px rgba(249,200,70,0.7)' : 'none' }}
              aria-hidden
            />
          </div>
          <div
            className="mt-5 flex flex-wrap items-center justify-center gap-x-4 gap-y-5 rounded-xl bg-black/30 px-3 py-6 sm:gap-x-5"
            aria-label="Flashing Morse code signal"
          >
            {WORDS.map((letters, wi) => (
              <div key={wi} className="flex items-center gap-4 sm:gap-5">
                <div className="flex items-center gap-3 sm:gap-4">
                  {letters.map((letter, li) => (
                    <div key={li} className="flex items-center gap-1.5">
                      {[...letter].map((sym, si) => {
                        const active = step.word === wi && step.letter === li && step.symbol === si && step.on
                        return (
                          <span
                            key={si}
                            className="block rounded-full transition-all duration-75"
                            style={{
                              width: sym === '.' ? 13 : 32,
                              height: 13,
                              background: active ? '#F9C846' : '#3DDC97',
                              opacity: active ? 1 : 0.55,
                              boxShadow: active ? '0 0 16px rgba(249,200,70,0.9)' : 'none',
                              transform: active ? 'scale(1.18)' : 'none',
                            }}
                          />
                        )
                      })}
                    </div>
                  ))}
                </div>
                {wi < WORDS.length - 1 && <span className="font-term text-4xl text-[#3DDC97]/40">/</span>}
              </div>
            ))}
          </div>
          <p className="mt-2 text-center font-term text-lg text-[#3DDC97]/50">Hint: it’s Morse code. Short flash = dot, long flash = dash.</p>
          <div className="mt-4 flex flex-wrap justify-center gap-2">
            <button type="button" className="btn btn-sm !bg-[#1E4A36] !text-[#BFF5DA]" onClick={replay}>
              ↻ Replay
            </button>
            <button
              type="button"
              className="btn btn-sm !bg-[#1E4A36] !text-[#BFF5DA]"
              aria-pressed={audioOn}
              onClick={() => {
                setAudioOn((a) => !a)
                replay()
              }}
            >
              {audioOn ? '🔊 Beeps on' : '🔈 Play beeps'}
            </button>
          </div>
          <div className="mt-5">
            <AnswerForm
              tone="dark"
              label="Decoded message"
              placeholder="Type the message"
              uppercase
              check={(v) => normalize(v) === 'meetbylake'}
              onCorrect={() => {
                setSolved(true)
                setTimeout(onSolved, 2800)
              }}
              wrongText="That doesn't match the signal."
              successText="Signal decoded!"
            />
          </div>
        </>
      )}
    </div>
  )
}
