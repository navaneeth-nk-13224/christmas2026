import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { Nicholas, Pip, Santa, ThiefBoss, ThiefSidekick } from '../art/characters'
import { C, House, Moon, Present, Reindeer, Sleigh, Stars, Tree } from '../art/props'
import { playSfx } from '../audio/sound'
import { DialogueBox } from '../components/DialogueBox'
import { Snow } from '../components/Snow'
import { D } from '../data/dialogues'

function Confetti() {
  const colors = [C.red, C.gold, C.green, C.winter, '#fff']
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      {Array.from({ length: 36 }, (_, i) => (
        <motion.span
          key={i}
          className="absolute block rounded-sm"
          style={{ left: `${(i * 37) % 100}%`, top: -20, width: 8 + (i % 3) * 3, height: 12 + (i % 4) * 2, background: colors[i % colors.length] }}
          animate={{ y: ['0vh', '110vh'], rotate: [0, 360 * (i % 2 ? 1 : -1)], x: [0, (i % 5) * 12 - 24] }}
          transition={{ duration: 3.5 + (i % 5) * 0.6, delay: (i % 9) * 0.25, repeat: Infinity, ease: 'linear' }}
        />
      ))}
    </div>
  )
}

/** Scene 1 — Santa thanks the detective, inside the recovered warehouse. */
function ThankYouScene() {
  return (
    <svg viewBox="0 0 1600 900" preserveAspectRatio="xMidYMax slice" className="absolute inset-0 h-full w-full" aria-hidden>
      <rect width={1600} height={900} fill="#3B4658" />
      {Array.from({ length: 40 }, (_, i) => (
        <rect key={i} x={i * 40} y={0} width={14} height={640} fill="#35404F" />
      ))}
      <circle cx={800} cy={380} r={420} fill="#FFE9A8" opacity={0.12} />
      {/* thieves sulking behind the lowered shutter's grille */}
      <rect x={60} y={260} width={360} height={380} fill="#2B3442" />
      <ThiefBoss x={170} y={640} s={0.75} mood="worried" />
      <ThiefSidekick x={300} y={640} s={0.78} mood="worried" />
      {Array.from({ length: 10 }, (_, i) => (
        <rect key={i} x={70 + i * 36} y={260} width={8} height={380} fill="#7D8A9C" />
      ))}
      <rect x={50} y={250} width={380} height={16} fill="#5F6B7C" />
      {/* recovered presents */}
      {[
        [1080, 540, 120, 100, C.red],
        [1210, 560, 100, 80, C.green],
        [1320, 520, 130, 120, C.gold],
        [1130, 450, 90, 80, '#8BCDF2'],
        [1260, 470, 70, 80, C.red],
        [1450, 570, 100, 70, C.green],
      ].map(([x, y, w, h, c], i) => (
        <Present key={i} x={x as number} y={y as number} w={w as number} h={h as number} color={c as string} ribbon={c === C.gold ? C.red : C.gold} />
      ))}
      <rect y={640} width={1600} height={260} fill="#4A5567" />
      <g className="breathe">
        <Santa x={760} y={860} s={1.6} pose="thumbs" />
      </g>
      <g className="bob" style={{ animationDelay: '-1s' }}>
        <Nicholas x={1040} y={860} s={1.35} pose="wave" />
      </g>
    </svg>
  )
}

/** Scene 2 — Pip thanks the detective. */
function PipScene() {
  return (
    <svg viewBox="0 0 1600 900" preserveAspectRatio="xMidYMax slice" className="absolute inset-0 h-full w-full" aria-hidden>
      <defs>
        <radialGradient id="end-pip" cx="0.5" cy="0.45" r="0.7">
          <stop offset="0" stopColor="#2F9E6E" />
          <stop offset="1" stopColor="#0F4F38" />
        </radialGradient>
      </defs>
      <rect width={1600} height={900} fill="url(#end-pip)" />
      {Array.from({ length: 16 }, (_, i) => (
        <path
          key={i}
          d={`M800 420 L${800 + Math.cos((i / 16) * Math.PI * 2) * 1400} ${420 + Math.sin((i / 16) * Math.PI * 2) * 1400} L${800 + Math.cos(((i + 0.5) / 16) * Math.PI * 2) * 1400} ${420 + Math.sin(((i + 0.5) / 16) * Math.PI * 2) * 1400} Z`}
          fill="#fff"
          opacity={0.05}
        />
      ))}
      <g className="bob">
        <Pip x={800} y={900} s={3.2} pose="cheer" />
      </g>
    </svg>
  )
}

/** Scene 3 — Santa and Pip in the sleigh, presents loaded behind them. */
function SleighScene() {
  return (
    <svg viewBox="0 0 1600 900" preserveAspectRatio="xMidYMax slice" className="absolute inset-0 h-full w-full" aria-hidden>
      <defs>
        <linearGradient id="end-night" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#0E1830" />
          <stop offset="1" stopColor="#3A4E80" />
        </linearGradient>
      </defs>
      <rect width={1600} height={900} fill="url(#end-night)" />
      <Stars w={1600} h={500} count={70} seed={9} />
      <Moon x={1320} y={150} r={60} />
      {/* warehouse behind */}
      <rect x={60} y={340} width={520} height={360} fill="#2B3442" />
      <rect x={110} y={420} width={200} height={280} fill="#7D8A9C" />
      <rect x={380} y={300} width={160} height={40} rx={6} fill="#1E2838" />
      <text x={460} y={327} textAnchor="middle" fontFamily="Fredoka, sans-serif" fontWeight={700} fontSize={18} fill="#FFE9A8">
        NORTH STAR
      </text>
      <path d="M0 700 Q400 660 800 690 T1600 680 V900 H0 Z" fill="#EEF3FB" />
      <Tree x={1500} y={720} s={1} snowy />
      {/* reindeer team */}
      <Reindeer x={1320} y={760} s={0.9} rudolph />
      <Reindeer x={1130} y={770} s={0.9} />
      <path d="M1040 700 L1200 710 L1380 690" fill="none" stroke={C.gold} strokeWidth={4} />
      {/* sleigh with Santa, Pip and the presents */}
      <Sleigh x={820} y={800} s={1.5}>
        <g>
          <Present x={-150} y={-190} w={60} h={70} color={C.green} />
          <Present x={-100} y={-210} w={70} h={90} color={C.gold} ribbon={C.red} />
          <Present x={-128} y={-250} w={50} h={44} color={C.red} />
          <Santa x={20} y={-60} s={0.62} pose="wave" />
          <Pip x={100} y={-70} s={0.58} pose="wave" />
        </g>
      </Sleigh>
    </svg>
  )
}

