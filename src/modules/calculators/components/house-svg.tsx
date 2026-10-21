"use client"

import { useId } from "react"
import { HouseConfig, resolve, shade } from "@lib/calculators/visualizer"

/**
 * Casa desenată din vizualizator, în perspectivă oblică: fațada lungă în față,
 * fronton în stânga. Învelitoarea e un model SVG înclinat după panta acoperișului.
 */

// panta planului din față: de la coamă (169,110) la streașină (251.5,297)
const SKEW = (Math.atan(82.5 / 187) * 180) / Math.PI

const SKIES = {
  zi: ["#DCEBF8", "#F7FBFF"],
  apus: ["#F6C9A0", "#FCEFE2"],
  seara: ["#1B2440", "#3D4A6E"],
}

export function RoofPattern({ id, material, color }: { id: string; material: string; color: string }) {
  const t = `skewX(${SKEW})`
  if (material === "faltuita") {
    return (
      <pattern id={id} width="30" height="60" patternUnits="userSpaceOnUse" patternTransform={t}>
        <rect width="30" height="60" fill={color} />
        <rect width="30" height="60" fill={`url(#${id}-g)`} />
        <rect x="0" width="2.4" height="60" fill="rgba(255,255,255,.30)" />
        <rect x="2.4" width="2.2" height="60" fill="rgba(0,0,0,.35)" />
        <linearGradient id={`${id}-g`} x1="0" x2="1">
          <stop offset="0" stopColor="#000" stopOpacity=".12" />
          <stop offset=".5" stopColor="#fff" stopOpacity=".06" />
          <stop offset="1" stopColor="#000" stopOpacity=".05" />
        </linearGradient>
      </pattern>
    )
  }
  if (material === "ceramica") {
    return (
      <pattern id={id} width="26" height="24" patternUnits="userSpaceOnUse" patternTransform={t}>
        <rect width="26" height="24" fill={color} />
        <rect width="26" height="24" fill={`url(#${id}-g)`} />
        <path d="M0 24 Q13 17 26 24 Z" fill="rgba(0,0,0,.22)" />
        <rect y="21.5" width="26" height="2.5" fill="rgba(0,0,0,.30)" />
        <rect x="0" width="2" height="24" fill="rgba(0,0,0,.25)" />
        <linearGradient id={`${id}-g`} x1="0" x2="1">
          <stop offset="0" stopColor="#fff" stopOpacity=".05" />
          <stop offset=".35" stopColor="#fff" stopOpacity=".16" />
          <stop offset="1" stopColor="#000" stopOpacity=".16" />
        </linearGradient>
      </pattern>
    )
  }
  if (material === "beton") {
    return (
      <pattern id={id} width="32" height="28" patternUnits="userSpaceOnUse" patternTransform={t}>
        <rect width="32" height="28" fill={color} />
        <rect width="32" height="28" fill={`url(#${id}-g)`} />
        <rect y="25" width="32" height="3" fill="rgba(0,0,0,.34)" />
        <rect y="24" width="32" height="1" fill="rgba(255,255,255,.12)" />
        <linearGradient id={`${id}-g`} x1="0" x2="1">
          <stop offset="0" stopColor="#fff" stopOpacity=".14" />
          <stop offset=".3" stopColor="#fff" stopOpacity="0" />
          <stop offset=".62" stopColor="#000" stopOpacity=".30" />
          <stop offset=".85" stopColor="#000" stopOpacity=".05" />
          <stop offset="1" stopColor="#fff" stopOpacity=".14" />
        </linearGradient>
      </pattern>
    )
  }
  // țiglă metalică: valuri și trepte la 35 cm
  return (
    <pattern id={id} width="24" height="30" patternUnits="userSpaceOnUse" patternTransform={t}>
      <rect width="24" height="30" fill={color} />
      <rect width="24" height="30" fill={`url(#${id}-g)`} />
      <rect y="25" width="24" height="1.2" fill="rgba(255,255,255,.22)" />
      <rect y="26.2" width="24" height="3.8" fill="rgba(0,0,0,.38)" />
      <linearGradient id={`${id}-g`} x1="0" x2="1">
        <stop offset="0" stopColor="#fff" stopOpacity=".22" />
        <stop offset=".45" stopColor="#fff" stopOpacity="0" />
        <stop offset=".8" stopColor="#000" stopOpacity=".26" />
        <stop offset="1" stopColor="#fff" stopOpacity=".22" />
      </linearGradient>
    </pattern>
  )
}

