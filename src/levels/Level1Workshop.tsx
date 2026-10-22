import { useState } from 'react'
import { C, Present, StringLights, SvgSnow, Tree } from '../art/props'
import { DialogueBox } from '../components/DialogueBox'
import { InspectionModal } from '../components/InspectionModal'
import { Hotspot, InteractiveScene } from '../components/InteractiveScene'
import { ScenePip } from '../components/ScenePip'
import { useObservation } from '../components/Toast'
import { D } from '../data/dialogues'
import { TicketArt, TicketPuzzle } from '../puzzles/TicketPuzzle'
import { useLevelPhase } from '../state/progress'
import type { LevelProps } from './types'

function Toys() {
  return (
    <g>
      {/* teddy bear */}
      <g transform="translate(1196 290)">
        <circle cx={0} cy={-34} r={26} fill="#D49A66" />
        <circle cx={0} cy={-80} r={22} fill="#D49A66" />
        <circle cx={-17} cy={-98} r={9} fill="#D49A66" />
        <circle cx={17} cy={-98} r={9} fill="#D49A66" />
        <ellipse cx={0} cy={-74} rx={10} ry={7} fill="#E3C3A0" />
        <circle cx={-8} cy={-84} r={2.6} fill={C.navy} />
        <circle cx={8} cy={-84} r={2.6} fill={C.navy} />
        <path d="M-12 -60 L0 -54 L12 -60 L12 -50 L0 -56 L-12 -50 Z" fill={C.red} />
      </g>
      {/* toy soldiers */}
      {[1286, 1326].map((x) => (
        <g key={x} transform={`translate(${x} 290)`}>
          <rect x={-10} y={-34} width={20} height={34} fill={C.navy} />
          <rect x={-12} y={-70} width={24} height={38} rx={4} fill={C.red} />
          <circle cx={0} cy={-82} r={11} fill="#F4C7A1" />
          <rect x={-11} y={-116} width={22} height={30} rx={5} fill="#24242C" />
          <circle cx={0} cy={-58} r={2.5} fill={C.gold} />
        </g>
      ))}
      {/* blocks */}
      <g fontFamily="Fredoka, sans-serif" fontWeight={700} fontSize={26} textAnchor="middle">
        <rect x={1392} y={244} width={46} height={46} rx={5} fill={C.gold} />
        <text x={1415} y={276} fill={C.navy}>
          A
        </text>
        <rect x={1442} y={244} width={46} height={46} rx={5} fill={C.winter} />
        <text x={1465} y={276} fill={C.navy}>
          B
        </text>
        <rect x={1416} y={198} width={46} height={46} rx={5} fill={C.red} />
        <text x={1439} y={230} fill="#fff">
          C
        </text>
      </g>
      {/* rocking horse */}
      <g transform="translate(1230 430)">
        <path d="M-70 -6 Q0 22 70 -6" fill="none" stroke="#7E4E30" strokeWidth={8} strokeLinecap="round" />
        <rect x={-46} y={-56} width={8} height={44} fill="#C48A5E" transform="rotate(12 -42 -34)" />
        <rect x={38} y={-56} width={8} height={44} fill="#C48A5E" transform="rotate(-12 42 -34)" />
        <ellipse cx={0} cy={-64} rx={52} ry={22} fill="#F8FBFF" />
        <path d="M34 -76 Q50 -116 70 -118 L80 -100 Q64 -96 56 -66 Z" fill="#F8FBFF" />
        <path d="M44 -100 Q40 -116 58 -122" fill="none" stroke={C.red} strokeWidth={8} strokeLinecap="round" />
        <circle cx={68} cy={-106} r={3} fill={C.navy} />
        <rect x={-18} y={-90} width={30} height={10} rx={4} fill={C.red} />
        <path d="M-52 -66 q-22 4 -20 24" fill="none" stroke="#7E4E30" strokeWidth={6} strokeLinecap="round" />
      </g>
      {/* toy train */}
      <g transform="translate(1352 430)">
        <rect x={0} y={-40} width={56} height={30} rx={5} fill={C.green} />
        <rect x={62} y={-40} width={56} height={30} rx={5} fill={C.gold} />
        <rect x={124} y={-56} width={34} height={46} rx={5} fill={C.red} />
        <rect x={132} y={-72} width={12} height={18} fill={C.navy} />
        {[14, 42, 76, 104, 138].map((x) => (
          <circle key={x} cx={x} cy={-8} r={8} fill={C.navy} />
        ))}
      </g>
      {/* ball, doll, drum */}
      <g transform="translate(1206 570)">
        <circle cx={0} cy={-38} r={38} fill={C.red} />
        <path d="M-38 -38 Q0 -62 38 -38 M-38 -38 Q0 -14 38 -38" fill="none" stroke="#fff" strokeWidth={8} />
      </g>
      <g transform="translate(1312 570)">
        <path d="M-26 0 L-16 -56 L16 -56 L26 0 Z" fill="#B23A48" />
        <circle cx={0} cy={-72} r={17} fill="#F0C4A2" />
        <path d="M-18 -74 Q-16 -96 0 -94 Q16 -96 18 -74 Q10 -88 0 -86 Q-10 -88 -18 -74 Z" fill="#6B4A34" />
        <circle cx={-6} cy={-72} r={2.2} fill={C.navy} />
        <circle cx={6} cy={-72} r={2.2} fill={C.navy} />
      </g>
      <g transform="translate(1440 570)">
        <rect x={-42} y={-62} width={84} height={62} rx={8} fill={C.winter} />
        <ellipse cx={0} cy={-62} rx={42} ry={11} fill="#F8FBFF" />
        <path d="M-42 -50 L-21 -12 L0 -50 L21 -12 L42 -50" fill="none" stroke={C.gold} strokeWidth={5} />
        <line x1={-20} y1={-66} x2={-46} y2={-104} stroke="#7E4E30" strokeWidth={5} strokeLinecap="round" />
        <line x1={20} y1={-66} x2={46} y2={-104} stroke="#7E4E30" strokeWidth={5} strokeLinecap="round" />
      </g>
    </g>
  )
}

