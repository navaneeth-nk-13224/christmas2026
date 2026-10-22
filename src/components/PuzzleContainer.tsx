import { AnimatePresence, motion } from 'framer-motion'
import { useState, type FormEvent, type ReactNode } from 'react'
import { playSfx } from '../audio/sound'

/** Lower-case, strip accents, and collapse everything that is not a letter or digit. */
export function normalize(value: string) {
  return value
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '')
}

export function FeedbackLine({ kind, children }: { kind: 'error' | 'success' | null; children?: ReactNode }) {
  return (
    <div className="min-h-[1.75rem]" aria-live="polite">
      <AnimatePresence mode="wait">
        {kind && (
          <motion.p
            key={String(children) + kind}
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className={`font-display text-base font-semibold ${kind === 'error' ? 'text-xred' : 'text-evergreen'}`}
          >
            {children}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  )
}

/**
 * Text answer box shared by the puzzles. Wrong answers get a gentle shake and a
 * short message; there is no limit on attempts and the answer is never revealed.
 */
export function AnswerForm({
  label,
  placeholder,
  check,
  onCorrect,
  wrongText = 'Not quite. Take another look.',
  successText = 'That’s it!',
  button = 'Check',
  inputMode,
  maxLength,
  uppercase = false,
  tone = 'light',
}: {
  label: string
  placeholder?: string
  check: (value: string) => boolean
  onCorrect: () => void
  wrongText?: string
  successText?: string
  button?: string
  inputMode?: 'text' | 'numeric'
  maxLength?: number
  uppercase?: boolean
  tone?: 'light' | 'dark'
}) {
  const [value, setValue] = useState('')
  const [state, setState] = useState<'idle' | 'error' | 'success'>('idle')
  const [shakeKey, setShakeKey] = useState(0)

  const submit = (e: FormEvent) => {
    e.preventDefault()
    if (state === 'success' || !value.trim()) return
    if (check(value)) {
      setState('success')
      playSfx('success')
      setTimeout(onCorrect, 900)
    } else {
      setState('error')
      setShakeKey((k) => k + 1)
      playSfx('error')
    }
  }

  return (
    <form onSubmit={submit} className="w-full">
      <label
        className={`mb-1.5 block font-display text-sm font-semibold tracking-wide uppercase ${tone === 'dark' ? 'text-winter' : 'text-navy/70'}`}
      >
        {label}
      </label>
      <div key={shakeKey} className={`flex gap-2 ${state === 'error' ? 'shake' : ''}`}>
        <input
          className={`field ${uppercase ? 'uppercase' : ''} ${state === 'success' ? '!border-evergreen' : state === 'error' ? '!border-xred/60' : ''}`}
          value={value}
          onChange={(e) => {
            setValue(e.target.value)
            if (state === 'error') setState('idle')
          }}
          placeholder={placeholder}
          inputMode={inputMode}
          maxLength={maxLength}
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
          spellCheck={false}
          disabled={state === 'success'}
        />
        <button type="submit" className={`btn ${state === 'success' ? 'btn-green' : 'btn-red'} shrink-0`} disabled={state === 'success'}>
          {state === 'success' ? '✓' : button}
        </button>
      </div>
      <FeedbackLine kind={state === 'idle' ? null : state}>{state === 'error' ? wrongText : successText}</FeedbackLine>
    </form>
  )
}