/** Variații de nuanță între țigle (doar la țigla ceramică și de beton). */
function Variation({ id, w, h }: { id: string; w: number; h: number }) {
  const cells = [
    [0, 0, 0.07], [1, 1, -0.08], [2, 0, 0.05], [3, 2, -0.06], [0, 3, 0.06], [4, 1, 0.08],
    [2, 4, -0.07], [5, 3, 0.05], [1, 5, -0.05], [4, 5, 0.06], [3, 0, -0.04], [5, 6, -0.07],
  ]
  return (
    <pattern id={id} width={w * 6} height={h * 7} patternUnits="userSpaceOnUse" patternTransform={`skewX(${SKEW})`}>
      {cells.map(([x, y, a], i) => (
        <rect key={i} x={x * w} y={y * h} width={w} height={h} fill={a > 0 ? "#fff" : "#000"} opacity={Math.abs(a)} />
      ))}
    </pattern>
  )
}

export default function HouseSVG({ config, className, title }: { config: HouseConfig; className?: string; title?: string }) {
  const uid = useId().replace(/:/g, "")
  const r = resolve(config)
  const night = config.light === "seara"
  // seara întunecăm casa, dar nu și ferestrele luminate
  const dim = (hex: string) => (night ? shade(hex, 0.62) : hex)
  const material = r.material
  const roof = { ...r.roof, hex: dim(r.roof.hex) }
  const facade = { ...r.facade, hex: dim(r.facade.hex) }
  const frames = { ...r.frames, hex: dim(r.frames.hex) }
  const gutters = { ...r.gutters, hex: dim(r.gutters.hex) }
  const sunset = config.light === "apus"
  const [sky1, sky2] = SKIES[config.light]
  const side = shade(facade.hex, 0.84)
  const plinth = shade(facade.hex, 0.55)
  const glass = night ? "#FFD98A" : sunset ? "#F5C79E" : "#BFD6EA"
  const roofDark = shade(roof.hex, 0.6)
  const tiles = material.id === "ceramica" || material.id === "beton"

  const P = `${uid}p`
  const windows = [
    { x: 296, w: 62 },
    { x: 386, w: 62 },
    { x: 590, w: 62 },
  ]

  return (
    <svg viewBox="0 0 800 500" className={className} role="img" aria-label={title ?? `Casă cu ${material.name.toLowerCase()} ${r.roof.name.toLowerCase()} și fațadă ${r.facade.name.toLowerCase()}`}>
      <defs>
        <linearGradient id={`${P}sky`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={sky1} />
          <stop offset="1" stopColor={sky2} />
        </linearGradient>
        <linearGradient id={`${P}ground`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={night ? "#3C4A3A" : "#DDE5CF"} />
          <stop offset="1" stopColor={night ? "#2B362A" : "#C9D6B6"} />
        </linearGradient>
        <linearGradient id={`${P}roofLight`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#fff" stopOpacity=".12" />
          <stop offset="1" stopColor="#000" stopOpacity=".14" />
        </linearGradient>
        <linearGradient id={`${P}glass`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor={shade(glass, 1.25)} />
          <stop offset="1" stopColor={shade(glass, night ? 0.95 : 0.78)} />
        </linearGradient>
        <radialGradient id={`${P}glow`}>
          <stop offset="0" stopColor="#FFC766" stopOpacity=".45" />
          <stop offset="1" stopColor="#FFC766" stopOpacity="0" />
        </radialGradient>
        <RoofPattern id={`${P}roof`} material={material.id} color={roof.hex} />
        {tiles && <Variation id={`${P}var`} w={material.id === "beton" ? 32 : 26} h={material.id === "beton" ? 28 : 24} />}
      </defs>

      {/* cer și teren */}
      <rect width="800" height="500" fill={`url(#${P}sky)`} />
      {config.light === "zi" && <circle cx="96" cy="70" r="26" fill="#FFF4CF" opacity=".9" />}
      {sunset && <circle cx="96" cy="150" r="40" fill="#FFD6A3" opacity=".9" />}
      {night && [[80, 50], [160, 90], [300, 40], [700, 60], [760, 120], [520, 30]].map(([x, y]) => <circle key={`${x}`} cx={x} cy={y} r="1.6" fill="#fff" opacity=".8" />)}
      <path d="M0 360 Q200 330 420 350 T800 340 V500 H0Z" fill={night ? "#2E3B33" : "#E6ECDD"} opacity=".7" />
      <rect y="440" width="800" height="60" fill={`url(#${P}ground)`} />
      <ellipse cx="400" cy="447" rx="330" ry="11" fill="#000" opacity=".14" />

      {/* perete lateral cu fronton */}
      <polygon points="110,235 185,110 260,280 260,440 110,395" fill={side} />
      <polygon points="110,367 260,412 260,440 110,395" fill={shade(plinth, 0.9)} />
      {/* fereastră laterală și lucarnă */}
      <polygon points="160,300 212,315.6 212,372 160,356.4" fill={frames.hex} />
      <polygon points="165,306 207,318.6 207,365.6 165,353" fill={`url(#${P}glass)`} />
      <ellipse cx="185" cy="214" rx="12" ry="15" fill={frames.hex} transform="rotate(16 185 214)" />
      <ellipse cx="185" cy="214" rx="8" ry="11" fill={`url(#${P}glass)`} transform="rotate(16 185 214)" />

      {/* fațada din față */}
      <rect x="260" y="280" width="420" height="160" fill={facade.hex} />
      <rect x="260" y="412" width="420" height="28" fill={plinth} />
      {windows.map((w) => (
        <g key={w.x}>
          {night && <ellipse cx={w.x + w.w / 2} cy="350" rx="60" ry="46" fill={`url(#${P}glow)`} />}
          <rect x={w.x - 4} y="318" width={w.w + 8} height="70" rx="2" fill={frames.hex} />
          <rect x={w.x} y="322" width={w.w} height="62" fill={`url(#${P}glass)`} />
          <rect x={w.x + w.w / 2 - 1.5} y="322" width="3" height="62" fill={frames.hex} />
          <rect x={w.x - 7} y="388" width={w.w + 14} height="5" rx="1" fill={shade(facade.hex, 0.72)} />
        </g>
      ))}
      {/* ușa */}
      {night && <ellipse cx="519" cy="380" rx="50" ry="60" fill={`url(#${P}glow)`} />}
      <rect x="492" y="330" width="54" height="110" rx="2" fill={frames.hex} />
      <rect x="497" y="335" width="44" height="105" fill={shade(frames.hex, frames.id === "alb" ? 0.93 : 1.12)} />
      <rect x="507" y="345" width="24" height="40" rx="1" fill={`url(#${P}glass)`} />
      <rect x="533" y="392" width="3" height="16" rx="1.5" fill={shade(frames.hex, 0.5)} />
      <rect x="484" y="436" width="70" height="6" fill={shade(plinth, 1.15)} />

      {/* acoperișul */}
      <polygon points="169,110 86.5,247.5 95,254 176,116" fill={roofDark} />
      <polygon points="172,113 89,250 92,252.5 175,115" fill={roof.hex} opacity=".7" />
      <polygon points="169,110 621,110 703.5,297 251.5,297" fill={`url(#${P}roof)`} />
      {tiles && <polygon points="169,110 621,110 703.5,297 251.5,297" fill={`url(#${P}var)`} />}
      <polygon points="169,110 621,110 703.5,297 251.5,297" fill={`url(#${P}roofLight)`} />
      {/* coama */}
      <rect x="164" y="104" width="462" height="10" rx="5" fill={shade(roof.hex, tiles ? 0.85 : 0.75)} />
      {/* coș de fum */}
      <rect x="540" y="66" width="36" height="88" fill={shade(facade.hex, 0.92)} />
      <polygon points="576,66 588,60 588,148 576,154" fill={shade(facade.hex, 0.75)} />
      <rect x="535" y="58" width="56" height="9" rx="1.5" fill={roofDark} />
      {/* streașina și jgheabul */}
      <polygon points="251.5,297 703.5,297 699,305 256,305" fill={roofDark} />
      <rect x="246" y="303" width="464" height="9" rx="4.5" fill={gutters.hex} />
      <rect x="246" y="303" width="464" height="3" rx="1.5" fill="#fff" opacity=".18" />
      <rect x="688" y="310" width="8" height="132" rx="3" fill={gutters.hex} />
      <rect x="688" y="310" width="2.5" height="132" fill="#fff" opacity=".15" />
      <rect x="266" y="310" width="8" height="132" rx="3" fill={gutters.hex} />

      {/* alee, arbust, copac */}
      <polygon points="497,442 541,442 590,500 448,500" fill={night ? "#59606A" : "#D9D4CA"} />
      <ellipse cx="300" cy="438" rx="34" ry="16" fill={night ? "#2F4A33" : "#7E9C66"} />
      <ellipse cx="640" cy="438" rx="30" ry="14" fill={night ? "#2C452F" : "#728F5C"} />
      <rect x="742" y="360" width="10" height="84" rx="3" fill={night ? "#3B2E26" : "#7A5A43"} />
      <circle cx="747" cy="330" r="40" fill={night ? "#2C452F" : "#86A56E"} />
      <circle cx="725" cy="355" r="28" fill={night ? "#2A402C" : "#789A60"} />
      <circle cx="770" cy="352" r="26" fill={night ? "#284029" : "#6F8F58"} />

      {sunset && <rect width="800" height="500" fill="#FF8A3D" opacity=".08" />}
    </svg>
  )
}
