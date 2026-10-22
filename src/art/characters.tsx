import type { ReactNode } from 'react'
// Character illustrations. Every character is drawn around its own origin:
// (0, 0) is the point between the feet, and the character extends upward (negative y).

export type Mood = 'happy' | 'worried' | 'surprised' | 'neutral' | 'sly' | 'excited' | 'thinking' | 'determined' | 'sad'

interface Placement {
  x?: number
  y?: number
  s?: number
  flip?: boolean
  className?: string
}

const INK = '#24354B'
const CHEEK = '#F28B82'
const RED = '#EA4335'
const RED_DARK = '#C5321F'
const GREEN = '#18865B'
const GOLD = '#F9C846'

function place({ x = 0, y = 0, s = 1, flip = false }: Placement) {
  return `translate(${x} ${y}) scale(${flip ? -s : s} ${s})`
}

function Shadow({ rx }: { rx: number }) {
  return <ellipse cx={0} cy={1} rx={rx} ry={rx * 0.16} fill="#0b1626" opacity={0.14} />
}

function Eyes({ cx = 0, cy, gap, r = 4.5, mood = 'happy' }: { cx?: number; cy: number; gap: number; r?: number; mood?: Mood }) {
  if (mood === 'sly') {
    return (
      <g fill="none" stroke={INK} strokeWidth={2.8} strokeLinecap="round">
        <path d={`M${cx - gap - r} ${cy} q${r} ${-r * 0.8} ${r * 2} 0`} />
        <path d={`M${cx + gap - r} ${cy} q${r} ${-r * 0.8} ${r * 2} 0`} />
      </g>
    )
  }
  const ry = mood === 'surprised' || mood === 'excited' ? r * 1.38 : mood === 'determined' ? r * 0.98 : r * 1.2
  // Thinking eyes glance up and to the side.
  const look = mood === 'thinking' ? [r * 0.45, -r * 0.5] : [0, 0]
  return (
    <g>
      {[-1, 1].map((side) => (
        <g key={side}>
          <ellipse cx={cx + side * gap + look[0]} cy={cy + look[1]} rx={r} ry={ry} fill={INK} />
          <circle cx={cx + side * gap + look[0] + r * 0.35} cy={cy + look[1] - r * 0.45} r={r * (mood === 'sad' ? 0.48 : 0.38)} fill="#fff" />
          {mood === 'excited' && <circle cx={cx + side * gap - r * 0.35} cy={cy + r * 0.5} r={r * 0.2} fill="#fff" />}
        </g>
      ))}
      {mood === 'sad' && <path d={`M${cx + gap + r * 0.6} ${cy + ry + 1} q-2.5 4 0 6 q2.5 -2 0 -6 z`} fill="#8BCDF2" />}
    </g>
  )
}

function Mouth({ cx = 0, cy, w, mood = 'happy' }: { cx?: number; cy: number; w: number; mood?: Mood }) {
  const line = { fill: 'none', stroke: INK, strokeWidth: 2.6, strokeLinecap: 'round' as const }
  switch (mood) {
    case 'surprised':
      return <ellipse cx={cx} cy={cy + 1} rx={w * 0.38} ry={w * 0.5} fill="#7A2A2A" />
    case 'worried':
      return <path d={`M${cx - w * 0.6} ${cy + 2} q${w * 0.6} ${-w * 0.5} ${w * 1.2} 0`} {...line} />
    case 'sad':
      return <path d={`M${cx - w * 0.7} ${cy + 3} q${w * 0.7} ${-w * 0.8} ${w * 1.4} 0`} {...line} />
    case 'neutral':
      return <path d={`M${cx - w * 0.5} ${cy} h${w}`} {...line} />
    case 'thinking':
      return <path d={`M${cx - w * 0.2} ${cy + 1} q${w * 0.5} ${-w * 0.25} ${w} ${-w * 0.05}`} {...line} />
    case 'determined':
      return <path d={`M${cx - w * 0.8} ${cy - 1} q${w * 0.8} ${w * 0.55} ${w * 1.6} ${-w * 0.25}`} {...line} strokeWidth={2.8} />
    case 'sly':
      return <path d={`M${cx - w * 0.7} ${cy} q${w * 0.8} ${w * 0.35} ${w * 1.4} ${-w * 0.5}`} {...line} strokeWidth={2.8} />
    case 'excited':
      return (
        <g>
          <path
            d={`M${cx - w * 1.25} ${cy - 2} q${w * 1.25} ${w * 1.9} ${w * 2.5} 0 z`}
            fill="#7A2A2A"
            stroke="#7A2A2A"
            strokeWidth={1.5}
            strokeLinejoin="round"
          />
          <ellipse cx={cx} cy={cy + w * 0.62} rx={w * 0.6} ry={w * 0.3} fill="#F08A8A" />
        </g>
      )
    default:
      return (
        <path d={`M${cx - w} ${cy - 1} q${w} ${w * 1.2} ${w * 2} 0 z`} fill="#7A2A2A" stroke="#7A2A2A" strokeWidth={1.5} strokeLinejoin="round" />
      )
  }
}

function Brows({
  cy,
  gap,
  w = 9,
  mood,
  color = INK,
  thick = 2.6,
}: {
  cy: number
  gap: number
  w?: number
  mood?: Mood
  color?: string
  thick?: number
}) {
  // Worried/sad brows tilt up in the middle, determined ones tilt down; surprised and excited brows lift and arch.
  const tilt = mood === 'worried' ? 3 : mood === 'sad' ? 4 : mood === 'determined' ? -2.5 : 0
  const lift = mood === 'surprised' ? -4 : mood === 'excited' ? -3 : 0
  const arch = mood === 'surprised' || mood === 'excited' ? -3 : 0
  // Thinking: one brow goes up.
  const rightLift = mood === 'thinking' ? -4 : 0
  return (
    <g stroke={color} strokeWidth={thick} strokeLinecap="round" fill="none">
      <path d={`M${-gap - w / 2} ${cy + tilt + lift} Q${-gap} ${cy + lift + arch} ${-gap + w / 2} ${cy - tilt + lift}`} />
      <path
        d={`M${gap + w / 2} ${cy + tilt + lift + rightLift} Q${gap} ${cy + lift + arch + rightLift * 1.4} ${gap - w / 2} ${cy - tilt + lift + rightLift}`}
      />
    </g>
  )
}

