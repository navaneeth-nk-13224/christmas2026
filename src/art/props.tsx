import type { CSSProperties, ReactNode } from 'react'

export const C = {
  red: '#EA4335',
  redDark: '#C5321F',
  green: '#18865B',
  greenDark: '#0F6643',
  snow: '#F8FBFF',
  winter: '#8BCDF2',
  gold: '#F9C846',
  navy: '#24354B',
  navyDeep: '#17233A',
  wood: '#A66A43',
  woodDark: '#7E4E30',
  woodLight: '#C48A5E',
}

/** Deterministic pseudo-random numbers so decorations look identical on every render. */
export function rng(seed: number) {
  let a = seed >>> 0
  return () => {
    a = (a + 0x6d2b79f5) >>> 0
    let t = a
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

export function Present({
  x,
  y,
  w,
  h,
  color = C.red,
  ribbon = C.gold,
  tag = false,
}: {
  x: number
  y: number
  w: number
  h: number
  color?: string
  ribbon?: string
  tag?: boolean
}) {
  const lid = Math.max(8, h * 0.18)
  return (
    <g>
      <rect x={x} y={y + lid * 0.6} width={w} height={h - lid * 0.6} rx={3} fill={color} />
      <rect x={x + w * 0.55} y={y + lid * 0.6} width={w * 0.45} height={h - lid * 0.6} fill="#000" opacity={0.08} />
      <rect x={x - 3} y={y} width={w + 6} height={lid} rx={3} fill={color} />
      <rect x={x - 3} y={y + lid - 3} width={w + 6} height={3} fill="#000" opacity={0.12} />
      <rect x={x + w / 2 - w * 0.07} y={y} width={w * 0.14} height={h} fill={ribbon} />
      <path
        d={`M${x + w / 2} ${y} q${-w * 0.28} ${-h * 0.28} ${-w * 0.3} ${-h * 0.04} q${w * 0.06} ${h * 0.1} ${w * 0.3} ${h * 0.04} q${w * 0.28} ${-h * 0.28} ${w * 0.3} ${-h * 0.04} q${-w * 0.06} ${h * 0.1} ${-w * 0.3} ${h * 0.04}`}
        fill={ribbon}
      />
      {tag && (
        <g>
          <rect x={x + w * 0.1} y={y + h * 0.45} width={w * 0.3} height={h * 0.2} rx={2} fill="#fff" />
          <line x1={x + w * 0.15} y1={y + h * 0.55} x2={x + w * 0.34} y2={y + h * 0.55} stroke={C.navy} strokeWidth={1.5} />
        </g>
      )}
    </g>
  )
}

export function Tree({
  x,
  y,
  s = 1,
  color = C.green,
  snowy = false,
  lights = false,
  star = false,
}: {
  x: number
  y: number
  s?: number
  color?: string
  snowy?: boolean
  lights?: boolean
  star?: boolean
}) {
  const shade = color === C.green ? C.greenDark : '#000'
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <rect x={-9} y={-24} width={18} height={26} fill={C.woodDark} />
      <path d="M-70 -20 L0 -110 L70 -20 Z" fill={color} />
      <path d="M-56 -78 L0 -160 L56 -78 Z" fill={color} />
      <path d="M-40 -130 L0 -200 L40 -130 Z" fill={color} />
      <path d="M0 -110 L70 -20 L0 -20 Z M0 -160 L56 -78 L0 -78 Z M0 -200 L40 -130 L0 -130 Z" fill={shade} opacity={0.16} />
      {snowy && (
        <g fill="#fff">
          <path d="M-70 -20 Q-35 -34 0 -24 Q35 -34 70 -20 L60 -26 Q30 -38 0 -30 Q-30 -38 -60 -26 Z" />
          <path d="M-22 -182 L0 -200 L22 -182 Q12 -176 0 -180 Q-12 -176 -22 -182 Z" />
          <path d="M-56 -78 Q-28 -90 0 -82 Q28 -90 56 -78 L46 -84 Q22 -94 0 -88 Q-22 -94 -46 -84 Z" />
        </g>
      )}
      {lights && (
        <g>
          {[
            [-40, -36, C.red],
            [-8, -50, C.gold],
            [30, -40, '#8BCDF2'],
            [52, -30, C.red],
            [-30, -96, C.gold],
            [6, -104, C.red],
            [34, -92, '#fff'],
            [-14, -146, '#8BCDF2'],
            [16, -150, C.gold],
            [-2, -176, C.red],
          ].map(([cx, cy, fill], i) => (
            <circle key={i} cx={cx} cy={cy} r={5.5} fill={fill as string} className={['flicker', 'flicker-2', 'flicker-3'][i % 3]} />
          ))}
        </g>
      )}
      {star && <path d="M0 -224 L7 -207 L25 -206 L11 -195 L16 -178 L0 -188 L-16 -178 L-11 -195 L-25 -206 L-7 -207 Z" fill={C.gold} />}
    </g>
  )
}

export function StringLights({
  x1,
  x2,
  y,
  sag = 30,
  count = 10,
  wire = '#2B3A2E',
}: {
  x1: number
  x2: number
  y: number
  sag?: number
  count?: number
  wire?: string
}) {
  const colors = [C.red, C.gold, '#5BC0F8', C.green, '#fff']
  const pts = Array.from({ length: count }, (_, i) => {
    const t = (i + 0.5) / count
    const px = x1 + (x2 - x1) * t
    const py = y + sag * 4 * t * (1 - t)
    return [px, py] as const
  })
  return (
    <g>
      <path d={`M${x1} ${y} Q${(x1 + x2) / 2} ${y + sag * 2} ${x2} ${y}`} fill="none" stroke={wire} strokeWidth={3} />
      {pts.map(([px, py], i) => (
        <g key={i}>
          <rect x={px - 3} y={py - 1} width={6} height={6} rx={1} fill="#3A4A3E" />
          <ellipse cx={px} cy={py + 12} rx={6} ry={9} fill={colors[i % colors.length]} className={['flicker', 'flicker-2', 'flicker-3'][i % 3]} />
        </g>
      ))}
    </g>
  )
}

/** Gently falling snow, drawn inside an SVG scene (e.g. visible through a window). */
export function SvgSnow({
  x = 0,
  y = 0,
  w,
  h,
  count = 30,
  seed = 1,
  color = '#fff',
}: {
  x?: number
  y?: number
  w: number
  h: number
  count?: number
  seed?: number
  color?: string
}) {
  const r = rng(seed)
  return (
    <g style={{ pointerEvents: 'none' }}>
      {Array.from({ length: count }, (_, i) => {
        const size = 1.5 + r() * 3.5
        return (
          <circle
            key={i}
            cx={x + r() * w}
            cy={y + r() * 20}
            r={size}
            fill={color}
            opacity={0.6 + r() * 0.4}
            className="svg-flake"
            style={
              {
                '--fall': `${h}px`,
                animationDuration: `${5 + r() * 7}s`,
                animationDelay: `${-r() * 12}s`,
              } as CSSProperties
            }
          />
        )
      })}
    </g>
  )
}

export function Crate({
  x,
  y,
  w,
  h,
  open = false,
  stencil,
  dark = false,
}: {
  x: number
  y: number
  w: number
  h: number
  open?: boolean
  stencil?: string
  dark?: boolean
}) {
  const base = dark ? '#8A5A3A' : '#C48A5E'
  const plank = dark ? '#6E4529' : '#A66A43'
  return (
    <g>
      {open && (
        <g>
          <Present x={x + w * 0.1} y={y - h * 0.35} w={w * 0.32} h={h * 0.5} color={C.red} />
          <Present x={x + w * 0.48} y={y - h * 0.28} w={w * 0.36} h={h * 0.42} color={C.green} ribbon="#fff" />
        </g>
      )}
      <rect x={x} y={y} width={w} height={h} fill={base} />
      <rect x={x} y={y} width={w} height={h * 0.14} fill={plank} />
      <rect x={x} y={y + h * 0.86} width={w} height={h * 0.14} fill={plank} />
      <rect x={x} y={y} width={w * 0.1} height={h} fill={plank} />
      <rect x={x + w * 0.9} y={y} width={w * 0.1} height={h} fill={plank} />
      <path d={`M${x + w * 0.1} ${y + h * 0.86} L${x + w * 0.9} ${y + h * 0.14}`} stroke={plank} strokeWidth={w * 0.08} />
      {stencil && (
        <text
          x={x + w / 2}
          y={y + h * 0.58}
          textAnchor="middle"
          fontFamily="Special Elite, monospace"
          fontSize={h * 0.17}
          fill={dark ? '#3A2414' : '#5B3A22'}
          opacity={0.75}
        >
          {stencil}
        </text>
      )}
    </g>
  )
}

export function Reindeer({
  x,
  y,
  s = 1,
  flip = false,
  rudolph = false,
  run = false,
}: {
  x: number
  y: number
  s?: number
  flip?: boolean
  rudolph?: boolean
  run?: boolean
}) {
  const BODY = '#A66A43'
  return (
    <g transform={`translate(${x} ${y}) scale(${flip ? -s : s} ${s})`}>
      <g className={run ? 'bob' : undefined}>
        <rect x={-50} y={-50} width={10} height={50} rx={5} fill="#7E4E30" transform={run ? 'rotate(18 -45 -50)' : undefined} />
        <rect x={-34} y={-50} width={10} height={50} rx={5} fill="#7E4E30" transform={run ? 'rotate(-10 -29 -50)' : undefined} />
        <rect x={22} y={-50} width={10} height={50} rx={5} fill="#7E4E30" transform={run ? 'rotate(22 27 -50)' : undefined} />
        <rect x={38} y={-50} width={10} height={50} rx={5} fill="#7E4E30" transform={run ? 'rotate(-16 43 -50)' : undefined} />
        <ellipse cx={0} cy={-62} rx={62} ry={28} fill={BODY} />
        <ellipse cx={-6} cy={-50} rx={40} ry={12} fill="#E8D5BF" />
        <circle cx={-60} cy={-70} r={9} fill="#E8D5BF" />
        <path d="M40 -76 Q58 -110 66 -124 L84 -118 Q72 -92 62 -62 Z" fill={BODY} />
        <ellipse cx={80} cy={-128} rx={22} ry={16} fill={BODY} />
        <ellipse cx={98} cy={-122} rx={12} ry={9} fill="#8E5634" />
        <circle cx={106} cy={-123} r={rudolph ? 8 : 5} fill={rudolph ? C.red : '#3A2414'} />
        <circle cx={80} cy={-134} r={3.5} fill={C.navy} />
        <path d="M66 -138 l-12 -8 l10 -2 z" fill="#8E5634" />
        <g stroke="#6E4529" strokeWidth={5} strokeLinecap="round" fill="none">
          <path d="M74 -142 Q66 -168 74 -186 M70 -162 L58 -172 M73 -176 L86 -186" />
          <path d="M86 -142 Q92 -166 104 -178 M92 -160 L106 -160" />
        </g>
        <path d="M44 -88 Q56 -70 70 -112" fill="none" stroke={C.red} strokeWidth={7} />
        <circle cx={52} cy={-80} r={5} fill={C.gold} />
      </g>
    </g>
  )
}

export function Sleigh({ x, y, s = 1, children, flip = false }: { x: number; y: number; s?: number; children?: ReactNode; flip?: boolean }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${flip ? -s : s} ${s})`}>
      {children}
      <path d="M-120 -10 H110 Q140 -10 140 -34 Q140 -50 126 -50" fill="none" stroke={C.gold} strokeWidth={8} strokeLinecap="round" />
      <path d="M-80 -10 V-30 M60 -10 V-30" stroke={C.gold} strokeWidth={7} />
      <path d="M-130 -110 Q-140 -30 -100 -30 H90 Q120 -30 126 -70 L130 -100 Q100 -92 80 -74 H-60 Q-80 -110 -130 -110 Z" fill={C.red} />
      <path d="M-100 -30 H90 Q120 -30 126 -70 L128 -80 Q90 -50 -110 -50 Q-112 -38 -100 -30 Z" fill="#000" opacity={0.12} />
      <path d="M-122 -100 Q-126 -46 -96 -44 H88" fill="none" stroke={C.gold} strokeWidth={5} strokeLinecap="round" />
      <path d="M-40 -70 q12 -18 26 0 q12 18 26 0" fill="none" stroke={C.gold} strokeWidth={4} strokeLinecap="round" />
    </g>
  )
}

/** Side view of the North Star Logistics truck. Plate and company are SVG text so they stay crisp when zoomed. */
export function Truck({
  x,
  y,
  s = 1,
  flip = false,
  doorOpen = false,
  plate = 'NP-4827',
  company = 'NORTH STAR LOGISTICS',
  palette = 'color',
  lights = false,
  children,
}: {
  x: number
  y: number
  s?: number
  flip?: boolean
  doorOpen?: boolean
  plate?: string
  company?: string
  palette?: 'color' | 'cctv'
  lights?: boolean
  children?: ReactNode
}) {
  const cctv = palette === 'cctv'
  const BODY = cctv ? '#D8E3DA' : '#F8FBFF'
  const CAB = cctv ? '#8FA596' : '#2F6F9E'
  const DARK = cctv ? '#34423A' : '#24354B'
  const STRIPE = cctv ? '#6F8577' : C.red
  return (
    <g transform={`translate(${x} ${y}) scale(${flip ? -s : s} ${s})`}>
      {/* cargo box */}
      <rect x={-260} y={-250} width={360} height={200} rx={8} fill={BODY} />
      <rect x={-260} y={-120} width={360} height={14} fill={STRIPE} />
      <path d="M-200 -200 l8 -18 l8 18 l19 1 l-15 12 l5 18 l-17 -10 l-17 10 l5 -18 l-15 -12 z" fill={cctv ? '#6F8577' : C.gold} />
      <g style={{ transform: flip ? 'scale(-1,1)' : undefined, transformBox: 'fill-box', transformOrigin: 'center' }}>
        <text x={-60} y={-180} textAnchor="middle" fontFamily="Fredoka, sans-serif" fontWeight={700} fontSize={30} fill={DARK}>
          {company.split(' ').slice(0, 2).join(' ')}
        </text>
        <text x={-60} y={-146} textAnchor="middle" fontFamily="Fredoka, sans-serif" fontWeight={600} fontSize={22} letterSpacing={6} fill={DARK}>
          {company.split(' ').slice(2).join(' ')}
        </text>
      </g>
      {/* rear door */}
      {doorOpen ? (
        <g>
          <rect x={-262} y={-246} width={70} height={192} fill={DARK} opacity={0.85} />
          <rect x={-330} y={-250} width={70} height={196} rx={4} fill={BODY} stroke={DARK} strokeWidth={3} />
          {children}
        </g>
      ) : (
        <line x1={-250} y1={-244} x2={-250} y2={-56} stroke={DARK} strokeWidth={3} opacity={0.4} />
      )}
      {/* cab */}
      <path d="M100 -190 H170 Q196 -190 206 -160 L224 -112 Q230 -98 230 -80 V-50 H100 Z" fill={CAB} />
      <path d="M118 -176 H166 Q184 -176 190 -158 L204 -122 H118 Z" fill={cctv ? '#BCCBC0' : '#BFE3F7'} />
      <rect x={124} y={-108} width={22} height={6} rx={3} fill={DARK} />
      {lights && <ellipse cx={232} cy={-74} rx={10} ry={8} fill={C.gold} />}
      <rect x={-270} y={-58} width={500} height={14} rx={4} fill={DARK} />
      {/* rear plate */}
      <g>
        <rect x={-282} y={-104} width={84} height={30} rx={4} fill="#FFF7D6" stroke={DARK} strokeWidth={3} />
        <text
          x={-240}
          y={-82}
          textAnchor="middle"
          fontFamily="Nunito, sans-serif"
          fontWeight={800}
          fontSize={17}
          fill={DARK}
          style={{ transform: flip ? 'scale(-1,1)' : undefined, transformBox: 'fill-box', transformOrigin: 'center' }}
        >
          {plate}
        </text>
      </g>
      {/* wheels */}
      {[-180, -110, 160].map((wx) => (
        <g key={wx}>
          <circle cx={wx} cy={-40} r={32} fill={DARK} />
          <circle cx={wx} cy={-40} r={14} fill={cctv ? '#A7B9AC' : '#B9C6D3'} />
        </g>
      ))}
    </g>
  )
}

/** Simple train used in the journey to Rovaniemi. */
export function Train({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      {[0, 1].map((i) => (
        <g key={i} transform={`translate(${-i * 230} 0)`}>
          <rect x={-100} y={-120} width={210} height={100} rx={14} fill={i === 0 ? C.red : C.green} />
          <rect x={-100} y={-50} width={210} height={10} fill={C.gold} />
          {[-80, -20, 40].map((wx) => (
            <rect key={wx} x={wx} y={-104} width={40} height={36} rx={6} fill="#FFE9A8" />
          ))}
          <circle cx={-60} cy={-18} r={16} fill={C.navy} />
          <circle cx={70} cy={-18} r={16} fill={C.navy} />
        </g>
      ))}
      <path d="M110 -120 H150 Q190 -120 200 -80 L206 -20 H110 Z" fill={C.red} />
      <rect x={130} y={-150} width={24} height={34} fill={C.navy} />
      <rect x={126} y={-156} width={32} height={10} rx={3} fill={C.navy} />
      <circle cx={180} cy={-18} r={16} fill={C.navy} />
      <circle cx={196} cy={-60} r={8} fill={C.gold} />
    </g>
  )
}

export function Plane({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <path d="M-150 -20 Q-150 -50 -110 -50 H110 Q160 -50 170 -20 Q160 6 110 6 H-110 Q-150 6 -150 -20 Z" fill={C.snow} />
      <path d="M-150 -20 Q-150 -2 -120 6 H110 Q160 6 170 -20 Z" fill="#DCE6F0" />
      <path d="M-120 -48 L-160 -110 H-126 L-80 -48 Z" fill={C.red} />
      <path d="M-30 -10 L-80 60 H-44 L40 -10 Z" fill="#C9D6E3" />
      {[-80, -50, -20, 10, 40, 70].map((wx) => (
        <circle key={wx} cx={wx} cy={-28} r={8} fill="#7FB6DD" />
      ))}
      <path d="M128 -42 Q150 -40 158 -26 H126 Z" fill="#7FB6DD" />
      <rect x={-150} y={-24} width={300} height={6} fill={C.red} />
      <circle cx={176} cy={-20} r={6} fill={C.navy} />
      <rect x={172} y={-56} width={8} height={70} rx={4} fill={C.navy} opacity={0.4} className="blink" />
    </g>
  )
}

export function Snowmobile({ x, y, s = 1, riders }: { x: number; y: number; s?: number; riders?: ReactNode }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      {riders}
      <path d="M-120 -8 H110 Q140 -8 146 -30" fill="none" stroke={C.navy} strokeWidth={8} strokeLinecap="round" />
      <path d="M-110 -70 H40 Q90 -80 120 -50 L130 -30 H-100 Q-120 -30 -110 -70 Z" fill={C.red} />
      <path d="M40 -70 L70 -110 H86 L60 -66 Z" fill="#BFE3F7" />
      <rect x={-100} y={-36} width={170} height={22} rx={11} fill={C.navy} />
      {[-80, -40, 0, 40].map((wx) => (
        <circle key={wx} cx={wx} cy={-25} r={7} fill="#4A5C74" />
      ))}
      <circle cx={126} cy={-52} r={7} fill={C.gold} />
    </g>
  )
}

export function Van({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <path d="M-140 -40 V-130 Q-140 -150 -120 -150 H70 Q100 -150 120 -110 L146 -70 V-40 Z" fill={C.green} />
      <path d="M78 -138 Q96 -138 108 -112 L124 -84 H78 Z" fill="#BFE3F7" />
      <rect x={-120} y={-130} width={70} height={46} rx={6} fill="#BFE3F7" />
      <rect x={-140} y={-74} width={286} height={10} fill={C.red} />
      <circle cx={-80} cy={-38} r={24} fill={C.navy} />
      <circle cx={90} cy={-38} r={24} fill={C.navy} />
      <circle cx={-80} cy={-38} r={10} fill="#B9C6D3" />
      <circle cx={90} cy={-38} r={10} fill="#B9C6D3" />
      <ellipse cx={146} cy={-62} rx={6} ry={8} fill={C.gold} />
    </g>
  )
}

export function Moon({ x, y, r = 50 }: { x: number; y: number; r?: number }) {
  return (
    <g>
      <circle cx={x} cy={y} r={r * 2.1} fill="#FFF6D8" opacity={0.03} />
      <circle cx={x} cy={y} r={r * 1.5} fill="#FFF6D8" opacity={0.05} />
      <circle cx={x} cy={y} r={r} fill="#FFF3C4" />
      <circle cx={x - r * 0.3} cy={y - r * 0.2} r={r * 0.16} fill="#F1E2A6" />
      <circle cx={x + r * 0.25} cy={y + r * 0.3} r={r * 0.11} fill="#F1E2A6" />
    </g>
  )
}

export function Stars({ w, h, count = 40, seed = 7 }: { w: number; h: number; count?: number; seed?: number }) {
  const r = rng(seed)
  return (
    <g>
      {Array.from({ length: count }, (_, i) => (
        <circle
          key={i}
          cx={r() * w}
          cy={r() * h}
          r={0.8 + r() * 2}
          fill="#fff"
          className="twinkle"
          style={{ animationDelay: `${-r() * 3}s`, animationDuration: `${1.8 + r() * 2.5}s` }}
        />
      ))}
    </g>
  )
}

export function House({
  x,
  y,
  w = 160,
  h = 120,
  color = C.red,
  lit = true,
  roof = '#fff',
}: {
  x: number
  y: number
  w?: number
  h?: number
  color?: string
  lit?: boolean
  roof?: string
}) {
  return (
    <g>
      <rect x={x} y={y - h} width={w} height={h} fill={color} />
      <path d={`M${x - 14} ${y - h + 4} L${x + w / 2} ${y - h - w * 0.45} L${x + w + 14} ${y - h + 4} Z`} fill={roof} />
      <rect x={x + w * 0.7} y={y - h - w * 0.42} width={w * 0.14} height={w * 0.3} fill="#7E4E30" />
      <rect
        x={x + w * 0.16}
        y={y - h * 0.72}
        width={w * 0.24}
        height={h * 0.3}
        rx={3}
        fill={lit ? '#FFE08A' : '#3A4A60'}
        className={lit ? 'flicker-2' : undefined}
      />
      <rect x={x + w * 0.58} y={y - h * 0.72} width={w * 0.24} height={h * 0.3} rx={3} fill={lit ? '#FFE08A' : '#3A4A60'} />
      <rect x={x + w * 0.4} y={y - h * 0.38} width={w * 0.2} height={h * 0.38} rx={2} fill="#5B3A22" />
    </g>
  )
}

/** Rounded hill/snowbank. */
export function Hill({ d, fill = '#fff' }: { d: string; fill?: string }) {
  return <path d={d} fill={fill} />
}

/** Tiled floor drawn in one-point perspective, vanishing toward (vx, horizon). */
export function PerspectiveFloor({
  top,
  fill,
  line,
  vx = 800,
  horizon = 300,
  columns = 14,
  rows = 6,
}: {
  top: number
  fill: string
  line: string
  vx?: number
  horizon?: number
  columns?: number
  rows?: number
}) {
  const bottom = 900
  const spread = 3200
  const xAt = (i: number) => vx - spread / 2 + (spread / columns) * i
  return (
    <g>
      <rect y={top} width={1600} height={bottom - top} fill={fill} />
      {Array.from({ length: columns + 1 }, (_, i) => {
        const xb = xAt(i)
        // Where this ray from the vanishing point crosses the top edge of the floor.
        const t = (top - horizon) / (bottom - horizon)
        const xt = vx + (xb - vx) * t
        return <line key={`c${i}`} x1={xt} y1={top} x2={xb} y2={bottom} stroke={line} strokeWidth={2} />
      })}
      {Array.from({ length: rows }, (_, j) => {
        const k = (j + 1) / (rows + 1)
        const y = top + (bottom - top) * k * k
        return <line key={`r${j}`} x1={0} y1={y} x2={1600} y2={y} stroke={line} strokeWidth={2} />
      })}
    </g>
  )
}

/** Soft dark edges that pull the eye toward the middle of a scene. */
export function Vignette({ id, strength = 0.35 }: { id: string; strength?: number }) {
  return (
    <g style={{ pointerEvents: 'none' }}>
      <defs>
        <radialGradient id={id} cx="0.5" cy="0.45" r="0.75">
          <stop offset="0.55" stopColor="#0b1626" stopOpacity={0} />
          <stop offset="1" stopColor="#0b1626" stopOpacity={strength} />
        </radialGradient>
      </defs>
      <rect width={1600} height={900} fill={`url(#${id})`} />
    </g>
  )
}
