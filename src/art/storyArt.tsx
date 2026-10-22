// The five illustrations of "The Story Behind the Mystery" (1200 × 700 each).
import type { ReactNode } from 'react'
import { Detective, Nicholas, Pip, Santa, ThiefBoss, ThiefSidekick } from './characters'
import { C, Crate, Present, StringLights, SvgSnow, Tree, Truck } from './props'

const VB = '0 0 1200 700'

function Frame({ children, label }: { children: ReactNode; label: string }) {
  return (
    <svg viewBox={VB} className="block h-full w-full" role="img" aria-label={label}>
      {children}
    </svg>
  )
}

/** 1 — Nicholas studies delivery records in his laboratory. */
export function StoryMissingPresents() {
  return (
    <Frame label="Professor Nicholas studying delivery records in his laboratory">
      <rect width={1200} height={700} fill="#3A5679" />
      <rect y={520} width={1200} height={180} fill="#22364F" />
      {/* big screen with delivery routes, some marked missing */}
      <rect x={560} y={90} width={520} height={320} rx={16} fill="#1C2A3C" />
      <rect x={580} y={110} width={480} height={280} rx={8} fill="#07130E" />
      <path d="M620 340 Q700 200 820 260 T1020 150" fill="none" stroke="#3DDC97" strokeWidth={4} strokeDasharray="10 8" />
      <path d="M640 160 Q760 220 860 180 T1030 320" fill="none" stroke="#3DDC97" strokeWidth={4} strokeDasharray="10 8" opacity={0.6} />
      {[
        [820, 260],
        [1020, 150],
        [960, 290],
      ].map(([x, y]) => (
        <path
          key={`${x}${y}`}
          d={`M${x - 14} ${y - 14} L${x + 14} ${y + 14} M${x + 14} ${y - 14} L${x - 14} ${y + 14}`}
          stroke={C.red}
          strokeWidth={7}
          strokeLinecap="round"
        />
      ))}
      <text x={600} y={140} fontFamily="VT323, monospace" fontSize={26} fill="#3DDC97">
        DELIVERIES · MISSING: 3
      </text>
      {/* desk piled with records */}
      <rect x={120} y={470} width={760} height={30} rx={8} fill="#5E7896" />
      <rect x={150} y={500} width={20} height={170} fill="#46607E" />
      <rect x={830} y={500} width={20} height={170} fill="#46607E" />
      {[0, 1, 2, 3, 4].map((i) => (
        <rect
          key={i}
          x={460 + i * 4}
          y={440 - i * 7}
          width={150}
          height={30}
          rx={3}
          fill={['#F8FBFF', '#EEF3F8', '#FFF8EA', '#F8FBFF', '#E1F1FB'][i]}
          transform={`rotate(${-4 + i * 2} 535 455)`}
        />
      ))}
      <g transform="rotate(-10 700 450)">
        <rect x={640} y={420} width={130} height={50} rx={3} fill="#FFF8EA" />
        <path d="M652 436 h90 M652 450 h70" stroke={C.navy} strokeWidth={3} opacity={0.4} />
        <circle cx={736} cy={448} r={12} fill="none" stroke={C.red} strokeWidth={3} />
      </g>
      <Nicholas x={340} y={680} s={1.55} pose="point" mood="worried" />
      <g transform="translate(486 330) rotate(-30)">
        <circle cx={0} cy={0} r={34} fill="#CFEAF9" fillOpacity={0.5} stroke="#6B4A34" strokeWidth={8} />
        <line x1={-26} y1={24} x2={-58} y2={56} stroke="#6B4A34" strokeWidth={12} strokeLinecap="round" />
      </g>
    </Frame>
  )
}