/* ------------------------------------------------------------------ */
/* PIP — Santa's elf                                                   */
/* ------------------------------------------------------------------ */

export type PipPose = 'idle' | 'point' | 'wave' | 'cheer' | 'think' | 'hips'

export function Pip({ mood = 'happy', pose = 'idle', ...p }: Placement & { mood?: Mood; pose?: PipPose }) {
  const SKIN = '#F5C6A0'
  const SKIN_SHADE = '#E9A585'
  const HAIR = '#8A5A35'
  const raisedPose = pose === 'cheer' || pose === 'wave' || pose === 'point' || pose === 'think'
  const arm = (side: -1 | 1) => {
    const raised = pose === 'cheer' || (side === 1 && (pose === 'wave' || pose === 'point')) || (side === -1 && pose === 'think')
    const shoulder: [number, number] = [side * 19, -97]
    let pts: [number, number][]
    if (pose === 'hips') pts = [shoulder, [side * 44, -80], [side * 29, -64]]
    else if (!raised) pts = [shoulder, [side * 35, -62]]
    else if (pose === 'point') pts = [shoulder, [46, -122]]
    else if (pose === 'think') pts = [shoulder, [-26, -84], [-12, -110]]
    else pts = [shoulder, [side * 40, -140]]
    const hand = pts[pts.length - 1]
    const prev = pts[pts.length - 2]
    // Put the white cuff a little way back from the hand, along the forearm.
    const cuff: [number, number] = [hand[0] + (prev[0] - hand[0]) * 0.22, hand[1] + (prev[1] - hand[1]) * 0.22]
    return (
      <g key={side}>
        <polyline
          points={pts.map((q) => q.join(',')).join(' ')}
          fill="none"
          stroke={GREEN}
          strokeWidth={13}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle cx={cuff[0]} cy={cuff[1]} r={7.4} fill="#F8FBFF" />
        <circle cx={hand[0]} cy={hand[1] + (raised ? -3 : 3)} r={7.5} fill={SKIN} />
        {pose === 'point' && side === 1 && <circle cx={52} cy={-128} r={3} fill={SKIN} />}
      </g>
    )
  }
  return (
    <g transform={place(p)} className={p.className}>
      <Shadow rx={38} />
      {/* striped stockings + curly shoes with bells */}
      {[-1, 1].map((side) => (
        <g key={side}>
          <rect x={side < 0 ? -15 : 4} y={-52} width={11} height={44} rx={5} fill="#F8FBFF" />
          {[-46, -36, -26, -16].map((y) => (
            <rect key={y} x={side < 0 ? -15 : 4} y={y} width={11} height={5} fill={RED} />
          ))}
        </g>
      ))}
      <path d="M-3 -14 V0 H-24 Q-33 0 -33 -8 Q-33 -13 -29 -13 Q-27 -7 -22 -8 L-17 -14 Z" fill="#7A4A2A" />
      <path d="M3 -14 V0 H24 Q33 0 33 -8 Q33 -13 29 -13 Q27 -7 22 -8 L17 -14 Z" fill="#7A4A2A" />
      <path d="M-3 -4 H-22 M3 -4 H22" stroke="#5B3A22" strokeWidth={2} opacity={0.5} />
      <circle cx={-30} cy={-15} r={3.6} fill={GOLD} />
      <circle cx={30} cy={-15} r={3.6} fill={GOLD} />
      {/* arms behind tunic when down */}
      {!raisedPose && [arm(-1), arm(1)]}
      {/* tunic with zig-zag hem and gold trim */}
      <path d="M-22 -104 L22 -104 L36 -46 L27 -38 L18 -46 L9 -38 L0 -46 L-9 -38 L-18 -46 L-27 -38 L-36 -46 Z" fill={GREEN} />
      <path
        d="M-36 -46 L-27 -38 L-18 -46 L-9 -38 L0 -46 L9 -38 L18 -46 L27 -38 L36 -46"
        fill="none"
        stroke={GOLD}
        strokeWidth={2.5}
        strokeLinejoin="round"
      />
      <path d="M2 -104 L22 -104 L36 -46 L27 -38 L18 -46 L9 -38 L2 -45 Z" fill="#000" opacity={0.09} />
      <path d="M-14 -100 Q-18 -80 -22 -60" fill="none" stroke="#fff" strokeWidth={3} opacity={0.12} strokeLinecap="round" />
      <rect x={-31} y={-68} width={62} height={9} rx={3} fill="#5B3A22" />
      <rect x={-7} y={-70.5} width={14} height={14} rx={2.5} fill="#5B3A22" stroke={GOLD} strokeWidth={3} />
      <circle cx={0} cy={-90} r={2.6} fill={GOLD} />
      <circle cx={0} cy={-80} r={2.6} fill={GOLD} />
      {/* raised arms in front */}
      {raisedPose && [arm(-1), arm(1)]}
      {/* collar with little bells */}
      <path d="M-28 -107 L28 -107 L22 -94 L14 -104 L6 -93 L0 -104 L-6 -93 L-14 -104 L-22 -94 Z" fill={RED} />
      {[-22, -6, 6, 22].map((x) => (
        <circle key={x} cx={x} cy={x === -22 || x === 22 ? -93 : -92} r={2.4} fill={GOLD} />
      ))}
      {/* ears */}
      <path d="M-26 -141 L-50 -156 L-27 -124 Z" fill={SKIN} />
      <path d="M-29 -138 L-42 -148 L-29 -129 Z" fill={SKIN_SHADE} />
      <path d="M26 -141 L50 -156 L27 -124 Z" fill={SKIN} />
      <path d="M29 -138 L42 -148 L29 -129 Z" fill={SKIN_SHADE} />
      {/* head */}
      <circle cx={0} cy={-132} r={31} fill={SKIN} />
      <path d="M-30 -140 Q0 -132 30 -140 L30 -150 L-30 -150 Z" fill="#000" opacity={0.06} />
      {/* hair: tufts across the forehead plus side curls */}
      <path d="M-30 -146 Q-24 -134 -17 -145 Q-11 -133 -3 -145 Q4 -134 11 -145 Q18 -135 24 -145 Q29 -138 31 -146 L30 -156 L-30 -156 Z" fill={HAIR} />
      <path d="M-30 -146 q-5 10 1 17 q2 -8 4 -12 z M30 -146 q5 10 -1 17 q-2 -8 -4 -12 z" fill={HAIR} />
      <Brows cy={-140} gap={10} w={8.5} mood={mood} color="#6B4426" thick={2.8} />
      <Eyes cy={-129} gap={10.5} r={4.1} mood={mood} />
      <ellipse cx={0} cy={-121} rx={3.8} ry={3.2} fill={SKIN_SHADE} />
      <circle cx={-18} cy={-118} r={6.2} fill={CHEEK} opacity={0.45} />
      <circle cx={18} cy={-118} r={6.2} fill={CHEEK} opacity={0.45} />
      <g fill="#C98A65" opacity={0.7}>
        <circle cx={-20} cy={-121} r={0.9} />
        <circle cx={-16} cy={-119} r={0.9} />
        <circle cx={-19} cy={-116.5} r={0.9} />
        <circle cx={20} cy={-121} r={0.9} />
        <circle cx={16} cy={-119} r={0.9} />
        <circle cx={19} cy={-116.5} r={0.9} />
      </g>
      <Mouth cy={-112.5} w={7} mood={mood} />
      {/* hat */}
      <path d="M-30 -158 C-26 -202 10 -230 46 -216 C55 -212 59 -202 57 -194 C42 -205 28 -198 30 -158 Z" fill={RED} />
      <path d="M8 -160 C10 -190 26 -206 46 -212 C38 -200 30 -186 30 -158 Z" fill={RED_DARK} opacity={0.45} />
      <path d="M-14 -186 C-4 -206 16 -218 34 -218" fill="none" stroke="#fff" strokeWidth={3} strokeLinecap="round" opacity={0.18} />
      {/* fluffy brim */}
      <rect x={-34} y={-165} width={68} height={15} rx={7.5} fill="#F8FBFF" />
      {[-28, -18, -8, 2, 12, 22, 30].map((x, i) => (
        <circle key={x} cx={x} cy={i % 2 ? -164 : -151} r={4.2} fill="#F8FBFF" />
      ))}
      <rect x={-33} y={-155} width={66} height={4} rx={2} fill="#DCE6F0" />
      {/* pom-pom */}
      <circle cx={58} cy={-190} r={10} fill="#F8FBFF" />
      <circle cx={52} cy={-185} r={6} fill="#F8FBFF" />
      <circle cx={64} cy={-185} r={6} fill="#F8FBFF" />
      <circle cx={58} cy={-197} r={6} fill="#F8FBFF" />
      <circle cx={61} cy={-186} r={4} fill="#DCE6F0" />
    </g>
  )
}