function TornPieces({ whole }: { whole: boolean }) {
  if (whole) {
    return (
      <g transform="translate(696 474) skewX(-14)">
        <rect width={92} height={22} rx={3} fill="#FFF8EA" stroke="#E8D9BC" />
        <rect width={92} height={6} rx={2} fill={C.red} />
      </g>
    )
  }
  const bits: [number, number, number, string][] = [
    [700, 478, -14, 'M0 0 L26 2 L22 14 L2 12 Z'],
    [732, 474, 9, 'M0 2 L20 0 L24 10 L4 15 Z'],
    [762, 482, -4, 'M0 0 L22 3 L19 13 L0 11 Z'],
    [708, 490, 18, 'M2 0 L24 3 L20 11 L0 9 Z'],
    [742, 490, -20, 'M0 2 L18 0 L22 12 L3 12 Z'],
    [780, 470, 12, 'M0 0 L20 1 L23 12 L2 10 Z'],
  ]
  return (
    <g>
      {bits.map(([x, y, r, d], i) => (
        <g key={i} transform={`translate(${x} ${y}) rotate(${r})`}>
          <path d={d} fill="#FFF8EA" stroke="#D9C7A3" strokeWidth={1.2} />
          {i % 2 === 0 && <rect x={2} y={1} width={16} height={3} fill={C.red} />}
        </g>
      ))}
    </g>
  )
}