/** 2 — Nicholas warns Santa; Santa gets ready to travel to Rovaniemi. */
export function StoryWarning() {
  return (
    <Frame label="Nicholas calls Santa, who prepares to travel to Rovaniemi">
      <defs>
        <clipPath id="sw-left">
          <path d="M0 0 H620 L560 700 H0 Z" />
        </clipPath>
        <clipPath id="sw-right">
          <path d="M620 0 H1200 V700 H560 Z" />
        </clipPath>
      </defs>
      {/* Nicholas in the lab, on the phone */}
      <g clipPath="url(#sw-left)">
        <rect width={1200} height={700} fill="#3A5679" />
        <rect y={540} width={1200} height={160} fill="#22364F" />
        <rect x={60} y={100} width={240} height={180} rx={6} fill="#BFE0F5" />
        <path d="M60 230 L130 170 L190 210 L250 150 L300 200 V280 H60 Z" fill="#fff" />
        <Nicholas x={330} y={680} s={1.55} pose="phone" mood="worried" />
        <g fill="none" stroke="#F9C846" strokeWidth={6} strokeLinecap="round">
          <path d="M420 240 q20 20 0 40" />
          <path d="M450 220 q36 40 0 80" />
        </g>
      </g>
      {/* Santa in the workshop, packing in a hurry */}
      <g clipPath="url(#sw-right)">
        <rect width={1200} height={700} fill="#C48A5E" />
        {Array.from({ length: 12 }, (_, i) => (
          <line key={i} x1={600 + i * 60} y1={0} x2={600 + i * 60} y2={540} stroke="#B57A4F" strokeWidth={3} />
        ))}
        <StringLights x1={560} x2={1210} y={30} sag={20} count={12} />
        <rect y={540} width={1200} height={160} fill="#8E5634" />
        <rect x={700} y={470} width={420} height={24} rx={6} fill="#7E4E30" />
        <rect x={720} y={494} width={18} height={150} fill="#5B3A22" />
        <rect x={1080} y={494} width={18} height={150} fill="#5B3A22" />
        {/* the ticket on the desk */}
        <g transform="rotate(-6 1000 455)">
          <rect x={950} y={440} width={110} height={30} rx={4} fill="#FFF8EA" />
          <rect x={950} y={440} width={110} height={9} rx={3} fill={C.red} />
        </g>
        {/* travel bag */}
        <g>
          <rect x={720} y={520} width={150} height={120} rx={20} fill="#7E4E30" />
          <path d="M760 520 Q795 470 830 520" fill="none" stroke="#5B3A22" strokeWidth={10} />
          <rect x={720} y={560} width={150} height={12} fill={C.gold} />
        </g>
        {/* Santa taps out his secret reply in Morse code */}
        <g>
          <rect x={1040} y={436} width={70} height={34} rx={6} fill="#46546A" />
          <rect x={1060} y={424} width={34} height={10} rx={5} fill="#2B3442" />
          <circle cx={1100} cy={448} r={5} fill="#3DDC97" className="blink" />
          <line x1={1094} y1={436} x2={1120} y2={330} stroke="#2B3442" strokeWidth={4} />
          <g fill={C.gold}>
            {[
              [1060, 300, 34],
              [1102, 300, 34],
              [1144, 300, 12],
              [1164, 300, 12],
              [1092, 262, 34],
              [1134, 262, 12],
            ].map(([x, y, w]) => (
              <rect key={`${x}${y}`} x={x} y={y} width={w} height={12} rx={6} opacity={0.9} />
            ))}
          </g>
        </g>
        <Santa x={900} y={690} s={1.4} pose="shh" mood="determined" />
      </g>
      <path d="M620 0 L560 700" stroke="#fff" strokeWidth={10} />
    </Frame>
  )
}

/** 3 — Santa and Nicholas meet at the frozen lake station. The photo sits on the desk. */
export function StoryMeeting() {
  return (
    <Frame label="Santa and Nicholas talk at the frozen lake monitoring station">
      <rect width={1200} height={700} fill="#DDAE7C" />
      {Array.from({ length: 13 }, (_, i) => (
        <rect key={i} x={0} y={i * 42} width={1200} height={4} fill="#C8955F" />
      ))}
      <rect x={240} y={70} width={720} height={300} rx={10} fill="#8E5634" />
      <rect x={258} y={88} width={684} height={264} fill="#DCEFFB" />
      <path d="M258 240 L380 170 L470 220 L560 150 L660 210 L760 160 L942 230 V280 H258 Z" fill="#EEF6FB" />
      {Array.from({ length: 18 }, (_, i) => (
        <Tree key={i} x={270 + i * 38} y={290} s={0.2} color="#2A6E66" snowy />
      ))}
      <rect x={258} y={290} width={684} height={62} fill="#CDE6F4" />
      <SvgSnow x={258} y={80} w={684} h={280} count={26} seed={3} />
      <rect x={590} y={88} width={14} height={264} fill="#8E5634" />
      <rect y={560} width={1200} height={140} fill="#B98252" />
      {/* desk */}
      <rect x={140} y={470} width={920} height={26} rx={6} fill="#8E5634" />
      <rect x={170} y={496} width={20} height={180} fill="#7E4E30" />
      <rect x={1010} y={496} width={20} height={180} fill="#7E4E30" />
      {/* framed family photo */}
      <g transform="rotate(-6 560 430)">
        <rect x={510} y={392} width={100} height={78} rx={4} fill="#7E4E30" />
        <rect x={518} y={400} width={84} height={62} fill="#BFD3E8" />
        <path d="M528 462 L545 420 L562 462 Z M556 462 L575 428 L594 462 Z" fill="#F8FBFF" />
        <circle cx={545} cy={432} r={6} fill="#E8B48F" />
        <circle cx={575} cy={436} r={6} fill="#F0C4A2" />
      </g>
      {/* two cups */}
      <rect x={680} y={434} width={30} height={36} rx={5} fill="#F8FBFF" />
      <rect x={720} y={438} width={28} height={32} rx={5} fill={C.red} />
      <Santa x={330} y={690} s={1.3} pose="idle" mood="happy" />
      <Nicholas x={890} y={690} s={1.3} pose="point" mood="happy" flip />
    </Frame>
  )
}

