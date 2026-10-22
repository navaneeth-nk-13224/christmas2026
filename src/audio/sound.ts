// All game audio is synthesised with the Web Audio API: no audio files to load,
// and nothing plays until the player has interacted with the page.

export type Sfx = 'click' | 'success' | 'error' | 'paper' | 'beep' | 'snap' | 'unlock' | 'bells' | 'shutter' | 'whoosh' | 'key'

let ctx: AudioContext | null = null
let master: GainNode | null = null
let musicGain: GainNode | null = null
let muted = false
let musicWanted = true
let musicTimer: number | null = null

function audio() {
  if (!ctx) {
    const AC = window.AudioContext ?? (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
    if (!AC) return null
    ctx = new AC()
    master = ctx.createGain()
    master.gain.value = muted ? 0 : 0.8
    master.connect(ctx.destination)
    musicGain = ctx.createGain()
    musicGain.gain.value = 0.13
    musicGain.connect(master)
  }
  if (ctx.state === 'suspended') void ctx.resume()
  return ctx
}

function tone(
  freq: number,
  start: number,
  dur: number,
  { type = 'sine', vol = 0.3, dest, attack = 0.005 }: { type?: OscillatorType; vol?: number; dest?: AudioNode; attack?: number } = {},
) {
  const ac = audio()
  if (!ac || !master) return
  const osc = ac.createOscillator()
  const g = ac.createGain()
  osc.type = type
  osc.frequency.value = freq
  g.gain.setValueAtTime(0, start)
  g.gain.linearRampToValueAtTime(vol, start + attack)
  g.gain.exponentialRampToValueAtTime(0.0001, start + dur)
  osc.connect(g)
  g.connect(dest ?? master)
  osc.start(start)
  osc.stop(start + dur + 0.05)
}

function noise(start: number, dur: number, { vol = 0.2, freq = 2000, q = 1, type = 'bandpass' as BiquadFilterType, sweepTo = 0 } = {}) {
  const ac = audio()
  if (!ac || !master) return
  const len = Math.ceil(ac.sampleRate * dur)
  const buf = ac.createBuffer(1, len, ac.sampleRate)
  const data = buf.getChannelData(0)
  for (let i = 0; i < len; i++) data[i] = Math.random() * 2 - 1
  const src = ac.createBufferSource()
  src.buffer = buf
  const filter = ac.createBiquadFilter()
  filter.type = type
  filter.frequency.setValueAtTime(freq, start)
  if (sweepTo) filter.frequency.exponentialRampToValueAtTime(sweepTo, start + dur)
  filter.Q.value = q
  const g = ac.createGain()
  g.gain.setValueAtTime(vol, start)
  g.gain.exponentialRampToValueAtTime(0.0001, start + dur)
  src.connect(filter)
  filter.connect(g)
  g.connect(master)
  src.start(start)
}

function jingle(start: number, count = 10) {
  for (let i = 0; i < count; i++) {
    const t = start + i * 0.09 + Math.random() * 0.03
    tone(2600 + Math.random() * 900, t, 0.25, { type: 'triangle', vol: 0.05 })
    tone(4100 + Math.random() * 900, t, 0.18, { type: 'sine', vol: 0.04 })
    noise(t, 0.08, { vol: 0.05, freq: 7000, q: 3 })
  }
}

export function playSfx(name: Sfx) {
  if (muted) return
  const ac = audio()
  if (!ac) return
  const t = ac.currentTime + 0.01
  switch (name) {
    case 'click':
      tone(660, t, 0.08, { type: 'triangle', vol: 0.14 })
      break
    case 'key':
      tone(1046, t, 0.06, { type: 'square', vol: 0.05 })
      break
    case 'snap':
      tone(523, t, 0.08, { type: 'triangle', vol: 0.2 })
      tone(784, t + 0.05, 0.12, { type: 'triangle', vol: 0.18 })
      break
    case 'success':
      ;[523.25, 659.25, 783.99, 1046.5].forEach((f, i) => {
        tone(f, t + i * 0.09, 0.6, { type: 'triangle', vol: 0.18 })
        tone(f * 2, t + i * 0.09, 0.35, { type: 'sine', vol: 0.05 })
      })
      jingle(t + 0.3, 5)
      break
    case 'error':
      tone(330, t, 0.16, { type: 'triangle', vol: 0.16 })
      tone(262, t + 0.13, 0.22, { type: 'triangle', vol: 0.16 })
      break
    case 'paper':
      noise(t, 0.22, { vol: 0.16, freq: 3200, q: 0.7, sweepTo: 1400 })
      noise(t + 0.12, 0.18, { vol: 0.1, freq: 4200, q: 0.8 })
      break
    case 'beep':
      tone(880, t, 0.09, { type: 'square', vol: 0.06 })
      break
    case 'unlock':
      noise(t, 0.05, { vol: 0.3, freq: 1800, q: 2 })
      tone(440, t + 0.06, 0.14, { type: 'square', vol: 0.06 })
      tone(880, t + 0.16, 0.3, { type: 'square', vol: 0.06 })
      noise(t + 0.32, 0.08, { vol: 0.3, freq: 900, q: 2 })
      break
    case 'bells':
      jingle(t, 16)
      break
    case 'shutter':
      noise(t, 1.1, { vol: 0.3, freq: 600, q: 0.8, type: 'lowpass', sweepTo: 150 })
      noise(t + 1.05, 0.25, { vol: 0.45, freq: 220, q: 1, type: 'lowpass' })
      break
    case 'whoosh':
      noise(t, 0.6, { vol: 0.12, freq: 400, q: 0.8, sweepTo: 2400 })
      break
  }
}

/** Plays a Morse message (".-.. / .-") as audio. Returns its total length in ms. */
export function playMorse(code: string, unitMs = 95) {
  const ac = audio()
  if (!ac || muted) return 0
  let t = ac.currentTime + 0.05
  const u = unitMs / 1000
  for (const ch of code) {
    if (ch === '.') {
      tone(620, t, u, { type: 'sine', vol: 0.22, attack: 0.004 })
      t += u * 2
    } else if (ch === '-') {
      tone(620, t, u * 3, { type: 'sine', vol: 0.22, attack: 0.004 })
      t += u * 4
    } else if (ch === ' ') {
      t += u * 2
    } else if (ch === '/') {
      t += u * 1
    }
  }
  return (t - ac.currentTime) * 1000
}

// "Jingle Bells" chorus (public domain), played softly as a music-box loop.
const N: Record<string, number> = {
  C4: 261.63,
  D4: 293.66,
  E4: 329.63,
  F4: 349.23,
  G4: 392,
  A4: 440,
  B4: 493.88,
  C5: 523.25,
  D5: 587.33,
  E5: 659.25,
  F5: 698.46,
  G5: 783.99,
  C3: 130.81,
  F3: 174.61,
  G3: 196,
}
const MELODY: [string | null, number][] = [
  ['E5', 1],
  ['E5', 1],
  ['E5', 2],
  ['E5', 1],
  ['E5', 1],
  ['E5', 2],
  ['E5', 1],
  ['G5', 1],
  ['C5', 1.5],
  ['D5', 0.5],
  ['E5', 4],
  ['F5', 1],
  ['F5', 1],
  ['F5', 1.5],
  ['F5', 0.5],
  ['F5', 1],
  ['E5', 1],
  ['E5', 1],
  ['E5', 0.5],
  ['E5', 0.5],
  ['E5', 1],
  ['D5', 1],
  ['D5', 1],
  ['E5', 1],
  ['D5', 2],
  ['G5', 2],
  ['E5', 1],
  ['E5', 1],
  ['E5', 2],
  ['E5', 1],
  ['E5', 1],
  ['E5', 2],
  ['E5', 1],
  ['G5', 1],
  ['C5', 1.5],
  ['D5', 0.5],
  ['E5', 4],
  ['F5', 1],
  ['F5', 1],
  ['F5', 1.5],
  ['F5', 0.5],
  ['F5', 1],
  ['E5', 1],
  ['E5', 1],
  ['E5', 0.5],
  ['E5', 0.5],
  ['G5', 1],
  ['G5', 1],
  ['F5', 1],
  ['D5', 1],
  ['C5', 4],
  [null, 4],
]
const BASS = ['C3', 'C3', 'F3', 'G3', 'C3', 'C3', 'F3', 'C3', 'C3']
const BEAT = 0.3

function scheduleMusic() {
  const ac = audio()
  if (!ac || !musicGain) return
  let t = ac.currentTime + 0.1
  let beats = 0
  for (const [note, len] of MELODY) {
    if (note) {
      tone(N[note], t, len * BEAT * 1.6, { type: 'triangle', vol: 0.32, dest: musicGain })
      tone(N[note] * 2, t, len * BEAT * 0.8, { type: 'sine', vol: 0.07, dest: musicGain })
    }
    if (beats % 4 === 0) {
      const bass = BASS[Math.floor(beats / 4) % BASS.length]
      tone(N[bass], t, BEAT * 3.5, { type: 'sine', vol: 0.3, dest: musicGain })
    }
    t += len * BEAT
    beats += len
  }
  const total = MELODY.reduce((s, [, l]) => s + l, 0) * BEAT * 1000
  musicTimer = window.setTimeout(scheduleMusic, total)
}

export function startMusic() {
  if (musicTimer !== null || muted || !musicWanted) return
  if (!audio()) return
  scheduleMusic()
}

export function stopMusic() {
  if (musicTimer !== null) {
    clearTimeout(musicTimer)
    musicTimer = null
  }
  if (musicGain && ctx) {
    // Fade out anything already scheduled, then restore for the next start.
    const g = musicGain
    g.gain.cancelScheduledValues(ctx.currentTime)
    g.gain.setValueAtTime(g.gain.value, ctx.currentTime)
    g.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.3)
    musicGain = ctx.createGain()
    musicGain.gain.value = 0.13
    musicGain.connect(master!)
    setTimeout(() => g.disconnect(), 400)
  }
}

export function setMuted(value: boolean) {
  muted = value
  if (master && ctx) master.gain.setTargetAtTime(value ? 0 : 0.8, ctx.currentTime, 0.05)
  if (value) stopMusic()
}

export function setMusicWanted(value: boolean) {
  musicWanted = value
  if (!value) stopMusic()
}
