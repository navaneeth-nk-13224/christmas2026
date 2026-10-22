import { NorthPoleNight } from './StartScreen'

export default function Credits({ onBack }: { onBack: () => void }) {
  return (
    <div className="relative h-full overflow-y-auto bg-navy-deep">
      <div className="fixed inset-0 opacity-40">
        <NorthPoleNight />
      </div>
      <div className="relative mx-auto max-w-xl px-5 py-12 text-white">
        <h1 className="font-display text-4xl font-bold">Credits</h1>
        <p className="mt-4 text-lg text-white/85">
          <strong>The Last Light of Christmas</strong> — an original Christmas detective adventure. All characters, scenes and illustrations are
          original artwork drawn for this game. Music is a music-box arrangement of the public-domain carol “Jingle Bells”, synthesised in your
          browser.
        </p>
        <h2 className="mt-8 font-display text-2xl font-semibold text-gold">Photograph</h2>
        <p className="mt-2 text-white/85">
          The background of the family photograph is a real photo by <strong>flightlog</strong>, licensed under{' '}
          <a className="underline" href="https://creativecommons.org/licenses/by/2.0/" target="_blank" rel="noreferrer">
            CC BY 2.0
          </a>
          , via{' '}
          <a
            className="underline"
            href="https://commons.wikimedia.org/wiki/File:Santa_Claus_Village_in_Rovaniemi_20120209_01.jpg"
            target="_blank"
            rel="noreferrer"
          >
            Wikimedia Commons
          </a>
          . Resized, redrawn with an illustration-style filter, and fictional characters added.
        </p>
        <h2 className="mt-8 font-display text-2xl font-semibold text-gold">Places</h2>
        <p className="mt-2 text-white/85">
          The laboratory, monitoring station, toy factory, North Star Logistics and the warehouse at 24 Frost Road are all fictional. The coordinates
          in the game point to open ground in a real Arctic research area — no real building is meant.
        </p>
        <button type="button" className="btn btn-red mt-10" onClick={onBack}>
          ← Back
        </button>
      </div>
    </div>
  )
}
