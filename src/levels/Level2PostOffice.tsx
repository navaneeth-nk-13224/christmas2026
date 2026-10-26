import { motion } from 'framer-motion'
import { useState } from 'react'
import { Postmaster } from '../art/characters'
import { C, rng, SvgSnow } from '../art/props'
import { playSfx } from '../audio/sound'
import { DialogueBox } from '../components/DialogueBox'
import { InspectionModal } from '../components/InspectionModal'
import { Hotspot, InteractiveScene } from '../components/InteractiveScene'
import { ScenePip } from '../components/ScenePip'
import { useObservation } from '../components/Toast'
import { D } from '../data/dialogues'
import { CoordinatePuzzle } from '../puzzles/CoordinatePuzzle'
import { useLevelPhase } from '../state/progress'
import type { LevelProps } from './types'

const ENVELOPES = ['#fff', '#FDE3E0', '#E1F1FB', '#FFF3C4', '#DFF3E8']

function Pigeonholes() {
  const r = rng(21)
  const cells = []
  for (let row = 0; row < 5; row++) {
    for (let col = 0; col < 8; col++) {
      const x = 566 + col * 60
      const y = 206 + row * 62
      const n = Math.floor(r() * 4)
      cells.push(
        <g key={`${row}-${col}`}>
          <rect x={x} y={y} width={56} height={58} fill="#6B3F22" />
          {Array.from({ length: n }, (_, k) => (
            <rect
              key={k}
              x={x + 5 + k * 3}
              y={y + 22 - k * 5}
              width={44}
              height={34}
              rx={2}
              fill={ENVELOPES[Math.floor(r() * ENVELOPES.length)]}
              transform={`rotate(${(r() - 0.5) * 10} ${x + 28} ${y + 40})`}
            />
          ))}
        </g>,
      )
    }
  }
  return (
    <g>
      <rect x={556} y={196} width={500} height={330} rx={6} fill="#8E5634" />
      {cells}
    </g>
  )
}

function ParcelShelves() {
  const r = rng(5)
  return (
    <g>
      <rect x={1100} y={180} width={14} height={390} fill="#7E4E30" />
      <rect x={1486} y={180} width={14} height={390} fill="#7E4E30" />
      {[300, 430, 560].map((y) => (
        <g key={y}>
          <rect x={1100} y={y} width={400} height={14} fill="#7E4E30" />
          {[0, 1, 2].map((i) => {
            const w = 80 + r() * 40
            const h = 60 + r() * 40
            const x = 1124 + i * 120 + r() * 10
            return (
              <g key={i}>
                <rect x={x} y={y - h} width={w} height={h} rx={3} fill={['#C9A27A', '#B98D63', '#D7B48C'][i]} />
                <path d={`M${x + w / 2} ${y - h} V${y} M${x} ${y - h / 2} H${x + w}`} stroke="#7E5A3A" strokeWidth={2.5} />
                <rect x={x + 8} y={y - h + 8} width={26} height={16} rx={2} fill="#fff" />
              </g>
            )
          })}
        </g>
      ))}
    </g>
  )
}

function ParcelArt({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <rect x={0} y={0} width={150} height={90} rx={5} fill="#C9A27A" />
      <rect x={0} y={0} width={150} height={20} rx={5} fill="#B98D63" />
      <path d="M75 0 V90 M0 45 H150" stroke="#7E5A3A" strokeWidth={4} />
      <path d="M75 0 q-18 -22 -30 -6 q14 6 30 6 q18 -22 30 -6 q-14 6 -30 6" fill="none" stroke="#7E5A3A" strokeWidth={4} />
      <rect x={10} y={52} width={56} height={30} rx={3} fill="#fff" />
      <rect x={10} y={52} width={56} height={8} rx={2} fill={C.red} />
      <text x={38} y={76} textAnchor="middle" fontFamily="Fredoka, sans-serif" fontWeight={700} fontSize={13} fill={C.navy}>
        SANTA
      </text>
    </g>
  )
}

