import { useId } from 'react'
import { Nicholas, Santa, ThiefBoss, ThiefSidekick } from './characters'
import { Crate, Truck } from './props'

export const FRAME_W = 480
export const FRAME_H = 300

export interface FrameInfo {
  time: string
  caption: string
}

export const FRAMES: FrameInfo[] = [
  { time: '20:05', caption: 'Santa arrives at the factory' },
  { time: '20:12', caption: 'Santa meets Professor Nicholas' },
  { time: '20:20', caption: 'They inspect crates of stolen presents' },
  { time: '20:31', caption: 'A delivery truck arrives' },
  { time: '20:36', caption: 'Santa and Nicholas climb into the truck' },
  { time: '20:40', caption: 'The truck drives away' },
]

const SECONDS = ['14', '47', '03', '29', '51', '08']

/** The fixed view of CAM 02 over the factory loading yard. */
function Yard() {
  return (
    <g>
      <rect width={FRAME_W} height={FRAME_H} fill="#3A4A44" />
      {/* factory wall + loading dock door */}
      <rect x={0} y={20} width={230} height={180} fill="#55665E" />
      {Array.from({ length: 6 }, (_, i) => (
        <rect key={i} x={0} y={30 + i * 28} width={230} height={2} fill="#4A5A53" />
      ))}
      <rect x={40} y={70} width={130} height={130} fill="#2A3530" />
      {Array.from({ length: 4 }, (_, i) => (
        <rect key={i} x={40} y={70 + i * 10} width={130} height={7} fill="#6E8077" />
      ))}
      <rect x={30} y={60} width={150} height={10} fill="#6E8077" />
      <rect x={196} y={70} width={14} height={14} fill="#C9D6C0" opacity={0.8} />
      {/* yard + snow banks */}
      <rect x={0} y={200} width={FRAME_W} height={100} fill="#8FA596" />
      <path d="M230 200 Q330 170 480 190 V200 H230 Z" fill="#A7B9AC" />
      <path d="M0 200 h230 v6 h-230 z" fill="#6E8077" />
      <path d="M250 300 L330 200 M380 300 L370 200" stroke="#7C9183" strokeWidth={6} opacity={0.6} />
      {/* lamp post */}
      <rect x={440} y={40} width={6} height={170} fill="#2A3530" />
      <rect x={420} y={36} width={34} height={8} fill="#2A3530" />
      <ellipse cx={428} cy={46} rx={10} ry={4} fill="#E2EBDD" />
      <path d="M418 48 L380 210 H476 Z" fill="#E2EBDD" opacity={0.08} />
    </g>
  )
}

function Overlay({ index }: { index: number }) {
  return (
    <g fontFamily="VT323, monospace" fill="#F2F7EE">
      <rect x={FRAME_W - 236} y={8} width={170} height={22} fill="#000" opacity={0.45} />
      <text x={FRAME_W - 230} y={25} fontSize={19}>
        CAM 02 · LOADING BAY
      </text>
      <rect x={8} y={FRAME_H - 38} width={196} height={30} fill="#000" opacity={0.55} />
      <text x={16} y={FRAME_H - 15} fontSize={28}>
        23-12 {FRAMES[index].time}:{SECONDS[index]}
      </text>
      <circle cx={FRAME_W - 52} cy={19} r={5} fill="#FF5A4E" className="blink" />
      <text x={FRAME_W - 42} y={25} fontSize={19}>
        REC
      </text>
    </g>
  )
}