/* ------------------------------------------------------------------ */
/* SANTA                                                               */
/* ------------------------------------------------------------------ */

export function Santa({
  mood = 'happy',
  pose = 'idle',
  seated = false,
  tied = false,
  ...p
}: Placement & { mood?: Mood; pose?: 'idle' | 'wave' | 'cheer' | 'thumbs' | 'shh'; seated?: boolean; tied?: boolean }) {
  const SKIN = '#F4C7A1'
  const dy = seated ? 34 : 0
  const armsDown = tied || pose === 'idle'
  return (
    <g transform={place(p)} className={p.className}>
      <Shadow rx={74} />
      {/* legs + boots */}
      {seated ? (
        <>
          <rect x={-44} y={-46} width={34} height={26} rx={12} fill={RED_DARK} />
          <rect x={10} y={-46} width={34} height={26} rx={12} fill={RED_DARK} />
        </>
      ) : (
        <>
          <rect x={-40} y={-62} width={30} height={40} fill={RED_DARK} />
          <rect x={10} y={-62} width={30} height={40} fill={RED_DARK} />
        </>
      )}
      <rect x={-50} y={-26} width={42} height={26} rx={11} fill="#2B2B33" />
      <rect x={8} y={-26} width={42} height={26} rx={11} fill="#2B2B33" />
      <rect x={-47} y={-33} width={38} height={11} rx={5.5} fill="#fff" />
      <rect x={9} y={-33} width={38} height={11} rx={5.5} fill="#fff" />
      <g transform={`translate(0 ${dy})`}>
        {/* arms (behind body when down) */}
        {armsDown && (
          <>
            <path d="M-50 -180 Q-90 -160 -92 -112 L-72 -108 Q-70 -146 -48 -160 Z" fill={RED} />
            <path d="M50 -180 Q90 -160 92 -112 L72 -108 Q70 -146 48 -160 Z" fill={RED} />
            <circle cx={-83} cy={-108} r={12} fill="#fff" />
            <circle cx={83} cy={-108} r={12} fill="#fff" />
            <circle cx={-83} cy={-96} r={11} fill="#2B2B33" />
            <circle cx={83} cy={-96} r={11} fill="#2B2B33" />
          </>
        )}
        {/* coat */}
        <path d="M-70 -80 Q-84 -150 -50 -186 L50 -186 Q84 -150 70 -80 Q0 -62 -70 -80 Z" fill={RED} />
        <path d="M4 -186 L50 -186 Q84 -150 70 -80 Q38 -70 4 -70 Z" fill="#000" opacity={0.07} />
        <path d="M-72 -84 Q0 -60 72 -84" fill="none" stroke="#fff" strokeWidth={15} strokeLinecap="round" />
        <rect x={-9} y={-170} width={18} height={98} fill="#fff" />
        <rect x={-77} y={-125} width={154} height={17} rx={6} fill="#24242C" />
        <rect x={-14} y={-129} width={28} height={25} rx={4} fill="none" stroke={GOLD} strokeWidth={5} />
        {/* raised arms */}
        {!armsDown && (
          <>
            <path d="M-50 -180 Q-90 -160 -92 -112 L-72 -108 Q-70 -146 -48 -160 Z" fill={RED} />
            <circle cx={-83} cy={-108} r={12} fill="#fff" />
            <circle cx={-83} cy={-96} r={11} fill="#2B2B33" />
            {pose === 'shh' ? null : pose === 'thumbs' ? (
              <>
                <path d="M48 -176 Q86 -170 92 -138 L74 -130 Q70 -150 46 -156 Z" fill={RED} />
                <circle cx={86} cy={-134} r={12} fill="#fff" />
                <circle cx={92} cy={-146} r={11} fill="#2B2B33" />
                <rect x={88} y={-170} width={8} height={18} rx={4} fill="#2B2B33" />
              </>
            ) : (
              <>
                <path d="M48 -180 Q100 -184 118 -226 L100 -236 Q86 -204 46 -158 Z" fill={RED} />
                <circle cx={110} cy={-232} r={12} fill="#fff" />
                <circle cx={115} cy={-246} r={12} fill="#2B2B33" />
              </>
            )}
          </>
        )}
        {/* head */}
        <circle cx={0} cy={-208} r={38} fill={SKIN} />
        {/* beard */}
        <g fill="#fff">
          <path d="M-40 -212 Q-50 -170 -32 -148 Q-18 -126 0 -124 Q18 -126 32 -148 Q50 -170 40 -212 Q28 -192 0 -192 Q-28 -192 -40 -212 Z" />
          <circle cx={-34} cy={-178} r={15} />
          <circle cx={34} cy={-178} r={15} />
          <circle cx={-22} cy={-154} r={17} />
          <circle cx={22} cy={-154} r={17} />
          <circle cx={0} cy={-142} r={19} />
        </g>
        <path d="M-30 -150 Q0 -128 30 -150" fill="none" stroke="#DCE6F0" strokeWidth={4} strokeLinecap="round" />
        <Eyes cy={-213} gap={14} r={4.6} mood={mood} />
        <Brows cy={-226} gap={14} w={13} mood={mood} color="#fff" thick={6} />
        <circle cx={-23} cy={-203} r={8} fill={CHEEK} opacity={0.5} />
        <circle cx={23} cy={-203} r={8} fill={CHEEK} opacity={0.5} />
        {mood === 'surprised' || mood === 'worried' ? (
          <ellipse cx={0} cy={-184} rx={7} ry={mood === 'surprised' ? 7 : 4} fill="#7A2A2A" />
        ) : (
          <path d="M-10 -188 Q0 -176 10 -188 Z" fill="#7A2A2A" />
        )}
        <ellipse cx={-13} cy={-194} rx={16} ry={8} transform="rotate(-14 -13 -194)" fill="#fff" />
        <ellipse cx={13} cy={-194} rx={16} ry={8} transform="rotate(14 13 -194)" fill="#fff" />
        <circle cx={0} cy={-202} r={8} fill="#EE9A86" />
        {/* hat */}
        <path d="M-38 -238 C-34 -290 20 -306 56 -284 C66 -278 70 -262 66 -252 C52 -266 34 -262 36 -238 Z" fill={RED} />
        <rect x={-45} y={-252} width={90} height={20} rx={10} fill="#fff" />
        <circle cx={68} cy={-246} r={13} fill="#fff" />
        {pose === 'shh' && (
          <g>
            <path
              d="M50 -176 Q88 -150 62 -130 Q42 -146 24 -170"
              fill="none"
              stroke={RED}
              strokeWidth={22}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <circle cx={28} cy={-168} r={11} fill="#fff" />
            <circle cx={12} cy={-180} r={11} fill="#2B2B33" />
            <rect x={5} y={-206} width={8} height={26} rx={4} fill="#2B2B33" />
          </g>
        )}
        {tied && (
          <g stroke="#B98A4E" strokeWidth={9} strokeLinecap="round" fill="none">
            <path d="M-92 -120 Q0 -100 92 -120" />
            <path d="M-92 -102 Q0 -82 92 -102" />
            <path d="M-6 -112 l12 18" stroke="#9A6E3A" strokeWidth={6} />
          </g>
        )}
      </g>
    </g>
  )
}

