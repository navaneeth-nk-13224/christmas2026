import { useState } from 'react'
import { FootageFrame, FRAME_H, FRAME_W } from '../art/footage'
import { C, PerspectiveFloor, Vignette } from '../art/props'
import { DialogueBox } from '../components/DialogueBox'
import { InspectionModal } from '../components/InspectionModal'
import { Hotspot, InteractiveScene } from '../components/InteractiveScene'
import { ScenePip } from '../components/ScenePip'
import { useObservation } from '../components/Toast'
import { ZoomPan } from '../components/ZoomPan'
import { D } from '../data/dialogues'
import { LogisticsPuzzle } from '../puzzles/LogisticsPuzzle'
import { useLevelPhase } from '../state/progress'
import type { LevelProps } from './types'

const WALL = '#3D4A5A'
const BLOCK = '#384453'
const DESK = '#6B5240'
const DESK_TOP = '#8A6A52'
const SCREEN = '#9BB0A2'

type CamKind = 'corridor' | 'gate' | 'belt' | 'static' | 'yard' | 'stairs'

/** One small CCTV screen in the monitor wall, each watching a different part of the factory. */
function CamScreen({ x, y, cam, kind }: { x: number; y: number; cam: string; kind: CamKind }) {
  const w = 150
  const h = 92
  return (
    <g>
      <rect x={x - 6} y={y - 6} width={w + 12} height={h + 12} rx={8} fill="#1E2530" />
      <rect x={x} y={y} width={w} height={h} rx={3} fill={kind === 'static' ? '#5F6E66' : '#6F8577'} />
      {kind === 'corridor' && (
        <g fill="none" stroke={SCREEN} strokeWidth={2}>
          <path
            d={`M${x} ${y} L${x + 55} ${y + 34} M${x + w} ${y} L${x + 95} ${y + 34} M${x} ${y + h} L${x + 55} ${y + 60} M${x + w} ${y + h} L${x + 95} ${y + 60}`}
          />
          <rect x={x + 55} y={y + 34} width={40} height={26} />
        </g>
      )}
      {kind === 'gate' && (
        <g fill={SCREEN}>
          <rect x={x} y={y + 60} width={w} height={32} opacity={0.6} />
          {Array.from({ length: 9 }, (_, i) => (
            <rect key={i} x={x + 14 + i * 14} y={y + 20} width={4} height={44} />
          ))}
          <rect x={x + 10} y={y + 18} width={130} height={5} />
        </g>
      )}
      {kind === 'belt' && (
        <g fill={SCREEN}>
          <rect x={x + 10} y={y + 56} width={130} height={10} rx={5} />
          <rect x={x + 24} y={y + 36} width={26} height={20} />
          <rect x={x + 70} y={y + 40} width={22} height={16} />
          <rect x={x + 108} y={y + 34} width={24} height={22} />
        </g>
      )}
      {kind === 'yard' && (
        <g fill={SCREEN}>
          <rect x={x} y={y + 58} width={w} height={34} opacity={0.7} />
          <rect x={x + 14} y={y + 20} width={56} height={40} opacity={0.6} />
          <rect x={x + 120} y={y + 14} width={4} height={46} />
        </g>
      )}
      {kind === 'stairs' && <path d={`M${x + 20} ${y + 80} h22 v-12 h22 v-12 h22 v-12 h22 v-12 h22`} fill="none" stroke={SCREEN} strokeWidth={3} />}
      {kind === 'static' ? (
        <g>
          {Array.from({ length: 15 }, (_, i) => (
            <rect key={i} x={x} y={y + i * 6} width={w} height={2} fill="#8FA596" opacity={0.6} className={i % 3 ? 'flicker' : 'flicker-2'} />
          ))}
          <text x={x + w / 2} y={y + 52} textAnchor="middle" fontFamily="VT323, monospace" fontSize={18} fill="#F2F7EE">
            NO SIGNAL
          </text>
        </g>
      ) : (
        Array.from({ length: 15 }, (_, i) => <rect key={i} x={x} y={y + i * 6} width={w} height={1.5} fill="#fff" opacity={0.08} />)
      )}
      <rect x={x + 4} y={y + 4} width={46} height={14} fill="#000" opacity={0.45} />
      <text x={x + 8} y={y + 15} fontFamily="VT323, monospace" fontSize={13} fill="#F2F7EE">
        {cam}
      </text>
      {kind !== 'static' && <circle cx={x + w - 10} cy={y + 11} r={3} fill="#FF5A4E" className="blink" />}
    </g>
  )
}

