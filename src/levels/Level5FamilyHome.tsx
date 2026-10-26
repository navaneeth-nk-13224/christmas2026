import { motion } from 'framer-motion'
import { useState } from 'react'
import { Child, Elina, Nicholas } from '../art/characters'
import { C, Present, rng, SvgSnow, Tree } from '../art/props'
import { playSfx } from '../audio/sound'
import { DialogueBox } from '../components/DialogueBox'
import { InspectionModal } from '../components/InspectionModal'
import { Hotspot, InteractiveScene } from '../components/InteractiveScene'
import { ScenePip } from '../components/ScenePip'
import { useObservation } from '../components/Toast'
import { D } from '../data/dialogues'
import { CipherPuzzle, SecretNote } from '../puzzles/CipherPuzzle'
import { useLevelPhase } from '../state/progress'
import type { LevelProps } from './types'

const WALL = '#F6E1C3'
const LOWER = '#2F6B57'

function MiniFamily({ x, y, w, h, bg }: { x: number; y: number; w: number; h: number; bg: string }) {
  const s = h / 330
  return (
    <g>
      <rect x={x - 8} y={y - 8} width={w + 16} height={h + 16} rx={4} fill="#7E4E30" />
      <rect x={x} y={y} width={w} height={h} fill={bg} />
      <clipPath id={`mf-${x}-${y}`}>
        <rect x={x} y={y} width={w} height={h} />
      </clipPath>
      <g clipPath={`url(#mf-${x}-${y})`}>
        <Nicholas x={x + w * 0.3} y={y + h + 4} s={s} />
        <Child x={x + w * 0.52} y={y + h + 4} s={s} />
        <Elina x={x + w * 0.72} y={y + h + 4} s={s} />
      </g>
    </g>
  )
}

function Bookshelf() {
  const r = rng(77)
  const colors = [C.red, C.green, C.navy, '#E0A92A', '#8BCDF2', '#B23A48', '#6B4A34']
  return (
    <g>
      <rect x={890} y={130} width={270} height={500} rx={6} fill="#7E4E30" />
      <rect x={906} y={146} width={238} height={468} fill="#5B3A22" />
      {[0, 1, 2, 3].map((row) => {
        const baseY = 256 + row * 118
        let x = 912
        const books = []
        while (x < 1130) {
          const w = 14 + r() * 14
          const h = 70 + r() * 30
          const tilt = r() > 0.92 ? 8 : 0
          books.push(
            <rect
              key={x}
              x={x}
              y={baseY - h}
              width={w}
              height={h}
              rx={2}
              fill={colors[Math.floor(r() * colors.length)]}
              transform={tilt ? `rotate(${tilt} ${x} ${baseY})` : undefined}
            />,
          )
          x += w + 2 + (tilt ? 8 : 0)
        }
        return (
          <g key={row}>
            {books}
            <rect x={906} y={baseY} width={238} height={10} fill="#7E4E30" />
          </g>
        )
      })}
      <circle cx={1100} cy={232} r={16} fill="#8BCDF2" />
      <path d="M1088 226 q12 -8 24 0 M1088 238 q12 8 24 0" fill="none" stroke="#3E7CC9" strokeWidth={2} />
      <rect x={1094} y={248} width={12} height={8} fill="#C9A35B" />
    </g>
  )
}