/* ------------------------------------------------------------------ */
/* PROFESSOR NICHOLAS                                                  */
/* ------------------------------------------------------------------ */

export function Nicholas({
  mood = 'happy',
  pose = 'idle',
  seated = false,
  tied = false,
  ...p
}: Placement & { mood?: Mood; pose?: 'idle' | 'wave' | 'point' | 'phone' | 'shh'; seated?: boolean; tied?: boolean }) {
  const SKIN = '#E8B48F'
  const COAT = '#2F6F9E'
  const dy = seated ? 40 : 0
  const right = pose === 'wave' ? [56, -262] : pose === 'point' ? [70, -200] : pose === 'phone' ? [26, -232] : [54, -106]
  return (
    <g transform={place(p)} className={p.className}>
      <Shadow rx={50} />
      {seated ? (
        <>
          <rect x={-30} y={-40} width={24} height={26} rx={8} fill="#3A4656" />
          <rect x={6} y={-40} width={24} height={26} rx={8} fill="#3A4656" />
        </>
      ) : (
        <>
          <rect x={-27} y={-74} width={21} height={60} fill="#3A4656" />
          <rect x={6} y={-74} width={21} height={60} fill="#3A4656" />
        </>
      )}
      <path d="M-31 -18 h26 v18 h-30 q-5 0 -5 -6 q0 -8 9 -12 z" fill="#5B3A22" />
      <path d="M31 -18 h-26 v18 h30 q5 0 5 -6 q0 -8 -9 -12 z" fill="#5B3A22" />
      <g transform={`translate(0 ${dy})`}>
        {/* left arm */}
        <line x1={-38} y1={-180} x2={-54} y2={-110} stroke={COAT} strokeWidth={20} strokeLinecap="round" />
        <circle cx={-55} cy={-104} r={10} fill={RED} />
        {/* parka */}
        <ellipse cx={0} cy={-190} rx={40} ry={12} fill="#E9DCC7" />
        <path d="M-42 -190 L42 -190 Q53 -120 50 -64 L-50 -64 Q-53 -120 -42 -190 Z" fill={COAT} />
        <path d="M4 -190 L42 -190 Q53 -120 50 -64 L4 -64 Z" fill="#000" opacity={0.08} />
        <line x1={0} y1={-186} x2={0} y2={-66} stroke="#24557A" strokeWidth={3} />
        <rect x={-38} y={-118} width={24} height={20} rx={4} fill="#28628C" />
        <rect x={14} y={-118} width={24} height={20} rx={4} fill="#28628C" />
        <rect x={-50} y={-76} width={100} height={12} rx={4} fill="#28628C" />
        {pose !== 'shh' && (
          <>
            {/* right arm */}
            <line x1={38} y1={-180} x2={right[0]} y2={right[1] + 6} stroke={COAT} strokeWidth={20} strokeLinecap="round" />
            <circle cx={right[0]} cy={right[1]} r={10} fill={RED} />
            {pose === 'phone' && <rect x={14} y={-250} width={14} height={26} rx={4} fill="#24354B" />}
          </>
        )}
        {/* scarf */}
        <rect x={-25} y={-200} width={50} height={15} rx={7.5} fill={GOLD} />
        <rect x={8} y={-192} width={13} height={46} rx={4} fill={GOLD} />
        <path d="M8 -150 v6 M12.5 -150 v6 M17 -150 v6 M21 -150 v6" stroke="#E0A92A" strokeWidth={2} />
        {/* head */}
        <circle cx={-31} cy={-226} r={7} fill={SKIN} />
        <circle cx={31} cy={-226} r={7} fill={SKIN} />
        <circle cx={0} cy={-228} r={31} fill={SKIN} />
        <path
          d="M-33 -230 Q-40 -262 -12 -266 Q-4 -278 9 -267 Q32 -272 34 -246 Q39 -236 31 -228 Q26 -250 6 -251 Q-10 -245 -24 -252 Q-29 -243 -33 -230 Z"
          fill="#6B4A34"
        />
        <path d="M-6 -268 q-4 -9 3 -14 M12 -268 q6 -8 13 -6" fill="none" stroke="#6B4A34" strokeWidth={3} strokeLinecap="round" />
        <path d="M-31 -240 q2 -6 6 -8 M30 -242 q-2 -6 -5 -8" stroke="#B9B2A8" strokeWidth={3} strokeLinecap="round" />
        <Brows cy={-243} gap={12} w={10} mood={mood} color="#5A3D2A" thick={3} />
        <Eyes cy={-228} gap={12} r={3.3} mood={mood} />
        <g fill="none" stroke={INK} strokeWidth={2.6}>
          <circle cx={-12} cy={-228} r={10} fill="#fff" fillOpacity={0.18} />
          <circle cx={12} cy={-228} r={10} fill="#fff" fillOpacity={0.18} />
          <path d="M-2 -229 h4" />
        </g>
        <path d="M-2 -220 q3 5 6 0" fill="none" stroke="#C98A65" strokeWidth={2.4} strokeLinecap="round" />
        <circle cx={-20} cy={-213} r={5} fill={CHEEK} opacity={0.35} />
        <circle cx={20} cy={-213} r={5} fill={CHEEK} opacity={0.35} />
        <Mouth cy={-210} w={6.5} mood={mood} />
        {pose === 'shh' && (
          <g>
            <polyline points="38,-180 60,-152 12,-200" fill="none" stroke={COAT} strokeWidth={20} strokeLinecap="round" strokeLinejoin="round" />
            <circle cx={8} cy={-204} r={9} fill={RED} />
            <rect x={3} y={-226} width={7} height={22} rx={3.5} fill={RED} />
          </g>
        )}
        {tied && (
          <g stroke="#B98A4E" strokeWidth={8} strokeLinecap="round" fill="none">
            <path d="M-62 -130 Q0 -116 62 -130" />
            <path d="M-62 -110 Q0 -96 62 -110" />
          </g>
        )}
      </g>
    </g>
  )
}

