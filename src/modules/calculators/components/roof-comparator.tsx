"use client"

import { useId, useMemo, useState } from "react"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { COVERINGS, CRITERIA, Covering, Criterion, rank } from "@lib/calculators/comparator"
import { fmt } from "@lib/calculators/roof"
import { RoofPattern } from "./house-svg"
import { NumberField } from "./ui"

const SWATCH: Record<string, string> = {
  metal: "#4A3530", faltuita: "#3A4045", novatik: "#2F2B2A", ceramica: "#B5542C", beton: "#5A3C2D",
}

function Swatch({ c }: { c: Covering }) {
  const id = useId().replace(/:/g, "")
  return (
    <svg viewBox="0 0 160 70" className="block w-full h-full" aria-hidden="true">
      <defs><RoofPattern id={`${id}r`} material={c.material} color={SWATCH[c.id]} /></defs>
      <rect width="160" height="70" fill={`url(#${id}r)`} />
      {c.id === "novatik" && Array.from({ length: 90 }, (_, i) => (
        <circle key={i} cx={(i * 37) % 160} cy={(i * 23) % 70} r="0.9" fill="#fff" opacity=".18" />
      ))}
      <rect width="160" height="70" fill="url(#cmp-light)" />
    </svg>
  )
}

function PitchFigure({ deg }: { deg: number }) {
  const a = (Math.min(60, Math.max(0, deg)) * Math.PI) / 180
  const w = 120
  const h = Math.tan(a) * (w / 2)
  const hh = Math.min(h, 70)
  return (
    <svg viewBox="0 0 140 90" className="w-[120px] h-[78px]" aria-hidden="true">
      <rect x="22" y="80" width="96" height="2" fill="#D2D2D7" />
      <polygon points={`10,80 70,${80 - hh} 130,80`} fill="#FED7AA" stroke="#F27A1A" strokeWidth="2" strokeLinejoin="round" />
      <text x="70" y="76" textAnchor="middle" fontSize="13" fontWeight="600" fill="#1D1D1F">{deg}°</text>
    </svg>
  )
}

const BUDGET = ["", "€", "€€", "€€€"]

