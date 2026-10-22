# The Last Light of Christmas

**SANTA IS MISSING! Find him before Christmas!**

A browser-based Christmas detective adventure in eight levels. You play the detective who helps Pip the elf follow the clues — from Santa's workshop to a criminals' warehouse — then rescue Santa and Professor Nicholas, catch the thieves, and unlock a five-page illustrated storybook.

## Run it

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # production build in dist/
npm run preview  # serve the production build
```

No backend or login. Progress is saved in `localStorage` automatically.

## The eight puzzles

| Level | Place | Puzzle | Answer |
| --- | --- | --- | --- |
| 1 | Santa's Workshop | Drag six torn ticket pieces together (tall board on phones) | Rovaniemi, Finland |
| 2 | Santa Claus Post Office | Look up the coordinates in the letter — Google Maps or the in-game map | 78.9120° N, 11.9000° E → Ny-Ålesund, Svalbard |
| 3 | Arctic Research Laboratory | Decode the repeating Morse signal `.-.. / .- / -.- / .` | LAKE |
| 4 | Frozen Lake Station | Identify the place in the family photograph (zoom, open/save for Google Lens) | Santa Claus Village / Rovaniemi |
| 5 | Nicholas's home | Shift each letter of `WRB IDFWRUB` three steps back | TOY FACTORY |
| 6 | Abandoned Toy Factory | Put six timestamped CCTV stills in order, then press Play | 20:05 → 20:40 |
| 7 | Factory Security Room | Read the truck's plate and company, then use the Find Logistics site | NP-4827, North Star Logistics |
| 8 | North Star Warehouse | Find the small wall calendar; Dec 8 is the boss's birthday | PIN 812 |

## How it's built

React + TypeScript + Vite, Tailwind CSS v4, Framer Motion.

- `src/art/` — all illustration, hand-built as SVG: characters (`characters.tsx`), props, CCTV frames, storybook art.
- `src/levels/` — one file per level: the scene, its hotspots, and its dialogue phases. Each level is lazy-loaded and the next one is prefetched.
- `src/puzzles/` — the eight puzzle components.
- `src/components/` — scene/hotspot system, dialogue box, inspection modal, zoom viewer, transitions, storybook, audio controls.
- `src/data/` — level metadata, every line of dialogue, storybook text.
- `src/state/progress.tsx` — saved progress: current level, level phases (dialogue progress), mid-puzzle state, completion and storybook unlock.
- `src/audio/sound.ts` — all sound is synthesised with Web Audio (music-box "Jingle Bells", chimes, beeps, Morse tones, sleigh bells). Nothing plays until the player interacts; music and sound can be muted separately. Sound is never needed to solve a puzzle.

All dates, timestamps, coordinates, plates, Morse and cipher text are SVG/HTML text, never baked into images.

On narrow/portrait screens each scene fills the height and can be swiped sideways, so small clues (like the calendar) stay tappable.

## Real-world references

- **Coordinates** (Level 2): 78.9120° N, 11.9000° E is open ground just south of Ny-Ålesund, Svalbard, a real Arctic research town. Checked with OpenStreetMap reverse geocoding: no building at that point. The laboratory itself is fictional.
- **Photograph** (Level 4): "Santa Claus Village in Rovaniemi" by flightlog, [CC BY 2.0](https://creativecommons.org/licenses/by/2.0/), via [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:Santa_Claus_Village_in_Rovaniemi_20120209_01.jpg). Resized to WebP and given an illustration-style filter (baked into `public/images/santa-claus-village-illustrated.webp`); the fictional family is composited on top at runtime. Credited in-game under *Credits*.
- North Star Logistics, Find Logistics, the toy factory and 24 Frost Road are fictional.
