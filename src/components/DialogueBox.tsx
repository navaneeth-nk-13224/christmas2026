import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { Portrait, speakerName, type Mood, type PipPose, type Speaker } from '../art/characters'
import { playSfx } from '../audio/sound'
import { setPipLine } from '../state/pipMood'

export interface Line {
  who: Speaker
  text: string
  /** Expression for the speaker's portrait (and for Pip in the scene). */
  mood?: Mood
  /** Pip's pose in the scene while he says this line. */
  pose?: PipPose
}

/**
 * Short illustrated dialogue panel. Tap/click (or Enter/Space) to advance.
 * Calls onDone after the last line.
 */
export function DialogueBox({ lines, onDone }: { lines: Line[]; onDone: () => void }) {
  const [index, setIndex] = useState(0)
  const [shown, setShown] = useState(0)
  const line = lines[index]
  const typing = line ? shown < line.text.length : false

  useEffect(() => {
    setPipLine(line?.who === 'pip' ? { mood: line.mood, pose: line.pose } : null)
  }, [line])
  useEffect(() => () => setPipLine(null), [])

  useEffect(() => {
    if (!line || shown >= line.text.length) return
    const t = setTimeout(() => setShown((n) => n + 1), 22)
    return () => clearTimeout(t)
  }, [line, shown])

  const advance = () => {
    if (!line) return
    if (typing) {
      setShown(line.text.length)
      return
    }
    playSfx('click')
    if (index + 1 < lines.length) {
      setIndex(index + 1)
      setShown(0)
    } else onDone()
  }

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      // Focused buttons and inputs handle these keys themselves.
      const tag = (e.target as HTMLElement | null)?.tagName
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'BUTTON') return
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault()
        advance()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  })

  if (!line) return null

  return (
    <div className="pointer-events-none absolute inset-x-0 bottom-0 z-30 flex justify-center px-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
      <AnimatePresence mode="wait">
        <motion.button
          key={index}
          type="button"
          onClick={advance}
          initial={{ y: 24, opacity: 0, scale: 0.98 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          exit={{ y: 8, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 420, damping: 32 }}
          className="pointer-events-auto flex w-full max-w-2xl cursor-pointer items-start gap-3 rounded-3xl border-4 border-white bg-white/95 p-3 text-left shadow-[0_10px_30px_rgba(10,20,40,0.35)] backdrop-blur sm:gap-4 sm:p-4"
          aria-label={`${speakerName(line.who)} says: ${line.text}. Continue.`}
        >
          <Portrait who={line.who} size={60} mood={line.mood} />
          <div className="min-w-0 flex-1 pt-0.5">
            <div className="font-display text-sm font-semibold tracking-wide text-xred uppercase">{speakerName(line.who)}</div>
            <p className="mt-0.5 font-display text-lg leading-snug text-navy sm:text-xl">
              {line.text.slice(0, shown)}
              <span className="invisible">{line.text.slice(shown)}</span>
            </p>
          </div>
          <span className={`self-end text-xl text-evergreen transition-opacity ${typing ? 'opacity-0' : 'animate-bounce opacity-100'}`} aria-hidden>
            ▼
          </span>
        </motion.button>
      </AnimatePresence>
    </div>
  )
}
