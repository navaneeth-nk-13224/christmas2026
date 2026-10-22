import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { Nicholas, Pip, Santa, ThiefBoss, ThiefSidekick } from '../art/characters'
import { C, Crate, Present, rng, SvgSnow, Truck } from '../art/props'
import { playSfx } from '../audio/sound'
import { DialogueBox } from '../components/DialogueBox'
import { InspectionModal } from '../components/InspectionModal'
import { Hotspot, InteractiveScene } from '../components/InteractiveScene'
import { ScenePip } from '../components/ScenePip'
import { useObservation } from '../components/Toast'
import { D } from '../data/dialogues'
import { Keypad, WallCalendar } from '../puzzles/BirthdayPinPuzzle'
import { useLevelPhase } from '../state/progress'
import type { LevelProps } from './types'

type Phase = 'intro' | 'explore' | 'unlocked' | 'freeing' | 'rescue' | 'lockdown' | 'caught'

const WALL = '#3B4658'
const RIB = '#35404F'
const FLOOR = '#4A5567'
const RACK = '#E07B39'
const BEAM = '#2F6F9E'

/** Roll-up shutter: `open` 0 (closed) … 1 (fully open). */
function Shutter({ x, y, w, h, open }: { x: number; y: number; w: number; h: number; open: number }) {
  const curtain = h * (1 - open) + 18
  return (
    <g>
      <motion.g initial={false} animate={{ scaleY: curtain / h }} transition={{ duration: 1.1, ease: [0.5, 0, 0.9, 0.4] }} style={{ originY: 0 }}>
        <rect x={x} y={y} width={w} height={h} fill="#7D8A9C" />
        {Array.from({ length: Math.floor(h / 22) }, (_, i) => (
          <rect key={i} x={x} y={y + i * 22 + 17} width={w} height={4} fill="#5F6B7C" />
        ))}
        <rect x={x} y={y + h - 14} width={w} height={14} fill="#2B3442" />
      </motion.g>
      <rect x={x - 14} y={y - 20} width={w + 28} height={26} rx={4} fill="#5F6B7C" />
    </g>
  )
}

function RackLoad() {
  const r = rng(808)
  const colors = [C.red, C.green, C.gold, '#8BCDF2', '#B23A48', '#fff']
  const shelves = [330, 480, 630]
  return (
    <g>
      {shelves.map((y, si) => {
        const items = []
        let x = 494
        while (x < 910) {
          if (r() > 0.75) {
            const w = 90
            items.push(<Crate key={x} x={x} y={y - 80} w={w} h={80} dark />)
            x += w + 8
          } else {
            const w = 40 + r() * 34
            const h = 40 + r() * 50
            const c = colors[Math.floor(r() * colors.length)]
            items.push(
              <Present key={x} x={x} y={y - h} w={w} h={h} color={c} ribbon={c === C.gold ? C.red : c === '#fff' ? C.red : C.gold} tag={r() > 0.6} />,
            )
            if (r() > 0.5 && h < 70) {
              const c2 = colors[Math.floor(r() * colors.length)]
              items.push(<Present key={`${x}t`} x={x + 6} y={y - h - 34} w={w - 12} h={32} color={c2} ribbon={c2 === C.gold ? C.red : C.gold} />)
            }
            x += w + 10
          }
        }
        return <g key={si}>{items}</g>
      })}
    </g>
  )
}

