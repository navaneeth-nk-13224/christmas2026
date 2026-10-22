import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, type ReactNode } from 'react'
import { playSfx } from '../audio/sound'

/** Full-screen close-up view used for every clue and puzzle. Always has a close button. */
export function InspectionModal({
  open,
  onClose,
  title,
  children,
  tone = 'light',
  size = 'lg',
}: {
  open: boolean
  onClose: () => void
  title?: string
  children: ReactNode
  tone?: 'light' | 'dark'
  size?: 'md' | 'lg' | 'xl'
}) {
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  const width = size === 'md' ? 'max-w-xl' : size === 'lg' ? 'max-w-3xl' : 'max-w-5xl'

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-40 flex items-start justify-center overflow-y-auto bg-navy-deep/75 px-3 py-[max(0.75rem,env(safe-area-inset-top))] backdrop-blur-sm sm:items-center sm:py-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={(e) => e.target === e.currentTarget && onClose()}
          role="dialog"
          aria-modal="true"
          aria-label={title}
        >
          <motion.div
            initial={{ scale: 0.9, y: 30, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.95, y: 10, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 340, damping: 30 }}
            className={`relative my-auto w-full ${width} rounded-[1.75rem] p-4 shadow-2xl sm:p-6 ${
              tone === 'dark' ? 'bg-[#121b2b] text-white' : 'bg-snow text-navy'
            }`}
          >
            <div className="mb-3 flex items-center justify-between gap-3 pr-1">
              {title ? (
                <h2
                  className={`font-display text-lg font-semibold tracking-wide uppercase sm:text-xl ${tone === 'dark' ? 'text-winter' : 'text-navy'}`}
                >
                  {title}
                </h2>
              ) : (
                <span />
              )}
              <button
                type="button"
                className="icon-btn shrink-0"
                onClick={() => {
                  playSfx('click')
                  onClose()
                }}
                aria-label="Close"
              >
                <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden>
                  <path d="M3 3 L15 15 M15 3 L3 15" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                </svg>
              </button>
            </div>
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
