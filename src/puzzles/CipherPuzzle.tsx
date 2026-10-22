import { motion } from 'framer-motion'
import { useState } from 'react'
import { playSfx } from '../audio/sound'
import { AnswerForm, normalize } from '../components/PuzzleContainer'

export const ENCODED = 'WRB IDFWRUB'
const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'

/** Optional tool: the lower row of letters can be slid left or right against the top row. */
function AlphabetStrip() {
  const [shift, setShift] = useState(0)
  const move = (d: number) => {
    playSfx('key')
    setShift((s) => (s + d + 26) % 26)
  }
  return (
    <div className="rounded-2xl bg-[#F1E6D2] p-3">
      <div className="mb-2 flex items-center justify-between gap-2">
        <span className="font-display text-sm font-semibold tracking-wide text-navy/70 uppercase">Alphabet strip</span>
        <div className="flex items-center gap-2">
          <button type="button" className="icon-btn !h-9 !w-9" aria-label="Slide lower row left" onClick={() => move(1)}>
            ◀
          </button>
          <button type="button" className="icon-btn !h-9 !w-9" aria-label="Slide lower row right" onClick={() => move(-1)}>
            ▶
          </button>
        </div>
      </div>
      <div className="overflow-x-auto no-scrollbar">
        <div className="grid min-w-[540px] grid-cols-[repeat(26,minmax(0,1fr))] gap-[2px] font-type text-base sm:text-lg">
          {[...ALPHABET].map((ch) => (
            <div key={`t${ch}`} className="rounded-t-md bg-white py-1 text-center text-navy">
              {ch}
            </div>
          ))}
          {[...ALPHABET].map((_, i) => {
            const ch = ALPHABET[(i + shift) % 26]
            return (
              <motion.div key={`b${i}`} layout className="rounded-b-md bg-navy py-1 text-center text-gold">
                {ch}
              </motion.div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export function SecretNote({ decoded }: { decoded: boolean }) {
  return (
    <motion.div
      initial={{ rotateX: 88, opacity: 0.4 }}
      animate={{ rotateX: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: [0.2, 0.8, 0.3, 1] }}
      style={{ transformOrigin: 'top center', transformPerspective: 900 }}
      className="paper-texture relative mx-auto max-w-lg rounded-md px-6 py-8 text-center shadow-[0_10px_30px_rgba(36,53,75,0.25)] sm:px-10"
    >
      {/* fold crease */}
      <div className="pointer-events-none absolute inset-x-0 top-1/2 h-px bg-[#E2D3B8]" />
      <div className="pointer-events-none absolute inset-x-0 top-1/2 h-6 -translate-y-6 bg-gradient-to-b from-transparent to-black/[0.03]" />
      <p className="font-type text-3xl tracking-[0.16em] whitespace-nowrap text-navy sm:text-5xl" aria-label={`Encoded message: ${ENCODED}`}>
        {ENCODED}
      </p>
      {decoded && (
        <motion.p initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} className="mt-2 font-hand text-4xl font-bold text-evergreen">
          TOY FACTORY
        </motion.p>
      )}
      <p className="mt-6 font-hand text-2xl leading-snug text-[#5B3A22] sm:text-3xl">“Remember how we used to count three steps backward?”</p>
      <p className="mt-2 text-right font-hand text-2xl text-[#5B3A22]">— N.</p>
    </motion.div>
  )
}

export function CipherPuzzle({ onSolved }: { onSolved: () => void }) {
  const [decoded, setDecoded] = useState(false)
  return (
    <div className="space-y-5">
      <SecretNote decoded={decoded} />
      {!decoded && <AlphabetStrip />}
      <AnswerForm
        label="Decoded message"
        placeholder="What does the note say?"
        uppercase
        check={(v) => normalize(v) === 'toyfactory'}
        onCorrect={() => {
          setDecoded(true)
          setTimeout(onSolved, 2200)
        }}
        wrongText="That doesn't decode the note."
        successText="Decoded!"
      />
    </div>
  )
}
