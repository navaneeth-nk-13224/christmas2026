import { motion } from 'framer-motion'
import { useEffect, useRef, useState, type ReactNode } from 'react'
import { Detective, Pip } from '../art/characters'
import { C, Moon, Plane, Snowmobile, Stars, Train, Tree, Van } from '../art/props'
import { playSfx } from '../audio/sound'
import type { LevelMeta } from '../data/levels'
import { Snow } from './Snow'

type Arrival = NonNullable<LevelMeta['arrival']>

const PALETTES = {
  day: { skyTop: '#9FD8F7', skyBottom: '#E4F5FD', far: '#D6EAF7', mid: '#BFDDF0', ground: '#F8FBFF', tree: C.green, text: C.navy },
  dusk: { skyTop: '#4B4F8C', skyBottom: '#F5B48A', far: '#8C86B8', mid: '#6E6AA0', ground: '#EEF1FA', tree: '#1E6B52', text: '#fff' },
  night: { skyTop: '#101A30', skyBottom: '#2C3E63', far: '#2A3A5C', mid: '#1F2D4A', ground: '#C9D6E8', tree: '#123F35', text: '#fff' },
  arctic: { skyTop: '#7CC3EC', skyBottom: '#E8F6FD', far: '#CFE9F7', mid: '#A9D6EE', ground: '#F8FBFF', tree: '#2A7D74', text: C.navy },
}

/** Repeats a 1600-wide strip twice and scrolls it forever for a parallax layer. */
function Scroll({ seconds, children }: { seconds: number; children: ReactNode }) {
  return (
    <motion.g animate={{ x: [0, -1600] }} transition={{ duration: seconds, repeat: Infinity, ease: 'linear' }}>
      {children}
      <g transform="translate(1599 0)">{children}</g>
    </motion.g>
  )
}

function Mountains({ fill, y, peaks }: { fill: string; y: number; peaks: number[] }) {
  const step = 1600 / peaks.length
  let d = `M0 ${y}`
  peaks.forEach((p, i) => {
    d += ` L${i * step + step / 2} ${y - p} L${(i + 1) * step} ${y}`
  })
  d += ` V900 H0 Z`
  return <path d={d} fill={fill} />
}

function Scenery({ vehicle, pal }: { vehicle: Arrival['vehicle']; pal: (typeof PALETTES)['day'] }) {
  const groundY = vehicle === 'plane' ? 820 : 720
  if (vehicle === 'walk') {
    // Inside the factory: a corridor of machines sliding past.
    return (
      <>
        <rect width={1600} height={900} fill="#1C2740" />
        <Scroll seconds={9}>
          {[0, 400, 800, 1200].map((x) => (
            <g key={x}>
              <rect x={x + 40} y={180} width={300} height={420} fill="#24324F" />
              <rect x={x + 70} y={220} width={240} height={110} rx={8} fill="#2E3E60" />
              <circle cx={x + 120} cy={420} r={50} fill="#2E3E60" />
              <circle cx={x + 120} cy={420} r={18} fill="#1C2740" />
              <rect x={x + 210} y={380} width={90} height={160} fill="#2E3E60" />
              <rect x={x + 90} y={240} width={40} height={14} rx={7} fill={C.gold} className="flicker" opacity={0.7} />
            </g>
          ))}
        </Scroll>
        <rect y={600} width={1600} height={300} fill="#2A3550" />
        <rect y={600} width={1600} height={10} fill="#3A4868" />
      </>
    )
  }
  return (
    <>
      <defs>
        <linearGradient id="tr-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={pal.skyTop} />
          <stop offset="1" stopColor={pal.skyBottom} />
        </linearGradient>
      </defs>
      <rect width={1600} height={900} fill="url(#tr-sky)" />
      {pal === PALETTES.night && (
        <>
          <Stars w={1600} h={500} count={70} />
          <Moon x={1300} y={150} r={56} />
        </>
      )}
      <Scroll seconds={40}>
        <Mountains fill={pal.far} y={groundY - 60} peaks={[180, 260, 140, 220]} />
      </Scroll>
      <Scroll seconds={22}>
        <Mountains fill={pal.mid} y={groundY - 10} peaks={[110, 70, 150, 90, 120]} />
      </Scroll>
      {vehicle === 'plane' ? (
        <Scroll seconds={7}>
          {[120, 620, 1120].map((x, i) => (
            <g key={x} fill="#fff" opacity={0.92}>
              <ellipse cx={x} cy={260 + i * 120} rx={120} ry={34} />
              <ellipse cx={x + 60} cy={240 + i * 120} rx={70} ry={40} />
              <ellipse cx={x - 50} cy={250 + i * 120} rx={60} ry={30} />
            </g>
          ))}
        </Scroll>
      ) : (
        <Scroll seconds={6}>
          <rect y={groundY} width={1600} height={900 - groundY} fill={pal.ground} />
          {[60, 300, 520, 760, 1010, 1240, 1460].map((x, i) => (
            <Tree key={x} x={x} y={groundY + 8} s={0.6 + (i % 3) * 0.18} color={pal.tree} snowy />
          ))}
        </Scroll>
      )}
      {vehicle === 'train' && (
        <g>
          <rect y={groundY + 70} width={1600} height={10} fill="#7E4E30" />
          <Scroll seconds={1.2}>
            {Array.from({ length: 16 }, (_, i) => (
              <rect key={i} x={i * 100} y={groundY + 80} width={40} height={12} fill="#A66A43" />
            ))}
          </Scroll>
        </g>
      )}
      {vehicle !== 'plane' && vehicle !== 'train' && <rect y={groundY + 60} width={1600} height={240} fill={pal.ground} />}
    </>
  )
}