function Warehouse({
  phase,
  onKeypad,
  onCalendar,
  observe,
}: {
  phase: Phase
  onKeypad: () => void
  onCalendar: () => void
  observe: (t: string) => void
}) {
  const doorOpen = phase !== 'intro' && phase !== 'explore'
  const lockdown = phase === 'caught'
  const interactive = phase === 'explore' || phase === 'intro'
  return (
    <g>
      <defs>
        <clipPath id="l8-bay">
          <rect x={30} y={200} width={360} height={440} />
        </clipPath>
        <linearGradient id="l8-light" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#FFF1C4" stopOpacity={0.22} />
          <stop offset="1" stopColor="#FFF1C4" stopOpacity={0} />
        </linearGradient>
      </defs>
      {/* corrugated walls */}
      <rect width={1600} height={900} fill={WALL} />
      {Array.from({ length: 40 }, (_, i) => (
        <rect key={i} x={i * 40} y={0} width={14} height={640} fill={RIB} />
      ))}
      <rect y={40} width={1600} height={60} fill="#1E2838" />
      {Array.from({ length: 10 }, (_, i) => (
        <rect key={i} x={i * 160 + 8} y={46} width={144} height={48} fill="#2C3E63" />
      ))}
      <rect y={100} width={1600} height={12} fill="#2B3442" />
      {/* overhead lights */}
      {[260, 800, 1340].map((x) => (
        <g key={x}>
          <line x1={x} y1={112} x2={x} y2={150} stroke="#1E2838" strokeWidth={4} />
          <path d={`M${x - 50} 176 Q${x} 136 ${x + 50} 176 Z`} fill="#5F6B7C" />
          <ellipse cx={x} cy={176} rx={40} ry={7} fill="#FFF1C4" />
          <path d={`M${x - 46} 178 L${x + 46} 178 L${x + 220} 880 L${x - 220} 880 Z`} fill="url(#l8-light)" />
        </g>
      ))}

      {/* loading bay, open to the night */}
      <Hotspot label="Loading bay" onClick={() => observe('The loading bay is wide open.')} disabled={!interactive}>
        <g clipPath="url(#l8-bay)">
          <rect x={30} y={200} width={360} height={440} fill="#1A2540" />
          <rect x={30} y={560} width={360} height={80} fill="#C9D6E8" />
          <Truck x={300} y={624} s={0.55} />
          <SvgSnow x={30} y={190} w={360} h={440} count={26} seed={88} />
        </g>
        <Shutter x={30} y={200} w={360} h={440} open={lockdown ? 0 : 0.86} />
        <rect x={20} y={190} width={12} height={452} fill="#2B3442" />
        <rect x={388} y={190} width={12} height={452} fill="#2B3442" />
      </Hotspot>

      {/* wall between the bay and the racks: notices and a small calendar */}
      <Hotspot label="No smoking sign" onClick={() => observe('No smoking in the warehouse.')} disabled={!interactive}>
        <circle cx={432} cy={262} r={22} fill="#fff" />
        <circle cx={432} cy={262} r={18} fill="none" stroke={C.red} strokeWidth={5} />
        <path d="M418 276 L446 248" stroke={C.red} strokeWidth={5} />
        <rect x={420} y={258} width={22} height={6} fill="#2B3442" />
      </Hotspot>
      <Hotspot label="Calendar" onClick={onCalendar} disabled={!interactive} hit={[404, 372, 56, 74]}>
        <line x1={432} y1={366} x2={432} y2={378} stroke="#2B3442" strokeWidth={2} />
        <circle cx={432} cy={366} r={2.5} fill="#9AA9B8" />
        <g transform="rotate(3 432 410)">
          <rect x={410} y={376} width={44} height={60} rx={2} fill="#F8FBFF" />
          <rect x={410} y={376} width={44} height={18} fill="#2C3E63" />
          <path d="M410 390 Q432 384 454 390 V394 H410 Z" fill="#E4EEF8" />
          {Array.from({ length: 5 }, (_, row) =>
            Array.from({ length: 7 }, (_, col) => (
              <rect key={`${row}${col}`} x={413 + col * 5.6} y={400 + row * 6.6} width={4} height={4.6} fill="#C9D3DD" />
            )),
          )}
          <circle cx={420.6} cy={408.9} r={3.6} fill="none" stroke={C.red} strokeWidth={1.2} />
        </g>
      </Hotspot>
      <Hotspot label="Fire extinguisher" onClick={() => observe('A fire extinguisher.')} disabled={!interactive}>
        <rect x={420} y={540} width={26} height={70} rx={10} fill={C.red} />
        <rect x={426} y={528} width={14} height={14} fill="#2B3442" />
        <path d="M440 534 q16 0 14 24" fill="none" stroke="#2B3442" strokeWidth={4} />
        <rect x={418} y={566} width={30} height={12} fill="#fff" opacity={0.8} />
      </Hotspot>

      {/* pallet racking full of stolen presents */}
      <Hotspot label="Shelves of presents" onClick={() => observe('Stolen presents! Hundreds of them.')} disabled={!interactive}>
        {[480, 700, 920].map((x) => (
          <rect key={x} x={x} y={190} width={14} height={456} fill={RACK} />
        ))}
        {[330, 480, 630].map((y) => (
          <rect key={y} x={480} y={y} width={454} height={12} fill={BEAM} />
        ))}
        <RackLoad />
      </Hotspot>

      <Hotspot label="Safety poster" onClick={() => observe('Safety first! Wear your hard hat.')} disabled={!interactive}>
        <rect x={948} y={240} width={46} height={64} rx={2} fill={C.gold} />
        <rect x={952} y={244} width={38} height={24} fill="#2B3442" />
        <path d="M960 262 q11 -16 22 0 z" fill={C.gold} />
        <path d="M956 280 h30 M956 288 h24 M956 296 h28" stroke="#2B3442" strokeWidth={3} />
      </Hotspot>

      {/* the office */}
      <rect x={1000} y={240} width={440} height={404} fill="#B9C3CF" />
      <rect x={990} y={228} width={460} height={18} rx={3} fill="#8A96A6" />
      {Array.from({ length: 10 }, (_, i) => (
        <rect key={i} x={1000 + i * 44} y={246} width={2} height={398} fill="#A7B1BE" />
      ))}
      <rect x={1030} y={300} width={150} height={120} fill="#D6DEE8" stroke="#8A96A6" strokeWidth={6} />
      {Array.from({ length: 8 }, (_, i) => (
        <rect key={i} x={1033} y={306 + i * 14} width={144} height={8} fill="#C3CCD8" />
      ))}
      <Hotspot label="Shift rota" onClick={() => observe('Shift rota: night crew only.')} disabled={!interactive}>
        <rect x={1060} y={470} width={64} height={84} rx={2} fill="#F8FBFF" transform="rotate(-2 1092 512)" />
        <path d="M1068 486 h46 M1068 500 h40 M1068 514 h46 M1068 528 h34 M1068 542 h42" stroke={C.navy} strokeWidth={3} opacity={0.35} />
      </Hotspot>
      <rect x={1196} y={374} width={168} height={24} rx={4} fill="#2B3442" />
      <text x={1280} y={391} textAnchor="middle" fontFamily="Nunito, sans-serif" fontWeight={800} fontSize={13} fill="#F8FBFF" letterSpacing={2}>
        OFFICE · PRIVATE
      </text>
      {/* door */}
      <rect x={1220} y={406} width={120} height={238} fill="#1C2433" />
      <Hotspot label="Office door" onClick={() => observe("It's locked tight.")} disabled={!interactive}>
        <motion.g initial={false} animate={{ scaleX: doorOpen ? 0.14 : 1 }} transition={{ duration: 0.8, ease: 'easeInOut' }} style={{ originX: 1 }}>
          <rect x={1220} y={406} width={120} height={238} fill="#7A8796" />
          <rect x={1234} y={424} width={92} height={90} rx={4} fill="#6B7787" />
          <rect x={1234} y={530} width={92} height={96} rx={4} fill="#6B7787" />
          <rect x={1230} y={520} width={18} height={8} rx={4} fill="#D6DEE8" />
        </motion.g>
      </Hotspot>
      {doorOpen && (
        <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
          <rect x={1224} y={410} width={100} height={234} fill="#FFE9A8" opacity={0.25} />
        </motion.g>
      )}
      {/* keypad */}
      <Hotspot label="Door keypad" onClick={onKeypad} disabled={!interactive} hit={[1346, 488, 60, 90]}>
        <rect x={1356} y={500} width={40} height={66} rx={6} fill="#2B3442" />
        <rect x={1362} y={506} width={28} height={12} rx={2} fill={doorOpen ? '#16A34A' : '#0B1A14'} />
        {Array.from({ length: 4 }, (_, row) =>
          Array.from({ length: 3 }, (_, col) => (
            <rect key={`${row}${col}`} x={1363 + col * 9} y={524 + row * 9} width={7} height={7} rx={1.5} fill="#9AA9B8" />
          )),
        )}
        <circle cx={1390} cy={512} r={2.5} fill={doorOpen ? '#22C55E' : '#EF4444'} className={doorOpen ? undefined : 'blink'} />
      </Hotspot>

      {/* side exit */}
      <rect x={1476} y={360} width={110} height={24} rx={4} fill="#16A34A" />
      <text x={1531} y={378} textAnchor="middle" fontFamily="Nunito, sans-serif" fontWeight={800} fontSize={14} fill="#fff" letterSpacing={2}>
        EXIT
      </text>
      <rect x={1476} y={400} width={110} height={242} fill="#1A2540" />
      <Shutter x={1476} y={400} w={110} h={242} open={lockdown ? 0 : 0.8} />

      {/* floor */}
      <rect y={640} width={1600} height={260} fill={FLOOR} />
      <path d="M0 700 H1600 M0 840 H1600" stroke={C.gold} strokeWidth={8} strokeDasharray="60 40" opacity={0.6} />

      {/* forklift */}
      <Hotspot label="Forklift" onClick={() => observe('A forklift, still warm.')} disabled={!interactive}>
        <rect x={820} y={520} width={12} height={300} fill="#2B3442" />
        <rect x={804} y={520} width={12} height={300} fill="#2B3442" />
        <rect x={760} y={760} width={70} height={10} fill="#2B3442" />
        <path d="M830 640 H960 Q990 640 990 680 V800 H830 Z" fill={C.gold} />
        <path d="M860 640 V560 H950 V640" fill="none" stroke="#2B3442" strokeWidth={8} />
        <rect x={880} y={600} width={50} height={40} rx={6} fill="#2B3442" />
        <circle cx={870} cy={820} r={30} fill="#2B3442" />
        <circle cx={960} cy={820} r={30} fill="#2B3442" />
        <circle cx={870} cy={820} r={12} fill="#7D8A9C" />
        <circle cx={960} cy={820} r={12} fill="#7D8A9C" />
      </Hotspot>

      {/* crates in front */}
      <Hotspot label="Crates" onClick={() => observe('More crates full of presents.')} disabled={!interactive}>
        <Crate x={1300} y={720} w={150} h={130} stencil="NSL" dark />
        <Crate x={1460} y={760} w={120} h={90} open dark />
        <Crate x={1330} y={610} w={110} h={110} dark />
      </Hotspot>

      {/* the trapped thieves */}
      {lockdown && (
        <g>
          <motion.g initial={{ x: 300, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ duration: 0.8 }}>
            <ThiefBoss x={470} y={860} s={1} mood="surprised" pose="grab" />
          </motion.g>
          <motion.g initial={{ x: 300, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ duration: 0.8, delay: 0.15 }}>
            <ThiefSidekick x={620} y={870} s={1} mood="surprised" pose="grab" />
          </motion.g>
        </g>
      )}
      {lockdown && (
        <g>
          <Santa x={1060} y={872} s={0.8} pose="cheer" />
          <Nicholas x={1180} y={872} s={0.8} pose="wave" />
        </g>
      )}
      {(interactive || lockdown) && <ScenePip mood={lockdown ? 'excited' : 'determined'} pose={lockdown ? 'cheer' : 'idle'} />}
      {phase === 'unlocked' && (
        <motion.g initial={{ x: 0 }} animate={{ x: 1130 }} transition={{ delay: 0.3, duration: 1 }}>
          <Pip x={150} y={886} s={1.15} pose="point" mood="excited" />
        </motion.g>
      )}
    </g>
  )
}