/* ------------------------------------------------------------------ */
/* ELINA — Nicholas's wife                                             */
/* ------------------------------------------------------------------ */

export function Elina({ mood = 'happy', pose = 'idle', ...p }: Placement & { mood?: Mood; pose?: 'idle' | 'offer' | 'wave' }) {
  const SKIN = '#F0C4A2'
  const KNIT = '#B23A48'
  const HAIR = '#E2B66C'
  const right = pose === 'offer' ? [50, -150] : pose === 'wave' ? [48, -236] : [42, -112]
  return (
    <g transform={place(p)} className={p.className}>
      <Shadow rx={44} />
      <rect x={-20} y={-30} width={14} height={20} fill="#3B3B4A" />
      <rect x={6} y={-30} width={14} height={20} fill="#3B3B4A" />
      <path d="M-26 -14 h20 v14 h-24 q-5 0 -5 -5 q0 -7 9 -9 z" fill="#6B4A34" />
      <path d="M26 -14 h-20 v14 h24 q5 0 5 -5 q0 -7 -9 -9 z" fill="#6B4A34" />
      <path d="M-28 -112 L28 -112 L40 -26 L-40 -26 Z" fill="#3B4C6B" />
      <path d="M2 -112 L28 -112 L40 -26 L2 -26 Z" fill="#000" opacity={0.08} />
      <line x1={-36} y1={-186} x2={-46} y2={-120} stroke={KNIT} strokeWidth={16} strokeLinecap="round" />
      <circle cx={-46} cy={-114} r={8} fill={SKIN} />
      <path d="M-34 -190 L34 -190 Q43 -150 37 -106 L-37 -106 Q-43 -150 -34 -190 Z" fill={KNIT} />
      <path d="M-40 -160 h80" stroke="#fff" strokeWidth={9} />
      <g fill={KNIT}>
        {[-32, -20, -8, 4, 16, 28].map((x) => (
          <path key={x} d={`M${x} -160 l4 -4 l4 4 l-4 4 z`} />
        ))}
      </g>
      <path d="M-37 -116 h74" stroke="#9A2E3B" strokeWidth={6} />
      <line x1={36} y1={-186} x2={right[0]} y2={right[1] + 6} stroke={KNIT} strokeWidth={16} strokeLinecap="round" />
      <circle cx={right[0]} cy={right[1]} r={8} fill={SKIN} />
      <rect x={-8} y={-198} width={16} height={14} fill={SKIN} />
      <path d="M-16 -190 Q0 -180 16 -190" fill="none" stroke="#F4EBDD" strokeWidth={7} strokeLinecap="round" />
      {/* hair back + bun */}
      <circle cx={0} cy={-218} r={34} fill={HAIR} />
      <circle cx={0} cy={-254} r={15} fill={HAIR} />
      <circle cx={0} cy={-214} r={29} fill={SKIN} />
      <path d="M-30 -218 Q-28 -246 0 -246 Q26 -246 31 -222 Q14 -240 -6 -232 Q-18 -228 -30 -218 Z" fill={HAIR} />
      <circle cx={-29} cy={-208} r={3} fill={GOLD} />
      <circle cx={29} cy={-208} r={3} fill={GOLD} />
      <Brows cy={-226} gap={11} w={8} mood={mood} color="#B98A45" />
      <Eyes cy={-215} gap={11} r={3.8} mood={mood} />
      <circle cx={-18} cy={-205} r={5.5} fill={CHEEK} opacity={0.45} />
      <circle cx={18} cy={-205} r={5.5} fill={CHEEK} opacity={0.45} />
      <path d="M-2 -208 q2 3 4 0" fill="none" stroke="#D69A7C" strokeWidth={2.2} strokeLinecap="round" />
      <Mouth cy={-198} w={6} mood={mood} />
    </g>
  )
}

