import { motion } from 'framer-motion'
import { useState } from 'react'
import { Portrait, Pip } from '../art/characters'
import { C, Moon, Stars, StringLights, Tree } from '../art/props'
import { playSfx } from '../audio/sound'
import { SoundButtons } from '../components/AudioManager'
import { Snow } from '../components/Snow'
import { D } from '../data/dialogues'

export function NorthPoleNight() {
  return (
    <svg viewBox="0 0 1600 900" preserveAspectRatio="xMidYMax slice" className="absolute inset-0 h-full w-full" aria-hidden>
      <defs>
        <linearGradient id="ss-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#0E1830" />
          <stop offset="0.6" stopColor="#273C66" />
          <stop offset="1" stopColor="#4E5C8F" />
        </linearGradient>
        <linearGradient id="ss-aurora" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#3DDC97" stopOpacity={0} />
          <stop offset="0.5" stopColor="#3DDC97" stopOpacity={0.45} />
          <stop offset="1" stopColor="#8BCDF2" stopOpacity={0} />
        </linearGradient>
      </defs>
      <rect width={1600} height={900} fill="url(#ss-sky)" />
      <Stars w={1600} h={520} count={90} seed={4} />
      <path
        d="M0 220 Q300 120 640 210 T1300 170 T1600 210 L1600 290 Q1300 240 980 300 T300 250 T0 300 Z"
        fill="url(#ss-aurora)"
        className="flicker-2"
      />
      <path d="M200 120 Q520 60 820 140 T1500 90 L1500 130 Q1200 150 900 180 T200 160 Z" fill="url(#ss-aurora)" opacity={0.6} className="flicker-3" />
      <Moon x={1380} y={140} r={48} />
      {/* far hills */}
      <path d="M0 640 Q260 560 560 620 T1100 590 T1600 610 V900 H0 Z" fill="#C6D3EA" />
      {[90, 210, 1280, 1420, 1530].map((x, i) => (
        <Tree key={x} x={x} y={640 - (i % 2) * 14} s={0.55 + (i % 3) * 0.12} color="#1E5A54" snowy />
      ))}
      {/* the workshop */}
      <g transform="translate(110 120) scale(0.86)">
        <rect x={560} y={420} width={520} height={260} fill="#A66A43" />
        {Array.from({ length: 13 }, (_, i) => (
          <line key={i} x1={560 + i * 40} y1={420} x2={560 + i * 40} y2={680} stroke="#956039" strokeWidth={3} />
        ))}
        <path d="M520 430 L820 250 L1120 430 Z" fill={C.red} />
        <path d="M520 430 L820 250 L1120 430 L1090 436 Q960 380 820 300 Q680 380 550 436 Z" fill="#fff" />
        <path d="M600 440 Q700 448 820 436 Q940 448 1040 440" fill="none" stroke="#fff" strokeWidth={10} strokeLinecap="round" />
        <rect x={960} y={260} width={56} height={110} fill="#7E4E30" />
        <rect x={952} y={252} width={72} height={18} rx={5} fill="#fff" />
        <g fill="#fff" opacity={0.5}>
          <circle cx={990} cy={226} r={16} className="steam" />
          <circle cx={1004} cy={200} r={20} className="steam-2" />
        </g>
        <StringLights x1={540} x2={1100} y={438} sag={14} count={16} />
        {[610, 940].map((x) => (
          <g key={x}>
            <rect x={x} y={490} width={90} height={84} rx={8} fill="#7E4E30" />
            <rect x={x + 8} y={498} width={74} height={68} rx={5} fill="#FFD978" className="flicker-2" />
            <path d={`M${x + 45} 498 V566 M${x + 8} 532 H${x + 82}`} stroke="#7E4E30" strokeWidth={6} />
          </g>
        ))}
        <rect x={762} y={500} width={116} height={180} rx={50} fill="#5B3A22" />
        <rect x={772} y={512} width={96} height={168} rx={44} fill={C.green} />
        <circle cx={846} cy={600} r={6} fill={C.gold} />
        <circle cx={820} cy={540} r={26} fill="none" stroke={C.greenDark} strokeWidth={9} />
        <path d="M820 566 l-10 8 l2 -12 z M820 566 l10 8 l-2 -12 z" fill={C.red} />
        <rect x={700} y={380} width={240} height={48} rx={10} fill="#7E4E30" />
        <text x={820} y={413} textAnchor="middle" fontFamily="Fredoka, sans-serif" fontWeight={700} fontSize={26} fill="#FFE9A8" letterSpacing={2}>
          SANTA'S WORKSHOP
        </text>
      </g>
      {/* north pole */}
      <g transform="translate(60 60)">
        <rect x={1180} y={470} width={22} height={240} fill="#fff" />
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <path key={i} d={`M1180 ${486 + i * 38} l22 -14 v12 l-22 14 z`} fill={C.red} />
        ))}
        <circle cx={1191} cy={462} r={18} fill={C.gold} />
        <rect x={1100} y={520} width={88} height={30} rx={6} fill="#7E4E30" transform="rotate(-6 1144 535)" />
        <text
          x={1144}
          y={541}
          textAnchor="middle"
          fontFamily="Fredoka, sans-serif"
          fontWeight={700}
          fontSize={14}
          fill="#fff"
          transform="rotate(-6 1144 535)"
        >
          NORTH POLE
        </text>
      </g>
      {/* foreground snow */}
      <path d="M0 700 Q400 650 800 690 T1600 680 V900 H0 Z" fill="#EEF3FB" />
      <path d="M0 780 Q300 740 640 780 T1300 770 T1600 790 V900 H0 Z" fill="#F8FBFF" />
      <Tree x={200} y={800} s={1.25} color={C.green} snowy lights star />
      <Tree x={1420} y={810} s={1.1} color={C.green} snowy />
      <g className="bob">
        <Pip x={460} y={800} s={1.25} mood="worried" />
      </g>
    </svg>
  )
}