/** 4 — Santa and Nicholas hide inside the truck, among the stolen presents. */
export function StoryTrap() {
  return (
    <Frame label="Santa and Nicholas hiding inside a delivery truck full of stolen presents">
      <defs>
        <linearGradient id="st-night" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#0E1830" />
          <stop offset="1" stopColor="#2C3E63" />
        </linearGradient>
      </defs>
      <rect width={1200} height={700} fill="url(#st-night)" />
      <rect y={600} width={1200} height={100} fill="#3A4757" />
      <path d="M0 640 H1200" stroke={C.gold} strokeWidth={6} strokeDasharray="60 40" opacity={0.6} />
      <Truck x={820} y={640} s={1.55} />
      {/* cut-away of the cargo box */}
      <rect x={430} y={262} width={540} height={286} rx={6} fill="#1C2433" />
      <rect x={430} y={262} width={540} height={286} rx={6} fill="none" stroke="#F8FBFF" strokeWidth={10} strokeDasharray="22 14" />
      <Crate x={450} y={430} w={140} h={110} dark />
      <Present x={600} y={440} w={90} h={100} color={C.red} />
      <Present x={830} y={420} w={110} h={120} color={C.green} />
      <Present x={860} y={340} w={70} h={80} color={C.gold} ribbon={C.red} />
      <Present x={470} y={360} w={80} h={70} color="#8BCDF2" ribbon="#fff" />
      <Nicholas x={660} y={548} s={0.85} mood="surprised" />
      <Santa x={780} y={548} s={0.82} mood="surprised" />
      {/* the thieves find them */}
      <ThiefBoss x={250} y={660} s={1.05} pose="grab" mood="sly" />
      <ThiefSidekick x={110} y={665} s={1.02} pose="grab" />
    </Frame>
  )
}

/** 5 — The detective and Pip rescue Santa and Nicholas; the thieves are trapped. */
export function StorySaved() {
  return (
    <Frame label="The detective and Pip rescue Santa and Nicholas while the thieves are trapped">
      <rect width={1200} height={700} fill="#3B4658" />
      {Array.from({ length: 30 }, (_, i) => (
        <rect key={i} x={i * 40} y={0} width={14} height={540} fill="#35404F" />
      ))}
      <circle cx={760} cy={360} r={360} fill="#FFE9A8" opacity={0.12} />
      {/* thieves behind the lowered shutter grille */}
      <rect x={40} y={200} width={300} height={340} fill="#2B3442" />
      <ThiefBoss x={130} y={540} s={0.7} mood="surprised" />
      <ThiefSidekick x={250} y={540} s={0.72} mood="surprised" />
      {Array.from({ length: 9 }, (_, i) => (
        <rect key={i} x={48 + i * 35} y={200} width={8} height={340} fill="#7D8A9C" />
      ))}
      <rect x={30} y={190} width={320} height={16} fill="#5F6B7C" />
      <rect y={540} width={1200} height={160} fill="#4A5567" />
      <Present x={1040} y={420} w={110} h={120} color={C.red} />
      <Present x={960} y={470} w={80} h={70} color={C.gold} ribbon={C.red} />
      <Present x={1070} y={340} w={70} h={74} color={C.green} />
      <Santa x={600} y={680} s={1.15} pose="cheer" />
      <Nicholas x={790} y={680} s={1.15} pose="wave" />
      <Detective x={430} y={680} s={1.15} />
      <Pip x={920} y={690} s={1.05} pose="cheer" />
    </Frame>
  )
}

export const STORY_ART = [StoryMissingPresents, StoryWarning, StoryMeeting, StoryTrap, StorySaved]
