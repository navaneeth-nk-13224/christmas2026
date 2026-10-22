import { motion } from 'framer-motion'
import { Pip, Santa } from '../art/characters'
import { C, House, Moon, Reindeer, Sleigh, Stars, Tree } from '../art/props'
import { playSfx } from '../audio/sound'
import { SoundButtons } from '../components/AudioManager'
import { ProgressLights } from '../components/GameLayout'
import { Snow } from '../components/Snow'

function NightVillage() {
  return (
    <svg viewBox="0 0 1600 900" preserveAspectRatio="xMidYMax slice" className="absolute inset-0 h-full w-full" aria-hidden>
      <defs>
        <linearGradient id="fin-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#0B1428" />
          <stop offset="1" stopColor="#34497C" />
        </linearGradient>
      </defs>
      <rect width={1600} height={900} fill="url(#fin-sky)" />
      <Stars w={1600} h={600} count={120} seed={21} />
      <Moon x={1250} y={230} r={120} />
      {/* sleigh silhouette crossing the moon */}
      <g transform="translate(1040 250) scale(0.32)">
        <g className="bob">
          <Reindeer x={560} y={0} s={0.9} rudolph />
          <Reindeer x={360} y={10} s={0.9} />
          <path d="M240 -60 L400 -40 L600 -70" fill="none" stroke={C.gold} strokeWidth={5} />
          <Sleigh x={60} y={60} s={1.2}>
            <Santa x={20} y={-60} s={0.62} pose="wave" />
            <Pip x={100} y={-70} s={0.58} pose="cheer" />
          </Sleigh>
        </g>
      </g>
      <path d="M0 740 Q320 700 680 735 T1360 720 T1600 735 V900 H0 Z" fill="#DCE6F4" />
      {[
        [60, 170, 130, C.red],
        [280, 140, 110, '#2F6F9E'],
        [1100, 160, 120, C.green],
        [1330, 180, 140, '#B23A48'],
      ].map(([x, w, h, c]) => (
        <House key={x as number} x={x as number} y={790} w={w as number} h={h as number} color={c as string} />
      ))}
      {[500, 640, 940, 1540].map((x, i) => (
        <Tree key={x} x={x} y={812} s={0.8 + (i % 2) * 0.3} snowy lights={i % 2 === 0} star={i === 1} />
      ))}
      <path d="M0 810 Q400 790 800 805 T1600 800 V900 H0 Z" fill="#F8FBFF" />
    </svg>
  )
}

export default function FinalScreen({ onStory, onPlayAgain }: { onStory: () => void; onPlayAgain: () => void }) {
  return (
    <div className="relative h-full overflow-hidden bg-navy-deep">
      <NightVillage />
      <Snow count={60} seed={8} />
      <div className="absolute top-[max(0.75rem,env(safe-area-inset-top))] right-3 z-10">
        <SoundButtons dark />
      </div>
      <div className="relative z-10 flex h-full flex-col items-center px-5 pt-[10vh] text-center text-white">
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <ProgressLights level={9} />
        </motion.div>
        <motion.h1
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4, type: 'spring', stiffness: 180, damping: 12 }}
          className="mt-5 font-display text-5xl leading-none font-bold tracking-wide drop-shadow-[0_5px_0_#C5321F] sm:text-7xl md:text-8xl"
        >
          CHRISTMAS SAVED!
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
          className="mt-5 max-w-xl font-display text-xl sm:text-2xl"
        >
          You found Santa, caught the thieves, and saved Christmas.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.3 }}
          className="mt-8 flex flex-col gap-3 sm:flex-row"
        >
          <button
            type="button"
            className="btn btn-red px-8 py-4 text-lg"
            onClick={() => {
              playSfx('paper')
              onStory()
            }}
          >
            📖 Read the Full Story
          </button>
          <button
            type="button"
            className="btn btn-light px-8 py-4 text-lg"
            onClick={() => {
              playSfx('bells')
              onPlayAgain()
            }}
          >
            Play Again
          </button>
        </motion.div>
      </div>
    </div>
  )
}
