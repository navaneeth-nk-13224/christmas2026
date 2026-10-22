import { AnimatePresence, motion } from 'framer-motion'
import { useCallback, useRef, useState } from 'react'

/** Small observation caption shown when the player inspects an ordinary object. */
export function useObservation() {
  const [text, setText] = useState<string | null>(null)
  const [key, setKey] = useState(0)
  const timer = useRef<number | undefined>(undefined)

  const show = useCallback((t: string) => {
    window.clearTimeout(timer.current)
    setText(t)
    setKey((k) => k + 1)
    timer.current = window.setTimeout(() => setText(null), 2600)
  }, [])

  const node = (
    <div className="pointer-events-none absolute inset-x-0 top-3 z-20 flex justify-center px-4">
      <AnimatePresence>
        {text && (
          <motion.div
            key={key}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            className="rounded-full bg-white/95 px-5 py-2 font-display text-base font-medium text-navy shadow-lg"
          >
            {text}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )

  return [node, show] as const
}