function Chair({ x, y, s }: { x: number; y: number; s: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <rect x={-74} y={-250} width={148} height={30} rx={10} fill="#7E4E30" />
      <rect x={-70} y={-230} width={16} height={180} fill="#6B3F22" />
      <rect x={54} y={-230} width={16} height={180} fill="#6B3F22" />
      <rect x={-82} y={-62} width={164} height={22} rx={6} fill="#7E4E30" />
      <rect x={-76} y={-40} width={14} height={40} fill="#6B3F22" />
      <rect x={62} y={-40} width={14} height={40} fill="#6B3F22" />
    </g>
  )
}

function Office({ phase }: { phase: Phase }) {
  const freed = phase !== 'freeing'
  return (
    <g>
      <rect width={1600} height={900} fill="#C8D1DC" />
      <rect y={0} width={1600} height={40} fill="#A7B1BE" />
      {/* window with blinds looking onto the warehouse */}
      <rect x={160} y={140} width={360} height={260} fill="#3B4658" stroke="#8A96A6" strokeWidth={10} />
      {Array.from({ length: 12 }, (_, i) => (
        <rect key={i} x={166} y={150 + i * 20} width={348} height={10} fill="#D6DEE8" opacity={0.9} />
      ))}
      {/* filing cabinet */}
      <rect x={60} y={440} width={180} height={300} rx={6} fill="#8A96A6" />
      {[0, 1, 2].map((i) => (
        <g key={i}>
          <rect x={74} y={456 + i * 92} width={152} height={80} rx={4} fill="#9AA6B6" />
          <rect x={130} y={490 + i * 92} width={40} height={10} rx={5} fill="#5F6B7C" />
        </g>
      ))}
      {/* clock */}
      <circle cx={800} cy={150} r={46} fill="#fff" stroke="#5F6B7C" strokeWidth={8} />
      <path d="M800 150 V118 M800 150 L822 162" stroke={C.navy} strokeWidth={5} strokeLinecap="round" />
      {/* lockdown panel */}
      <rect x={1220} y={250} width={260} height={300} rx={14} fill="#2B3442" />
      <rect x={1232} y={262} width={236} height={276} rx={8} fill="none" stroke={C.gold} strokeWidth={10} strokeDasharray="20 14" />
      <text x={1350} y={312} textAnchor="middle" fontFamily="Fredoka, sans-serif" fontWeight={700} fontSize={22} fill="#fff" letterSpacing={1.5}>
        EMERGENCY
      </text>
      <text x={1350} y={340} textAnchor="middle" fontFamily="Fredoka, sans-serif" fontWeight={700} fontSize={22} fill="#fff" letterSpacing={1.5}>
        LOCKDOWN
      </text>
      <circle cx={1350} cy={430} r={58} fill="#5F6B7C" />
      <circle cx={1350} cy={424} r={46} fill={C.red} />
      <ellipse cx={1338} cy={410} rx={18} ry={10} fill="#fff" opacity={0.35} />
      <g fontFamily="Nunito, sans-serif" fontWeight={800} fontSize={12} fill="#D6DEE8">
        <circle cx={1270} cy={512} r={6} fill="#22C55E" />
        <text x={1282} y={516}>
          SHUTTERS OPEN
        </text>
      </g>
      {/* desk */}
      <rect x={1100} y={600} width={420} height={26} rx={6} fill="#7E4E30" />
      <rect x={1120} y={626} width={20} height={200} fill="#6B3F22" />
      <rect x={1480} y={626} width={20} height={200} fill="#6B3F22" />
      <rect x={1180} y={570} width={120} height={30} rx={3} fill="#F8FBFF" />
      <rect x={1320} y={560} width={40} height={40} rx={6} fill={C.gold} />
      {/* floor */}
      <rect y={760} width={1600} height={140} fill="#8A96A6" />
      <rect y={756} width={1600} height={8} fill="#6B7787" />

      {/* the captives */}
      <Chair x={640} y={850} s={1.15} />
      <Chair x={920} y={850} s={1.15} />
      <Santa x={640} y={858} s={1.05} seated tied={!freed} mood={freed ? 'happy' : 'worried'} pose={freed ? 'cheer' : 'idle'} />
      <Nicholas x={920} y={858} s={1.05} seated tied={!freed} mood={freed ? 'happy' : 'worried'} pose={freed ? 'wave' : 'idle'} />
      {freed && (
        <g stroke="#B98A4E" strokeWidth={8} strokeLinecap="round" fill="none">
          <path d="M560 880 q40 -20 80 0 t80 0" />
          <path d="M850 884 q40 -16 80 0 t60 -6" />
        </g>
      )}
      <motion.g initial={{ x: -560 }} animate={{ x: 0 }} transition={{ duration: 0.9, ease: 'easeOut' }}>
        <Pip x={430} y={890} s={1.1} pose={freed ? 'cheer' : 'point'} mood={freed ? 'happy' : 'surprised'} />
      </motion.g>
    </g>
  )
}

