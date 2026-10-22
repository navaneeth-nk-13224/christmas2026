import { useEffect, useRef, useState, type Ref, type RefObject } from 'react'
import { Child, Elina, Nicholas } from '../art/characters'
import { AnswerForm, normalize } from '../components/PuzzleContainer'
import { ZoomPan } from '../components/ZoomPan'

export const PHOTO_SRC = `${import.meta.env.BASE_URL}images/santa-claus-village-illustrated.webp`
const PW = 1280
const PH = 853

const ACCEPTED = ['santaclausvillage', 'santasvillage', 'santavillage', 'rovaniemi', 'joulupukinpajakyla', 'santaclausholidayvillage']

export function isPhotoPlace(value: string) {
  const v = normalize(value)
  return ACCEPTED.some((a) => v.includes(a))
}

/** The fictional family, drawn to sit naturally on the snow in the photograph. */
function FamilyOverlay() {
  return (
    <g>
      <defs>
        {/* Match the photo: cooler, less saturated, slightly soft, lit from the upper left. */}
        <filter id="fam-soft" x="-20%" y="-20%" width="140%" height="140%">
          <feColorMatrix type="saturate" values="0.9" />
          <feComponentTransfer>
            <feFuncR type="linear" slope="0.86" intercept="0.02" />
            <feFuncG type="linear" slope="0.9" intercept="0.03" />
            <feFuncB type="linear" slope="0.95" intercept="0.07" />
          </feComponentTransfer>
          <feGaussianBlur stdDeviation="0.4" />
        </filter>
        <linearGradient id="fam-light" x1="0" y1="0" x2="1" y2="0.4">
          <stop offset="0" stopColor="#ffffff" stopOpacity={0.16} />
          <stop offset="0.55" stopColor="#ffffff" stopOpacity={0} />
          <stop offset="1" stopColor="#1b2740" stopOpacity={0.28} />
        </linearGradient>
        <mask id="fam-mask">
          <g filter="url(#fam-silhouette)">
            <Nicholas x={572} y={848} s={1.18} pose="wave" />
            <Child x={668} y={850} s={1.18} />
            <Elina x={762} y={848} s={1.18} />
          </g>
        </mask>
        <filter id="fam-silhouette">
          <feColorMatrix type="matrix" values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 1 0" />
        </filter>
        <filter id="fam-grain" x="0" y="0" width="100%" height="100%">
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed="4" />
          <feColorMatrix type="saturate" values="0" />
          <feComponentTransfer>
            <feFuncA type="linear" slope="0.09" />
          </feComponentTransfer>
        </filter>
        <radialGradient id="fam-shadow" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#2a3a55" stopOpacity={0.35} />
          <stop offset="1" stopColor="#2a3a55" stopOpacity={0} />
        </radialGradient>
      </defs>
      <ellipse cx={668} cy={844} rx={215} ry={24} fill="url(#fam-shadow)" />
      <g filter="url(#fam-soft)" opacity={0.97}>
        <Nicholas x={572} y={848} s={1.18} pose="wave" />
        <Child x={668} y={850} s={1.18} />
        <Elina x={762} y={848} s={1.18} />
      </g>
      <rect x={480} y={460} width={380} height={400} fill="url(#fam-light)" mask="url(#fam-mask)" />
      {/* film grain over the whole print ties photo and family together */}
      <rect width={PW} height={PH} filter="url(#fam-grain)" />
    </g>
  )
}

/** Real photograph with the family composited on top, as a single SVG. */
export function FamilyPhoto({ svgRef }: { svgRef?: Ref<SVGSVGElement> }) {
  return (
    <svg
      ref={svgRef}
      xmlns="http://www.w3.org/2000/svg"
      viewBox={`0 0 ${PW} ${PH}`}
      className="block h-full w-full"
      role="img"
      aria-label="Family photograph"
    >
      <image href={PHOTO_SRC} width={PW} height={PH} />
      <FamilyOverlay />
      <rect width={PW} height={PH} fill="none" stroke="#000" strokeOpacity={0.15} strokeWidth={30} />
    </svg>
  )
}

/** Renders the composite to a JPEG blob URL so players can open or save it (e.g. for Google Lens). */
function useCompositeUrl(svgRef: RefObject<SVGSVGElement | null>) {
  const [url, setUrl] = useState<string | null>(null)
  useEffect(() => {
    let revoked: string | null = null
    let cancelled = false
    const run = async () => {
      const svg = svgRef.current
      if (!svg) return
      const photo = new Image()
      photo.src = PHOTO_SRC
      await photo.decode()
      // Serialise only the overlay: clone the SVG without the <image>, which the canvas draws itself.
      const clone = svg.cloneNode(true) as SVGSVGElement
      clone.querySelector('image')?.remove()
      clone.setAttribute('width', String(PW))
      clone.setAttribute('height', String(PH))
      const overlayUrl = URL.createObjectURL(new Blob([new XMLSerializer().serializeToString(clone)], { type: 'image/svg+xml' }))
      const overlay = new Image()
      overlay.src = overlayUrl
      await overlay.decode()
      const canvas = document.createElement('canvas')
      canvas.width = PW
      canvas.height = PH
      const ctx = canvas.getContext('2d')!
      ctx.drawImage(photo, 0, 0, PW, PH)
      ctx.drawImage(overlay, 0, 0, PW, PH)
      URL.revokeObjectURL(overlayUrl)
      canvas.toBlob(
        (blob) => {
          if (!blob || cancelled) return
          revoked = URL.createObjectURL(blob)
          setUrl(revoked)
        },
        'image/jpeg',
        0.92,
      )
    }
    run().catch(() => setUrl(null))
    return () => {
      cancelled = true
      if (revoked) URL.revokeObjectURL(revoked)
    }
  }, [svgRef])
  return url
}

export function LandmarkPuzzle({ onSolved }: { onSolved: () => void }) {
  const svgRef = useRef<SVGSVGElement>(null)
  const url = useCompositeUrl(svgRef)

  return (
    <div>
      {/* framed photograph */}
      <div
        className="mx-auto rounded-2xl bg-[#7E4E30] p-3 shadow-[inset_0_0_0_4px_#5B3A22,0_10px_30px_rgba(0,0,0,0.3)] sm:p-5"
        style={{ maxWidth: 'calc(56vh * 1.5 + 64px)' }}
      >
        <div className="rounded-md bg-[#F4EBDD] p-2 sm:p-3">
          <ZoomPan aspect={PW / PH} maxZoom={6}>
            <FamilyPhoto svgRef={svgRef} />
          </ZoomPan>
        </div>
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        <a
          className={`btn btn-light btn-sm !border-2 !border-navy/10 ${url ? '' : 'pointer-events-none opacity-50'}`}
          href={url ?? undefined}
          target="_blank"
          rel="noreferrer"
        >
          Open full photo ↗
        </a>
        <a
          className={`btn btn-light btn-sm !border-2 !border-navy/10 ${url ? '' : 'pointer-events-none opacity-50'}`}
          href={url ?? undefined}
          download="family-photograph.jpg"
        >
          Save photo ⤓
        </a>
        <span className="self-center text-sm text-navy/60">Tip: image search tools can recognise places.</span>
      </div>
      <div className="mt-4">
        <AnswerForm
          label="Where was this photo taken?"
          placeholder="Name the place"
          check={isPhotoPlace}
          onCorrect={onSolved}
          wrongText="That doesn't look like the place in the photo."
          successText="That's the place!"
        />
      </div>
    </div>
  )
}