function WorkshopScene({ onTicket, observe, solved }: { onTicket: () => void; observe: (t: string) => void; solved: boolean }) {
  return (
    <g>
      <defs>
        <clipPath id="l1-glass">
          <rect x={116} y={170} width={290} height={260} rx={4} />
        </clipPath>
        <radialGradient id="l1-lamp" cx="0.5" cy="0" r="1">
          <stop offset="0" stopColor="#FFE9A8" stopOpacity={0.55} />
          <stop offset="1" stopColor="#FFE9A8" stopOpacity={0} />
        </radialGradient>
      </defs>
      {/* wall */}
      <rect width={1600} height={660} fill="#C48A5E" />
      {Array.from({ length: 21 }, (_, i) => (
        <line key={i} x1={i * 80} y1={56} x2={i * 80} y2={470} stroke="#B57A4F" strokeWidth={3} />
      ))}
      <rect y={470} width={1600} height={190} fill="#A66A43" />
      {Array.from({ length: 11 }, (_, i) => (
        <rect key={i} x={i * 160 + 20} y={496} width={120} height={140} rx={6} fill="none" stroke="#956039" strokeWidth={4} />
      ))}
      <rect y={460} width={1600} height={14} fill="#7E4E30" />
      <rect width={1600} height={56} fill="#7E4E30" />
      <StringLights x1={-10} x2={1610} y={54} sag={26} count={22} />

      {/* window with snow outside */}
      <Hotspot label="Window" onClick={() => observe('Snow is falling over the North Pole.')}>
        <rect x={96} y={150} width={330} height={300} rx={14} fill="#7E4E30" />
        <g clipPath="url(#l1-glass)">
          <rect x={116} y={170} width={290} height={260} fill="#BFE3F7" />
          <path d="M116 380 Q200 340 290 372 Q350 392 406 360 V430 H116 Z" fill="#fff" />
          <Tree x={180} y={392} s={0.38} color="#2A7D74" snowy />
          <Tree x={340} y={384} s={0.3} color="#2A7D74" snowy />
          <SvgSnow x={116} y={160} w={290} h={280} count={26} seed={11} />
        </g>
        <rect x={256} y={170} width={10} height={260} fill="#7E4E30" />
        <rect x={116} y={294} width={290} height={10} fill="#7E4E30" />
        <rect x={80} y={444} width={362} height={20} rx={4} fill="#7E4E30" />
      </Hotspot>

      {/* wreath */}
      <Hotspot label="Wreath" onClick={() => observe('A fresh pine wreath.')}>
        <circle cx={1010} cy={230} r={56} fill="none" stroke={C.green} strokeWidth={30} />
        <circle cx={1010} cy={230} r={56} fill="none" stroke={C.greenDark} strokeWidth={30} strokeDasharray="10 16" opacity={0.5} />
        {[0, 60, 130, 200, 260, 320].map((a) => (
          <circle key={a} cx={1010 + Math.cos((a * Math.PI) / 180) * 56} cy={230 + Math.sin((a * Math.PI) / 180) * 56} r={7} fill={C.red} />
        ))}
        <path d="M1010 282 l-28 18 l4 -26 z M1010 282 l28 18 l-4 -26 z" fill={C.red} />
        <circle cx={1010} cy={282} r={9} fill={C.redDark} />
      </Hotspot>

      {/* shelves of toys */}
      <Hotspot label="Toy shelves" onClick={() => observe('Toys waiting to be wrapped.')}>
        <rect x={1130} y={140} width={400} height={500} fill="#8E5634" opacity={0.35} />
        <rect x={1124} y={136} width={18} height={510} fill="#7E4E30" />
        <rect x={1518} y={136} width={18} height={510} fill="#7E4E30" />
        {[136, 290, 430, 570].map((y) => (
          <rect key={y} x={1124} y={y} width={412} height={16} fill="#7E4E30" />
        ))}
        <Toys />
      </Hotspot>

      {/* floor + rug */}
      <rect y={660} width={1600} height={240} fill="#8E5634" />
      {[700, 750, 810, 880].map((y) => (
        <line key={y} x1={0} y1={y} x2={1600} y2={y} stroke="#7E4E30" strokeWidth={3} />
      ))}
      <ellipse cx={800} cy={810} rx={440} ry={70} fill={C.redDark} />
      <ellipse cx={800} cy={810} rx={410} ry={56} fill="none" stroke={C.gold} strokeWidth={5} strokeDasharray="18 12" />

      {/* Santa's desk */}
      <path d="M490 470 L1010 470 L1032 502 L468 502 Z" fill="#B77B4E" />
      <rect x={466} y={500} width={568} height={26} rx={6} fill="#7E4E30" />
      <rect x={490} y={526} width={520} height={210} fill="#8E5634" />
      <rect x={516} y={540} width={270} height={196} fill="#5B3A22" />
      {[546, 608, 670].map((y) => (
        <g key={y}>
          <rect x={812} y={y} width={180} height={52} rx={5} fill="#A66A43" />
          <circle cx={902} cy={y + 26} r={6} fill={C.gold} />
        </g>
      ))}
      {/* lamp — still switched on */}
      <Hotspot label="Desk lamp" onClick={() => observe('His desk lamp is still on.')}>
        <path d="M528 404 L620 404 L700 500 L452 500 Z" fill="url(#l1-lamp)" />
        <ellipse cx={556} cy={490} rx={32} ry={8} fill={C.greenDark} />
        <path d="M556 488 L576 420" stroke={C.greenDark} strokeWidth={7} strokeLinecap="round" />
        <path d="M540 420 Q574 372 612 420 Z" fill={C.green} />
        <ellipse cx={576} cy={420} rx={36} ry={7} fill="#FFE9A8" />
      </Hotspot>
      {/* letters */}
      <Hotspot label="Letters" onClick={() => observe('Letters from children all over the world.')}>
        {[0, 1, 2].map((i) => (
          <g key={i} transform={`translate(${620 + i * 6} ${478 - i * 7}) rotate(${-6 + i * 5})`}>
            <rect width={58} height={20} rx={2} fill={['#fff', '#FDE3E0', '#E1F1FB'][i]} stroke="#D6DEE8" />
            <path d="M0 0 L29 11 L58 0" fill="none" stroke="#C9D3DD" strokeWidth={1.5} />
          </g>
        ))}
      </Hotspot>
      {/* the torn ticket */}
      <Hotspot label="Torn ticket" onClick={onTicket} hit={[688, 452, 128, 52]}>
        <TornPieces whole={solved} />
      </Hotspot>
      {/* reading glasses */}
      <g transform="translate(838 486)">
        <circle cx={0} cy={0} r={9} fill="none" stroke="#7E4E30" strokeWidth={3} />
        <circle cx={24} cy={0} r={9} fill="none" stroke="#7E4E30" strokeWidth={3} />
        <path d="M9 0 h6" stroke="#7E4E30" strokeWidth={3} />
      </g>
      {/* cocoa mug */}
      <Hotspot label="Mug of cocoa" onClick={() => observe("Santa's cocoa. It's still warm.")}>
        <ellipse cx={936} cy={436} rx={8} ry={12} fill="#fff" opacity={0.6} className="steam" />
        <ellipse cx={950} cy={440} rx={7} ry={11} fill="#fff" opacity={0.6} className="steam-2" />
        <rect x={922} y={452} width={40} height={40} rx={6} fill={C.red} />
        <path d="M962 462 q16 0 16 12 q0 12 -16 12" fill="none" stroke={C.red} strokeWidth={6} />
        <ellipse cx={942} cy={453} rx={20} ry={5} fill="#6B3F22" />
        <path d="M930 468 h24" stroke="#fff" strokeWidth={4} />
      </Hotspot>

      {/* chair pushed back in a hurry */}
      <Hotspot label="Chair" onClick={() => observe('The chair was pushed back in a hurry.')}>
        <g transform="rotate(-8 1085 780)">
          <rect x={1036} y={560} width={16} height={160} rx={6} fill="#5B3A22" />
          <rect x={1118} y={560} width={16} height={160} rx={6} fill="#5B3A22" />
          <rect x={1028} y={548} width={114} height={30} rx={14} fill="#6B3F22" />
          <rect x={1052} y={586} width={66} height={64} rx={14} fill={C.red} />
          <rect x={1060} y={594} width={50} height={8} rx={4} fill="#fff" opacity={0.25} />
          <path d="M1016 704 L1154 704 L1146 732 L1024 732 Z" fill="#6B3F22" />
          <rect x={1020} y={696} width={130} height={14} rx={7} fill={C.red} />
          <rect x={1026} y={730} width={14} height={66} rx={5} fill="#5B3A22" />
          <rect x={1130} y={730} width={14} height={66} rx={5} fill="#5B3A22" />
        </g>
      </Hotspot>

      {/* tree in the corner */}
      <Hotspot label="Christmas tree" onClick={() => observe('The tree lights are still twinkling.')}>
        <Tree x={1490} y={856} s={1.3} lights star />
        <Present x={1396} y={806} w={64} h={52} color={C.winter} ribbon={C.red} />
        <Present x={1510} y={812} w={60} h={46} color={C.gold} ribbon={C.green} />
      </Hotspot>

      {/* pile of presents */}
      <Hotspot label="Presents" onClick={() => observe('Presents for the big night.')}>
        <Present x={1190} y={790} w={90} h={70} color={C.green} ribbon={C.red} />
        <Present x={1276} y={812} w={62} h={48} color={C.red} />
        <Present x={1206} y={728} w={64} h={60} color={C.gold} ribbon={C.red} />
      </Hotspot>

      <ScenePip mood={solved ? 'excited' : 'worried'} />
    </g>
  )
}

export default function Level1Workshop({ onComplete }: LevelProps) {
  const [phase, setPhase] = useLevelPhase<'intro' | 'explore' | 'done'>(1, 'intro')
  const [open, setOpen] = useState(false)
  const [note, observe] = useObservation()

  return (
    <div className="relative h-full">
      <InteractiveScene label="Santa's workshop" bg="#7E4E30" focusX={760}>
        <WorkshopScene onTicket={() => setOpen(true)} observe={observe} solved={phase === 'done'} />
      </InteractiveScene>
      {note}
      {phase === 'intro' && <DialogueBox lines={D.l1Intro} onDone={() => setPhase('explore')} />}
      {phase === 'done' && !open && <DialogueBox lines={D.l1Done} onDone={onComplete} />}
      <InspectionModal open={open} onClose={() => setOpen(false)} title="A torn ticket" size="xl">
        {phase === 'done' ? (
          <div className="mx-auto max-w-[600px]">
            <svg viewBox="0 0 600 260" className="w-full drop-shadow-lg">
              <TicketArt />
            </svg>
          </div>
        ) : (
          <TicketPuzzle
            onSolved={() => {
              setOpen(false)
              setPhase('done')
            }}
          />
        )}
      </InspectionModal>
    </div>
  )
}
