"use client"

import { useMemo, useState } from "react"
import { calculateTiles, FLOOR_FORMATS, TILE_ADHESIVES, TILE_RULES, TileFormat, WALL_FORMATS } from "@lib/calculators/tiles"
import { fmt } from "@lib/calculators/roof"
import { Chips, Choice, Disclaimer, NumberField, ResultTable, SendToQuote, Step, Line } from "./ui"

type Kind = "pardoseala" | "pereti" | "ambele"

function KindIcon({ kind, active }: { kind: Kind; active: boolean }) {
  const s = active ? "#F27A1A" : "#CBD5E1"
  const f = active ? "#FED7AA" : "#F1F5F9"
  const floor = kind !== "pereti"
  const wall = kind !== "pardoseala"
  return (
    <svg width="44" height="36" viewBox="0 0 44 36" aria-hidden="true">
      <path d="M6 4v24l32 0V4" fill="none" stroke="#CBD5E1" />
      {wall && [0, 1, 2].map((r) => [0, 1, 2].map((c) => (
        <rect key={`w${r}${c}`} x={8 + c * 10} y={6 + r * 7} width="9" height="6" rx="0.8" fill={f} stroke={s} strokeWidth="0.8" />
      )))}
      {floor && <path d="M2 34 6 28h32l4 6z" fill={f} stroke={s} />}
      {floor && <path d="M14 28l-3 6M22 28v6M30 28l3 6" stroke={s} strokeWidth="0.8" />}
    </svg>
  )
}

function FormatPicker({ label, formats, value, onChange }: { label: string; formats: TileFormat[]; value: TileFormat; onChange: (f: TileFormat) => void }) {
  return (
    <Chips label={label} value={value.id} options={formats.map((f) => f.id)} onChange={(id) => onChange(formats.find((f) => f.id === id)!)}
      format={(id) => `${formats.find((f) => f.id === id)!.label} cm`} />
  )
}