function VehicleArt({ vehicle }: { vehicle: Arrival['vehicle'] }) {
  switch (vehicle) {
    case 'train':
      return (
        <g className="bob">
          <Train x={1000} y={786} s={1.1} />
        </g>
      )
    case 'plane':
      return (
        <g className="bob">
          <Plane x={800} y={460} s={1.6} />
        </g>
      )
    case 'snowmobile':
      return (
        <g className="bob">
          <Snowmobile
            x={800}
            y={800}
            s={1.3}
            riders={
              <>
                <Detective x={-56} y={-40} s={0.62} glass={false} />
                <Pip x={20} y={-40} s={0.62} pose="point" />
              </>
            }
          />
        </g>
      )
    case 'van':
      return (
        <g className="bob">
          <Van x={800} y={796} s={1.5} />
        </g>
      )
    default:
      return (
        <g>
          <g className="bob">
            <Detective x={700} y={780} s={0.95} />
          </g>
          <g className="bob" style={{ animationDelay: '-1.2s' }}>
            <Pip x={880} y={780} s={0.95} pose="point" />
          </g>
        </g>
      )
  }
}

export function LevelTransition({ arrival, onDone }: { arrival: Arrival; onDone: () => void }) {
  const pal = PALETTES[arrival.palette]
  const [ready, setReady] = useState(false)
  const fired = useRef(false)
  const doneRef = useRef(onDone)
  useEffect(() => {
    doneRef.current = onDone
  })
  const finish = () => {
    if (fired.current) return
    fired.current = true
    doneRef.current()
  }

  useEffect(() => {
    playSfx(arrival.vehicle === 'walk' ? 'click' : 'whoosh')
    const a = setTimeout(() => setReady(true), 1400)
    const b = setTimeout(finish, 5200)
    return () => {
      clearTimeout(a)
      clearTimeout(b)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [arrival])

  const textColor = arrival.vehicle === 'walk' ? '#fff' : pal.text

  return (
    <motion.div
      className="fixed inset-0 z-50 cursor-pointer overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={() => ready && finish()}
    >
      <svg viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice" className="absolute inset-0 h-full w-full">
        <Scenery vehicle={arrival.vehicle} pal={pal} />
        <VehicleArt vehicle={arrival.vehicle} />
      </svg>
      {arrival.vehicle !== 'walk' && <Snow count={45} />}
      <div className="absolute inset-x-0 top-[12%] flex flex-col items-center px-6 text-center" style={{ color: textColor }}>
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 0.85, y: 0 }}
          transition={{ delay: 0.4 }}
          className="font-display text-sm font-semibold tracking-[0.3em] uppercase"
        >
          Next stop
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ delay: 0.7, type: 'spring', stiffness: 200, damping: 20 }}
          className="mt-2 font-display text-4xl font-bold tracking-wide drop-shadow-[0_3px_0_rgba(0,0,0,0.12)] sm:text-6xl"
        >
          {arrival.title}
        </motion.h2>
        {arrival.subtitle && (
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 0.9 }} transition={{ delay: 1.2 }} className="mt-3 font-display text-lg sm:text-2xl">
            {arrival.subtitle}
          </motion.p>
        )}
      </div>
      {ready && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.8 }}
          className="absolute inset-x-0 bottom-6 text-center font-display text-sm tracking-widest uppercase"
          style={{ color: textColor }}
        >
          Tap to continue
        </motion.p>
      )}
    </motion.div>
  )
}
