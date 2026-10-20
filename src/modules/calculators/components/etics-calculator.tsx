"use client"

import { useMemo, useState } from "react"
import { calculateEtics } from "@lib/calculators/etics"
import { fmt } from "@lib/calculators/roof"
import { ETICS_ADHESIVES, ETICS_FINISHES, ETICS_INSULATION, ETICS_RULES } from "@lib/calculators/data"
import { Choice, Disclaimer, NumberField, ResultTable, SendToQuote, Step, Stepper, Line } from "./ui"

function WallIcon({ wool, active }: { wool: boolean; active: boolean }) {
  return (
    <svg width="44" height="36" viewBox="0 0 44 36" aria-hidden="true">
      <rect x="4" y="4" width="14" height="28" fill={active ? "#FDBA74" : "#E2E8F0"} />
      <rect x="18" y="4" width="12" height="28" fill={wool ? (active ? "#FCD34D" : "#F1F5F9") : (active ? "#fff" : "#F8FAFC")} stroke={active ? "#F27A1A" : "#CBD5E1"} />
      {wool && [8, 14, 20, 26].map((y) => <path key={y} d={`M19 ${y} q3 -3 6 0 t5 0`} stroke={active ? "#B45309" : "#94A3B8"} fill="none" />)}
      <rect x="30" y="4" width="3" height="28" fill={active ? "#F27A1A" : "#94A3B8"} />
    </svg>
  )
}

