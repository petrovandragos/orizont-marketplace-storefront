"use client"

import { useMemo, useState } from "react"
import { calculateMasonry } from "@lib/calculators/masonry"
import { fmt } from "@lib/calculators/roof"
import { MASONRY_UNITS } from "@lib/calculators/data"
import { Choice, Disclaimer, NumberField, ResultTable, SendToQuote, Step, Line } from "./ui"

function BrickIcon({ active }: { active: boolean }) {
  const c = active ? "#F27A1A" : "#CBD5E1"
  return (
    <svg width="44" height="34" viewBox="0 0 44 34" aria-hidden="true">
      {[0, 1, 2].map((r) => [0, 1].map((k) => (
        <rect key={`${r}${k}`} x={(r % 2 ? -9 : 2) + k * 22} y={3 + r * 10} width="20" height="8" rx="1" fill={active ? "#FED7AA" : "#F1F5F9"} stroke={c} />
      )))}
    </svg>
  )
}

export default function MasonryCalculator() {
  const groups = useMemo(() => Array.from(new Set(MASONRY_UNITS.map((u) => u.group))), [])
  const [group, setGroup] = useState(groups[0])
  const [unitId, setUnitId] = useState(MASONRY_UNITS[0]?.id)
  const [length, setLength] = useState(40)
  const [height, setHeight] = useState(2.8)
  const [openings, setOpenings] = useState(20)
  const unit = MASONRY_UNITS.find((u) => u.id === unitId)!
  const valid = length > 0 && height > 0 && openings >= 0 && !!unit
  const res = useMemo(() => (valid ? calculateMasonry({ length, height, openings, waste: 0.05 }, unit) : null), [valid, length, height, openings, unit])

  const b = unit?.binder
  const binderUnit = b?.unit === "doză" ? "doză" : "sac"
  const lines: Line[] = res
    ? [
        { name: unit.name, quantity: res.pieces, unit: "buc", note: `${fmt(unit.perM2, 1)} buc/m² + 5% rezervă${res.pallets ? `, aprox. ${res.pallets} ${res.pallets === 1 ? "palet" : "paleți"}` : ""}`, href: unit.handle ? `/products/${unit.handle}` : undefined },
        ...(b
          ? [{ name: b.name, quantity: res.bags, unit: binderUnit, note: b.unit === "l" ? `${fmt(res.binderTotal, 0)} l mortar; ${b.note}` : b.note, href: b.handle ? `/products/${b.handle}` : undefined }]
          : []),
      ]
    : []

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_400px] gap-5 items-start">
      <div className="flex flex-col gap-5">
        <Step n={1} title="Elementul de zidărie">
          <div className="flex flex-wrap gap-2 mb-3">
            {groups.map((g) => (
              <button key={g} type="button" aria-pressed={group === g}
                onClick={() => { setGroup(g); const f = MASONRY_UNITS.find((u) => u.group === g); if (f) setUnitId(f.id) }}
                className={`h-9 px-4 rounded-full text-sm font-semibold border ${group === g ? "bg-[#1D1D1F] text-white border-[#1D1D1F]" : "bg-white text-[#424245] border-transparent hover:border-[#D2D2D7]"}`}>
                {g}
              </button>
            ))}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {MASONRY_UNITS.filter((u) => u.group === group).map((u) => (
              <Choice key={u.id} selected={unitId === u.id} onClick={() => setUnitId(u.id)} title={u.name}
                subtitle={`${u.size} mm · perete ${fmt(u.wallCm, 1)} cm · ${fmt(u.perM2, 1)} buc/m²`} icon={<BrickIcon active={unitId === u.id} />} />
            ))}
          </div>
        </Step>

        <Step n={2} title="Dimensiunile pereților" hint="Lungimea totală a pereților de zidit (exteriori și interiori, dacă sunt din același material).">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <NumberField id="m-len" label="Lungimea pereților" value={length} onChange={setLength} unit="m" />
            <NumberField id="m-h" label="Înălțimea pereților" value={height} onChange={setHeight} unit="m" step={0.05} />
            <NumberField id="m-op" label="Ferestre și uși" value={openings} onChange={setOpenings} unit="m²" step={0.5} />
          </div>
        </Step>
      </div>

      <aside className="bg-white border border-[#D2D2D7] rounded-[26px] p-5 md:p-7 lg:sticky lg:top-36 flex flex-col gap-5">
        {res ? (
          <div className="grid grid-cols-3 gap-2">
            <div className="bg-[#F5F5F7] rounded-2xl p-3.5"><b className="block text-2xl font-semibold tracking-[-0.02em]">{fmt(res.area, 1)}</b><span className="text-xs text-[#6E6E73]">m² perete</span></div>
            <div className="bg-[#F5F5F7] rounded-2xl p-3.5"><b className="block text-2xl font-semibold tracking-[-0.02em]">{fmt(res.volume, 1)}</b><span className="text-xs text-[#6E6E73]">m³ zidărie</span></div>
            <div className="bg-[#F5F5F7] rounded-2xl p-3.5"><b className="block text-2xl font-semibold tracking-[-0.02em]">{res.pieces}</b><span className="text-xs text-[#6E6E73]">bucăți</span></div>
          </div>
        ) : (
          <p className="text-sm text-red-600">Completați dimensiunile ca să vedem calculul.</p>
        )}
        {res && <ResultTable title="Materiale" lines={lines} />}
        {res && unit.note && <p className="text-sm text-gray-700 bg-[#FFF3E6] border border-[#F27A1A]/30 rounded-xl p-3">{unit.note}</p>}
        {res && <SendToQuote calculator="zidărie" summary={`${fmt(res.area, 1)} m² perete, ${unit.name}`} lines={lines} />}
        <Disclaimer />
      </aside>
    </div>
  )
}
