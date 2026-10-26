import { useEffect, useState } from 'react'
import { C, PerspectiveFloor, Stars, SvgSnow, Vignette } from '../art/props'
import { playSfx } from '../audio/sound'
import { DialogueBox } from '../components/DialogueBox'
import { InspectionModal } from '../components/InspectionModal'
import { Hotspot, InteractiveScene } from '../components/InteractiveScene'
import { ScenePip } from '../components/ScenePip'
import { useObservation } from '../components/Toast'
import { D } from '../data/dialogues'
import { FrozenLakeMap, MorsePuzzle } from '../puzzles/MorsePuzzle'
import { useLevelPhase } from '../state/progress'
import type { LevelProps } from './types'

const WALL = '#3A5679'
const WALL_LOW = '#31496A'
const SEAM = '#33506F'
const CEIL = '#253B57'
const METAL = '#6A84A2'
const METAL_DARK = '#4C6684'
const DARK = '#1C2A3C'

function Ceiling() {
  return (
    <g>
      <rect width={1600} height={74} fill={CEIL} />
      {/* air duct and pipes along the ceiling */}
      <rect x={-10} y={70} width={1620} height={30} rx={15} fill="#4F6A8A" />
      <rect x={-10} y={76} width={1620} height={6} rx={3} fill="#fff" opacity={0.12} />
      {[120, 440, 760, 1080, 1400].map((x) => (
        <g key={x}>
          <rect x={x} y={66} width={14} height={38} rx={3} fill="#3D5675" />
          <rect x={x + 160} y={68} width={44} height={34} rx={6} fill="#3D5675" opacity={0.7} />
        </g>
      ))}
      <rect x={-10} y={110} width={1620} height={10} rx={5} fill="#2E4563" />
      <rect x={-10} y={124} width={1620} height={6} rx={3} fill={C.gold} opacity={0.35} />
      {/* hanging lab lights: one on, one flickering, one dead */}
      {[300, 800, 1300].map((x, i) => (
        <g key={x}>
          <line x1={x - 60} y1={130} x2={x - 60} y2={150} stroke="#1E2E44" strokeWidth={3} />
          <line x1={x + 60} y1={130} x2={x + 60} y2={150} stroke="#1E2E44" strokeWidth={3} />
          <rect x={x - 90} y={148} width={180} height={16} rx={5} fill="#22354E" />
          <rect
            x={x - 80}
            y={162}
            width={160}
            height={7}
            rx={3.5}
            fill={i === 2 ? '#3E5572' : '#DDF3FF'}
            className={i === 1 ? 'flicker' : undefined}
          />
        </g>
      ))}
    </g>
  )
}

function PanoramaWindow() {
  return (
    <g>
      <defs>
        <linearGradient id="l3-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#12224A" />
          <stop offset="0.55" stopColor="#2F5F86" />
          <stop offset="1" stopColor="#9FD1EA" />
        </linearGradient>
        <linearGradient id="l3-aurora" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#3DDC97" stopOpacity={0} />
          <stop offset="0.45" stopColor="#3DDC97" stopOpacity={0.7} />
          <stop offset="1" stopColor="#8BCDF2" stopOpacity={0} />
        </linearGradient>
        <clipPath id="l3-glass">
          <rect x={446} y={176} width={708} height={268} rx={4} />
        </clipPath>
      </defs>
      <rect x={430} y={160} width={740} height={300} rx={12} fill="#C9D8E8" />
      <g clipPath="url(#l3-glass)">
        <rect x={446} y={176} width={708} height={268} fill="url(#l3-sky)" />
        <g transform="translate(446 176)">
          <Stars w={708} h={140} count={34} seed={31} />
        </g>
        <path d="M430 250 Q600 190 760 240 T1170 220 L1170 262 Q960 270 780 284 T430 300 Z" fill="url(#l3-aurora)" className="flicker-2" />
        <path
          d="M520 208 Q700 170 880 214 T1170 196 L1170 214 Q960 236 800 238 T520 232 Z"
          fill="url(#l3-aurora)"
          opacity={0.6}
          className="flicker-3"
        />
        {/* mountains and the station outside */}
        <path d="M446 380 L540 300 L610 342 L700 270 L790 330 L880 286 L980 350 L1060 300 L1154 352 V444 H446 Z" fill="#DCEBF6" />
        <path
          d="M540 300 L568 322 L552 320 L540 312 L528 320 Z M700 270 L730 296 L712 292 L700 282 L688 292 Z M880 286 L908 308 L892 306 L880 298 L868 306 Z"
          fill="#fff"
        />
        <path d="M446 406 Q800 380 1154 404 V444 H446 Z" fill="#F4FAFE" />
        <g fill="#2B4A6A">
          {/* radar dome and antenna mast of the research station */}
          <rect x={1006} y={360} width={60} height={34} />
          <path d="M1000 362 A36 36 0 0 1 1072 362 Z" />
          <rect x={1100} y={300} width={6} height={100} />
          <path d="M1103 300 l-22 22 h44 z" fill="none" stroke="#2B4A6A" strokeWidth={3} />
          <circle cx={1103} cy={298} r={4} fill="#FF5A4E" className="blink" />
          <rect x={560} y={372} width={4} height={34} />
          <path d="M562 372 l-14 8 M562 372 l14 8" stroke="#2B4A6A" strokeWidth={3} />
        </g>
        <SvgSnow x={446} y={170} w={708} h={280} count={40} seed={33} />
        {/* frost creeping in from the corners */}
        <path d="M446 176 h140 q-60 18 -92 54 q-26 30 -48 40 z" fill="#fff" opacity={0.5} />
        <path d="M1154 444 h-170 q70 -12 110 -50 q34 -34 60 -42 z" fill="#fff" opacity={0.5} />
      </g>
      <rect x={677} y={176} width={12} height={268} fill="#C9D8E8" />
      <rect x={911} y={176} width={12} height={268} fill="#C9D8E8" />
      <rect x={414} y={456} width={772} height={22} rx={6} fill="#E9F2F8" />
      <path d="M430 468 h740" stroke="#fff" strokeWidth={6} strokeLinecap="round" opacity={0.8} />
    </g>
  )
}