function PostOfficeScene({ parcel, onParcel, observe }: { parcel: boolean; onParcel: () => void; observe: (t: string) => void }) {
  return (
    <g>
      <defs>
        <clipPath id="l2-win">
          <path d="M110 500 V250 Q110 170 255 170 Q400 170 400 250 V500 Z" />
        </clipPath>
        <radialGradient id="l2-lamp" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#FFE08A" stopOpacity={0.9} />
          <stop offset="1" stopColor="#FFE08A" stopOpacity={0} />
        </radialGradient>
      </defs>
      {/* wall */}
      <rect width={1600} height={900} fill="#F4E6D4" />
      {Array.from({ length: 33 }, (_, i) => (
        <rect key={i} x={i * 50} y={0} width={22} height={900} fill="#EEDAC2" />
      ))}
      <rect y={0} width={1600} height={46} fill="#7E4E30" />
      {/* garland swags */}
      {[0, 400, 800, 1200].map((x) => (
        <g key={x}>
          <path d={`M${x} 46 Q${x + 200} 120 ${x + 400} 46`} fill="none" stroke={C.green} strokeWidth={18} strokeLinecap="round" />
          <path d={`M${x} 46 Q${x + 200} 120 ${x + 400} 46`} fill="none" stroke={C.greenDark} strokeWidth={18} strokeDasharray="6 12" opacity={0.5} />
          <circle cx={x} cy={52} r={14} fill={C.red} />
          <path d={`M${x} 60 l-12 26 l12 -8 l12 8 z`} fill={C.redDark} />
        </g>
      ))}

      {/* window onto a snowy Rovaniemi street */}
      <Hotspot label="Window" onClick={() => observe('Snow is falling over Rovaniemi.')}>
        <path d="M92 514 V250 Q92 152 255 152 Q418 152 418 250 V514 Z" fill="#7E4E30" />
        <g clipPath="url(#l2-win)">
          <rect x={100} y={160} width={310} height={350} fill="#5B6FA8" />
          <rect x={100} y={330} width={310} height={180} fill="#8C9AC8" opacity={0.4} />
          <path d="M100 400 H200 V320 L240 290 L280 320 V400 H410 V510 H100 Z" fill="#3E4C7E" />
          <rect x={220} y={340} width={22} height={24} fill="#FFD978" className="flicker-2" />
          <path d="M100 460 Q250 430 410 455 V510 H100 Z" fill="#fff" />
          <circle cx={350} cy={340} r={46} fill="url(#l2-lamp)" />
          <rect x={346} y={340} width={8} height={130} fill={C.navy} />
          <rect x={336} y={326} width={28} height={20} rx={4} fill="#FFE08A" />
          <SvgSnow x={100} y={150} w={310} h={360} count={30} seed={33} />
        </g>
        <rect x={250} y={160} width={10} height={350} fill="#7E4E30" />
        <rect x={100} y={330} width={310} height={10} fill="#7E4E30" />
        <rect x={76} y={508} width={358} height={20} rx={4} fill="#7E4E30" />
      </Hotspot>

      {/* sign */}
      <rect x={560} y={74} width={490} height={92} rx={14} fill="#7E4E30" />
      <rect x={570} y={84} width={470} height={72} rx={10} fill="#8E5634" />
      <text x={805} y={124} textAnchor="middle" fontFamily="Fredoka, sans-serif" fontWeight={700} fontSize={30} fill="#FFE9A8" letterSpacing={2}>
        SANTA CLAUS POST OFFICE
      </text>
      <text x={805} y={147} textAnchor="middle" fontFamily="Nunito, sans-serif" fontWeight={800} fontSize={14} fill="#FDE3E0" letterSpacing={6}>
        ROVANIEMI
      </text>

      <Hotspot label="Letter pigeonholes" onClick={() => observe('Letters sorted from all over the world.')}>
        <Pigeonholes />
      </Hotspot>
      <Hotspot label="Parcel shelves" onClick={() => observe('Parcels waiting to be collected.')}>
        <ParcelShelves />
      </Hotspot>

      {/* postmaster behind the counter */}
      <g className="breathe">
        <Postmaster x={820} y={712} s={1.25} pose={parcel ? 'offer' : 'idle'} />
      </g>

      {/* counter */}
      <rect x={360} y={600} width={1140} height={300} fill="#8E5634" />
      {[400, 640, 880, 1120].map((x) => (
        <rect key={x} x={x} y={650} width={200} height={190} rx={10} fill="none" stroke="#7E4E30" strokeWidth={6} />
      ))}
      <rect x={340} y={584} width={1180} height={30} rx={8} fill="#B77B4E" />
      <rect x={340} y={606} width={1180} height={8} fill="#7E4E30" opacity={0.4} />

      {/* counter items */}
      <Hotspot label="Letter scale" onClick={() => observe('A brass letter scale.')}>
        <rect x={470} y={564} width={90} height={22} rx={5} fill="#C9A35B" />
        <rect x={508} y={530} width={14} height={36} fill="#B38B45" />
        <rect x={470} y={518} width={90} height={14} rx={4} fill="#E0BE72" />
      </Hotspot>
      <Hotspot label="Postmark stamp" onClick={() => observe('A Christmas postmark stamp.')}>
        <rect x={1150} y={566} width={70} height={20} rx={4} fill={C.navy} />
        <rect x={1172} y={530} width={26} height={38} rx={4} fill="#7E4E30" />
        <circle cx={1185} cy={524} r={14} fill={C.red} />
      </Hotspot>
      <Hotspot
        label="Service bell"
        onClick={() => {
          playSfx('beep')
          observe('Ding!')
        }}
        sound={false}
      >
        <path d="M1290 584 Q1290 544 1322 544 Q1354 544 1354 584 Z" fill={C.gold} />
        <rect x={1282} y={580} width={80} height={8} rx={4} fill="#C9A35B" />
        <circle cx={1322} cy={540} r={5} fill="#C9A35B" />
      </Hotspot>

      {/* Santa's parcel */}
      {parcel && (
        <Hotspot label="Parcel for Santa" onClick={onParcel} hit={[880, 480, 170, 110]}>
          <motion.g initial={{ y: -60, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ type: 'spring', stiffness: 260, damping: 16 }}>
            <ParcelArt x={892} y={498} s={0.95} />
          </motion.g>
        </Hotspot>
      )}

      {/* Christmas postbox */}
      <Hotspot label="Christmas postbox" onClick={() => observe('A special postbox for Christmas letters.')}>
        <g transform="translate(150 0)">
          <rect x={96} y={640} width={130} height={200} rx={16} fill={C.red} />
          <path d="M96 690 Q161 620 226 690" fill={C.redDark} />
          <rect x={120} y={700} width={82} height={12} rx={6} fill={C.navy} />
          <text x={161} y={760} textAnchor="middle" fontFamily="Fredoka, sans-serif" fontWeight={700} fontSize={17} fill="#fff">
            CHRISTMAS
          </text>
          <text x={161} y={782} textAnchor="middle" fontFamily="Fredoka, sans-serif" fontWeight={700} fontSize={17} fill="#fff">
            POST
          </text>
          <rect x={120} y={840} width={82} height={50} fill={C.navy} />
        </g>
      </Hotspot>

      {/* sack of letters */}
      <Hotspot label="Sack of letters" onClick={() => observe('So many letters to Santa!')}>
        <path d="M1380 890 Q1360 760 1420 720 L1520 720 Q1580 760 1560 890 Z" fill="#D7B48C" />
        <path d="M1416 724 Q1470 690 1524 724" fill="none" stroke="#9A7650" strokeWidth={8} />
        {[0, 1, 2].map((i) => (
          <rect
            key={i}
            x={1430 + i * 30}
            y={690 - i * 6}
            width={44}
            height={30}
            rx={2}
            fill={ENVELOPES[i + 1]}
            transform={`rotate(${-15 + i * 15} ${1452 + i * 30} 705)`}
          />
        ))}
        <text x={1470} y={820} textAnchor="middle" fontFamily="Fredoka, sans-serif" fontWeight={700} fontSize={22} fill="#9A7650">
          LETTERS
        </text>
      </Hotspot>

      <ScenePip mood="happy" pose={parcel ? 'idle' : 'wave'} />
    </g>
  )
}