function Scene({ index }: { index: number }) {
  switch (index) {
    case 0:
      return (
        <g>
          <Crate x={120} y={160} w={50} h={40} dark />
          {/* tiptoeing in along the wall, finger to lips */}
          <g transform="rotate(-8 300 258)">
            <Santa x={300} y={258} s={0.3} flip pose="shh" mood="worried" />
          </g>
          <g fill="#6E8077">
            {[340, 362, 384, 406, 428].map((x, i) => (
              <ellipse key={x} cx={x} cy={262 + (i % 2) * 6} rx={5} ry={2.5} />
            ))}
          </g>
        </g>
      )
    case 1:
      return (
        <g>
          <Crate x={120} y={160} w={50} h={40} dark />
          {/* a quiet meeting in the shadow of the dock */}
          <g transform="rotate(6 200 256)">
            <Nicholas x={200} y={256} s={0.3} pose="shh" mood="worried" />
          </g>
          <g transform="rotate(-5 262 258)">
            <Santa x={262} y={258} s={0.3} flip mood="worried" />
          </g>
        </g>
      )
    case 2:
      return (
        <g>
          <Crate x={60} y={150} w={60} h={50} open dark />
          <Crate x={124} y={150} w={60} h={50} open dark />
          <Crate x={92} y={110} w={56} h={40} dark />
          <Nicholas x={210} y={256} s={0.3} pose="point" flip />
          <Santa x={270} y={258} s={0.3} flip mood="surprised" />
        </g>
      )
    case 3:
      return (
        <g>
          <Crate x={60} y={150} w={60} h={50} open dark />
          <Crate x={124} y={150} w={60} h={50} open dark />
          <Crate x={92} y={110} w={56} h={40} dark />
          {/* hiding behind the crates */}
          <g>
            <Nicholas x={40} y={250} s={0.3} mood="surprised" />
            <Santa x={104} y={252} s={0.3} mood="surprised" />
            <Crate x={20} y={206} w={110} h={48} dark />
          </g>
          <Truck x={340} y={292} s={0.55} palette="cctv" lights />
        </g>
      )
    case 4:
      return (
        <g>
          {/* the thieves carry crates inside with their backs turned, while Santa and Nicholas sneak into the truck */}
          <ThiefBoss x={66} y={200} s={0.24} pose="carry" back />
          <ThiefSidekick x={118} y={200} s={0.26} pose="carry" back />
          <Truck x={340} y={292} s={0.55} palette="cctv" doorOpen>
            <g>
              <Nicholas x={-226} y={-58} s={0.55} pose="shh" mood="worried" />
              <g transform="rotate(10 -300 -4)">
                <Santa x={-300} y={-4} s={0.55} pose="shh" mood="worried" />
              </g>
            </g>
          </Truck>
        </g>
      )
    default:
      return (
        <g>
          <Crate x={120} y={160} w={50} h={40} dark />
          <Truck x={440} y={284} s={0.55} palette="cctv" />
          <g stroke="#C9D6C0" strokeWidth={3} strokeLinecap="round" opacity={0.6}>
            <path d="M240 160 h-40 M250 186 h-60 M242 212 h-36" />
          </g>
        </g>
      )
  }
}

/** One recovered CCTV still. `grain` toggles the scan-line overlay. */
export function FootageFrame({
  index,
  className = '',
  grain = true,
  box,
}: {
  index: number
  className?: string
  grain?: boolean
  /** Position when nested inside another SVG scene: [x, y, width, height]. */
  box?: [number, number, number, number]
}) {
  const id = useId().replace(/:/g, '')
  return (
    <svg
      viewBox={`0 0 ${FRAME_W} ${FRAME_H}`}
      className={box ? undefined : `block ${className}`}
      x={box?.[0]}
      y={box?.[1]}
      width={box?.[2]}
      height={box?.[3]}
      role="img"
      aria-label={`Security camera still, ${FRAMES[index].time}`}
    >
      <defs>
        <filter id={`cctv-${id}`}>
          <feColorMatrix type="matrix" values="0.30 0.55 0.12 0 0.02  0.32 0.60 0.13 0 0.04  0.28 0.50 0.11 0 0.02  0 0 0 1 0" />
        </filter>
        <radialGradient id={`vig-${id}`} cx="0.5" cy="0.5" r="0.7">
          <stop offset="0.6" stopColor="#000" stopOpacity={0} />
          <stop offset="1" stopColor="#000" stopOpacity={0.55} />
        </radialGradient>
      </defs>
      <g filter={`url(#cctv-${id})`}>
        <Yard />
        <Scene index={index} />
      </g>
      <rect width={FRAME_W} height={FRAME_H} fill={`url(#vig-${id})`} />
      {grain && (
        <g opacity={0.18}>
          {Array.from({ length: 50 }, (_, i) => (
            <rect key={i} x={0} y={i * 6} width={FRAME_W} height={1.5} fill="#fff" />
          ))}
        </g>
      )}
      <Overlay index={index} />
    </svg>
  )
}
