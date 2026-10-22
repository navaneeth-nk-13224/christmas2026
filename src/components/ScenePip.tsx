import { Pip, type Mood, type PipPose } from '../art/characters'
import { usePipLine } from '../state/pipMood'

/** Pip's standard spot in every scene: the bottom-left corner. */
export function ScenePip({
  mood = 'happy',
  pose = 'idle',
  x = 150,
  y = 886,
  s = 1.15,
}: {
  mood?: Mood
  pose?: PipPose
  x?: number
  y?: number
  s?: number
}) {
  const line = usePipLine()
  return (
    <g className="bob" style={{ pointerEvents: 'none' }}>
      <Pip x={x} y={y} s={s} mood={line?.mood ?? mood} pose={line?.pose ?? pose} />
    </g>
  )
}
