import { motion } from 'framer-motion'
import { useState } from 'react'
import { C } from '../art/props'
import { AnswerForm, normalize } from '../components/PuzzleContainer'

// Open ground just south of Ny-Ålesund, Svalbard (a real Arctic research town).
// Verified with OpenStreetMap reverse geocoding: no building at this point.
export const LAB_LAT = 78.912
export const LAB_LON = 11.9
export const COORD_TEXT = '78.9120° N, 11.9000° E'
const MAPS_URL = `https://www.google.com/maps?q=${LAB_LAT},${LAB_LON}`

const PLACE_ANSWERS = [
  'svalbard',
  'nyalesund',
  'nyaalesund',
  'spitsbergen',
  'spitzbergen',
  'kongsfjorden',
  'kongsfjord',
  'nyalesundsvalbard',
  'svalbardnorway',
]

export function isLabPlace(value: string) {
  const v = normalize(value)
  return PLACE_ANSWERS.some((a) => v === a || v.includes(a))
}

export function NavigationLetter() {
  const [copied, setCopied] = useState(false)
  return (
    <div className="paper-texture relative rounded-xl p-5 shadow-[0_6px_24px_rgba(36,53,75,0.18)] sm:p-7" style={{ fontFamily: 'var(--font-type)' }}>
      <div className="flex items-center gap-3 border-b-2 border-navy/15 pb-3">
        <svg width="44" height="44" viewBox="0 0 44 44" aria-hidden>
          <circle cx="22" cy="22" r="20" fill={C.navy} />
          <path d="M22 6 L27 22 L22 38 L17 22 Z" fill="#fff" />
          <path d="M22 6 L27 22 L17 22 Z" fill={C.red} />
          <circle cx="22" cy="22" r="3" fill={C.gold} />
        </svg>
        <div>
          <div className="font-display text-base font-bold tracking-[0.15em] text-navy sm:text-lg">NORTH POLE NAVIGATION TEAM</div>
          <div className="font-body text-xs font-bold tracking-wider text-navy/50 uppercase">Route Research · Arctic Division</div>
        </div>
      </div>
      <div className="mt-4 space-y-3 text-[1.05rem] leading-relaxed text-navy">
        <p>Santa,</p>
        <p>Please visit our research laboratory.</p>
        <p>
          Location coordinates:
          <br />
          <span className="mt-1 inline-block rounded-md bg-[#FFF0C2] px-2 py-0.5 text-lg font-bold tracking-wide select-all">{COORD_TEXT}</span>
        </p>
        <p className="pt-1 text-right">— North Pole Navigation Team</p>
      </div>
      <div className="mt-4 flex flex-wrap gap-2 font-body">
        <button
          type="button"
          className="btn btn-light btn-sm !border-2 !border-navy/10"
          onClick={() => {
            void navigator.clipboard?.writeText(`${LAB_LAT.toFixed(4)}, ${LAB_LON.toFixed(4)}`).then(() => setCopied(true))
          }}
        >
          {copied ? '✓ Copied' : 'Copy coordinates'}
        </button>
        <a className="btn btn-light btn-sm !border-2 !border-navy/10" href={MAPS_URL} target="_blank" rel="noreferrer">
          Open in Google Maps ↗
        </a>
      </div>
    </div>
  )
}

export function CoordinatePuzzle({ onSolved }: { onSolved: () => void }) {
  const [found, setFound] = useState(false)
  return (
    <div className="mx-auto flex max-w-xl flex-col gap-5">
      <motion.div
        initial={{ rotateX: -70, opacity: 0 }}
        animate={{ rotateX: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
        style={{ transformOrigin: 'top' }}
      >
        <NavigationLetter />
      </motion.div>
      {found ? (
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="rounded-2xl bg-evergreen p-4 text-center text-white shadow-lg"
        >
          <div className="text-xs font-bold tracking-[0.25em] text-white/80 uppercase">Location identified</div>
          <div className="font-display text-2xl font-bold tracking-wide">ARCTIC RESEARCH LABORATORY</div>
          <div className="text-sm text-white/85">Near Ny-Ålesund, Svalbard</div>
        </motion.div>
      ) : (
        <AnswerForm
          label="Where do the coordinates lead?"
          placeholder="Name the place"
          check={isLabPlace}
          onCorrect={() => {
            setFound(true)
            setTimeout(onSolved, 2400)
          }}
          wrongText="That doesn't match the coordinates."
          successText="Found it!"
        />
      )}
    </div>
  )
}