export function StartScreen({
  hasSave,
  storyUnlocked,
  onStart,
  onContinue,
  onStory,
  onCredits,
}: {
  hasSave: boolean
  storyUnlocked: boolean
  onStart: () => void
  onContinue: () => void
  onStory: () => void
  onCredits: () => void
}) {
  const [confirming, setConfirming] = useState(false)
  const go = (fn: () => void) => () => {
    playSfx('bells')
    fn()
  }
  return (
    <div className="relative h-full overflow-hidden bg-navy-deep">
      <NorthPoleNight />
      <Snow count={60} />
      <div className="absolute top-[max(0.75rem,env(safe-area-inset-top))] right-3 z-10">
        <SoundButtons dark />
      </div>
      <div className="relative z-10 flex h-full flex-col items-center px-5 pt-[9vh] text-center text-white">
        <motion.p
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="font-display text-xs font-semibold tracking-[0.35em] text-gold uppercase sm:text-sm"
        >
          The Last Light of Christmas
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 180, damping: 14 }}
          className="mt-3 font-display text-5xl leading-none font-bold tracking-wide text-white drop-shadow-[0_5px_0_#C5321F] sm:text-7xl md:text-8xl"
        >
          SANTA IS MISSING!
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-4 font-display text-xl font-medium sm:text-3xl"
        >
          Find him before Christmas!
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          className="mt-8 flex flex-col items-center gap-3"
        >
          {confirming ? (
            <div className="rounded-3xl bg-white/95 p-5 text-navy shadow-xl">
              <p className="font-display text-lg font-semibold">Start a new investigation?</p>
              <p className="mt-1 text-sm text-navy/70">Your saved progress will be cleared.</p>
              <div className="mt-4 flex justify-center gap-2">
                <button type="button" className="btn btn-light btn-sm !border-2 !border-navy/10" onClick={() => setConfirming(false)}>
                  Cancel
                </button>
                <button type="button" className="btn btn-red btn-sm" onClick={go(onStart)}>
                  Start over
                </button>
              </div>
            </div>
          ) : (
            <>
              {hasSave && (
                <button type="button" className="btn btn-green text-lg" onClick={go(onContinue)}>
                  Continue Game
                </button>
              )}
              <button
                type="button"
                className={`btn ${hasSave ? 'btn-light' : 'btn-red px-8 py-4 text-lg'}`}
                onClick={hasSave ? () => setConfirming(true) : go(onStart)}
              >
                Start Investigation
              </button>
              {storyUnlocked && (
                <button type="button" className="btn btn-light btn-sm" onClick={go(onStory)}>
                  📖 Read the Full Story
                </button>
              )}
            </>
          )}
        </motion.div>
      </div>

      {/* Pip's opening line */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.3 }}
        className="absolute inset-x-0 bottom-[max(1rem,env(safe-area-inset-bottom))] z-10 flex justify-center px-3"
      >
        <div className="flex max-w-xl items-center gap-3 rounded-3xl border-4 border-white bg-white/95 p-3 pr-5 text-left shadow-xl">
          <Portrait who="pip" size={54} />
          <div>
            <div className="font-display text-sm font-semibold text-xred uppercase">Pip</div>
            <p className="font-display text-lg leading-snug text-navy">{D.title[0].text}</p>
          </div>
        </div>
      </motion.div>
      <button
        type="button"
        onClick={onCredits}
        className="absolute top-[max(1.1rem,env(safe-area-inset-top))] left-4 z-10 font-display text-sm text-white/60 underline-offset-2 hover:underline"
      >
        Credits
      </button>
    </div>
  )
}
