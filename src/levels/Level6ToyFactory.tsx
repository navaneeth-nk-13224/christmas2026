import { useState } from 'react'
import { C, Crate, Present } from '../art/props'
import { DialogueBox } from '../components/DialogueBox'
import { InspectionModal } from '../components/InspectionModal'
import { Hotspot, InteractiveScene } from '../components/InteractiveScene'
import { ScenePip } from '../components/ScenePip'
import { useObservation } from '../components/Toast'
import { D } from '../data/dialogues'
import { FootagePuzzle, Playback } from '../puzzles/FootagePuzzle'
import { useLevelPhase } from '../state/progress'
import type { LevelProps } from './types'

const WALL = '#2E3B4C'
const BRICK = '#344356'
const FLOOR = '#3A4757'
const STEEL = '#5A6A80'
const STEEL_DARK = '#46546A'

function Gear({ x, y, r, fill }: { x: number; y: number; r: number; fill: string }) {
  const teeth = 10
  return (
    <g>
      {Array.from({ length: teeth }, (_, i) => (
        <rect
          key={i}
          x={x - r * 0.16}
          y={y - r * 1.18}
          width={r * 0.32}
          height={r * 0.4}
          rx={2}
          fill={fill}
          transform={`rotate(${(360 / teeth) * i} ${x} ${y})`}
        />
      ))}
      <circle cx={x} cy={y} r={r} fill={fill} />
      <circle cx={x} cy={y} r={r * 0.35} fill={WALL} />
    </g>
  )
}

