import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useRef, useState, type FormEvent, type ReactNode } from 'react'
import { playSfx } from '../audio/sound'
import { normalize } from '../components/PuzzleContainer'

export const WAREHOUSE_ADDRESS = '24 Frost Road, Rovaniemi Industrial District'

export function isPlate(v: string) {
  return normalize(v) === 'np4827'
}
export function isCompany(v: string) {
  const n = normalize(v)
  return n.startsWith('northstar') && (n === 'northstar' || n.startsWith('northstarlogistic'))
}

function ResultCard() {
  const rows: [string, string][] = [
    ['Company', 'North Star Logistics'],
    ['Vehicle', 'NP-4827'],
    ['Destination', 'North Star Warehouse'],
    ['Address', WAREHOUSE_ADDRESS],
    ['Status', 'Arrived'],
  ]
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    ref.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
  }, [])
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="mt-5 overflow-hidden rounded-xl border-2 border-[#16A34A]/30 bg-white"
    >
      <div className="flex items-center gap-2 bg-[#16A34A] px-4 py-2.5 font-body text-sm font-extrabold tracking-[0.2em] text-white uppercase">
        <span className="grid h-5 w-5 place-items-center rounded-full bg-white text-xs text-[#16A34A]">✓</span>
        Vehicle found
      </div>
      <dl className="divide-y divide-slate-100 font-body text-[0.95rem]">
        {rows.map(([k, v]) => (
          <div key={k} className="grid grid-cols-[7.5rem_1fr] gap-3 px-4 py-2.5">
            <dt className="font-bold text-slate-500">{k}</dt>
            <dd className={`font-bold ${k === 'Status' ? 'text-[#16A34A]' : 'text-slate-800'}`}>{v}</dd>
          </div>
        ))}
      </dl>
    </motion.div>
  )
}