/** Weather radar console: a sweeping radar screen, dials and a paper chart recorder. */
function RadarConsole() {
  return (
    <g>
      <rect x={52} y={292} width={286} height={344} rx={14} fill="#4C6684" />
      <rect x={52} y={292} width={286} height={18} rx={9} fill="#5E7896" />
      <rect x={70} y={312} width={250} height={36} rx={6} fill="#2B3E58" />
      <text x={195} y={336} textAnchor="middle" fontFamily="Nunito, sans-serif" fontWeight={800} fontSize={14} fill="#CFE3F2" letterSpacing={2}>
        WEATHER RADAR
      </text>
      {/* radar screen */}
      <circle cx={195} cy={434} r={78} fill="#2B3442" />
      <circle cx={195} cy={434} r={70} fill="#07130E" />
      <g fill="none" stroke="#1E6B4A" strokeWidth={1.5}>
        <circle cx={195} cy={434} r={23} />
        <circle cx={195} cy={434} r={46} />
        <path d="M125 434 H265 M195 364 V504" />
      </g>
      <path d="M195 434 L195 364 A70 70 0 0 1 255 398 Z" fill="#3DDC97" opacity={0.35} className="radar-sweep" />
      <circle cx={226} cy={404} r={3.5} fill="#3DDC97" className="blink" />
      <circle cx={168} cy={470} r={3} fill="#F9C846" className="flicker" />
      <path d="M150 400 q10 -8 22 -2 q10 6 20 -2" fill="none" stroke="#3DDC97" strokeWidth={3} opacity={0.6} />
      {/* dials */}
      {[110, 195, 280].map((x, i) => (
        <g key={x}>
          <circle cx={x} cy={546} r={22} fill="#F8FBFF" />
          <circle cx={x} cy={546} r={22} fill="none" stroke="#2B3E58" strokeWidth={4} />
          <path d={`M${x} 546 l${[10, -12, 4][i]} ${[-14, -8, -16][i]}`} stroke={C.red} strokeWidth={3} strokeLinecap="round" />
          <circle cx={x} cy={546} r={3} fill={C.navy} />
        </g>
      ))}
      {/* chart recorder printing a pressure trace */}
      <rect x={90} y={584} width={210} height={14} rx={4} fill="#1C2A3C" />
      <path d="M104 596 H286 V640 Q240 650 196 640 T104 642 Z" fill="#F8FBFF" />
      <path d="M110 616 l14 -8 l12 10 l14 -14 l12 12 l16 -6 l12 8 l14 -12 l14 10 l16 -4 l14 6" fill="none" stroke={C.red} strokeWidth={2} />
      <circle cx={318} cy={318} r={5} fill="#3DDC97" className="blink" />
    </g>
  )
}