function HomeScene({ phase, onNote, observe }: { phase: string; onNote: () => void; observe: (t: string) => void }) {
  const holding = phase === 'note'
  return (
    <g>
      <defs>
        <clipPath id="l5-win">
          <rect x={600} y={170} width={230} height={280} rx={4} />
        </clipPath>
        <radialGradient id="l5-glow" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#FFB347" stopOpacity={0.5} />
          <stop offset="1" stopColor="#FFB347" stopOpacity={0} />
        </radialGradient>
      </defs>
      {/* wallpaper with tiny pattern */}
      <rect width={1600} height={900} fill={WALL} />
      {Array.from({ length: 12 }, (_, row) =>
        Array.from({ length: 26 }, (_, col) => (
          <path key={`${row}-${col}`} d={`M${col * 64 + (row % 2) * 32} ${row * 50 + 20} l5 -7 l5 7 l-5 7 z`} fill="#E9C9A0" />
        )),
      )}
      <rect y={560} width={1600} height={120} fill={LOWER} />
      <rect y={552} width={1600} height={14} fill="#7E4E30" />
      <rect y={0} width={1600} height={30} fill="#7E4E30" />
      {/* floor + rug */}
      <rect y={680} width={1600} height={220} fill="#9A6240" />
      {[720, 770, 830].map((y) => (
        <line key={y} x1={0} y1={y} x2={1600} y2={y} stroke="#8A5536" strokeWidth={3} />
      ))}
      <ellipse cx={820} cy={820} rx={360} ry={60} fill="#F4EBDD" />
      <ellipse cx={820} cy={820} rx={320} ry={46} fill="none" stroke={C.green} strokeWidth={8} />
      <ellipse cx={820} cy={820} rx={260} ry={32} fill="none" stroke={C.red} strokeWidth={6} />

      {/* window with curtains */}
      <Hotspot label="Window" onClick={() => observe('Snow is falling over Santa Claus Village.')}>
        <rect x={586} y={156} width={258} height={308} rx={8} fill="#F8FBFF" />
        <g clipPath="url(#l5-win)">
          <rect x={600} y={170} width={230} height={280} fill="#2C3E63" />
          <path d="M600 400 Q700 370 830 392 V450 H600 Z" fill="#E4EEF8" />
          <Tree x={660} y={404} s={0.34} color="#1E5A54" snowy />
          <rect x={760} y={360} width={50} height={40} fill="#7E4E30" />
          <path d="M750 362 L785 334 L820 362 Z" fill="#fff" />
          <rect x={770} y={370} width={14} height={14} fill="#FFD978" className="flicker" />
          <SvgSnow x={600} y={160} w={230} h={300} count={22} seed={55} />
        </g>
        <rect x={709} y={170} width={10} height={280} fill="#F8FBFF" />
        <path d="M560 140 Q590 300 570 480 L630 480 Q620 300 620 140 Z" fill={C.red} />
        <path d="M870 140 Q840 300 860 480 L800 480 Q810 300 810 140 Z" fill={C.red} />
        <rect x={548} y={130} width={334} height={16} rx={8} fill="#7E4E30" />
      </Hotspot>

      {/* family photos on the wall */}
      <Hotspot label="Family photographs" onClick={() => observe('Family photos. They look so happy together.')}>
        <MiniFamily x={1210} y={170} w={130} h={100} bg="#BFE3F7" />
        <MiniFamily x={1380} y={200} w={100} h={130} bg="#FDE3E0" />
        <MiniFamily x={1220} y={320} w={110} h={86} bg="#DFF3E8" />
      </Hotspot>

      <Hotspot label="Bookshelf" onClick={() => observe('Books about maps, stars and navigation.')}>
        <Bookshelf />
      </Hotspot>

      {/* fireplace */}
      <Hotspot label="Fireplace" onClick={() => observe('A warm, crackling fire.')}>
        <circle cx={270} cy={640} r={260} fill="url(#l5-glow)" />
        <rect x={80} y={360} width={380} height={420} fill="#C9B8A6" />
        {Array.from({ length: 30 }, (_, i) => {
          const r = rng(i + 3)
          return (
            <rect
              key={i}
              x={84 + (i % 6) * 62 + r() * 6}
              y={364 + Math.floor(i / 6) * 82 + r() * 6}
              width={52 + r() * 6}
              height={70}
              rx={10}
              fill={['#BBA894', '#D3C4B4', '#C2B09C'][i % 3]}
            />
          )
        })}
        <rect x={150} y={520} width={240} height={260} rx={110} fill="#2B1E18" />
        <rect x={150} y={640} width={240} height={140} fill="#2B1E18" />
        <g>
          <path
            d="M210 760 Q200 680 240 640 Q236 700 262 720 Q270 660 300 620 Q306 690 330 720 Q340 690 336 660 Q370 710 340 760 Z"
            fill={C.red}
            className="flame"
          />
          <path d="M226 760 Q224 710 250 680 Q252 720 272 730 Q280 690 300 670 Q310 720 320 760 Z" fill="#F98E2B" className="flame-2" />
          <path d="M246 760 Q246 730 262 712 Q268 740 280 740 Q290 720 296 712 Q306 740 300 760 Z" fill={C.gold} className="flame" />
        </g>
        <rect x={190} y={752} width={160} height={20} rx={10} fill="#7E4E30" transform="rotate(-6 270 762)" />
        <rect x={196} y={756} width={150} height={18} rx={9} fill="#5B3A22" transform="rotate(8 270 764)" />
        <rect x={60} y={340} width={420} height={30} rx={6} fill="#7E4E30" />
        {/* mantel: candles */}
        {[110, 420].map((x) => (
          <g key={x}>
            <rect x={x - 8} y={290} width={16} height={50} rx={3} fill="#F8FBFF" />
            <path d={`M${x} 270 q-8 12 0 20 q8 -8 0 -20`} fill={C.gold} className="flame" />
          </g>
        ))}
        <MiniFamily x={200} y={262} w={70} h={64} bg="#FFF3C4" />
      </Hotspot>

      {/* three stockings */}
      <Hotspot label="Stockings" onClick={() => observe('Three stockings hung by the fire.')}>
        {[150, 260, 370].map((x, i) => (
          <g key={x} className="sway">
            <rect x={x - 22} y={366} width={44} height={16} rx={4} fill="#fff" />
            <path
              d={`M${x - 18} 380 V440 Q${x - 18} 466 ${x + 8} 466 H${x + 26} Q${x + 36} 466 ${x + 36} 452 Q${x + 36} 440 ${x + 18} 440 V380 Z`}
              fill={[C.red, C.green, '#3E7CC9'][i]}
            />
          </g>
        ))}
      </Hotspot>

      {/* armchair */}
      <Hotspot label="Armchair" onClick={() => observe('A cozy armchair, still warm.')}>
        <rect x={500} y={560} width={200} height={190} rx={40} fill="#B23A48" />
        <rect x={480} y={640} width={60} height={140} rx={24} fill="#9A2E3B" />
        <rect x={660} y={640} width={60} height={140} rx={24} fill="#9A2E3B" />
        <rect x={530} y={680} width={140} height={60} rx={16} fill="#C94A58" />
        <rect x={510} y={780} width={18} height={30} fill="#5B3A22" />
        <rect x={672} y={780} width={18} height={30} fill="#5B3A22" />
        <path d="M560 600 h80 v50 h-80 z" fill="#F4EBDD" opacity={0.9} transform="rotate(-6 600 625)" />
      </Hotspot>

      {/* Christmas tree */}
      <Hotspot label="Christmas tree" onClick={() => observe('The tree smells of fresh pine.')}>
        <Tree x={1410} y={830} s={1.75} lights star />
        <Present x={1270} y={780} w={80} h={60} color={C.gold} ribbon={C.red} />
        <Present x={1480} y={790} w={70} h={52} color={C.red} />
        <Present x={1350} y={800} w={60} h={46} color="#8BCDF2" ribbon="#fff" />
      </Hotspot>

      {/* Elina, with the note when it's time */}
      <g className="breathe">
        <Elina x={1060} y={860} s={1.2} pose={holding ? 'offer' : 'idle'} mood={phase === 'intro' ? 'worried' : 'neutral'} />
      </g>
      {holding && (
        <Hotspot label="Folded note" onClick={onNote} hit={[1078, 640, 100, 80]}>
          <motion.g
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 300, damping: 16 }}
          >
            <g transform="rotate(-10 1122 680)">
              <rect x={1094} y={664} width={58} height={38} rx={2} fill="#FFFAF0" stroke="#E2D3B8" strokeWidth={2} />
              <path d="M1094 683 h58" stroke="#E2D3B8" strokeWidth={2} />
            </g>
          </motion.g>
        </Hotspot>
      )}

      <ScenePip mood={phase === 'intro' ? 'sad' : 'determined'} />
    </g>
  )
}

export default function Level5FamilyHome({ onComplete }: LevelProps) {
  const [phase, setPhase] = useLevelPhase<'intro' | 'note' | 'done'>(5, 'intro')
  const [open, setOpen] = useState(false)
  const [note, observe] = useObservation()

  return (
    <div className="relative h-full">
      <InteractiveScene label="Professor Nicholas's family home" bg={WALL} focusX={900}>
        <HomeScene
          phase={phase}
          onNote={() => {
            playSfx('paper')
            setOpen(true)
          }}
          observe={observe}
        />
      </InteractiveScene>
      {note}
      {phase === 'intro' && <DialogueBox lines={D.l5Intro} onDone={() => setPhase('note')} />}
      {phase === 'done' && !open && <DialogueBox lines={D.l5Done} onDone={onComplete} />}
      <InspectionModal open={open} onClose={() => setOpen(false)} title="Nicholas's note" size="lg" done={phase === 'done'}>
        {phase === 'done' ? (
          <SecretNote decoded />
        ) : (
          <CipherPuzzle
            onSolved={() => setPhase('done')}
          />
        )}
      </InspectionModal>
    </div>
  )
}
