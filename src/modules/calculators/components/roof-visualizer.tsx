"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import {
  DEFAULT_HOUSE, FACADES, FRAMES, GUTTERS, HouseConfig, Light, MATERIALS, RoofMaterial, Swatch, resolve,
} from "@lib/calculators/visualizer"
import { addCalc } from "@lib/quote-list"
import { track } from "@lib/util/analytics"
import HouseSVG from "./house-svg"

function Swatches({ label, items, value, onChange, current }: {
  label: string; items: Swatch[]; value: string; onChange: (id: string) => void; current?: string
}) {
  const selected = items.find((i) => i.id === value)
  return (
    <div>
      <div className="flex items-baseline justify-between gap-x-3 mb-2.5">
        <span className="text-sm font-semibold text-[#1D1D1F]">{label}</span>
        <span className="text-[13px] text-[#6E6E73] truncate">{current ?? [selected?.code, selected?.name].filter(Boolean).join(" · ")}</span>
      </div>
      <div className="flex flex-wrap gap-2.5">
        {items.map((s) => (
          <button
            key={s.id}
            type="button"
            onClick={() => onChange(s.id)}
            aria-pressed={value === s.id}
            aria-label={[s.code, s.name].filter(Boolean).join(" ")}
            title={[s.code, s.name].filter(Boolean).join(" · ")}
            className={`w-10 h-10 rounded-full p-[3px] border-2 transition-colors ${value === s.id ? "border-[#1D1D1F]" : "border-transparent hover:border-[#D2D2D7]"}`}
          >
            <span
              className="block w-full h-full rounded-full shadow-[inset_0_0_0_1px_rgba(0,0,0,0.12)]"
              style={{ background: s.hex || "conic-gradient(#4A3530 0 25%, #3A4045 0 50%, #9C3C27 0 75%, #1C1C1E 0)" }}
            />
          </button>
        ))}
      </div>
    </div>
  )
}

const LIGHTS: { id: Light; name: string }[] = [
  { id: "zi", name: "Zi" },
  { id: "apus", name: "Apus" },
  { id: "seara", name: "Seară" },
]

