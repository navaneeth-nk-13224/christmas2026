import { motion } from 'framer-motion'
import { useEffect, useLayoutEffect, useMemo, useRef, useState, type PointerEvent } from 'react'
import { C, rng } from '../art/props'
import { playSfx } from '../audio/sound'
import { usePuzzleState } from '../state/progress'

const TW = 600
const TH = 260
const SNAP = 34

type Pt = [number, number]
type LayoutName = 'wide' | 'tall'

/** Wide boards scatter the pieces around the ticket; tall boards (phones) stack them above and below it. */
const LAYOUTS: Record<LayoutName, { w: number; h: number; slot: { x: number; y: number }; spots: Pt[] }> = {
  wide: {
    w: 1000,
    h: 720,
    slot: { x: 200, y: 230 },
    spots: [
      [10, 18],
      [250, 30],
      [500, 12],
      [748, 26],
      [16, 534],
      [262, 552],
      [508, 528],
      [752, 546],
    ],
  },
  tall: {
    w: 640,
    h: 1060,
    slot: { x: 20, y: 400 },
    spots: [
      [0, 16],
      [330, 24],
      [10, 204],
      [324, 214],
      [0, 690],
      [330, 700],
      [10, 878],
      [324, 886],
    ],
  },
}

/* ---------- The ticket itself (SVG so all text is crisp) ---------- */

export function TicketArt() {
  return (
    <g>
      <rect width={TW} height={TH} rx={14} fill="#FFF8EA" />
      <rect width={TW} height={TH} rx={14} fill="none" stroke="#E8D9BC" strokeWidth={3} />
      <rect x={0} y={0} width={TW} height={58} rx={14} fill={C.red} />
      <rect x={0} y={40} width={TW} height={18} fill={C.red} />
      <text x={24} y={38} fontFamily="Fredoka, sans-serif" fontWeight={700} fontSize={27} fill="#fff" letterSpacing={2}>
        NORTH POLE EXPRESS
      </text>
      <text x={584} y={35} fontFamily="Nunito, sans-serif" fontWeight={800} fontSize={12} fill="#FFE3DF" textAnchor="end" letterSpacing={1.2}>
        REINDEER RAIL · ONE WAY
      </text>
      <g fontFamily="Nunito, sans-serif" fill={C.navy}>
        <text x={24} y={88} fontSize={12} fontWeight={800} opacity={0.55} letterSpacing={1.5}>
          PASSENGER
        </text>
        <text x={24} y={108} fontSize={18} fontWeight={800}>
          S. CLAUS
        </text>
        <text x={210} y={88} fontSize={12} fontWeight={800} opacity={0.55} letterSpacing={1.5}>
          FROM
        </text>
        <text x={210} y={108} fontSize={18} fontWeight={800}>
          NORTH POLE WORKSHOP
        </text>
        <text x={24} y={146} fontSize={14} fontWeight={800} opacity={0.55} letterSpacing={1.5}>
          DESTINATION:
        </text>
        <text x={24} y={180} fontSize={31} fontWeight={800} fontFamily="Fredoka, sans-serif" fill={C.redDark} letterSpacing={0.5}>
          ROVANIEMI, FINLAND
        </text>
        <path d="M30 196 a7 7 0 1 1 0.1 0 M30 212 l-6 -12 h12 z" fill={C.green} />
        <text x={44} y={208} fontSize={17} fontWeight={800} fill={C.green} letterSpacing={1}>
          SANTA CLAUS POST OFFICE
        </text>
        <text x={24} y={242} fontSize={13} fontWeight={700} opacity={0.65}>
          DEPARTS 19:40 · CAR 3 · SEAT 12
        </text>
      </g>
      <line x1={466} y1={66} x2={466} y2={TH - 10} stroke="#D9C7A3" strokeWidth={3} strokeDasharray="8 7" />
      <g fontFamily="Nunito, sans-serif" fill={C.navy}>
        <text x={533} y={92} textAnchor="middle" fontSize={14} fontWeight={800} letterSpacing={2}>
          ADMIT ONE
        </text>
        {Array.from({ length: 22 }, (_, i) => (
          <rect key={i} x={490 + i * 4} y={108} width={i % 3 === 0 ? 3 : 1.6} height={70} fill={C.navy} />
        ))}
        <text x={533} y={200} textAnchor="middle" fontSize={13} fontWeight={700} opacity={0.6}>
          No. 1224
        </text>
        <circle cx={533} cy={230} r={14} fill="none" stroke={C.red} strokeWidth={2.5} opacity={0.7} />
        <path d="M526 230 l5 5 l9 -10" fill="none" stroke={C.red} strokeWidth={2.5} opacity={0.7} />
      </g>
    </g>
  )
}