/* ------------------------------------------------------------------ */
/* POSTMASTER                                                          */
/* ------------------------------------------------------------------ */

export function Postmaster({ mood = 'happy', pose = 'idle', ...p }: Placement & { mood?: Mood; pose?: 'idle' | 'offer' }) {
  const SKIN = '#F2C29B'
  const UNIFORM = '#2D4A7A'
  return (
    <g transform={place(p)} className={p.className}>
      <Shadow rx={54} />
      <rect x={-34} y={-80} width={28} height={66} fill="#24354B" />
      <rect x={6} y={-80} width={28} height={66} fill="#24354B" />
      <rect x={-40} y={-16} width={36} height={16} rx={7} fill="#2B2B33" />
      <rect x={4} y={-16} width={36} height={16} rx={7} fill="#2B2B33" />
      <line x1={-46} y1={-178} x2={-62} y2={pose === 'offer' ? -142 : -100} stroke={UNIFORM} strokeWidth={22} strokeLinecap="round" />
      <circle cx={-63} cy={pose === 'offer' ? -136 : -94} r={10} fill={SKIN} />
      <path d="M-48 -188 L48 -188 Q66 -130 56 -74 L-56 -74 Q-66 -130 -48 -188 Z" fill={UNIFORM} />
      <path d="M-18 -188 L18 -188 L10 -110 L-10 -110 Z" fill="#CFE3F5" />
      <path d="M-5 -186 L5 -186 L7 -140 L0 -132 L-7 -140 Z" fill={RED} />
      <path d="M-18 -188 L-4 -150 L-30 -120 M18 -188 L4 -150 L30 -120" fill="none" stroke="#24406B" strokeWidth={4} />
      {[-150, -128, -106].map((y) => (
        <circle key={y} cx={-22} cy={y + 10} r={3.5} fill={GOLD} />
      ))}
      <line
        x1={46}
        y1={-178}
        x2={pose === 'offer' ? 66 : 62}
        y2={pose === 'offer' ? -142 : -100}
        stroke={UNIFORM}
        strokeWidth={22}
        strokeLinecap="round"
      />
      <circle cx={pose === 'offer' ? 67 : 63} cy={pose === 'offer' ? -136 : -94} r={10} fill={SKIN} />
      <circle cx={-32} cy={-214} r={8} fill={SKIN} />
      <circle cx={32} cy={-214} r={8} fill={SKIN} />
      <circle cx={0} cy={-214} r={32} fill={SKIN} />
      <path d="M-34 -222 q-8 12 0 22 q4 -10 4 -22 z M34 -222 q8 12 0 22 q-4 -10 -4 -22 z" fill="#E8EEF4" />
      <Brows cy={-226} gap={12} w={11} mood={mood} color="#C9D3DD" thick={5} />
      <Eyes cy={-215} gap={12} r={3.8} mood={mood} />
      <circle cx={-21} cy={-203} r={6} fill={CHEEK} opacity={0.5} />
      <circle cx={21} cy={-203} r={6} fill={CHEEK} opacity={0.5} />
      <circle cx={0} cy={-206} r={6} fill="#E9A585" />
      <path d="M-22 -196 Q-12 -204 0 -198 Q12 -204 22 -196 Q18 -186 0 -190 Q-18 -186 -22 -196 Z" fill="#E8EEF4" />
      <Mouth cy={-186} w={5} mood={mood} />
      {/* postal cap */}
      <path d="M-34 -236 Q-36 -262 0 -264 Q36 -262 34 -236 Z" fill={UNIFORM} />
      <path d="M-36 -238 h72 l6 8 h-84 z" fill="#1E3456" />
      <circle cx={0} cy={-250} r={8} fill={GOLD} />
      <path d="M-4 -250 q4 -5 8 0 q-4 4 -8 0" fill={UNIFORM} />
    </g>
  )
}

/* ------------------------------------------------------------------ */
/* THE THIEVES                                                         */
/* ------------------------------------------------------------------ */

export function ThiefBoss({
  mood = 'sly',
  pose = 'idle',
  back = false,
  ...p
}: Placement & { mood?: Mood; pose?: 'idle' | 'carry' | 'grab'; back?: boolean }) {
  const SKIN = '#D9A57E'
  const COAT = '#5B3F8C'
  const armY = pose === 'carry' ? -166 : pose === 'grab' ? -208 : -112
  return (
    <g transform={place(p)} className={p.className}>
      <Shadow rx={40} />
      <rect x={-20} y={-110} width={15} height={96} fill="#4A4A58" />
      <rect x={5} y={-110} width={15} height={96} fill="#4A4A58" />
      <path d="M-5 -16 V0 H-32 Q-40 0 -36 -8 Q-30 -16 -20 -16 Z" fill="#2B2B33" />
      <path d="M5 -16 V0 H32 Q40 0 36 -8 Q30 -16 20 -16 Z" fill="#2B2B33" />
      <line x1={-26} y1={-200} x2={-40} y2={armY} stroke={COAT} strokeWidth={14} strokeLinecap="round" />
      <circle cx={-40} cy={armY + 6} r={8} fill="#2B2B33" />
      <path d="M-28 -210 L28 -210 Q36 -150 34 -92 L-34 -92 Q-36 -150 -28 -210 Z" fill={COAT} />
      <path d="M2 -210 L28 -210 Q36 -150 34 -92 L2 -92 Z" fill="#000" opacity={0.1} />
      <path d="M-24 -212 L-8 -176 L0 -206 L8 -176 L24 -212 Z" fill="#46306E" />
      <rect x={-34} y={-140} width={68} height={8} fill="#2B2B33" />
      <line x1={26} y1={-200} x2={40} y2={armY} stroke={COAT} strokeWidth={14} strokeLinecap="round" />
      <circle cx={40} cy={armY + 6} r={8} fill="#2B2B33" />
      <ellipse cx={0} cy={-248} rx={25} ry={32} fill={SKIN} />
      <path d="M-26 -256 Q-28 -292 0 -294 Q28 -292 26 -256 Z" fill="#2B2B33" />
      <rect x={-28} y={-262} width={56} height={11} rx={5} fill="#3A3A46" />
      <circle cx={0} cy={-296} r={6} fill="#3A3A46" />
      {back ? (
        <path d="M-25 -250 Q-26 -222 0 -216 Q26 -222 25 -250 Z" fill="#3A2A20" />
      ) : (
        <>
          {mood === 'surprised' ? (
            <Brows cy={-246} gap={10} w={9} mood="surprised" />
          ) : (
            <g stroke={INK} strokeWidth={3} strokeLinecap="round">
              <path d="M-16 -244 L-5 -242" />
              <path d="M5 -246 L16 -250" />
            </g>
          )}
          <Eyes cy={-236} gap={10} r={3.6} mood={mood === 'surprised' ? 'surprised' : 'sly'} />
          <path d="M0 -236 Q10 -222 2 -218" fill="none" stroke="#B9805A" strokeWidth={3} strokeLinecap="round" />
          <path d="M-14 -212 Q-6 -218 0 -214 Q6 -218 14 -212" fill="none" stroke="#3A2A20" strokeWidth={3} strokeLinecap="round" />
          <Mouth cx={2} cy={-206} w={7} mood={mood === 'surprised' ? 'surprised' : 'sly'} />
        </>
      )}
    </g>
  )
}