function FactoryScene({ onMonitor, observe }: { onMonitor: () => void; observe: (t: string) => void }) {
  return (
    <g>
      <defs>
        <linearGradient id="l6-beam" x1="0" y1="0" x2="0.3" y2="1">
          <stop offset="0" stopColor="#BFE0F5" stopOpacity={0.22} />
          <stop offset="1" stopColor="#BFE0F5" stopOpacity={0} />
        </linearGradient>
      </defs>
      {/* walls */}
      <rect width={1600} height={900} fill={WALL} />
      {Array.from({ length: 14 }, (_, row) =>
        Array.from({ length: 17 }, (_, col) => (
          <rect key={`${row}-${col}`} x={col * 100 + (row % 2) * 50 - 50} y={row * 44 + 220} width={92} height={36} rx={3} fill={BRICK} />
        )),
      )}
      {/* high windows with moonlight */}
      {[120, 420, 720, 1020, 1320].map((x, i) => (
        <g key={x}>
          <rect x={x} y={60} width={200} height={130} fill="#1E2838" />
          <rect x={x + 8} y={68} width={184} height={114} fill="#5B7AA6" />
          <path d={`M${x + 100} 68 V182 M${x + 8} 125 H${x + 192}`} stroke="#1E2838" strokeWidth={6} />
          {i === 2 && <path d={`M${x + 110} 72 l30 22 l-18 10 l28 24`} stroke="#1E2838" strokeWidth={3} fill="none" />}
          <path d={`M${x + 8} 182 L${x + 192} 182 L${x + 330} 900 L${x - 40} 900 Z`} fill="url(#l6-beam)" />
        </g>
      ))}
      <rect y={190} width={1600} height={24} fill="#253142" />

      {/* hanging lamps (one recently switched on) */}
      {[600, 1060].map((x, i) => (
        <g key={x}>
          <line x1={x} y1={214} x2={x} y2={300} stroke="#1E2838" strokeWidth={4} />
          <path d={`M${x - 40} 330 Q${x} 280 ${x + 40} 330 Z`} fill={STEEL_DARK} />
          {i === 0 && (
            <>
              <ellipse cx={x} cy={330} rx={30} ry={6} fill="#FFE08A" className="flicker" />
              <path d={`M${x - 36} 332 L${x + 36} 332 L${x + 180} 820 L${x - 180} 820 Z`} fill="#FFE08A" opacity={0.07} />
            </>
          )}
        </g>
      ))}

      {/* loading bay door, left partly open */}
      <Hotspot label="Loading bay door" onClick={() => observe('Fresh tyre tracks lead in from the snow.')}>
        <rect x={1170} y={250} width={300} height={360} fill="#253142" />
        {Array.from({ length: 13 }, (_, i) => (
          <rect key={i} x={1180} y={258 + i * 24} width={280} height={18} fill={STEEL_DARK} />
        ))}
        <rect x={1180} y={572} width={280} height={38} fill="#C9D6E8" opacity={0.85} />
        <rect x={1160} y={240} width={320} height={14} fill={STEEL} />
        <path d="M1260 610 L1160 900 M1380 610 L1440 900" stroke="#2C3846" strokeWidth={26} opacity={0.9} />
      </Hotspot>

      {/* floor */}
      <path d="M0 640 H1600 V900 H0 Z" fill={FLOOR} />
      <path d="M1260 640 L1110 900 M1380 640 L1430 900" stroke="#2C3846" strokeWidth={30} opacity={0.85} />
      {[700, 780, 860].map((y) => (
        <line key={y} x1={0} y1={y} x2={1600} y2={y} stroke="#34404F" strokeWidth={2} />
      ))}

      {/* toy machine */}
      <Hotspot label="Toy-making machine" onClick={() => observe('Old toy-making machines, covered in dust.')}>
        <rect x={40} y={300} width={330} height={420} rx={14} fill={STEEL} />
        <rect x={60} y={320} width={290} height={150} rx={8} fill={STEEL_DARK} />
        <Gear x={130} y={395} r={46} fill="#7C8BA0" />
        <Gear x={226} y={420} r={30} fill="#8E9CB0" />
        <Gear x={300} y={380} r={36} fill="#7C8BA0" />
        <path d="M120 260 L290 260 L250 300 L160 300 Z" fill={STEEL_DARK} />
        {[110, 190, 270].map((x) => (
          <g key={x}>
            <circle cx={x} cy={530} r={22} fill="#F8FBFF" opacity={0.9} />
            <path d={`M${x} 530 l10 -12`} stroke={C.red} strokeWidth={3} />
          </g>
        ))}
        <rect x={80} y={590} width={250} height={80} rx={6} fill={STEEL_DARK} />
        <rect x={100} y={610} width={60} height={20} rx={4} fill={C.red} opacity={0.6} />
        <rect x={180} y={610} width={60} height={20} rx={4} fill={C.gold} opacity={0.6} />
        <rect x={60} y={710} width={40} height={30} fill="#2C3846" />
        <rect x={310} y={710} width={40} height={30} fill="#2C3846" />
        <path d="M60 300 Q60 220 140 220 H190" fill="none" stroke={STEEL_DARK} strokeWidth={14} />
      </Hotspot>

      {/* conveyor belt with toy boxes */}
      <Hotspot label="Conveyor belt" onClick={() => observe('The belt stopped halfway through a job.')}>
        <rect x={700} y={580} width={480} height={36} rx={18} fill="#222C3A" />
        {Array.from({ length: 12 }, (_, i) => (
          <circle key={i} cx={720 + i * 40} cy={598} r={12} fill={STEEL} />
        ))}
        {[740, 1130].map((x) => (
          <rect key={x} x={x} y={616} width={20} height={130} fill={STEEL_DARK} />
        ))}
        <rect x={760} y={520} width={80} height={60} rx={4} fill="#C9A27A" />
        <rect x={880} y={530} width={70} height={50} rx={4} fill="#D7B48C" />
        <rect x={1000} y={510} width={90} height={70} rx={4} fill="#C9A27A" />
        <path d="M800 520 V580 M915 530 V580 M1045 510 V580" stroke="#9A7650" strokeWidth={3} />
        <g transform="translate(1110 580)">
          <rect x={-14} y={-50} width={28} height={36} rx={4} fill="#8E9CB0" />
          <rect x={-10} y={-70} width={20} height={20} rx={4} fill="#8E9CB0" />
          <circle cx={-4} cy={-60} r={2.5} fill={C.gold} />
          <circle cx={4} cy={-60} r={2.5} fill={C.gold} />
          <rect x={-12} y={-14} width={8} height={14} fill="#7C8BA0" />
          <rect x={4} y={-14} width={8} height={14} fill="#7C8BA0" />
        </g>
      </Hotspot>

      {/* crates of stolen presents */}
      <Hotspot label="Crates" onClick={() => observe("Wrapped presents with children's name tags!")}>
        <Crate x={1220} y={660} w={160} h={120} stencil="FRAGILE" dark />
        <Crate x={1390} y={640} w={170} h={140} open dark />
        <Crate x={1290} y={540} w={150} h={120} open dark />
        <Present x={1470} y={570} w={60} h={50} color={C.red} tag />
      </Hotspot>

      {/* security camera high on the wall */}
      <Hotspot label="Security camera" onClick={() => observe('The camera is still recording.')}>
        <rect x={1500} y={226} width={60} height={14} fill={STEEL_DARK} />
        <rect x={1528} y={236} width={10} height={40} fill={STEEL_DARK} />
        <g transform="rotate(24 1530 286)">
          <rect x={1460} y={270} width={100} height={40} rx={8} fill="#D6DEE8" />
          <rect x={1440} y={276} width={24} height={28} rx={4} fill="#9AA9B8" />
          <circle cx={1446} cy={290} r={8} fill="#1C2433" />
        </g>
        <circle cx={1546} cy={268} r={5} fill="#FF5A4E" className="blink" />
      </Hotspot>

      {/* the security monitor */}
      <rect x={410} y={640} width={300} height={22} rx={5} fill="#5B3A22" />
      <rect x={426} y={662} width={18} height={140} fill="#4A3020" />
      <rect x={676} y={662} width={18} height={140} fill="#4A3020" />
      <Hotspot label="Security monitor" onClick={onMonitor} hit={[420, 450, 280, 200]}>
        <rect x={440} y={470} width={230} height={170} rx={16} fill="#2B3442" />
        <rect x={456} y={486} width={198} height={132} rx={10} fill="#8FA596" />
        <g opacity={0.5} className="flicker">
          {Array.from({ length: 22 }, (_, i) => (
            <rect key={i} x={456} y={488 + i * 6} width={198} height={2} fill="#3A4A44" />
          ))}
        </g>
        <text x={470} y={508} fontFamily="VT323, monospace" fontSize={16} fill="#F2F7EE">
          CAM 02
        </text>
        <circle cx={636} cy={503} r={4} fill="#FF5A4E" className="blink" />
        <rect x={538} y={640} width={34} height={8} fill="#2B3442" />
      </Hotspot>
      <Hotspot label="Takeaway cup" onClick={() => observe('A takeaway cup. Someone was here recently.')}>
        <path d="M674 640 L678 604 H700 L704 640 Z" fill="#F8FBFF" />
        <rect x={675} y={598} width={28} height={8} rx={3} fill={C.red} />
      </Hotspot>

      <ScenePip mood="worried" />
    </g>
  )
}