function Whiteboard() {
  return (
    <g>
      <rect x={60} y={150} width={270} height={124} rx={6} fill="#F8FBFF" stroke="#C9D8E8" strokeWidth={8} />
      <path d="M84 250 L120 220 L150 236 L186 196 L222 212 L256 176" fill="none" stroke={C.red} strokeWidth={4} />
      <path d="M84 176 h70 M84 192 h48" stroke={C.navy} strokeWidth={3} opacity={0.45} />
      <path d="M270 176 l30 22 M300 176 l-30 22" stroke={C.red} strokeWidth={4} />
      <circle cx={186} cy={196} r={9} fill="none" stroke={C.red} strokeWidth={3} />
      <rect x={110} y={272} width={170} height={8} rx={4} fill="#C9D8E8" />
    </g>
  )
}

function LabScene({ signal, onComputer, observe }: { signal: boolean; onComputer: () => void; observe: (t: string) => void }) {
  return (
    <g>
      <defs>
        <radialGradient id="l3-screen" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#3DDC97" stopOpacity={0.45} />
          <stop offset="1" stopColor="#3DDC97" stopOpacity={0} />
        </radialGradient>
        <linearGradient id="l3-beam" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#DDF3FF" stopOpacity={0.16} />
          <stop offset="1" stopColor="#DDF3FF" stopOpacity={0} />
        </linearGradient>
      </defs>
      {/* walls */}
      <rect width={1600} height={900} fill={WALL} />
      {Array.from({ length: 9 }, (_, i) => (
        <rect key={i} x={i * 200 - 4} y={74} width={6} height={566} fill={SEAM} />
      ))}
      <rect y={520} width={1600} height={120} fill={WALL_LOW} />
      <rect y={516} width={1600} height={8} fill="#5E7896" opacity={0.6} />
      <Ceiling />
      {[300, 800].map((x) => (
        <path key={x} d={`M${x - 80} 168 L${x + 80} 168 L${x + 250} 900 L${x - 250} 900 Z`} fill="url(#l3-beam)" />
      ))}

      <Hotspot label="Window" onClick={() => observe('The northern lights are out tonight.')}>
        <PanoramaWindow />
      </Hotspot>
      <Hotspot label="Whiteboard" onClick={() => observe('Charts of delivery routes. Some are crossed out.')}>
        <Whiteboard />
      </Hotspot>
      <Hotspot label="Weather radar" onClick={() => observe('A weather radar. Snow is on the way.')}>
        <RadarConsole />
      </Hotspot>

      {/* Arctic map + clock on the right wall */}
      <Hotspot label="Arctic map" onClick={() => observe('A map of the Arctic Ocean, covered in notes.')}>
        <rect x={1220} y={170} width={300} height={190} rx={6} fill="#E9F2F8" />
        <rect x={1232} y={182} width={276} height={166} fill="#BFE0F5" />
        <circle cx={1370} cy={265} r={70} fill="none" stroke="#fff" strokeWidth={2} />
        <circle cx={1370} cy={265} r={38} fill="none" stroke="#fff" strokeWidth={2} />
        <path d="M1250 220 Q1280 200 1316 220 Q1332 248 1306 264 Q1270 270 1250 246 Z" fill="#F8FBFF" />
        <path d="M1410 312 Q1440 288 1486 298 Q1494 326 1466 340 Q1420 340 1410 312 Z" fill="#E4EEDF" />
        <circle cx={1424} cy={214} r={5} fill={C.red} />
        <path d="M1280 300 l40 -20 M1330 230 l30 30" stroke={C.red} strokeWidth={2} strokeDasharray="4 4" />
        <rect x={1350} y={158} width={40} height={22} fill={C.gold} opacity={0.9} transform="rotate(-4 1370 169)" />
      </Hotspot>
      <g>
        <circle cx={1280} cy={436} r={34} fill="#F8FBFF" stroke={METAL_DARK} strokeWidth={6} />
        <path d="M1280 436 V412 M1280 436 L1296 446" stroke={C.navy} strokeWidth={4} strokeLinecap="round" />
      </g>

      {/* floor */}
      <PerspectiveFloor top={640} fill="#22364F" line="#2B4360" horizon={330} />
      <path d="M470 640 L1130 640 L1300 900 L300 900 Z" fill="#BFE0F5" opacity={0.06} />
      <rect y={636} width={1600} height={8} fill="#2B4360" />

      {/* server rack */}
      <Hotspot label="Server rack" onClick={() => observe('The servers are humming quietly.')}>
        <ellipse cx={1475} cy={706} rx={110} ry={14} fill="#0b1626" opacity={0.35} />
        <rect x={1390} y={330} width={170} height={376} rx={8} fill={DARK} />
        <rect x={1390} y={330} width={16} height={376} fill="#26384F" />
        {[0, 1, 2, 3, 4, 5, 6].map((i) => (
          <g key={i}>
            <rect x={1412} y={348 + i * 50} width={134} height={38} rx={4} fill="#26384F" />
            <circle
              cx={1428}
              cy={367 + i * 50}
              r={4}
              fill={i % 3 === 0 ? '#3DDC97' : i % 3 === 1 ? '#F9C846' : '#33445A'}
              className={i % 2 ? 'blink' : 'flicker-3'}
            />
            <rect x={1442} y={363 + i * 50} width={80} height={6} rx={3} fill="#33445A" />
          </g>
        ))}
        <path d="M1400 706 Q1380 760 1300 770" fill="none" stroke="#0F1824" strokeWidth={8} strokeLinecap="round" />
      </Hotspot>

      {/* main workstation */}
      <ellipse cx={810} cy={812} rx={330} ry={22} fill="#0b1626" opacity={0.35} />
      <path d="M560 604 L1060 604 L1084 646 L536 646 Z" fill={METAL} />
      <rect x={536} y={646} width={548} height={16} fill={METAL_DARK} />
      <rect x={560} y={662} width={18} height={150} fill={METAL_DARK} />
      <rect x={1042} y={662} width={18} height={150} fill={METAL_DARK} />
      <rect x={870} y={662} width={160} height={120} rx={6} fill="#557091" />
      {[690, 730].map((y) => (
        <rect key={y} x={930} y={y} width={40} height={8} rx={4} fill={METAL_DARK} />
      ))}
      {signal && <ellipse cx={780} cy={560} rx={260} ry={130} fill="url(#l3-screen)" />}
      <Hotspot label="Laboratory computer" onClick={onComputer} hit={[620, 400, 330, 240]}>
        <rect x={640} y={410} width={290} height={192} rx={12} fill={DARK} />
        <rect x={652} y={422} width={266} height={152} rx={6} fill={signal ? '#07130E' : '#0F1824'} />
        {signal ? (
          <g className="blink">
            <rect x={676} y={492} width={40} height={16} rx={8} fill="#3DDC97" />
            <rect x={722} y={492} width={40} height={16} rx={8} fill="#3DDC97" />
            <rect x={778} y={492} width={16} height={16} rx={8} fill="#3DDC97" />
            <rect x={810} y={492} width={16} height={16} rx={8} fill="#3DDC97" />
            <rect x={842} y={492} width={40} height={16} rx={8} fill="#3DDC97" />
            <rect x={676} y={444} width={130} height={8} rx={4} fill="#3DDC97" opacity={0.5} />
            <rect x={676} y={530} width={90} height={6} rx={3} fill="#3DDC97" opacity={0.35} />
          </g>
        ) : (
          <path d="M664 434 l40 0 l-40 50 z" fill="#fff" opacity={0.05} />
        )}
        <circle cx={906} cy={588} r={5} fill={signal ? '#F9C846' : '#33445A'} className={signal ? 'blink' : undefined} />
        <rect x={768} y={600} width={36} height={10} fill={METAL_DARK} />
        <path d="M680 618 L890 618 L900 636 L670 636 Z" fill="#2B3442" />
        <path d="M690 622 h200 M688 628 h204" stroke="#46546A" strokeWidth={2} />
      </Hotspot>
      {/* papers, cold coffee, switched-off lamp */}
      <g transform="rotate(-8 600 618)">
        <rect x={570} y={608} width={70} height={22} rx={2} fill="#F8FBFF" />
        <rect x={576} y={603} width={70} height={22} rx={2} fill="#EEF3F8" />
      </g>
      <Hotspot label="Coffee cup" onClick={() => observe('This coffee went cold a long time ago.')}>
        <rect x={956} y={584} width={32} height={36} rx={5} fill="#E9F2F8" />
        <path d="M988 594 q12 0 12 10 q0 10 -12 10" fill="none" stroke="#E9F2F8" strokeWidth={5} />
        <ellipse cx={972} cy={585} rx={16} ry={4} fill="#4A3020" />
      </Hotspot>
      <g>
        <path d="M1030 626 l8 -70 l-28 -30" fill="none" stroke={DARK} strokeWidth={6} strokeLinecap="round" />
        <path d="M986 512 L1030 512 L1022 536 L994 536 Z" fill={DARK} transform="rotate(-28 1008 524)" />
        <ellipse cx={1030} cy={628} rx={22} ry={5} fill={DARK} />
      </g>

      {/* chair rolled away, a mitten dropped in a hurry */}
      <g>
        <ellipse cx={1170} cy={854} rx={70} ry={10} fill="#0b1626" opacity={0.35} />
        <rect x={1118} y={690} width={100} height={86} rx={18} fill="#26384F" />
        <rect x={1108} y={770} width={120} height={22} rx={9} fill="#2E4563" />
        <rect x={1162} y={792} width={12} height={48} fill={DARK} />
        <path d="M1116 852 L1168 836 L1220 852" fill="none" stroke={DARK} strokeWidth={8} strokeLinecap="round" />
      </g>
      <path d="M1250 860 q-8 -24 10 -28 q16 -2 18 16 q2 14 -12 18 z" fill={C.red} />
      <rect x={1246} y={856} width={30} height={8} rx={4} fill="#fff" transform="rotate(-12 1261 860)" />

      {/* equipment bench */}
      <Hotspot label="Scientific equipment" onClick={() => observe('Ice samples and measuring tools.')}>
        <ellipse cx={1262} cy={792} rx={140} ry={14} fill="#0b1626" opacity={0.3} />
        <path d="M1150 650 L1370 650 L1384 676 L1136 676 Z" fill={METAL} />
        <rect x={1136} y={676} width={248} height={12} fill={METAL_DARK} />
        <rect x={1150} y={688} width={14} height={104} fill={METAL_DARK} />
        <rect x={1356} y={688} width={14} height={104} fill={METAL_DARK} />
        <path d="M1166 654 V614 H1176 V594 H1190 V614 H1200 V654 Z" fill="#BFE0F5" opacity={0.85} />
        <rect x={1168} y={630} width={30} height={22} fill="#3DDC97" opacity={0.6} />
        <path d="M1222 654 L1238 604 H1262 L1278 654 Z" fill="#BFE0F5" opacity={0.85} />
        <path d="M1228 654 L1236 628 H1264 L1272 654 Z" fill="#8BCDF2" />
        <rect x={1300} y={640} width={50} height={14} rx={3} fill="#2B3442" />
        <rect x={1316} y={570} width={14} height={72} rx={4} fill="#2B3442" />
        <rect x={1306} y={560} width={34} height={22} rx={6} fill="#46607E" transform="rotate(-20 1323 571)" />
      </Hotspot>

      {/* clipboard on the floor */}
      <Hotspot label="Clipboard" onClick={() => observe('Notes about missing deliveries.')}>
        <g transform="rotate(-18 420 840)">
          <rect x={380} y={800} width={84} height={104} rx={6} fill="#A66A43" />
          <rect x={390} y={812} width={64} height={84} fill="#F8FBFF" />
          <rect x={404} y={794} width={36} height={14} rx={4} fill={METAL} />
          <path d="M398 830 h48 M398 846 h40 M398 862 h46" stroke={C.navy} strokeWidth={3} opacity={0.4} />
        </g>
      </Hotspot>

      <ScenePip mood={signal ? 'surprised' : 'worried'} pose={signal ? 'point' : 'idle'} />
      <Vignette id="l3-vig" />
    </g>
  )
}