export function ThiefSidekick({
  mood = 'happy',
  pose = 'idle',
  back = false,
  ...p
}: Placement & { mood?: Mood; pose?: 'idle' | 'carry' | 'grab'; back?: boolean }) {
  const SKIN = '#C68B63'
  const JACKET = '#D9A13B'
  const armY = pose === 'carry' ? -128 : pose === 'grab' ? -160 : -70
  return (
    <g transform={place(p)} className={p.className}>
      <Shadow rx={46} />
      <rect x={-28} y={-56} width={22} height={42} fill="#6B4A34" />
      <rect x={6} y={-56} width={22} height={42} fill="#6B4A34" />
      <rect x={-34} y={-16} width={30} height={16} rx={7} fill="#2B2B33" />
      <rect x={4} y={-16} width={30} height={16} rx={7} fill="#2B2B33" />
      <line x1={-44} y1={-124} x2={-56} y2={armY} stroke={JACKET} strokeWidth={17} strokeLinecap="round" />
      <circle cx={-57} cy={armY + 6} r={9} fill={SKIN} />
      <ellipse cx={0} cy={-100} rx={50} ry={52} fill={JACKET} />
      <path d="M0 -150 A50 52 0 0 1 0 -48 Z" fill="#000" opacity={0.08} />
      <line x1={0} y1={-148} x2={0} y2={-52} stroke="#B9822A" strokeWidth={3} />
      <rect x={-50} y={-64} width={100} height={10} rx={5} fill="#B9822A" />
      <line x1={44} y1={-124} x2={56} y2={armY} stroke={JACKET} strokeWidth={17} strokeLinecap="round" />
      <circle cx={57} cy={armY + 6} r={9} fill={SKIN} />
      <circle cx={0} cy={-172} r={30} fill={SKIN} />
      {back ? (
        <path d="M-30 -176 Q-28 -150 0 -144 Q28 -150 30 -176 Z" fill="#5B3A22" />
      ) : (
        <>
          <g fill="#8A5E44" opacity={0.6}>
            {[
              [-12, -156],
              [-6, -152],
              [0, -150],
              [6, -152],
              [12, -156],
              [-16, -160],
              [16, -160],
            ].map(([cx, cy]) => (
              <circle key={`${cx}${cy}`} cx={cx} cy={cy} r={1.4} />
            ))}
          </g>
          <Brows cy={-184} gap={11} w={12} mood={mood} color="#3A2A20" thick={5} />
          <Eyes cy={-174} gap={11} r={4} mood={mood} />
          <circle cx={0} cy={-166} r={6} fill="#D9705A" />
          {mood === 'surprised' ? (
            <Mouth cy={-154} w={7} mood="surprised" />
          ) : (
            <g>
              <path d="M-13 -158 Q0 -142 13 -158 Z" fill="#7A2A2A" />
              <rect x={-6} y={-158} width={5} height={5} fill="#fff" />
              <rect x={1.5} y={-158} width={5} height={5} fill="#fff" />
            </g>
          )}
        </>
      )}
      <path d="M-31 -182 Q-30 -206 2 -206 Q32 -204 32 -184 Z" fill="#7A5230" />
      <path d="M-6 -186 Q18 -190 46 -180 Q44 -174 30 -176 Q10 -180 -6 -180 Z" fill="#634224" />
    </g>
  )
}

/* ------------------------------------------------------------------ */
/* THE DETECTIVE (the player)                                          */
/* ------------------------------------------------------------------ */