export default function Level6ToyFactory({ onComplete }: LevelProps) {
  const [phase, setPhase] = useLevelPhase<'intro' | 'explore' | 'done'>(6, 'intro')
  const [open, setOpen] = useState(false)
  // Keep the just-finished playback on screen instead of restarting it.
  const [justSolved, setJustSolved] = useState(false)
  const [note, observe] = useObservation()

  return (
    <div className="relative h-full">
      <InteractiveScene label="Abandoned toy factory" bg={WALL} focusX={760}>
        <FactoryScene onMonitor={() => setOpen(true)} observe={observe} />
      </InteractiveScene>
      {note}
      {phase === 'intro' && <DialogueBox lines={D.l6Intro} onDone={() => setPhase('explore')} />}
      {phase === 'done' && !open && <DialogueBox lines={D.l6Done} onDone={onComplete} />}
      <InspectionModal
        open={open}
        onClose={() => {
          setOpen(false)
          setJustSolved(false)
        }}
        title="Recovered footage"
        tone="dark"
        size="xl"
        done={phase === 'done'}
      >
        {phase === 'done' && !justSolved ? (
          <Playback onDone={() => undefined} />
        ) : (
          <FootagePuzzle
            onSolved={() => {
              setJustSolved(true)
              setPhase('done')
            }}
          />
        )}
      </InspectionModal>
    </div>
  )
}
