import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'

const STORAGE_KEY = 'last-light-of-christmas:v1'

export interface Progress {
  started: boolean
  /** 1–8 are levels; 9 means the rescue is done and the ending plays. */
  currentLevel: number
  completed: number[]
  /** Saved sub-phase of each level (dialogue progress, puzzle steps). */
  levelPhase: Record<number, string>
  /** Saved mid-puzzle state, keyed by puzzle name. */
  puzzleState: Record<string, unknown>
  dialogueSeen: string[]
  gameComplete: boolean
  storyUnlocked: boolean
  muted: boolean
  musicOn: boolean
}

const fresh = (): Progress => ({
  started: false,
  currentLevel: 1,
  completed: [],
  levelPhase: {},
  puzzleState: {},
  dialogueSeen: [],
  gameComplete: false,
  storyUnlocked: false,
  muted: false,
  musicOn: true,
})

function load(): Progress {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return fresh()
    return { ...fresh(), ...JSON.parse(raw) }
  } catch {
    return fresh()
  }
}

interface ProgressApi {
  progress: Progress
  update: (fn: (p: Progress) => Progress) => void
  setPhase: (level: number, phase: string) => void
  setPuzzleState: (key: string, value: unknown) => void
  markDialogue: (id: string) => void
  completeLevel: (level: number) => void
  resetGame: () => void
}

const ProgressContext = createContext<ProgressApi | null>(null)

export function ProgressProvider({ children }: { children: ReactNode }) {
  const [progress, setProgress] = useState<Progress>(load)

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(progress))
    } catch {
      /* storage unavailable: play continues unsaved */
    }
  }, [progress])

  const update = useCallback((fn: (p: Progress) => Progress) => setProgress(fn), [])

  const api = useMemo<ProgressApi>(
    () => ({
      progress,
      update,
      setPhase: (level, phase) => update((p) => ({ ...p, levelPhase: { ...p.levelPhase, [level]: phase } })),
      setPuzzleState: (key, value) => update((p) => ({ ...p, puzzleState: { ...p.puzzleState, [key]: value } })),
      markDialogue: (id) => update((p) => (p.dialogueSeen.includes(id) ? p : { ...p, dialogueSeen: [...p.dialogueSeen, id] })),
      completeLevel: (level) =>
        update((p) => ({
          ...p,
          completed: p.completed.includes(level) ? p.completed : [...p.completed, level],
          currentLevel: Math.max(p.currentLevel, level + 1),
        })),
      resetGame: () =>
        update((p) => ({
          ...fresh(),
          storyUnlocked: p.storyUnlocked,
          muted: p.muted,
          musicOn: p.musicOn,
        })),
    }),
    [progress, update],
  )

  return <ProgressContext.Provider value={api}>{children}</ProgressContext.Provider>
}

export function useProgress() {
  const ctx = useContext(ProgressContext)
  if (!ctx) throw new Error('useProgress must be used inside ProgressProvider')
  return ctx
}

/** Level sub-phase that survives refreshes. */
export function useLevelPhase<T extends string>(level: number, initial: T) {
  const { progress, setPhase } = useProgress()
  const phase = (progress.levelPhase[level] as T | undefined) ?? initial
  const set = useCallback((next: T) => setPhase(level, next), [level, setPhase])
  return [phase, set] as const
}

/** Mid-puzzle state that survives refreshes. */
export function usePuzzleState<T>(key: string, initial: T | (() => T)) {
  const { progress, setPuzzleState } = useProgress()
  const stored = progress.puzzleState[key] as T | undefined
  const [fallback] = useState(initial)
  const value = stored ?? fallback
  const set = useCallback((next: T) => setPuzzleState(key, next), [key, setPuzzleState])
  return [value, set] as const
}