export default function RoofComparator() {
  const [area, setArea] = useState(150)
  const [pitch, setPitch] = useState(30)
  const [wanted, setWanted] = useState<Criterion[]>([])
  const toggle = (k: Criterion) => setWanted((w) => (w.includes(k) ? w.filter((x) => x !== k) : [...w, k]))

  const ranked = useMemo(() => rank(COVERINGS, wanted, pitch), [wanted, pitch])
  const maxKg = Math.max(...COVERINGS.map((c) => c.kg[1]))
  const okArea = area > 0
  const bestScore = wanted.length ? Math.max(...ranked.filter((r) => r.fits).map((r) => r.score)) : -1

  return (
    <div className="flex flex-col gap-6">
      <svg width="0" height="0" className="absolute" aria-hidden="true">
        <defs>
          <linearGradient id="cmp-light" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#fff" stopOpacity=".14" />
            <stop offset="1" stopColor="#000" stopOpacity=".12" />
          </linearGradient>
        </defs>
      </svg>

      <section className="bg-[#F5F5F7] rounded-[26px] p-5 md:p-7 grid grid-cols-1 lg:grid-cols-[260px_minmax(0,1fr)_minmax(0,1.3fr)] gap-6 lg:gap-8 items-start">
        <NumberField id="c-area" label="Suprafața acoperișului" value={area} onChange={setArea} unit="m²" step={5}
          hint="O aflați din calculatorul de acoperiș; pentru o estimare, folosiți suprafața casei × 1,4." />
        <div className="flex flex-col gap-y-1.5">
          <label htmlFor="c-pitch" className="text-sm font-medium text-[#1D1D1F]">Panta acoperișului</label>
          <div className="flex items-center gap-x-4">
            <PitchFigure deg={pitch} />
            <input id="c-pitch" type="range" min={3} max={60} step={1} value={pitch} onChange={(e) => setPitch(Number(e.target.value))}
              className="flex-1 accent-[#F27A1A]" aria-valuetext={`${pitch} grade`} />
          </div>
        </div>
        <div className="flex flex-col gap-y-2">
          <span className="text-sm font-medium text-[#1D1D1F]">Ce contează pentru dumneavoastră?</span>
          <div className="flex flex-wrap gap-2">
            {CRITERIA.map((k) => (
              <button key={k.id} type="button" onClick={() => toggle(k.id)} aria-pressed={wanted.includes(k.id)}
                className={`h-10 px-4 rounded-full text-sm font-semibold border transition-colors ${wanted.includes(k.id) ? "bg-[#1D1D1F] text-white border-[#1D1D1F]" : "bg-white text-[#424245] border-transparent hover:border-[#D2D2D7]"}`}>
                {k.name}
              </button>
            ))}
          </div>
          <p className="text-[13px] text-[#6E6E73]">Alegeți una sau mai multe; ordonăm învelitorile după potrivire.</p>
        </div>
      </section>

      <div className="-mx-4 px-4 scroll-px-4 md:mx-0 md:px-0 overflow-x-auto snap-x snap-mandatory md:overflow-visible pb-2">
        <div className="grid grid-flow-col auto-cols-[78%] sm:auto-cols-[46%] md:grid-flow-row md:grid-cols-3 xl:grid-cols-5 gap-3 md:gap-4">
          {ranked.map(({ c, fits, score }) => {
            const partial = fits && pitch < c.pitch[1]
            const totalMin = (area * c.kg[0]) / 1000
            const totalMax = (area * c.kg[1]) / 1000
            const best = wanted.length > 0 && fits && score === bestScore
            return (
              <article key={c.id}
                className={`snap-start relative flex flex-col bg-white border rounded-[26px] overflow-hidden transition-opacity ${best ? "border-[#F27A1A] border-2" : "border-[#D2D2D7]"} ${fits ? "" : "opacity-60"}`}>
                <div className="h-20 relative">
                  <Swatch c={c} />
                  {best && <span className="absolute top-3 left-3 bg-[#F27A1A] text-white text-[12px] font-semibold px-2.5 py-1 rounded-full">Cea mai potrivită</span>}
                </div>
                <div className="p-5 flex flex-col gap-4 flex-1">
                  <h2 className="text-[19px] font-semibold tracking-[-0.015em] text-[#1D1D1F] leading-tight min-h-[2.5em]">{c.name}</h2>

                  <div>
                    <p className="text-[13px] text-[#6E6E73]">Greutate</p>
                    <p className="text-[15px] font-semibold text-[#1D1D1F]">{c.kg[0]}–{c.kg[1]} kg/m²</p>
                    <div className="h-2 rounded-full bg-[#F5F5F7] mt-1.5 overflow-hidden">
                      <div className="h-full rounded-full bg-[#F27A1A]" style={{ width: `${Math.max(3, (c.kg[1] / maxKg) * 100)}%` }} />
                    </div>
                    {okArea && (
                      <p className="text-[13px] text-[#6E6E73] mt-1">
                        Pe {fmt(area, 0)} m²: <b className="text-[#1D1D1F] font-semibold">{totalMax < 1 ? `${fmt(totalMin * 1000, 0)}–${fmt(totalMax * 1000, 0)} kg` : `${fmt(totalMin, 1)}–${fmt(totalMax, 1)} t`}</b>
                      </p>
                    )}
                  </div>

                  <div>
                    <p className="text-[13px] text-[#6E6E73]">Pantă minimă</p>
                    <p className="text-[15px] font-semibold text-[#1D1D1F]">
                      {c.pitch[0] === c.pitch[1] ? `${c.pitch[0]}°` : `${c.pitch[0]}–${c.pitch[1]}°`}
                    </p>
                    {c.pitchNote && <p className="text-[12px] text-[#6E6E73] leading-snug">{c.pitchNote}</p>}
                    <p className={`mt-1.5 inline-flex items-center gap-x-1.5 text-[12px] font-semibold px-2.5 py-1 rounded-full ${!fits ? "bg-red-50 text-red-700" : partial ? "bg-amber-50 text-amber-800" : "bg-green-50 text-green-700"}`}>
                      {!fits ? `Nu pentru ${pitch}°` : partial ? `La ${pitch}°: depinde de model` : `Potrivită pentru ${pitch}°`}
                    </p>
                  </div>

                  <dl className="flex flex-col gap-3 text-[14px]">
                    {[
                      ["Garanție", c.warranty],
                      ["Zgomot la ploaie", c.noise],
                      ["Montaj", c.install],
                      ["Structură", c.structure],
                    ].map(([k, v]) => (
                      <div key={k}>
                        <dt className="text-[13px] text-[#6E6E73]">{k}</dt>
                        <dd className="text-[#1D1D1F] leading-snug">{v}</dd>
                      </div>
                    ))}
                    <div>
                      <dt className="text-[13px] text-[#6E6E73]">Buget relativ</dt>
                      <dd className="text-[#1D1D1F] font-semibold tracking-wider">
                        {BUDGET[c.budget]}<span className="text-[#D2D2D7]">{"€€€".slice(c.budget)}</span>
                      </dd>
                    </div>
                  </dl>

                  <div className="mt-auto pt-2 flex flex-col gap-2">
                    <LocalizedClientLink href={c.calc} className="h-10 flex items-center justify-center rounded-full bg-[#1D1D1F] text-white text-sm font-medium hover:bg-black">
                      Calculați necesarul
                    </LocalizedClientLink>
                    <div className="grid grid-cols-2 gap-2">
                      <LocalizedClientLink href={c.category} className="h-10 flex items-center justify-center rounded-full border border-[#D2D2D7] text-sm font-medium text-[#1D1D1F] hover:border-[#1D1D1F]">
                        Produse
                      </LocalizedClientLink>
                      <LocalizedClientLink href={`/calculatoare/vizualizator-acoperis?material=${c.material}`} className="h-10 flex items-center justify-center rounded-full border border-[#D2D2D7] text-sm font-medium text-[#1D1D1F] hover:border-[#1D1D1F]">
                        Pe casă
                      </LocalizedClientLink>
                    </div>
                  </div>
                </div>
              </article>
            )
          })}
        </div>
      </div>

      <p className="text-xs text-[#6E6E73] leading-relaxed max-w-[90ch]">
        Greutatea și panta minimă provin din fișele tehnice ale producătorilor (Bilka, Novatik, Leier, swissporTON, Bramac) și variază de la un model la altul.
        Bugetul este relativ, doar pentru învelitoare, fără accesorii și manoperă; prețul exact îl primiți în ofertă. Pentru țigla ceramică și de beton,
        șarpanta trebuie verificată de proiectant pentru greutatea învelitorii.
      </p>
    </div>
  )
}