/* ---------- Six irregular torn pieces ---------- */

function jagged(a: Pt, b: Pt, seed: number, amp: number): Pt[] {
  const r = rng(seed)
  const n = 6
  const pts: Pt[] = []
  const dx = b[0] - a[0]
  const dy = b[1] - a[1]
  const len = Math.hypot(dx, dy)
  const nx = -dy / len
  const ny = dx / len
  for (let i = 1; i < n; i++) {
    const t = i / n + (r() - 0.5) * 0.08
    const off = (r() - 0.5) * 2 * amp
    pts.push([a[0] + dx * t + nx * off, a[1] + dy * t + ny * off])
  }
  return pts
}

function buildPieces() {
  // Grid nodes (5 columns × 3 rows → 8 pieces). Inner nodes are nudged so every piece has a different shape.
  const NODES: Pt[][] = [
    [
      [0, 0],
      [146, 0],
      [318, 0],
      [452, 0],
      [TW, 0],
    ],
    [
      [0, 142],
      [156, 112],
      [298, 150],
      [462, 120],
      [TW, 134],
    ],
    [
      [0, TH],
      [138, TH],
      [306, TH],
      [446, TH],
      [TW, TH],
    ],
  ]
  const cols = NODES[0].length - 1
  const node = (c: number, r: number): Pt => NODES[r][c]
  // Horizontal edge between node(c,r) and node(c+1,r); vertical edge between node(c,r) and node(c,r+1).
  const hEdge = (c: number, r: number): Pt[] => {
    const a = node(c, r)
    const b = node(c + 1, r)
    return r === 1 ? [a, ...jagged(a, b, 100 + c, 13), b] : [a, b]
  }
  const vEdge = (c: number, r: number): Pt[] => {
    const a = node(c, r)
    const b = node(c, r + 1)
    return c > 0 && c < cols ? [a, ...jagged(a, b, 200 + c * 10 + r, 14), b] : [a, b]
  }
  const pieces: { poly: Pt[]; bbox: { x: number; y: number; w: number; h: number } }[] = []
  for (let r = 0; r < 2; r++) {
    for (let c = 0; c < cols; c++) {
      const top = hEdge(c, r)
      const right = vEdge(c + 1, r)
      const bottom = hEdge(c, r + 1).reverse()
      const left = vEdge(c, r).reverse()
      const poly = [...top, ...right.slice(1), ...bottom.slice(1), ...left.slice(1, -1)]
      const minX = Math.min(...poly.map((p) => p[0]))
      const maxX = Math.max(...poly.map((p) => p[0]))
      const minY = Math.min(...poly.map((p) => p[1]))
      const maxY = Math.max(...poly.map((p) => p[1]))
      pieces.push({ poly, bbox: { x: minX, y: minY, w: maxX - minX, h: maxY - minY } })
    }
  }
  return pieces
}

interface TicketState {
  pos: Pt[]
  placed: boolean[]
  rot: number[]
  layout?: LayoutName
}

type Pieces = ReturnType<typeof buildPieces>

const spotFor = (p: Pieces[number], [sx, sy]: Pt, jitter = true): Pt => [
  sx + (jitter ? (Math.random() - 0.5) * 30 : 0) + (200 - p.bbox.w) / 2,
  sy + (jitter ? (Math.random() - 0.5) * 20 : 0),
]

function scatter(pieces: Pieces, layout: LayoutName): TicketState {
  const { spots } = LAYOUTS[layout]
  const order = [...spots.keys()].sort(() => Math.random() - 0.5)
  return {
    pos: pieces.map((p, i) => spotFor(p, spots[order[i]])),
    placed: pieces.map(() => false),
    rot: pieces.map(() => Math.round((Math.random() - 0.5) * 24)),
    layout,
  }
}