/** The fictional lookup site, shown inside a browser window on the security-room computer. */
function FindLogisticsSite({ onFound, found }: { onFound: () => void; found: boolean }) {
  const [plate, setPlate] = useState('')
  const [company, setCompany] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [shake, setShake] = useState(0)

  const submit = (e: FormEvent) => {
    e.preventDefault()
    if (found || loading) return
    if (!plate.trim() || !company.trim()) {
      setError('Please fill in both fields.')
      setShake((s) => s + 1)
      playSfx('error')
      return
    }
    setLoading(true)
    setError(null)
    playSfx('beep')
    setTimeout(() => {
      setLoading(false)
      if (isPlate(plate) && isCompany(company)) {
        playSfx('success')
        onFound()
      } else {
        setError('No vehicle found. Check the details and try again.')
        setShake((s) => s + 1)
        playSfx('error')
      }
    }, 700)
  }

  return (
    <div className="bg-[#F5F7FA] px-4 py-6 font-body text-slate-800 sm:px-8 sm:py-8">
      <div className="mx-auto max-w-md">
        <div className="flex items-center gap-2.5">
          <svg width="34" height="34" viewBox="0 0 34 34" aria-hidden>
            <rect width="34" height="34" rx="9" fill="#0F4C81" />
            <path d="M7 21 h13 v-8 h4 l4 4 v4 h-2" fill="none" stroke="#fff" strokeWidth="2.4" strokeLinejoin="round" />
            <circle cx="11" cy="23" r="2.5" fill="#FDB833" />
            <circle cx="24" cy="23" r="2.5" fill="#FDB833" />
          </svg>
          <div className="text-xl font-extrabold tracking-[0.12em] text-[#0F4C81]">FIND LOGISTICS</div>
        </div>
        <p className="mt-1 text-sm font-semibold text-slate-500">Vehicle and delivery information</p>

        <form
          onSubmit={submit}
          key={shake}
          className={`mt-5 space-y-3 rounded-xl bg-white p-4 shadow-sm ring-1 ring-slate-200 ${error ? 'shake' : ''}`}
        >
          <label className="block">
            <span className="text-xs font-extrabold tracking-wider text-slate-500 uppercase">Vehicle Registration</span>
            <input
              className="mt-1 w-full rounded-lg border-2 border-slate-200 px-3 py-2.5 font-bold text-slate-800 outline-none focus:border-[#0F4C81]"
              value={plate}
              onChange={(e) => setPlate(e.target.value)}
              placeholder="e.g. AB-1234"
              autoComplete="off"
              spellCheck={false}
              disabled={found}
            />
          </label>
          <label className="block">
            <span className="text-xs font-extrabold tracking-wider text-slate-500 uppercase">Logistics Company</span>
            <input
              className="mt-1 w-full rounded-lg border-2 border-slate-200 px-3 py-2.5 font-bold text-slate-800 outline-none focus:border-[#0F4C81]"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              placeholder="Company name"
              autoComplete="off"
              spellCheck={false}
              disabled={found}
            />
          </label>
          <button
            type="submit"
            disabled={found}
            className="w-full cursor-pointer rounded-lg bg-[#0F4C81] py-3 text-sm font-extrabold tracking-[0.2em] text-white transition hover:bg-[#0C3D68] disabled:opacity-60"
          >
            {loading ? 'SEARCHING…' : 'GET DETAILS'}
          </button>
          <AnimatePresence>
            {error && (
              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-sm font-bold text-[#DC2626]">
                {error}
              </motion.p>
            )}
          </AnimatePresence>
        </form>
        {found && <ResultCard />}
        <p className="mt-6 text-center text-[0.7rem] font-semibold text-slate-400">© Find Logistics · Fleet tracking for the North</p>
      </div>
    </div>
  )
}

function Tab({ active, title, icon, onClick }: { active: boolean; title: string; icon: ReactNode; onClick: () => void }) {
  return (
    <button
      type="button"
      role="tab"
      aria-selected={active}
      aria-label={title}
      onClick={onClick}
      className={`flex min-w-0 max-w-[12rem] flex-1 cursor-pointer items-center gap-2 rounded-t-lg px-3 py-2 text-left text-[0.8rem] font-bold ${
        active ? 'bg-white text-slate-800' : 'text-slate-600 hover:bg-white/50'
      }`}
    >
      {icon}
      <span className="truncate">{title}</span>
    </button>
  )
}

export function LogisticsPuzzle({ onSolved }: { onSolved: () => void }) {
  const [tab, setTab] = useState<'new' | 'find'>('new')
  const [found, setFound] = useState(false)

  return (
    <div className="overflow-hidden rounded-xl bg-[#DEE3EA] shadow-2xl ring-1 ring-black/10">
      {/* window chrome */}
      <div className="flex items-end gap-1 px-2 pt-2">
        <div className="mr-2 mb-2.5 flex gap-1.5 pl-1">
          <span className="h-3 w-3 rounded-full bg-[#FF5F57]" />
          <span className="h-3 w-3 rounded-full bg-[#FEBC2E]" />
          <span className="h-3 w-3 rounded-full bg-[#28C840]" />
        </div>
        <Tab
          active={tab === 'new'}
          title="New Tab"
          icon={<span className="h-3.5 w-3.5 rounded-full border-2 border-slate-400" />}
          onClick={() => setTab('new')}
        />
        <Tab
          active={tab === 'find'}
          title="Find Logistics"
          icon={<span className="grid h-3.5 w-3.5 place-items-center rounded-[3px] bg-[#0F4C81] text-[8px] text-[#FDB833]">▲</span>}
          onClick={() => {
            playSfx('click')
            setTab('find')
          }}
        />
      </div>
      <div className="flex items-center gap-2 bg-white px-3 py-2">
        <span className="text-slate-400">‹ ›</span>
        <div className="flex-1 truncate rounded-full bg-slate-100 px-4 py-1.5 font-body text-sm text-slate-500">
          {tab === 'find' ? 'findlogistics.np/vehicle-lookup' : 'Search or type a web address'}
        </div>
      </div>
      <div className="max-h-[62vh] overflow-y-auto bg-white">
        {tab === 'new' ? (
          <div className="grid min-h-[300px] place-items-center bg-white p-8 text-center font-body text-slate-400">
            <div>
              <div className="text-4xl">🌐</div>
              <p className="mt-2 text-sm font-semibold">New Tab</p>
            </div>
          </div>
        ) : (
          <FindLogisticsSite
            found={found}
            onFound={() => {
              setFound(true)
              setTimeout(onSolved, 3200)
            }}
          />
        )}
      </div>
    </div>
  )
}
