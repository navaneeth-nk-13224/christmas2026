import { useState } from 'react'
import { C, SvgSnow, Tree } from '../art/props'
import { DialogueBox } from '../components/DialogueBox'
import { InspectionModal } from '../components/InspectionModal'
import { Hotspot, InteractiveScene } from '../components/InteractiveScene'
import { ScenePip } from '../components/ScenePip'
import { useObservation } from '../components/Toast'
import { D } from '../data/dialogues'
import { LandmarkPuzzle, PHOTO_SRC } from '../puzzles/LandmarkPuzzle'
import { useLevelPhase } from '../state/progress'
import type { LevelProps } from './types'

const PINE = '#DDAE7C'
const PINE_LINE = '#C8955F'

function LakeView() {
  return (
    <g>
      <defs>
        <linearGradient id="l4-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#CFE7F7" />
          <stop offset="1" stopColor="#F2F9FD" />
        </linearGradient>
        <clipPath id="l4-glass">
          <rect x={400} y={128} width={800} height={326} />
        </clipPath>
      </defs>
      <g clipPath="url(#l4-glass)">
        <rect x={400} y={128} width={800} height={326} fill="url(#l4-sky)" />
        <path d="M400 300 L520 210 L600 260 L700 180 L800 250 L900 200 L1020 270 L1100 220 L1200 280 V340 H400 Z" fill="#E4F0F8" />
        <path
          d="M520 210 L560 240 L540 238 L520 226 L500 236 Z M700 180 L736 210 L716 206 L700 196 L684 208 Z M900 200 L940 230 L916 226 L900 214 L884 224 Z"
          fill="#fff"
        />
        {Array.from({ length: 22 }, (_, i) => (
          <Tree key={i} x={410 + i * 38} y={350 - (i % 3) * 4} s={0.22 + (i % 4) * 0.03} color="#2A6E66" snowy />
        ))}
        {/* the frozen lake */}
        <rect x={400} y={346} width={800} height={110} fill="#CDE6F4" />
        <path d="M400 360 Q700 350 1200 362" stroke="#fff" strokeWidth={5} opacity={0.7} fill="none" />
        <path d="M520 400 l60 -12 l40 20 l70 -8 M860 420 l50 -18 l30 10 l60 -14 M700 440 l30 -10" stroke="#A9CFE4" strokeWidth={2.5} fill="none" />
        <ellipse cx={980} cy={392} rx={90} ry={10} fill="#fff" opacity={0.6} />
        <ellipse cx={600} cy={430} rx={120} ry={9} fill="#fff" opacity={0.5} />
        {/* small ice-measuring hut on the ice */}
        <g>
          <rect x={1040} y={402} width={40} height={30} fill={C.red} />
          <path d="M1034 404 L1060 386 L1086 404 Z" fill="#fff" />
          <rect x={1056} y={414} width={10} height={18} fill="#7E4E30" />
        </g>
        <SvgSnow x={400} y={120} w={800} h={340} count={34} seed={44} />
      </g>
    </g>
  )
}