export default function TileCalculator() {
  const [kind, setKind] = useState<Kind>("ambele")
  const [length, setLength] = useState(2.5)
  const [width, setWidth] = useState(2)
  const [height, setHeight] = useState(2.1)
  const [openings, setOpenings] = useState(1.6)
  const [floorF, setFloorF] = useState(FLOOR_FORMATS[3])
  const [floorBox, setFloorBox] = useState(FLOOR_FORMATS[3].boxM2)
  const [wallF, setWallF] = useState(WALL_FORMATS[2])
  const [wallBox, setWallBox] = useState(WALL_FORMATS[2].boxM2)
  const [pattern, setPattern] = useState<"drept" | "diagonal">("drept")
  const [joint, setJoint] = useState(3)
  const [adhId, setAdhId] = useState(TILE_ADHESIVES[0].id)
  const [wet, setWet] = useState(true)
  const [shower, setShower] = useState(4)

  const hasFloor = kind !== "pereti"
  const hasWall = kind !== "pardoseala"
  const adhesive = TILE_ADHESIVES.find((a) => a.id === adhId)!
  const floorArea = length * width
  const perimeter = 2 * (length + width)
  const wallArea = Math.max(0, perimeter * height - openings)
  const valid = length > 0 && width > 0 && (!hasWall || (height > 0 && openings >= 0)) && (!hasFloor || floorBox > 0) && (!hasWall || wallBox > 0) && (!wet || shower >= 0)

  const res = useMemo(
    () =>
      valid
        ? calculateTiles({
            floor: hasFloor ? { area: floorArea, format: floorF, boxM2: floorBox } : undefined,
            wall: hasWall ? { area: wallArea, format: wallF, boxM2: wallBox } : undefined,
            pattern,
            jointMm: joint,
            adhesive,
            // pardoseala, plus 20 cm ridicați pe pereți, plus pereții din zona dușului
            waterproof: wet ? { area: (hasFloor ? floorArea + perimeter * 0.2 : 0) + shower, perimeter: perimeter + 4 } : undefined,
          })
        : null,
    [valid, hasFloor, hasWall, floorArea, wallArea, floorF, floorBox, wallF, wallBox, pattern, joint, adhesive, wet, shower, perimeter]
  )

  const waste = Math.round(TILE_RULES.waste[pattern] * 100)
  const lines: Line[] = []
  if (res) {
    if (res.floor) lines.push({ name: `Gresie ${floorF.label} cm`, quantity: res.floor.boxes, unit: "cutie", note: `${fmt(res.floor.tileM2, 1)} m² cu ${waste}% pierderi, ${fmt(floorBox)} m²/cutie` })
    if (res.wall) lines.push({ name: `Faianță ${wallF.label} cm`, quantity: res.wall.boxes, unit: "cutie", note: `${fmt(res.wall.tileM2, 1)} m² cu ${waste}% pierderi, ${fmt(wallBox)} m²/cutie` })
    const teeth = [res.floor, res.wall].filter(Boolean).map((s) => `gletieră ${s!.tooth} mm, ${fmt(s!.adhesiveRate, 1)} kg/m²`)
    lines.push(
      { name: adhesive.name, quantity: res.adhesiveBags, unit: "sac", note: `${fmt(res.adhesiveKg, 0)} kg; ${Array.from(new Set(teeth)).join("; ")}`, href: `/products/${adhesive.handle}` },
      { name: "Chit de rosturi Ceresit CE 40", quantity: res.groutKg, unit: "kg", note: `rost de ${joint} mm; în saci de 2 sau 5 kg, după culoare`, href: "/categories/Chituri" },
      { name: "Amorsă Ceresit R766, 10 kg", quantity: res.primerCans, unit: "bidon", note: `${fmt(res.primerKg, 1)} kg, pe tot suportul`, href: "/products/amorsa-universala-ceresit-r766-interior-exterior-10-kg" },
    )
    if (wet) {
      lines.push(
        { name: "Hidroizolație Ceresit CL 51", quantity: Math.ceil(res.waterproofKg), unit: "kg", note: "două straturi, aprox. 1,1 kg/m²; găleți de 5 sau 15 kg", href: "/products/hidroizolatie-ceresit-cl-51-express-1-k" },
        { name: "Bandă de hidroizolație Mapeband", quantity: res.waterproofTapeM, unit: "m", note: "la colțurile dintre pardoseală și pereți și în duș", href: "/products/banda-hidroizolatie-mapei-mapeband" },
      )
    }
  }

  const summary = [
    `încăpere ${fmt(length)} × ${fmt(width)} m`,
    hasFloor ? `gresie ${floorF.label} cm pe ${fmt(floorArea, 1)} m²` : "",
    hasWall ? `faianță ${wallF.label} cm pe ${fmt(wallArea, 1)} m² (înălțime ${fmt(height)} m)` : "",
    pattern === "diagonal" ? "montaj diagonal" : "",
  ].filter(Boolean).join(", ")

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_400px] gap-5 items-start">
      <div className="flex flex-col gap-5">
        <Step n={1} title="Ce placați">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            {([
              ["pardoseala", "Pardoseală", "gresie"],
              ["pereti", "Pereți", "faianță"],
              ["ambele", "Pardoseală și pereți", "baie, bucătărie"],
            ] as const).map(([k, t, sub]) => (
              <Choice key={k} selected={kind === k} onClick={() => setKind(k)} title={t} subtitle={sub} icon={<KindIcon kind={k} active={kind === k} />} />
            ))}
          </div>
        </Step>

        <Step n={2} title="Încăperea" hint={hasWall ? "Faianța se calculează pe tot perimetrul, până la înălțimea aleasă, fără uși și ferestre." : undefined}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <NumberField id="t-l" label="Lungimea" value={length} onChange={setLength} unit="m" step={0.05} />
            <NumberField id="t-w" label="Lățimea" value={width} onChange={setWidth} unit="m" step={0.05} />
            {hasWall && <NumberField id="t-h" label="Înălțimea faianței" value={height} onChange={setHeight} unit="m" step={0.05} />}
            {hasWall && <NumberField id="t-o" label="Uși și ferestre" value={openings} onChange={setOpenings} unit="m²" step={0.1} />}
          </div>
          <p className="text-[13px] text-[#6E6E73] mt-4">
            {hasFloor && <>Pardoseală: <b className="text-[#1D1D1F]">{fmt(floorArea, 2)} m²</b>. </>}
            {hasWall && <>Pereți: <b className="text-[#1D1D1F]">{fmt(wallArea, 2)} m²</b>.</>}
          </p>
        </Step>

        <Step n={3} title="Plăcile" hint="Găsiți câți metri pătrați are o cutie pe eticheta ei; valorile de mai jos sunt cele obișnuite.">
          <div className="flex flex-col gap-5">
            {hasFloor && (
              <div className="grid grid-cols-1 sm:grid-cols-[minmax(0,1fr)_180px] gap-4 items-end">
                <FormatPicker label="Formatul gresiei" formats={FLOOR_FORMATS} value={floorF} onChange={(f) => { setFloorF(f); setFloorBox(f.boxM2) }} />
                <NumberField id="t-fb" label="m² pe cutie" value={floorBox} onChange={setFloorBox} unit="m²" step={0.01} />
              </div>
            )}
            {hasWall && (
              <div className="grid grid-cols-1 sm:grid-cols-[minmax(0,1fr)_180px] gap-4 items-end">
                <FormatPicker label="Formatul faianței" formats={WALL_FORMATS} value={wallF} onChange={(f) => { setWallF(f); setWallBox(f.boxM2) }} />
                <NumberField id="t-wb" label="m² pe cutie" value={wallBox} onChange={setWallBox} unit="m²" step={0.01} />
              </div>
            )}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 border-t border-black/[0.07] pt-5">
              <Chips label="Montaj" value={pattern} options={["drept", "diagonal"] as const} onChange={setPattern}
                format={(v) => (v === "drept" ? "Drept sau decalat (+10%)" : "Diagonal (+15%)")} />
              <Chips label="Lățimea rostului" value={joint} options={[2, 3, 5] as const} onChange={setJoint} format={(v) => `${v} mm`} />
            </div>
          </div>
        </Step>

        <Step n={4} title="Adezivul și hidroizolația">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            {TILE_ADHESIVES.map((a) => (
              <Choice key={a.id} selected={adhId === a.id} onClick={() => setAdhId(a.id)} title={a.name.replace(", 25 kg", "")} subtitle={a.note} />
            ))}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 border-t border-black/[0.07] mt-6 pt-5 items-end">
            <Chips label="Baie sau zonă umedă" value={wet ? "da" : "nu"} options={["da", "nu"] as const} onChange={(v) => setWet(v === "da")}
              format={(v) => (v === "da" ? "Da, cu hidroizolație" : "Nu")} />
            {wet && <NumberField id="t-sh" label="Pereți în zona dușului" value={shower} onChange={setShower} unit="m²" step={0.5} hint="Hidroizolația se pune pe toată pardoseala și pe pereții din duș." />}
          </div>
        </Step>
      </div>

      <aside className="bg-white border border-[#D2D2D7] rounded-[26px] p-5 md:p-7 lg:sticky lg:top-36 flex flex-col gap-5">
        {res ? (
          <div className="grid grid-cols-3 gap-2">
            <div className="bg-[#F5F5F7] rounded-2xl p-3.5"><b className="block text-2xl font-semibold tracking-[-0.02em]">{fmt(res.area, 1)}</b><span className="text-xs text-[#6E6E73]">m² de placat</span></div>
            <div className="bg-[#F5F5F7] rounded-2xl p-3.5"><b className="block text-2xl font-semibold tracking-[-0.02em]">{(res.floor?.boxes ?? 0) + (res.wall?.boxes ?? 0)}</b><span className="text-xs text-[#6E6E73]">cutii plăci</span></div>
            <div className="bg-[#F5F5F7] rounded-2xl p-3.5"><b className="block text-2xl font-semibold tracking-[-0.02em]">{res.adhesiveBags}</b><span className="text-xs text-[#6E6E73]">saci adeziv</span></div>
          </div>
        ) : (
          <p className="text-sm text-red-600">Completați dimensiunile ca să vedem calculul.</p>
        )}
        {res && <ResultTable title="Materiale" lines={lines} />}
        {res && <SendToQuote calculator="gresie și faianță" summary={summary} lines={lines} />}
        <Disclaimer />
      </aside>
    </div>
  )
}