const CAMS: [string, CamKind][] = [
  ['CAM 01', 'corridor'],
  ['CAM 03', 'gate'],
  ['CAM 04', 'belt'],
  ['CAM 05', 'static'],
  ['CAM 06', 'stairs'],
  ['CAM 07', 'yard'],
  ['CAM 08', 'static'],
  ['CAM 09', 'corridor'],
]

function SecurityRoom({ onMonitor, onComputer, observe }: { onMonitor: () => void; onComputer: () => void; observe: (t: string) => void }) {
  return (
    <g>
      <defs>
        <linearGradient id="l7-lamp" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#FFE9A8" stopOpacity={0.35} />
          <stop offset="1" stopColor="#FFE9A8" stopOpacity={0} />
        </linearGradient>
        <linearGradient id="l7-ceiling" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#DDF3FF" stopOpacity={0.14} />
          <stop offset="1" stopColor="#DDF3FF" stopOpacity={0} />
        </linearGradient>
      </defs>
      {/* concrete-block walls */}
      <rect width={1600} height={900} fill={WALL} />
      {Array.from({ length: 11 }, (_, row) =>
        Array.from({ length: 14 }, (_, col) => (
          <rect key={`${row}-${col}`} x={col * 120 + (row % 2) * 60 - 60} y={56 + row * 54} width={114} height={48} rx={3} fill={BLOCK} />
        )),
      )}
      <rect width={1600} height={56} fill="#2E3947" />
      <rect x={-10} y={52} width={1620} height={10} fill="#262F3B" />
      {/* caged ceiling light */}
      <rect x={770} y={56} width={60} height={20} rx={4} fill="#262F3B" />
      <ellipse cx={800} cy={86} rx={28} ry={12} fill="#DDF3FF" />
      <path d="M772 80 Q800 104 828 80 M786 76 V96 M814 76 V96" fill="none" stroke="#262F3B" strokeWidth={3} />
      <path d="M770 90 L830 90 L1150 900 L450 900 Z" fill="url(#l7-ceiling)" />

      {/* factory floor plan + notice board on the left wall */}
      <Hotspot label="Factory floor plan" onClick={() => observe('A floor plan of the factory.')}>
        <rect x={60} y={110} width={280} height={190} rx={4} fill="#2F5F8F" />
        <g fill="none" stroke="#CFE3F2" strokeWidth={2.5} opacity={0.85}>
          <rect x={80} y={130} width={240} height={150} />
          <path d="M80 196 H200 V280 M200 196 V130 M240 130 V226 H320 M140 196 V246" />
          <path d="M270 280 v-14 h30 v14" />
        </g>
        <text x={90} y={150} fontFamily="Nunito, sans-serif" fontWeight={800} fontSize={11} fill="#CFE3F2">
          LOADING BAY
        </text>
        <circle cx={292} cy={250} r={7} fill={C.red} />
        <rect x={172} y={98} width={56} height={18} fill={C.gold} opacity={0.9} />
      </Hotspot>
      <Hotspot label="Notice board" onClick={() => observe('A note: “Load the truck by 20:30.”')}>
        <rect x={70} y={330} width={260} height={170} rx={6} fill="#B98252" />
        <rect x={82} y={342} width={236} height={146} fill="#C99665" />
        <rect x={98} y={356} width={84} height={64} fill="#FFF3C4" transform="rotate(-4 140 388)" />
        <rect x={198} y={352} width={100} height={74} fill="#F8FBFF" transform="rotate(3 248 389)" />
        <rect x={118} y={430} width={110} height={48} fill="#DFF3E8" transform="rotate(2 173 454)" />
        <path d="M208 374 h70 M208 390 h62 M208 406 h66 M108 376 h56 M108 392 h46" stroke={C.navy} strokeWidth={3} opacity={0.35} />
        <circle cx={140} cy={358} r={6} fill={C.red} />
        <circle cx={248} cy={354} r={6} fill={C.red} />
        <circle cx={173} cy={432} r={6} fill={C.red} />
      </Hotspot>

      {/* CCTV monitor wall */}
      <Hotspot label="Camera screens" onClick={() => observe('Every other camera shows an empty factory.')}>
        <rect x={408} y={66} width={704} height={238} rx={10} fill="#262F3B" />
        <rect x={408} y={290} width={704} height={14} fill="#1E2530" />
        {CAMS.map(([cam, kind], i) => (
          <CamScreen key={cam + i} x={428 + (i % 4) * 172} y={86 + Math.floor(i / 4) * 106} cam={cam} kind={kind} />
        ))}
      </Hotspot>

      {/* door + filing cabinet on the right */}
      <Hotspot label="Door" onClick={() => observe('The door to the factory floor.')}>
        <rect x={1356} y={140} width={196} height={500} fill="#262F3B" />
        <rect x={1370} y={154} width={168} height={486} fill="#5F6B7C" />
        <rect x={1396} y={184} width={116} height={110} rx={4} fill="#1A2540" />
        <path d="M1396 240 h116 M1454 184 v110" stroke="#5F6B7C" strokeWidth={5} />
        <rect x={1400} y={330} width={108} height={26} rx={4} fill={C.gold} />
        <text x={1454} y={348} textAnchor="middle" fontFamily="Nunito, sans-serif" fontWeight={800} fontSize={13} fill={C.navy} letterSpacing={2}>
          SECURITY
        </text>
        <rect x={1380} y={430} width={34} height={12} rx={6} fill="#C9D3DD" />
      </Hotspot>
      <Hotspot label="Delivery records" onClick={() => observe('Delivery records, all stamped “N.S.L.”')}>
        <rect x={1186} y={402} width={156} height={240} rx={6} fill="#7D8A9C" />
        {[0, 1, 2].map((i) => (
          <g key={i}>
            <rect x={1198} y={416 + i * 74} width={132} height={64} rx={4} fill="#8A96A6" />
            <rect x={1244} y={440 + i * 74} width={40} height={10} rx={5} fill="#5F6B7C" />
            <rect x={1248} y={424 + i * 74} width={32} height={12} rx={2} fill="#F8FBFF" />
          </g>
        ))}
        <rect x={1196} y={318} width={46} height={84} rx={5} fill={C.red} />
        <rect x={1246} y={326} width={42} height={76} rx={5} fill="#3E7CC9" />
        <rect x={1292} y={334} width={40} height={68} rx={5} fill={C.green} />
        <rect x={1202} y={340} width={34} height={14} rx={3} fill="#fff" />
        <text x={1219} y={351} textAnchor="middle" fontFamily="Nunito, sans-serif" fontWeight={800} fontSize={7} fill={C.navy}>
          DELIVERIES
        </text>
      </Hotspot>

      {/* floor */}
      <PerspectiveFloor top={640} fill="#353F4D" line="#2E3744" horizon={320} rows={5} />
      <rect y={636} width={1600} height={8} fill="#2E3744" />
      <path d="M560 760 Q700 800 640 900" fill="none" stroke="#1E2530" strokeWidth={8} strokeLinecap="round" />
      <path d="M990 760 Q1100 820 1180 900" fill="none" stroke="#1E2530" strokeWidth={6} strokeLinecap="round" />

      {/* console desk in perspective */}
      <ellipse cx={750} cy={790} rx={460} ry={26} fill="#0b1626" opacity={0.35} />
      <rect x={370} y={612} width={760} height={168} fill="#3A2E24" />
      <rect x={380} y={626} width={220} height={154} fill="#4E3C2E" />
      <rect x={900} y={626} width={220} height={154} fill="#4E3C2E" />
      {[660, 712].map((y) => (
        <g key={y}>
          <rect x={400} y={y} width={180} height={40} rx={5} fill={DESK} />
          <rect x={920} y={y} width={180} height={40} rx={5} fill={DESK} />
          <rect x={470} y={y + 16} width={40} height={8} rx={4} fill={C.gold} />
          <rect x={990} y={y + 16} width={40} height={8} rx={4} fill={C.gold} />
        </g>
      ))}
      <path d="M380 558 L1120 558 L1150 610 L350 610 Z" fill={DESK_TOP} />
      <rect x={350} y={610} width={800} height={16} fill={DESK} />

      {/* desk lamp's pool of light */}
      <path d="M1102 470 L1156 470 L1170 612 L1020 612 Z" fill="url(#l7-lamp)" />

      {/* the security monitor, paused on the last still */}
      <Hotspot label="Security monitor" onClick={onMonitor} hit={[380, 300, 400, 300]}>
        <rect x={548} y={540} width={60} height={24} fill="#1E2530" />
        <rect x={500} y={560} width={156} height={10} rx={5} fill="#1E2530" />
        <rect x={390} y={316} width={376} height={236} rx={18} fill="#2B3442" />
        <FootageFrame index={5} box={[410, 334, 336, 210]} />
        <rect x={410} y={334} width={336} height={210} fill="none" stroke="#1C2433" strokeWidth={4} />
        <rect x={418} y={342} width={70} height={22} rx={4} fill="#000" opacity={0.55} />
        <text x={453} y={359} textAnchor="middle" fontFamily="VT323, monospace" fontSize={17} fill="#F2F7EE">
          ❚❚ PAUSE
        </text>
        <circle cx={752} cy={545} r={4} fill="#3DDC97" />
      </Hotspot>

      {/* paperwork, phone, mug */}
      <Hotspot label="Paperwork" onClick={() => observe('Invoices for toy deliveries that never arrived.')}>
        {[0, 1, 2, 3].map((i) => (
          <rect
            key={i}
            x={742 + i * 3}
            y={576 - i * 5}
            width={110}
            height={26}
            rx={2}
            fill={['#F8FBFF', '#EEF3F8', '#FFF8EA', '#F8FBFF'][i]}
            transform={`rotate(${-5 + i * 2} 797 590)`}
          />
        ))}
        <path d="M760 566 h70 M760 574 h52" stroke={C.navy} strokeWidth={2} opacity={0.3} />
      </Hotspot>
      <g>
        <rect x={672} y={576} width={58} height={26} rx={6} fill="#2B3442" />
        <path d="M676 578 q25 -22 50 0" fill="none" stroke="#2B3442" strokeWidth={9} strokeLinecap="round" />
        <rect x={684} y={584} width={34} height={10} rx={2} fill="#46546A" />
      </g>
      <Hotspot label="Mug" onClick={() => observe('Cold coffee.')}>
        <rect x={1034} y={562} width={30} height={36} rx={6} fill={C.gold} />
        <path d="M1064 572 q11 0 11 9 q0 9 -11 9" fill="none" stroke={C.gold} strokeWidth={5} />
      </Hotspot>

      {/* computer with a browser already open */}
      <Hotspot label="Computer" onClick={onComputer} hit={[820, 350, 300, 260]}>
        <rect x={950} y={540} width={36} height={22} fill="#2B3442" />
        <rect x={916} y={558} width={104} height={8} rx={4} fill="#2B3442" />
        <rect x={830} y={350} width={276} height={196} rx={14} fill="#2B3442" />
        <rect x={844} y={364} width={248} height={166} rx={5} fill="#DEE3EA" />
        <rect x={850} y={370} width={74} height={18} rx={5} fill="#C9D0DA" />
        <rect x={928} y={370} width={92} height={18} rx={5} fill="#fff" />
        <rect x={934} y={375} width={8} height={8} rx={2} fill="#0F4C81" />
        <text x={946} y={383} fontFamily="Nunito, sans-serif" fontWeight={800} fontSize={9} fill="#334155">
          Find Logistics
        </text>
        <text x={858} y={383} fontFamily="Nunito, sans-serif" fontWeight={700} fontSize={9} fill="#64748B">
          New Tab
        </text>
        <rect x={844} y={388} width={248} height={142} fill="#fff" />
        <rect x={854} y={396} width={228} height={10} rx={5} fill="#EEF2F6" />
        <circle cx={968} cy={466} r={16} fill="none" stroke="#CBD5E1" strokeWidth={3} />
        <path d="M842 576 L1086 576 L1098 600 L830 600 Z" fill="#C9D0DA" />
        <path d="M852 584 h226 M848 592 h234" stroke="#AEB7C4" strokeWidth={2} />
        <ellipse cx={1118} cy={604} rx={12} ry={7} fill="#C9D0DA" />
      </Hotspot>

      {/* desk lamp */}
      <g transform="translate(46 0)">
        <g>
          <ellipse cx={1086} cy={560} rx={26} ry={6} fill="#2B3442" />
          <path d="M1086 558 l-12 -64 l30 -34" fill="none" stroke="#2B3442" strokeWidth={6} strokeLinecap="round" />
          <path d="M1076 446 L1132 446 L1120 474 L1088 474 Z" fill="#2B3442" transform="rotate(24 1104 460)" />
          <ellipse cx={1100} cy={474} rx={14} ry={4} fill="#FFE9A8" />
        </g>
      </g>
      {/* swivel chair pushed back */}
      <g>
        <ellipse cx={800} cy={872} rx={84} ry={12} fill="#0b1626" opacity={0.4} />
        <rect x={738} y={680} width={124} height={104} rx={22} fill="#2B3442" />
        <rect x={752} y={692} width={96} height={80} rx={16} fill="#3A4556" />
        <rect x={722} y={778} width={156} height={26} rx={10} fill="#2B3442" />
        <rect x={792} y={804} width={16} height={46} fill="#1E2530" />
        <path d="M736 866 L800 848 L864 866 M800 848 V870" fill="none" stroke="#1E2530" strokeWidth={9} strokeLinecap="round" />
      </g>

      <ScenePip mood="thinking" pose="think" />
      <Vignette id="l7-vig" />
    </g>
  )
}