function StationScene({ onPhoto, observe }: { onPhoto: () => void; observe: (t: string) => void }) {
  return (
    <g>
      {/* log walls */}
      <rect width={1600} height={900} fill={PINE} />
      {Array.from({ length: 16 }, (_, i) => (
        <g key={i}>
          <rect x={0} y={i * 42} width={1600} height={4} fill={PINE_LINE} />
          <circle cx={(i * 137) % 1600} cy={i * 42 + 22} r={5} fill={PINE_LINE} opacity={0.6} />
        </g>
      ))}
      <rect y={0} width={1600} height={34} fill="#A66A43" />

      {/* panoramic window over the lake */}
      <Hotspot label="Window over the frozen lake" onClick={() => observe('The lake is frozen solid.')}>
        <rect x={380} y={108} width={840} height={366} rx={10} fill="#8E5634" />
        <LakeView />
        <rect x={660} y={128} width={14} height={326} fill="#8E5634" />
        <rect x={926} y={128} width={14} height={326} fill="#8E5634" />
        <rect x={364} y={468} width={872} height={24} rx={6} fill="#8E5634" />
      </Hotspot>

      {/* radio on a shelf */}
      <Hotspot label="Radio" onClick={() => observe('A shortwave radio. Only static now.')}>
        <rect x={60} y={300} width={260} height={16} fill="#8E5634" />
        <rect x={84} y={220} width={190} height={82} rx={8} fill="#46607E" />
        <rect x={98} y={234} width={90} height={40} rx={4} fill="#1C2A3C" />
        <path d="M104 262 q10 -16 20 0 t20 0 t20 0 t20 0" fill="none" stroke="#3DDC97" strokeWidth={2} className="flicker" />
        <circle cx={220} cy={254} r={16} fill="#2B3442" />
        <circle cx={256} cy={254} r={10} fill="#2B3442" />
        <line x1={260} y1={220} x2={290} y2={150} stroke="#2B3442" strokeWidth={4} />
      </Hotspot>

      {/* snowshoes on the wall */}
      <Hotspot label="Snowshoes" onClick={() => observe('A pair of snowshoes.')}>
        {[110, 190].map((x) => (
          <g key={x} transform={`rotate(${x === 110 ? -8 : 8} ${x} 470)`}>
            <ellipse cx={x} cy={470} rx={30} ry={78} fill="none" stroke="#7E4E30" strokeWidth={8} />
            <path d={`M${x - 26} 440 h52 M${x - 28} 470 h56 M${x - 26} 500 h52 M${x} 396 V544`} stroke="#A66A43" strokeWidth={3} />
          </g>
        ))}
      </Hotspot>

      {/* lake map on the right wall */}
      <Hotspot label="Lake map" onClick={() => observe('Ice thickness measurements across the lake.')}>
        <rect x={1290} y={130} width={240} height={190} rx={6} fill="#F8FBFF" />
        <path
          d="M1320 190 Q1380 150 1460 176 Q1510 210 1480 260 Q1420 296 1350 270 Q1300 240 1320 190 Z"
          fill="#CDE6F4"
          stroke="#8FB8D3"
          strokeWidth={3}
        />
        {[
          [1360, 200],
          [1410, 230],
          [1450, 200],
          [1390, 260],
          [1460, 250],
        ].map(([x, y]) => (
          <circle key={`${x}${y}`} cx={x} cy={y} r={5} fill={C.red} />
        ))}
        <rect x={1300} y={290} width={120} height={8} rx={4} fill={C.navy} opacity={0.3} />
      </Hotspot>

      {/* empty coat hook */}
      <Hotspot label="Coat hooks" onClick={() => observe('Two empty coat hooks.')}>
        <rect x={1300} y={370} width={200} height={20} rx={5} fill="#8E5634" />
        {[1340, 1400, 1460].map((x, i) => (
          <g key={x}>
            <path d={`M${x} 388 v18 q0 10 10 10`} fill="none" stroke="#5B3A22" strokeWidth={6} strokeLinecap="round" />
            {i === 2 && <path d={`M${x - 20} 410 h40 l8 110 h-56 z`} fill="#3E7CC9" />}
          </g>
        ))}
      </Hotspot>

      {/* floor */}
      <rect y={680} width={1600} height={220} fill="#B98252" />
      {[700, 740, 790, 850].map((y) => (
        <line key={y} x1={0} y1={y} x2={1600} y2={y} stroke="#A66A43" strokeWidth={3} />
      ))}

      {/* cold stove */}
      <Hotspot label="Stove" onClick={() => observe('The stove has gone cold.')}>
        <g transform="translate(1150 0)">
          <rect x={110} y={600} width={170} height={200} rx={14} fill="#2B3442" />
          <rect x={134} y={650} width={122} height={90} rx={10} fill="#1C2433" />
          <path d="M176 592 V548 Q176 530 194 530 H290" fill="none" stroke="#2B3442" strokeWidth={36} strokeLinejoin="round" />
          <rect x={100} y={590} width={190} height={20} rx={6} fill="#3A4556" />
          <rect x={124} y={800} width={20} height={40} fill="#2B3442" />
          <rect x={246} y={800} width={20} height={40} fill="#2B3442" />
        </g>
      </Hotspot>

      {/* ice drill */}
      <Hotspot label="Ice drill" onClick={() => observe('An ice drill, still a little wet.')}>
        <g transform="translate(46 0) rotate(-4 1500 860)">
          <rect x={1492} y={480} width={14} height={380} fill="#9AA9B8" />
          <path d="M1480 700 l40 14 l-40 14 l40 14 l-40 14 l40 14 l-40 14" fill="none" stroke="#7B8A99" strokeWidth={6} />
          <rect x={1450} y={474} width={100} height={16} rx={8} fill={C.red} />
        </g>
      </Hotspot>

      {/* desk */}
      <rect x={330} y={566} width={940} height={28} rx={6} fill="#8E5634" />
      <rect x={360} y={594} width={24} height={230} fill="#7E4E30" />
      <rect x={1216} y={594} width={24} height={230} fill="#7E4E30" />
      <rect x={400} y={594} width={260} height={80} rx={4} fill="#7E4E30" />

      {/* logbook */}
      <Hotspot label="Logbook" onClick={() => observe('Ice and weather readings, written by hand.')}>
        <path d="M410 562 L500 552 L590 562 L590 534 L500 524 L410 534 Z" fill="#F8FBFF" />
        <path d="M500 524 V552" stroke="#C9D3DD" strokeWidth={2} />
        <path d="M424 540 l60 -6 M424 548 l60 -6 M516 534 l60 6 M516 542 l60 6" stroke={C.navy} strokeWidth={1.6} opacity={0.4} />
        <rect x={600} y={548} width={60} height={6} rx={3} fill={C.gold} transform="rotate(-10 630 551)" />
      </Hotspot>

      {/* instruments */}
      <Hotspot label="Monitoring instruments" onClick={() => observe('The ice monitors are still recording.')}>
        <rect x={700} y={470} width={230} height={96} rx={8} fill="#46607E" />
        <circle cx={752} cy={520} r={32} fill="#F8FBFF" />
        <path d="M752 520 L774 500" stroke={C.red} strokeWidth={4} strokeLinecap="round" />
        <circle cx={752} cy={520} r={4} fill={C.navy} />
        <rect x={800} y={494} width={110} height={40} rx={4} fill="#07130E" />
        <text x={855} y={522} textAnchor="middle" fontFamily="VT323, monospace" fontSize={26} fill="#3DDC97">
          -18.4°C
        </text>
        <circle cx={906} cy={550} r={5} fill="#3DDC97" className="blink" />
      </Hotspot>

      {/* thermos */}
      <Hotspot label="Thermos" onClick={() => observe('Two cups. Someone had a visitor.')}>
        <rect x={970} y={480} width={40} height={86} rx={10} fill={C.green} />
        <rect x={966} y={470} width={48} height={18} rx={6} fill="#2B3442" />
        <rect x={1022} y={532} width={30} height={34} rx={5} fill="#F8FBFF" />
        <rect x={1060} y={536} width={28} height={30} rx={5} fill={C.red} />
      </Hotspot>

      {/* framed family photograph */}
      <Hotspot label="Framed photograph" onClick={onPhoto} hit={[1104, 460, 140, 110]}>
        <g transform="rotate(-6 1170 520)">
          <rect x={1112} y={470} width={118} height={92} rx={4} fill="#7E4E30" />
          <rect x={1120} y={478} width={102} height={76} fill="#F4EBDD" />
          <image href={PHOTO_SRC} x={1124} y={482} width={94} height={68} preserveAspectRatio="xMidYMid slice" />
          <path d="M1196 562 l14 22" stroke="#5B3A22" strokeWidth={5} />
        </g>
      </Hotspot>

      <ScenePip mood="thinking" />
    </g>
  )
}

export default function Level4FrozenLake({ onComplete }: LevelProps) {
  const [phase, setPhase] = useLevelPhase<'explore' | 'photo' | 'inspect' | 'done'>(4, 'explore')
  const [open, setOpen] = useState(false)
  const [note, observe] = useObservation()

  const onPhoto = () => {
    if (phase === 'explore') setPhase('photo')
    else setOpen(true)
  }

  return (
    <div className="relative h-full">
      <InteractiveScene label="Frozen lake monitoring station" bg={PINE} focusX={900}>
        <StationScene onPhoto={onPhoto} observe={observe} />
      </InteractiveScene>
      {note}
      {phase === 'photo' && (
        <DialogueBox
          lines={D.l4Photo}
          onDone={() => {
            setPhase('inspect')
            setOpen(true)
          }}
        />
      )}
      {phase === 'done' && !open && <DialogueBox lines={D.l4Done} onDone={onComplete} />}
      <InspectionModal open={open} onClose={() => setOpen(false)} title="Family photograph" size="xl" done={phase === 'done'}>
        <LandmarkPuzzle
          onSolved={() => setPhase('done')}
        />
      </InspectionModal>
    </div>
  )
}