/** Scene 4 — the sleigh flies over a sleeping town, delivering presents. */
function FlightScene() {
  const houses: [number, number, number, string][] = [
    [40, 180, 140, C.red],
    [250, 150, 120, '#2F6F9E'],
    [430, 200, 150, C.green],
    [660, 160, 130, '#B23A48'],
    [860, 190, 140, '#A66A43'],
    [1080, 150, 120, C.red],
    [1260, 180, 150, '#2F6F9E'],
    [1460, 140, 120, C.green],
  ]
  return (
    <svg viewBox="0 0 1600 900" preserveAspectRatio="xMidYMax slice" className="absolute inset-0 h-full w-full" aria-hidden>
      <defs>
        <linearGradient id="end-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#0B1428" />
          <stop offset="0.7" stopColor="#24355E" />
          <stop offset="1" stopColor="#3E5288" />
        </linearGradient>
      </defs>
      <rect width={1600} height={900} fill="url(#end-sky)" />
      <Stars w={1600} h={560} count={110} seed={12} />
      <Moon x={1180} y={200} r={110} />
      <path d="M0 760 Q300 720 640 750 T1300 740 T1600 750 V900 H0 Z" fill="#DCE6F4" />
      {houses.map(([x, w, h, color]) => (
        <House key={x} x={x} y={800} w={w} h={h} color={color} />
      ))}
      {[200, 600, 1020, 1420].map((x) => (
        <Tree key={x} x={x} y={820} s={0.8} snowy lights />
      ))}
      <path d="M0 820 Q400 800 800 815 T1600 810 V900 H0 Z" fill="#F8FBFF" />
      {/* the flight across the moon */}
      <motion.g initial={{ x: -700, y: 120 }} animate={{ x: 2100, y: [120, -60, 40, -120] }} transition={{ duration: 8, ease: 'easeInOut' }}>
        <g transform="translate(0 360) scale(0.55)">
          <Reindeer x={560} y={0} s={0.9} rudolph run />
          <Reindeer x={360} y={10} s={0.9} run />
          <path d="M240 -60 L400 -40 L600 -70" fill="none" stroke={C.gold} strokeWidth={5} />
          <Sleigh x={60} y={60} s={1.2}>
            <Present x={-150} y={-190} w={60} h={70} color={C.green} />
            <Present x={-100} y={-210} w={70} h={90} color={C.gold} ribbon={C.red} />
            <Santa x={20} y={-60} s={0.62} pose="wave" />
            <Pip x={100} y={-70} s={0.58} pose="cheer" />
          </Sleigh>
        </g>
      </motion.g>
      {/* presents dropping toward chimneys */}
      {[300, 720, 1150].map((x, i) => (
        <motion.g
          key={x}
          initial={{ y: 0, opacity: 0 }}
          animate={{ y: [0, 0, 380], opacity: [0, 1, 1, 0] }}
          transition={{ duration: 2.2, delay: 1.6 + i * 1.6, times: [0, 0.1, 0.9, 1] }}
        >
          <Present x={x} y={300} w={34} h={30} color={[C.red, C.gold, C.green][i]} ribbon={i === 1 ? C.red : C.gold} />
        </motion.g>
      ))}
    </svg>
  )
}

export default function Ending({ onDone }: { onDone: () => void }) {
  const [scene, setScene] = useState(0)

  useEffect(() => {
    if (scene === 0) playSfx('success')
    if (scene === 2) playSfx('bells')
    if (scene === 3) {
      playSfx('bells')
      const t = setTimeout(onDone, 8400)
      return () => clearTimeout(t)
    }
  }, [scene, onDone])

  const lines = [D.end1, D.end2, D.end3][scene]

  return (
    <div className="relative h-full overflow-hidden bg-navy-deep">
      <AnimatePresence mode="wait">
        <motion.div
          key={scene}
          className="absolute inset-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6 }}
        >
          {scene === 0 && <ThankYouScene />}
          {scene === 1 && <PipScene />}
          {scene === 2 && <SleighScene />}
          {scene === 3 && <FlightScene />}
        </motion.div>
      </AnimatePresence>
      {scene === 1 && <Confetti />}
      {scene >= 2 && <Snow count={50} />}
      {lines && <DialogueBox key={scene} lines={lines} onDone={() => setScene(scene + 1)} />}
      {scene === 3 && (
        <button
          type="button"
          onClick={onDone}
          className="absolute right-4 bottom-4 z-30 font-display text-sm tracking-widest text-white/60 uppercase hover:text-white"
        >
          Skip ›
        </button>
      )}
    </div>
  )
}
