import { useSyncExternalStore } from 'react'
import type { Mood, PipPose } from '../art/characters'

// While Pip is speaking, the scene's Pip mirrors the expression of the current line.
type PipLine = { mood?: Mood; pose?: PipPose } | null

let current: PipLine = null
const listeners = new Set<() => void>()

export function setPipLine(line: PipLine) {
  current = line
  listeners.forEach((l) => l())
}

export function usePipLine() {
  return useSyncExternalStore(
    (l) => {
      listeners.add(l)
      return () => listeners.delete(l)
    },
    () => current,
  )
}