export default function Level3Laboratory({ onComplete }: LevelProps) {
  const [phase, setPhase] = useLevelPhase<'intro' | 'signal' | 'explore' | 'done'>(3, 'intro')
  const [open, setOpen] = useState(false)
  const [note, observe] = useObservation()
  const [signalDialog, setSignalDialog] = useState(false)
  const signal = phase !== 'intro'

  useEffect(() => {
    if (phase !== 'signal') return
    playSfx('beep')
    const t = setTimeout(() => setSignalDialog(true), 900)
    return () => clearTimeout(t)
  }, [phase])

  return (
    <div className="relative h-full">
      <InteractiveScene label="Arctic research laboratory" bg={WALL} focusX={780}>
        <LabScene signal={signal} onComputer={() => (signal ? setOpen(true) : observe('The screen is dark.'))} observe={observe} />
      </InteractiveScene>
      {note}
      {phase === 'intro' && <DialogueBox lines={D.l3Intro} onDone={() => setPhase('signal')} />}
      {phase === 'signal' && signalDialog && <DialogueBox lines={D.l3Signal} onDone={() => setPhase('explore')} />}
      {phase === 'done' && !open && <DialogueBox lines={D.l3Done} onDone={onComplete} />}
      <InspectionModal open={open} onClose={() => setOpen(false)} title="Laboratory computer" tone="dark" size="lg" done={phase === 'done'}>
        {phase === 'done' ? (
          <div className="overflow-hidden rounded-xl border-4 border-[#2B3442]">
            <FrozenLakeMap reveal />
          </div>
        ) : (
          <MorsePuzzle
            onSolved={() => setPhase('done')}
          />
        )}
      </InspectionModal>
    </div>
  )
}
