import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { STORY_ART } from '../art/storyArt'
import { playSfx } from '../audio/sound'
import { STORY_PAGES } from '../data/storyPages'
import { NorthPoleNight } from '../screens/StartScreen'
import { Snow } from './Snow'

/** "The Story Behind the Mystery": five illustrated pages, unlocked after the rescue. */
export default function Storybook({ onBack }: { onBack: () => void }) {
  const [page, setPage] = useState(0)
  const [dir, setDir] = useState(1)
  const last = page === STORY_PAGES.length - 1
  const Art = STORY_ART[page]
  const { heading, lines } = STORY_PAGES[page]

  const go = (d: number) => {
    const next = page + d
    if (next < 0 || next >= STORY_PAGES.length) return
    playSfx('paper')
    setDir(d)
    setPage(next)
  }

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') go(1)
      if (e.key === 'ArrowLeft') go(-1)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  })

  return (
    <div className="relative h-full overflow-y-auto bg-navy-deep">
      <div className="fixed inset-0 opacity-30">
        <NorthPoleNight />
      </div>
      <Snow count={30} />
      <div className="relative mx-auto flex min-h-full max-w-4xl flex-col px-3 py-[max(1rem,env(safe-area-inset-top))] sm:px-6 sm:py-8">
        <h1 className="text-center font-display text-xl font-bold tracking-[0.18em] text-gold uppercase sm:text-3xl">The Story Behind the Mystery</h1>
        <div className="relative mt-4 flex-1 [perspective:1400px]">
          <AnimatePresence mode="wait" custom={dir}>
            <motion.article
              key={page}
              custom={dir}
              initial={{ rotateY: dir * 70, opacity: 0, x: dir * 60 }}
              animate={{ rotateY: 0, opacity: 1, x: 0 }}
              exit={{ rotateY: dir * -70, opacity: 0, x: dir * -60 }}
              transition={{ duration: 0.45, ease: [0.3, 0.7, 0.3, 1] }}
              style={{ transformOrigin: dir > 0 ? 'left center' : 'right center' }}
              className="paper-texture overflow-hidden rounded-[1.75rem] shadow-[0_20px_50px_rgba(0,0,0,0.45)]"
            >
              <div className="m-3 overflow-hidden rounded-2xl sm:m-4" style={{ aspectRatio: '12 / 7' }}>
                <Art />
              </div>
              <div className="px-5 pt-2 pb-6 sm:px-10 sm:pb-8">
                <div className="font-display text-sm font-semibold tracking-[0.25em] text-xred uppercase">Chapter {page + 1}</div>
                <h2 className="mt-1 font-display text-3xl font-bold text-navy sm:text-4xl">{heading}</h2>
                <div className="mt-3 space-y-1.5 text-lg leading-relaxed text-navy/85 sm:text-xl">
                  {lines.map((l) => (
                    <p key={l}>{l}</p>
                  ))}
                </div>
              </div>
            </motion.article>
          </AnimatePresence>
        </div>
        <nav className="mt-5 flex items-center justify-between gap-3 pb-[env(safe-area-inset-bottom)]" aria-label="Story pages">
          <button type="button" className="btn btn-light" onClick={() => go(-1)} disabled={page === 0}>
            ← Previous
          </button>
          <span className="font-display text-lg font-semibold text-white" aria-live="polite">
            {page + 1} / {STORY_PAGES.length}
          </span>
          {last ? (
            <button type="button" className="btn btn-red" onClick={onBack}>
              Back to Celebration
            </button>
          ) : (
            <button type="button" className="btn btn-red" onClick={() => go(1)}>
              Next →
            </button>
          )}
        </nav>
      </div>
    </div>
  )
}