export default function RoofVisualizer() {
  const router = useRouter()
  const [cfg, setCfg] = useState<HouseConfig>(DEFAULT_HOUSE)
  const [saved, setSaved] = useState<HouseConfig[]>([])
  const r = resolve(cfg)
  const set = (patch: Partial<HouseConfig>) => setCfg((c) => ({ ...c, ...patch }))

  // din comparator: /calculatoare/vizualizator-acoperis?material=ceramica
  useEffect(() => {
    const m = new URLSearchParams(window.location.search).get("material")
    const found = MATERIALS.find((x) => x.id === m)
    if (found) setCfg((c) => ({ ...c, material: found.id, roof: found.colors[0].id }))
  }, [])

  const pickMaterial = (id: RoofMaterial) => {
    const m = MATERIALS.find((x) => x.id === id)!
    // păstrăm culoarea dacă există și la noul material
    set({ material: id, roof: m.colors.some((c) => c.id === cfg.roof) ? cfg.roof : m.colors[0].id })
    track("vizualizator", { material: id })
  }

  const describe = (c: HouseConfig) => {
    const x = resolve(c)
    return `${x.material.name}, ${[x.roof.code, x.roof.name.toLowerCase()].filter(Boolean).join(" ")}; fațadă ${x.facade.name.toLowerCase()}; tâmplărie ${x.frames.name.toLowerCase()}; jgheaburi ${x.gutters.name.toLowerCase()}`
  }

  const sameAs = (a: HouseConfig, b: HouseConfig) =>
    a.material === b.material && a.roof === b.roof && a.facade === b.facade && a.frames === b.frames && a.gutters === b.gutters

  const save = () => {
    if (saved.some((s) => sameAs(s, cfg))) return
    setSaved((s) => [...s.slice(-2), cfg])
  }

  const toQuote = () => {
    addCalc({
      id: "vizualizator",
      title: "Vizualizator acoperiș",
      summary: "combinația aleasă pentru acoperiș și fațadă",
      lines: [
        { name: "Învelitoare", amount: `${r.material.name}, ${[r.roof.code, r.roof.name].filter(Boolean).join(" ")}` },
        { name: "Jgheaburi și burlane", amount: r.gutters.id === "asortat" ? `asortate (${r.roof.name.toLowerCase()})` : r.gutters.name.toLowerCase() },
        { name: "Fațadă", amount: r.facade.name },
        { name: "Tâmplărie", amount: r.frames.name },
      ],
      href: window.location.pathname,
    })
    track("calculator_oferta", { calculator: "vizualizator" })
    router.push("/cerere-oferta")
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_380px] gap-5 items-start">
      <div className="lg:sticky lg:top-36 flex flex-col gap-4">
        <div className="relative rounded-[26px] overflow-hidden bg-[#F5F5F7]">
          <HouseSVG config={cfg} className="block w-full h-auto" />
          <div className="absolute top-3 right-3 flex bg-white/85 backdrop-blur rounded-full p-1 shadow-sm">
            {LIGHTS.map((l) => (
              <button key={l.id} type="button" onClick={() => set({ light: l.id })} aria-pressed={cfg.light === l.id}
                className={`h-8 px-3.5 rounded-full text-[13px] font-medium ${cfg.light === l.id ? "bg-[#1D1D1F] text-white" : "text-[#424245] hover:text-[#1D1D1F]"}`}>
                {l.name}
              </button>
            ))}
          </div>
          <div className="hidden sm:block absolute left-3 bottom-3 bg-white/90 backdrop-blur rounded-2xl px-4 py-2.5 shadow-sm">
            <p className="text-[13px] text-[#6E6E73] leading-tight">{r.material.name}</p>
            <p className="text-[15px] font-semibold text-[#1D1D1F] leading-tight">{[r.roof.code, r.roof.name].filter(Boolean).join(" · ")}</p>
          </div>
        </div>

        {saved.length > 0 && (
          <div>
            <p className="text-sm font-semibold text-[#1D1D1F] mb-2">Variantele salvate</p>
            <div className="grid grid-cols-3 gap-3">
              {saved.map((s, i) => (
                <button key={i} type="button" onClick={() => setCfg({ ...s, light: cfg.light })}
                  className={`rounded-[18px] overflow-hidden bg-[#F5F5F7] border-2 text-left ${sameAs(s, cfg) ? "border-[#F27A1A]" : "border-transparent hover:border-[#D2D2D7]"}`}>
                  <HouseSVG config={{ ...s, light: "zi" }} className="block w-full h-auto" title={describe(s)} />
                  <span className="block px-2.5 py-1.5 text-[12px] text-[#424245] leading-tight line-clamp-2">{describe(s)}</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      <aside className="bg-[#F5F5F7] rounded-[26px] p-5 md:p-6 flex flex-col gap-6">
        <div>
          <span className="block text-sm font-semibold text-[#1D1D1F] mb-2.5">Învelitoarea</span>
          <div className="grid grid-cols-2 gap-2">
            {MATERIALS.map((m) => (
              <button key={m.id} type="button" onClick={() => pickMaterial(m.id)} aria-pressed={cfg.material === m.id}
                className={`text-left rounded-[18px] border-2 px-3.5 py-3 bg-white transition-colors ${cfg.material === m.id ? "border-[#F27A1A]" : "border-transparent hover:border-[#D2D2D7]"}`}>
                <span className="block text-[15px] font-semibold text-[#1D1D1F] leading-tight">{m.name}</span>
                <span className="block text-[12px] text-[#6E6E73] mt-0.5 leading-tight">{m.text}</span>
              </button>
            ))}
          </div>
        </div>

        <Swatches label="Culoarea acoperișului" items={r.material.colors} value={r.roof.id} onChange={(id) => set({ roof: id })} />
        <Swatches label="Fațada" items={FACADES} value={cfg.facade} onChange={(id) => set({ facade: id })} />
        <Swatches label="Tâmplăria" items={FRAMES} value={cfg.frames} onChange={(id) => set({ frames: id })} />
        <Swatches label="Jgheaburi și burlane" items={GUTTERS} value={cfg.gutters} onChange={(id) => set({ gutters: id })} />

        <div className="flex flex-col gap-2.5 pt-1">
          <button type="button" onClick={toQuote} className="w-full btn-pill">Adăugați în lista de ofertă</button>
          <div className="grid grid-cols-2 gap-2">
            <LocalizedClientLink href={r.material.calc} className="h-11 flex items-center justify-center rounded-full bg-white text-[15px] font-medium text-[#1D1D1F] border border-[#D2D2D7] hover:border-[#1D1D1F]">
              Calculați necesarul
            </LocalizedClientLink>
            <button type="button" onClick={save} className="h-11 rounded-full bg-white text-[15px] font-medium text-[#1D1D1F] border border-[#D2D2D7] hover:border-[#1D1D1F]">
              Salvați varianta
            </button>
          </div>
          <LocalizedClientLink href={r.material.category} className="link-more text-center text-[15px] mt-1">
            Vedeți produsele: {r.material.name.toLowerCase()} ›
          </LocalizedClientLink>
        </div>

        <p className="text-xs text-[#6E6E73] leading-relaxed">
          Culorile de pe ecran sunt aproximative și diferă de la un monitor la altul. Gama de culori diferă de la un model la altul; vă recomandăm să vedeți mostrele înainte de comandă.
        </p>
      </aside>
    </div>
  )
}
