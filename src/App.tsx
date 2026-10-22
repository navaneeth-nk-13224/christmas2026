import { AnimatePresence } from 'framer-motion'
import { lazy, Suspense, useCallback, useEffect, useState, type ComponentType } from 'react'
import { AudioManager } from './components/AudioManager'
import { GameLayout } from './components/GameLayout'
import { LevelTransition } from './components/LevelTransition'
import { levelMeta } from './data/levels'
import type { LevelProps } from './levels/types'
import { StartScreen } from './screens/StartScreen'
import { ProgressProvider, useProgress } from './state/progress'

// Each level is its own chunk, fetched only when needed (and prefetched one level ahead).
const LEVEL_LOADERS: Record<number, () => Promise<{ default: ComponentType<LevelProps> }>> = {
  1: () => import('./levels/Level1Workshop'),
  2: () => import('./levels/Level2PostOffice'),
  3: () => import('./levels/Level3Laboratory'),
  4: () => import('./levels/Level4FrozenLake'),
  5: () => import('./levels/Level5FamilyHome'),
  6: () => import('./levels/Level6ToyFactory'),
  7: () => import('./levels/Level7TruckTracking'),
  8: () => import('./levels/Level8Warehouse'),
}
const LEVELS = Object.fromEntries(Object.entries(LEVEL_LOADERS).map(([k, load]) => [k, lazy(load)])) as Record<number, ComponentType<LevelProps>>

const Ending = lazy(() => import('./screens/Ending'))
const FinalScreen = lazy(() => import('./screens/FinalScreen'))
const Storybook = lazy(() => import('./components/Storybook'))
const Credits = lazy(() => import('./screens/Credits'))

type Screen =
  | { name: 'menu' }
  | { name: 'level' }
  | { name: 'transition'; level: number }
  | { name: 'ending' }
  | { name: 'final' }
  | { name: 'story' }
  | { name: 'credits' }

function Loading() {
  return (
    <div className="grid h-full place-items-center bg-navy-deep">
      <div className="h-10 w-10 animate-spin rounded-full border-4 border-white/20 border-t-gold" />
    </div>
  )
}

function Game() {
  const { progress, update, completeLevel, resetGame } = useProgress()
  const [screen, setScreen] = useState<Screen>({ name: 'menu' })
  const level = Math.min(progress.currentLevel, 8)

  useEffect(() => {
    // Warm up the next chunk so the journey doesn't wait on the network.
    if (screen.name === 'level' && level < 8) void LEVEL_LOADERS[level + 1]()
    if (screen.name === 'level' && level === 8) void import('./screens/Ending')
  }, [screen.name, level])

  const finishLevel = useCallback(() => {
    const done = level
    completeLevel(done)
    if (done === 8) {
      update((p) => ({ ...p, storyUnlocked: true }))
      setScreen({ name: 'ending' })
    } else {
      setScreen({ name: 'transition', level: done + 1 })
    }
  }, [level, completeLevel, update])

  const continueGame = () => {
    if (progress.gameComplete) setScreen({ name: 'final' })
    else if (progress.currentLevel > 8) setScreen({ name: 'ending' })
    else setScreen({ name: 'level' })
  }

  const startNew = () => {
    resetGame()
    update((p) => ({ ...p, started: true }))
    setScreen({ name: 'level' })
  }

  const CurrentLevel = LEVELS[level]

  return (
    <div className="h-full">
      <AudioManager />
      <Suspense fallback={<Loading />}>
        {screen.name === 'menu' && (
          <StartScreen
            hasSave={progress.started}
            storyUnlocked={progress.gameComplete /* only once this playthrough is solved */}
            onStart={startNew}
            onContinue={continueGame}
            onStory={() => setScreen({ name: 'story' })}
            onCredits={() => setScreen({ name: 'credits' })}
          />
        )}
        {(screen.name === 'level' || screen.name === 'transition') && (
          <GameLayout level={level} onHome={() => setScreen({ name: 'menu' })}>
            <Suspense fallback={<Loading />}>
              {/* key: a fresh component per level so no state leaks between levels */}
              <CurrentLevel key={level} onComplete={finishLevel} />
            </Suspense>
          </GameLayout>
        )}
        <AnimatePresence>
          {screen.name === 'transition' && (
            <LevelTransition key={screen.level} arrival={levelMeta(screen.level).arrival!} onDone={() => setScreen({ name: 'level' })} />
          )}
        </AnimatePresence>
        {screen.name === 'ending' && (
          <Ending
            onDone={() => {
              update((p) => ({ ...p, gameComplete: true, storyUnlocked: true }))
              setScreen({ name: 'final' })
            }}
          />
        )}
        {screen.name === 'final' && (
          <FinalScreen
            onStory={() => setScreen({ name: 'story' })}
            onPlayAgain={() => {
              resetGame()
              setScreen({ name: 'menu' })
            }}
          />
        )}
        {screen.name === 'story' && <Storybook onBack={() => setScreen({ name: 'final' })} />}
        {screen.name === 'credits' && <Credits onBack={() => setScreen({ name: 'menu' })} />}
      </Suspense>
    </div>
  )
}

export default function App() {
  return (
    <ProgressProvider>
      <Game />
    </ProgressProvider>
  )
}