export function Detective({ mood = 'happy', glass = true, ...p }: Placement & { mood?: Mood; glass?: boolean }) {
  const SKIN = '#B9805A'
  const COAT = '#C9A36B'
  return (
    <g transform={place(p)} className={p.className}>
      <Shadow rx={44} />
      <rect x={-24} y={-70} width={18} height={56} fill="#4A3A30" />
      <rect x={6} y={-70} width={18} height={56} fill="#4A3A30" />
      <rect x={-30} y={-16} width={26} height={16} rx={7} fill="#3A2A20" />
      <rect x={4} y={-16} width={26} height={16} rx={7} fill="#3A2A20" />
      <line x1={-34} y1={-176} x2={-46} y2={-104} stroke={COAT} strokeWidth={17} strokeLinecap="round" />
      <circle cx={-47} cy={-98} r={8.5} fill={SKIN} />
      <path d="M-38 -186 L38 -186 Q48 -120 46 -60 L-46 -60 Q-48 -120 -38 -186 Z" fill={COAT} />
      <path d="M2 -186 L38 -186 Q48 -120 46 -60 L2 -60 Z" fill="#000" opacity={0.08} />
      <path d="M-22 -186 L0 -140 L22 -186" fill="none" stroke="#A9844E" strokeWidth={5} />
      <rect x={-46} y={-122} width={92} height={10} fill="#8C6A3C" />
      <rect x={-6} y={-124} width={12} height={14} rx={2} fill="none" stroke={GOLD} strokeWidth={2.5} />
      {[-104, -88].map((y) => (
        <g key={y}>
          <circle cx={-14} cy={y} r={3} fill="#6B4A34" />
          <circle cx={14} cy={y} r={3} fill="#6B4A34" />
        </g>
      ))}
      <line x1={34} y1={-176} x2={glass ? 52 : 46} y2={glass ? -150 : -104} stroke={COAT} strokeWidth={17} strokeLinecap="round" />
      <circle cx={glass ? 54 : 47} cy={glass ? -146 : -98} r={8.5} fill={SKIN} />
      {glass && (
        <g>
          <line x1={56} y1={-150} x2={66} y2={-178} stroke="#6B4A34" strokeWidth={6} strokeLinecap="round" />
          <circle cx={72} cy={-196} r={17} fill="#CFEAF9" fillOpacity={0.6} stroke="#6B4A34" strokeWidth={5} />
        </g>
      )}
      <rect x={-22} y={-198} width={44} height={16} rx={8} fill={RED} />
      <rect x={-20} y={-186} width={12} height={36} rx={4} fill={RED} />
      <circle cx={0} cy={-222} r={28} fill={SKIN} />
      <path d="M-28 -226 Q-30 -244 -14 -246 L-14 -236 Q-22 -234 -26 -222 Z M28 -226 Q30 -244 14 -246 L14 -236 Q22 -234 26 -222 Z" fill="#2B211C" />
      <Brows cy={-230} gap={10} w={9} mood={mood} color="#2B211C" thick={3} />
      <Eyes cy={-219} gap={10} r={3.8} mood={mood} />
      <circle cx={-17} cy={-209} r={5} fill={CHEEK} opacity={0.3} />
      <circle cx={17} cy={-209} r={5} fill={CHEEK} opacity={0.3} />
      <Mouth cy={-204} w={6} mood={mood} />
      {/* hat */}
      <path d="M-30 -240 Q-30 -272 0 -274 Q30 -272 30 -240 Z" fill="#7A5230" />
      <rect x={-29} y={-248} width={58} height={8} fill="#4A3020" />
      <ellipse cx={0} cy={-240} rx={42} ry={8} fill="#6B4426" />
    </g>
  )
}

/* ------------------------------------------------------------------ */
/* CHILD (family photograph)                                           */
/* ------------------------------------------------------------------ */

export function Child({ mood = 'happy', ...p }: Placement & { mood?: Mood }) {
  const SKIN = '#F0C4A2'
  const SUIT = '#3E7CC9'
  return (
    <g transform={place(p)} className={p.className}>
      <Shadow rx={30} />
      <rect x={-18} y={-44} width={14} height={34} rx={6} fill={SUIT} />
      <rect x={4} y={-44} width={14} height={34} rx={6} fill={SUIT} />
      <rect x={-22} y={-12} width={20} height={12} rx={5} fill="#2B2B33" />
      <rect x={2} y={-12} width={20} height={12} rx={5} fill="#2B2B33" />
      <line x1={-20} y1={-92} x2={-34} y2={-128} stroke={SUIT} strokeWidth={12} strokeLinecap="round" />
      <circle cx={-35} cy={-133} r={7} fill={RED} />
      <rect x={-24} y={-98} width={48} height={60} rx={20} fill={SUIT} />
      <line x1={0} y1={-96} x2={0} y2={-42} stroke="#2F64A8" strokeWidth={2.5} />
      <line x1={20} y1={-92} x2={30} y2={-58} stroke={SUIT} strokeWidth={12} strokeLinecap="round" />
      <circle cx={31} cy={-54} r={7} fill={RED} />
      <rect x={-16} y={-104} width={32} height={10} rx={5} fill={RED} />
      <circle cx={0} cy={-124} r={22} fill={SKIN} />
      <Eyes cy={-124} gap={8} r={3.2} mood={mood} />
      <circle cx={-13} cy={-116} r={4} fill={CHEEK} opacity={0.5} />
      <circle cx={13} cy={-116} r={4} fill={CHEEK} opacity={0.5} />
      <Mouth cy={-114} w={5} mood={mood} />
      <path d="M-23 -128 Q-24 -152 0 -152 Q24 -152 23 -128 Z" fill="#fff" />
      <rect x={-24} y={-136} width={48} height={9} rx={4.5} fill="#DCE6F0" />
      <circle cx={0} cy={-156} r={7} fill={RED} />
    </g>
  )
}

/* ------------------------------------------------------------------ */
/* PORTRAITS for the dialogue box                                      */
/* ------------------------------------------------------------------ */

export type Speaker = 'pip' | 'santa' | 'nicholas' | 'elina' | 'postmaster'

const PORTRAIT: Record<Speaker, { box: string; bg: string; name: string; draw: (mood?: Mood) => ReactNode }> = {
  pip: { box: '-58 -196 116 116', bg: '#CDEFDD', name: 'Pip', draw: (mood) => <Pip mood={mood} /> },
  santa: { box: '-74 -282 148 148', bg: '#FDE3E0', name: 'Santa', draw: (mood) => <Santa mood={mood} /> },
  nicholas: { box: '-52 -284 104 104', bg: '#DCEFFB', name: 'Professor Nicholas', draw: (mood) => <Nicholas mood={mood} /> },
  elina: { box: '-52 -276 104 104', bg: '#FBE3E6', name: 'Elina', draw: (mood) => <Elina mood={mood} /> },
  postmaster: { box: '-56 -272 112 112', bg: '#E1E9F7', name: 'Postmaster', draw: (mood) => <Postmaster mood={mood} /> },
}

export function speakerName(s: Speaker) {
  return PORTRAIT[s].name
}

export function Portrait({ who, size = 64, mood }: { who: Speaker; size?: number; mood?: Mood }) {
  const cfg = PORTRAIT[who]
  return (
    <svg width={size} height={size} viewBox={cfg.box} style={{ borderRadius: '50%', background: cfg.bg, flexShrink: 0 }} aria-hidden>
      {cfg.draw(mood)}
    </svg>
  )
}
