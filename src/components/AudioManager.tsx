import { useEffect } from 'react'
import { playSfx, setMusicWanted, setMuted, startMusic } from '../audio/sound'
import { useProgress } from '../state/progress'

/** Keeps the audio engine in sync with saved settings; music starts on the first interaction. */
export function AudioManager() {
  const { progress } = useProgress()
  const { muted, musicOn } = progress

  useEffect(() => {
    setMuted(muted)
    setMusicWanted(musicOn)
  }, [muted, musicOn])

  useEffect(() => {
    if (muted || !musicOn) return
    const kick = () => startMusic()
    window.addEventListener('pointerdown', kick, { once: true })
    window.addEventListener('keydown', kick, { once: true })
    return () => {
      window.removeEventListener('pointerdown', kick)
      window.removeEventListener('keydown', kick)
    }
  }, [muted, musicOn])

  return null
}

export function SoundButtons({ dark = false }: { dark?: boolean }) {
  const { progress, update } = useProgress()
  const cls = `icon-btn ${dark ? '!bg-white/15 !text-white' : ''}`
  return (
    <div className="flex gap-2">
      <button
        type="button"
        className={cls}
        aria-label={progress.musicOn ? 'Turn music off' : 'Turn music on'}
        aria-pressed={progress.musicOn}
        onClick={() => {
          const next = !progress.musicOn
          update((p) => ({ ...p, musicOn: next }))
          setMusicWanted(next)
          if (next && !progress.muted) startMusic()
        }}
      >
        <svg width="20" height="20" viewBox="0 0 20 20" aria-hidden>
          <path d="M7 15 V4 L16 2 V13" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
          <circle cx="5" cy="15" r="2.6" fill="currentColor" />
          <circle cx="14" cy="13" r="2.6" fill="currentColor" />
          {!progress.musicOn && <path d="M2 2 L18 18" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />}
        </svg>
      </button>
      <button
        type="button"
        className={cls}
        aria-label={progress.muted ? 'Unmute sound' : 'Mute sound'}
        aria-pressed={progress.muted}
        onClick={() => {
          const next = !progress.muted
          update((p) => ({ ...p, muted: next }))
          setMuted(next)
          if (!next) {
            playSfx('click')
            if (progress.musicOn) startMusic()
          }
        }}
      >
        <svg width="20" height="20" viewBox="0 0 20 20" aria-hidden>
          <path d="M3 7.5 H6.5 L11 3.5 V16.5 L6.5 12.5 H3 Z" fill="currentColor" />
          {progress.muted ? (
            <path d="M13.5 7.5 L18 12 M18 7.5 L13.5 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          ) : (
            <path d="M13.5 7 Q15.5 10 13.5 13 M15.5 5 Q19 10 15.5 15" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          )}
        </svg>
      </button>
    </div>
  )
}