export default function Level2PostOffice({ onComplete }: LevelProps) {
  const [phase, setPhase] = useLevelPhase<'intro' | 'explore' | 'done'>(2, 'intro')
  const [open, setOpen] = useState(false)
  const [opened, setOpened] = useState(false)
  const [note, observe] = useObservation()

  return (
    <div className="relative h-full">
      <InteractiveScene label="Santa Claus Post Office" bg="#8E5634" focusX={800}>
        <PostOfficeScene parcel={phase !== 'intro'} onParcel={() => setOpen(true)} observe={observe} />
      </InteractiveScene>
      {note}
      {phase === 'intro' && <DialogueBox lines={D.l2Intro} onDone={() => setPhase('explore')} />}
      {phase === 'done' && !open && <DialogueBox lines={D.l2Done} onDone={onComplete} />}
      <InspectionModal
        open={open}
        onClose={() => setOpen(false)}
        title={opened ? 'Letter in the parcel' : 'Parcel for Santa'}
        size={opened ? 'lg' : 'md'}
        done={phase === 'done'}
      >
        {opened || phase === 'done' ? (
          <CoordinatePuzzle
            onSolved={() => setPhase('done')}
          />
        ) : (
          <div className="flex flex-col items-center">
            <button
              type="button"
              className="cursor-pointer transition-transform hover:scale-[1.02] active:scale-95"
              onClick={() => {
                playSfx('paper')
                setOpened(true)
              }}
              aria-label="Open the parcel"
            >
              <svg viewBox="-10 -40 170 140" className="w-72 max-w-full drop-shadow-xl">
                <ParcelArt x={0} y={0} />
              </svg>
            </button>
            <div className="mt-2 rounded-lg bg-white px-4 py-2 text-center font-type text-navy shadow">
              TO: SANTA CLAUS
              <br />
              <span className="text-sm opacity-70">Held for collection</span>
            </div>
            <button
              type="button"
              className="btn btn-red mt-5"
              onClick={() => {
                playSfx('paper')
                setOpened(true)
              }}
            >
              Open parcel
            </button>
          </div>
        )}
      </InspectionModal>
    </div>
  )
}