/** Moves a saved arrangement onto another board shape, keeping placed pieces placed. */
function relayout(state: TicketState, pieces: Pieces, layout: LayoutName): TicketState {
  const { slot, spots } = LAYOUTS[layout]
  let k = 0
  return {
    ...state,
    layout,
    pos: pieces.map((p, i) => (state.placed[i] ? [slot.x + p.bbox.x, slot.y + p.bbox.y] : spotFor(p, spots[k++ % spots.length], false))),
  }
}

export function TicketPuzzle({ onSolved }: { onSolved: () => void }) {
  const pieces = useMemo(() => buildPieces(), [])
  const [stored, setSaved] = usePuzzleState<TicketState>('ticket', () => scatter(pieces, 'wide'))
  // A save from an older version may have a different number of pieces: start that puzzle afresh.
  const [state, setState] = useState<TicketState>(() => (stored.pos.length === pieces.length ? stored : scatter(pieces, 'wide')))
  const stateRef = useRef(state)
  useEffect(() => {
    stateRef.current = state
  })
  const L = LAYOUTS[state.layout ?? 'wide']
  const [drag, setDrag] = useState<{ i: number; dx: number; dy: number } | null>(null)
  const [top, setTop] = useState<number[]>(() => pieces.map((_, i) => i))
  const wrap = useRef<HTMLDivElement>(null)
  const [scale, setScale] = useState(1)
  const solved = state.placed.every(Boolean)
  const solvedOnce = useRef(false)

  useLayoutEffect(() => {
    const el = wrap.current
    if (!el) return
    const ro = new ResizeObserver(([e]) => {
      const width = e.contentRect.width
      const want: LayoutName = width < 640 ? 'tall' : 'wide'
      const current = stateRef.current
      if ((current.layout ?? 'wide') !== want) {
        const next = relayout(current, pieces, want)
        stateRef.current = next
        setState(next)
        setSaved(next)
      }
      setScale(Math.min(1, width / LAYOUTS[want].w))
    })
    ro.observe(el)
    return () => ro.disconnect()
  }, [pieces, setSaved])

  useEffect(() => {
    if (!solved || solvedOnce.current) return
    solvedOnce.current = true
    playSfx('success')
    const t = setTimeout(onSolved, 2600)
    return () => clearTimeout(t)
  }, [solved, onSolved])

  const target = (i: number): Pt => [L.slot.x + pieces[i].bbox.x, L.slot.y + pieces[i].bbox.y]

  const onDown = (i: number) => (e: PointerEvent<HTMLDivElement>) => {
    if (state.placed[i]) return
    e.currentTarget.setPointerCapture(e.pointerId)
    const rect = wrap.current!.getBoundingClientRect()
    const px = (e.clientX - rect.left) / scale
    const py = (e.clientY - rect.top) / scale
    setDrag({ i, dx: px - state.pos[i][0], dy: py - state.pos[i][1] })
    setTop((t) => [...t.filter((k) => k !== i), i])
    playSfx('paper')
  }

  const onMove = (e: PointerEvent<HTMLDivElement>) => {
    if (!drag) return
    const rect = wrap.current!.getBoundingClientRect()
    const px = (e.clientX - rect.left) / scale - drag.dx
    const py = (e.clientY - rect.top) / scale - drag.dy
    const b = pieces[drag.i].bbox
    const x = Math.max(-b.w / 2, Math.min(L.w - b.w / 2, px))
    const y = Math.max(-b.h / 2, Math.min(L.h - b.h / 2, py))
    setState((s) => {
      const pos = [...s.pos]
      pos[drag.i] = [x, y]
      return { ...s, pos }
    })
  }

  const onUp = () => {
    if (!drag) return
    const i = drag.i
    setDrag(null)
    const [tx, ty] = target(i)
    const [x, y] = state.pos[i]
    const next = { ...state, pos: [...state.pos], placed: [...state.placed] }
    if (Math.hypot(x - tx, y - ty) < SNAP) {
      next.pos[i] = [tx, ty]
      next.placed[i] = true
      playSfx('snap')
    }
    setState(next)
    setSaved(next)
  }

  return (
    <div>
      <p className="mb-3 text-center font-display text-base text-navy/70">Drag the torn pieces together to rebuild the ticket.</p>
      <div ref={wrap} className="relative mx-auto w-full touch-none select-none" style={{ maxWidth: LAYOUTS.wide.w, height: L.h * scale }}>
        <div
          className="absolute top-0 left-0 rounded-3xl bg-[#7E4E30]"
          style={{ width: L.w, height: L.h, transform: `scale(${scale})`, transformOrigin: '0 0' }}
          onPointerMove={onMove}
          onPointerUp={onUp}
          onPointerCancel={onUp}
        >
          {/* desk surface */}
          <div
            className="absolute inset-0 rounded-3xl"
            style={{ background: 'repeating-linear-gradient(90deg, #8E5634 0 120px, #885131 120px 240px)' }}
          />
          {/* outline where the ticket goes */}
          <div
            className="absolute rounded-2xl border-4 border-dashed border-white/35"
            style={{ left: L.slot.x - 6, top: L.slot.y - 6, width: TW + 12, height: TH + 12 }}
          />
          {pieces.map((p, i) => {
            const [x, y] = state.pos[i]
            const placed = state.placed[i]
            const dragging = drag?.i === i
            return (
              <div
                key={i}
                onPointerDown={onDown(i)}
                className={placed ? '' : 'cursor-grab active:cursor-grabbing'}
                style={{
                  position: 'absolute',
                  left: x,
                  top: y,
                  width: p.bbox.w,
                  height: p.bbox.h,
                  zIndex: placed ? 1 : 10 + top.indexOf(i),
                  transform: `rotate(${placed || dragging ? 0 : state.rot[i]}deg) scale(${dragging ? 1.04 : 1})`,
                  transition: dragging ? 'transform 0.1s' : 'transform 0.2s, left 0.15s, top 0.15s',
                  filter: placed ? 'none' : `drop-shadow(0 ${dragging ? 12 : 5}px ${dragging ? 10 : 4}px rgba(30,15,5,0.45))`,
                }}
              >
                <svg
                  width={p.bbox.w}
                  height={p.bbox.h}
                  viewBox={`${p.bbox.x} ${p.bbox.y} ${p.bbox.w} ${p.bbox.h}`}
                  className="block overflow-visible"
                  aria-label={`Ticket piece ${i + 1}`}
                >
                  <defs>
                    <clipPath id={`ticket-piece-${i}`}>
                      <polygon points={p.poly.map((pt) => pt.join(',')).join(' ')} />
                    </clipPath>
                  </defs>
                  <g clipPath={`url(#ticket-piece-${i})`}>
                    <TicketArt />
                  </g>
                  {!placed && (
                    <polygon
                      points={p.poly.map((pt) => pt.join(',')).join(' ')}
                      fill="none"
                      stroke="#fff"
                      strokeWidth={2.5}
                      strokeLinejoin="round"
                      opacity={0.9}
                    />
                  )}
                </svg>
              </div>
            )
          })}
          {solved && (
            <motion.div
              className="pointer-events-none absolute"
              style={{ left: L.slot.x, top: L.slot.y, width: TW, height: TH, zIndex: 50 }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <motion.div
                className="absolute inset-0 rounded-2xl"
                style={{
                  background: 'linear-gradient(105deg, transparent 30%, rgba(255,255,255,0.75) 50%, transparent 70%)',
                  backgroundSize: '250% 100%',
                }}
                initial={{ backgroundPositionX: '120%' }}
                animate={{ backgroundPositionX: '-120%' }}
                transition={{ duration: 1.1, ease: 'easeInOut' }}
              />
              <motion.div
                className="absolute -top-24 left-1/2 -translate-x-1/2 rounded-full bg-evergreen px-6 py-2 font-display text-2xl font-bold tracking-wider whitespace-nowrap text-white shadow-lg"
                initial={{ scale: 0, rotate: -8 }}
                animate={{ scale: 1, rotate: -3 }}
                transition={{ delay: 0.5, type: 'spring', stiffness: 260, damping: 14 }}
              >
                ✓ TICKET RESTORED
              </motion.div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  )
}