export default function Level8Warehouse({ onComplete }: LevelProps) {
  const [phase, setPhase] = useLevelPhase<Phase>(8, 'intro')
  const [modal, setModal] = useState<'keypad' | 'calendar' | null>(null)
  const [note, observe] = useObservation()

  // Short, automatic story beats between the interactive moments.
  useEffect(() => {
    let t: number | undefined
    if (phase === 'unlocked') t = window.setTimeout(() => setPhase('freeing'), 1500)
    else if (phase === 'freeing') t = window.setTimeout(() => setPhase('rescue'), 2000)
    else if (phase === 'caught') {
      playSfx('shutter')
      t = window.setTimeout(() => playSfx('success'), 1300)
      const done = window.setTimeout(onComplete, 5200)
      return () => {
        clearTimeout(t)
        clearTimeout(done)
      }
    }
    return () => clearTimeout(t)
    // onComplete is stable for the life of this level.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, setPhase])

  const inOffice = phase === 'freeing' || phase === 'rescue' || phase === 'lockdown'

  return (
    <div className="relative h-full">
      {inOffice ? (
        <InteractiveScene
          label="The warehouse office"
          bg="#C8D1DC"
          focusX={900}
          overlay={
            phase === 'lockdown' && (
              <div className="absolute" style={{ left: `${(1350 / 1600) * 100}%`, top: `${(640 / 900) * 100}%`, transform: 'translate(-50%, -50%)' }}>
                <motion.button
                  type="button"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 15 }}
                  className="btn btn-red pointer-events-auto px-6 py-4 text-base whitespace-nowrap shadow-xl sm:text-lg"
                  onClick={() => setPhase('caught')}
                >
                  Activate Lockdown
                </motion.button>
              </div>
            )
          }
        >
          <Office phase={phase} />
        </InteractiveScene>
      ) : (
        <InteractiveScene label="North Star Warehouse" bg={WALL} focusX={phase === 'caught' ? 700 : 1100}>
          <Warehouse phase={phase} onKeypad={() => setModal('keypad')} onCalendar={() => setModal('calendar')} observe={observe} />
        </InteractiveScene>
      )}
      {note}
      {phase === 'intro' && <DialogueBox lines={D.l8Intro} onDone={() => setPhase('explore')} />}
      {phase === 'rescue' && <DialogueBox lines={D.l8Rescue} onDone={() => setPhase('lockdown')} />}
      <AnimatePresence>
        {phase === 'caught' && (
          <motion.div
            className="pointer-events-none absolute inset-x-0 top-6 z-20 flex justify-center px-4"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.4 }}
          >
            <div className="rounded-3xl bg-white/95 px-6 py-3 text-center shadow-xl">
              <div className="font-display text-2xl font-bold text-xred sm:text-3xl">Thieves trapped!</div>
              <div className="font-display text-base text-evergreen sm:text-lg">The stolen presents are safe.</div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <InspectionModal open={modal === 'keypad'} onClose={() => setModal(null)} title="Office door keypad" tone="dark" size="md">
        <Keypad
          onUnlock={() => {
            setModal(null)
            setPhase('unlocked')
          }}
        />
      </InspectionModal>
      <InspectionModal open={modal === 'calendar'} onClose={() => setModal(null)} title="Wall calendar" size="lg">
        <WallCalendar />
      </InspectionModal>
    </div>
  )
}