export default function EticsCalculator() {
  const [insId, setInsId] = useState(ETICS_INSULATION[0].id)
  const ins = ETICS_INSULATION.find((i) => i.id === insId)!
  const [thickness, setThickness] = useState(ins.thicknesses.includes(10) ? 10 : ins.thicknesses[0])
  const adhesives = ETICS_ADHESIVES.filter((a) => a.bond[ins.kind] !== undefined)
  const [adhId, setAdhId] = useState(ETICS_ADHESIVES[0].id)
  const adh = adhesives.find((a) => a.id === adhId) ?? adhesives[0]
  const [finishId, setFinishId] = useState<string>(ETICS_FINISHES[0]?.id ?? "fara")
  const [perimeter, setPerimeter] = useState(40)
  const [height, setHeight] = useState(6)
  const [openings, setOpenings] = useState(25)
  const [openingsPerimeter, setOpeningsPerimeter] = useState(40)
  const [corners, setCorners] = useState(4)

  const finish = ETICS_FINISHES.find((f) => f.id === finishId) ?? null
  const thick = ins.thicknesses.includes(thickness) ? thickness : ins.thicknesses[0]
  const valid = perimeter > 0 && height > 0 && openings >= 0
  const res = useMemo(
    () => (valid ? calculateEtics({ perimeter, height, openings, openingsPerimeter: openingsPerimeter || 0, corners, thickness: thick }, ins, adh, finish, ETICS_RULES) : null),
    [valid, perimeter, height, openings, openingsPerimeter, corners, thick, ins, adh, finish]
  )
  const lines: Line[] = res ? res.lines.map((l) => ({ name: l.name, quantity: l.quantity, unit: l.unit, note: l.note, href: l.handle ? `/products/${l.handle}` : undefined })) : []

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_400px] gap-5 items-start">
      <div className="flex flex-col gap-5">
        <Step n={1} title="Materialul izolant">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {ETICS_INSULATION.map((i) => (
              <Choice key={i.id} selected={insId === i.id} onClick={() => { setInsId(i.id); if (!i.thicknesses.includes(thickness)) setThickness(i.thicknesses[0]) }} title={i.name}
                subtitle={i.kind === "eps" ? "Ușor, cel mai folosit la case" : `Incombustibilă, permeabilă la vapori${i.note ? ` · ${i.note}` : ""}`}
                icon={<WallIcon wool={i.kind === "vata"} active={insId === i.id} />} />
            ))}
          </div>
          <div className="mt-4">
            <span className="text-sm font-medium text-[#1D1D1F]">Grosimea plăcilor</span>
            <div className="flex flex-wrap gap-2 mt-1.5">
              {ins.thicknesses.map((t) => (
                <button key={t} type="button" aria-pressed={thick === t} onClick={() => setThickness(t)}
                  className={`h-10 min-w-[64px] px-4 rounded-full text-sm font-medium border-2 ${thick === t ? "border-[#F27A1A] bg-white text-[#1D1D1F]" : "border-transparent bg-white text-[#424245] hover:border-[#D2D2D7]"}`}>
                  {t} cm
                </button>
              ))}
            </div>
          </div>
        </Step>

        <Step n={2} title="Adezivul" hint="Același adeziv se folosește la lipirea plăcilor și la șpăcluirea cu plasă.">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {adhesives.map((a) => (
              <Choice key={a.id} selected={adh.id === a.id} onClick={() => setAdhId(a.id)} title={a.name}
                subtitle={`lipire ${fmt(a.bond[ins.kind] ?? 0, 1)} kg/m² · șpăcluire ${fmt(a.mesh, 1)} kg/m²`} />
            ))}
          </div>
        </Step>

        <Step n={3} title="Dimensiunile fațadei" hint="Perimetrul e suma lungimilor tuturor pereților exteriori. Scădem suprafața ferestrelor și ușilor.">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <NumberField id="e-per" label="Perimetrul casei" value={perimeter} onChange={setPerimeter} unit="m" />
            <NumberField id="e-h" label="Înălțimea de izolat" value={height} onChange={setHeight} unit="m" hint="De la soclu până la streașină" />
            <NumberField id="e-op" label="Suprafața ferestrelor și ușilor" value={openings} onChange={setOpenings} unit="m²" step={0.5} />
            <NumberField id="e-opp" label="Perimetrul ferestrelor și ușilor" value={openingsPerimeter} onChange={setOpeningsPerimeter} unit="m" hint="Pentru colțarele de la glafuri. Puteți lăsa 0." />
            <Stepper label="Colțuri exterioare ale casei" value={corners} onChange={setCorners} max={16} />
          </div>
        </Step>

        <Step n={4} title="Finisajul">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {ETICS_FINISHES.map((f) => (
              <Choice key={f.id} selected={finishId === f.id} onClick={() => setFinishId(f.id)} title={f.name} subtitle={`${fmt(f.kgM2, 1)} kg/m², ${f.unit === "sac" ? "saci" : "găleți"} de ${f.bagKg} kg`} />
            ))}
            <Choice selected={finishId === "fara"} onClick={() => setFinishId("fara")} title="Fără tencuială" subtitle="Doar sistemul de izolare" />
          </div>
        </Step>
      </div>

      <aside className="bg-white border border-[#D2D2D7] rounded-[26px] p-5 md:p-7 lg:sticky lg:top-36 flex flex-col gap-5">
        {res ? (
          <div className="grid grid-cols-2 gap-2">
            <div className="bg-[#F5F5F7] rounded-2xl p-3.5"><b className="block text-2xl font-semibold tracking-[-0.02em]">{fmt(res.area, 1)}</b><span className="text-xs text-[#6E6E73]">m² de izolat</span></div>
            <div className="bg-[#F5F5F7] rounded-2xl p-3.5"><b className="block text-2xl font-semibold tracking-[-0.02em]">{thick} cm</b><span className="text-xs text-[#6E6E73]">dibluri de {res.dowel} mm</span></div>
          </div>
        ) : (
          <p className="text-sm text-red-600">Completați dimensiunile ca să vedem calculul.</p>
        )}
        {res && <ResultTable title="Materiale" lines={lines} />}
        {res && <SendToQuote calculator="termosistem" summary={`${fmt(res.area, 1)} m² fațadă, ${ins.name} ${thick} cm`} lines={lines} />}
        <Disclaimer />
      </aside>
    </div>
  )
}