export default function Level7TruckTracking({ onComplete }: LevelProps) {
  const [phase, setPhase] = useLevelPhase<'intro' | 'explore' | 'done'>(7, 'intro')
  const [view, setView] = useState<'monitor' | 'computer' | null>(null)
  const [note, observe] = useObservation()

  return (
    <div className="relative h-full">
      <InteractiveScene label="Toy factory security room" bg={WALL} focusX={760}>
        <SecurityRoom onMonitor={() => setView('monitor')} onComputer={() => setView('computer')} observe={observe} />
      </InteractiveScene>
      {note}
      {phase === 'intro' && <DialogueBox lines={D.l7Intro} onDone={() => setPhase('explore')} />}
      {phase === 'done' && !view && <DialogueBox lines={D.l7Done} onDone={onComplete} />}
      <InspectionModal open={view === 'monitor'} onClose={() => setView(null)} title="Last security image · 20:40" tone="dark" size="xl">
        <ZoomPan aspect={FRAME_W / FRAME_H} maxZoom={8}>
          <FootageFrame index={5} className="h-full w-full" grain={false} />
        </ZoomPan>
      </InspectionModal>
      <InspectionModal open={view === 'computer'} onClose={() => setView(null)} title="Security room computer" size="lg">
        <LogisticsPuzzle
          onSolved={() => {
            setView(null)
            setPhase('done')
          }}
        />
      </InspectionModal>
    </div>
  )
}
