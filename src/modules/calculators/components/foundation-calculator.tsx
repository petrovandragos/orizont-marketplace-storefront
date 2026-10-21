"use client"

import { useMemo, useState } from "react"
import { calculateConcrete, ConcreteClass } from "@lib/calculators/concrete"
import { fmt } from "@lib/calculators/roof"
import { Chips, Choice, Disclaimer, NumberField, ResultTable, SendToQuote, Step, Line } from "./ui"

type Kind = "fundatie" | "placa" | "ambele"

function KindIcon({ kind, active }: { kind: Kind; active: boolean }) {
  const s = active ? "#F27A1A" : "#CBD5E1"
  const f = active ? "#FED7AA" : "#F1F5F9"
  return (
    <svg width="48" height="36" viewBox="0 0 48 36" aria-hidden="true">
      <path d="M2 14h44" stroke="#CBD5E1" strokeDasharray="3 3" />
      {kind !== "placa" && (
        <>
          <rect x="5" y="14" width="8" height="18" rx="1" fill={f} stroke={s} />
          <rect x="35" y="14" width="8" height="18" rx="1" fill={f} stroke={s} />
        </>
      )}
      {kind !== "fundatie" && <rect x={kind === "ambele" ? 13 : 5} y="10" width={kind === "ambele" ? 22 : 38} height="5" rx="1" fill={f} stroke={s} />}
    </svg>
  )
}

export default function FoundationCalculator() {
  const [kind, setKind] = useState<Kind>("ambele")
  const [houseLength, setHouseLength] = useState(12)
  const [houseWidth, setHouseWidth] = useState(10)
  const [interior, setInterior] = useState(10)
  const [widthCm, setWidthCm] = useState(40)
  const [depthCm, setDepthCm] = useState(90)
  const [bars, setBars] = useState(4)
  const [barD, setBarD] = useState(12)
  const [stirD, setStirD] = useState(8)
  const [stirCm, setStirCm] = useState(20)
  const [area, setArea] = useState(100)
  const [thickCm, setThickCm] = useState(12)
  const [layers, setLayers] = useState<1 | 2>(1)
  const [mix, setMix] = useState<"statie" | "santier">("statie")
  const [cls, setCls] = useState<ConcreteClass>("C16/20")

  const hasF = kind !== "placa"
  const hasS = kind !== "fundatie"
  const valid =
    (!hasF || (houseLength > 0 && houseWidth > 0 && widthCm > 0 && depthCm > 0 && interior >= 0)) &&
    (!hasS || (area > 0 && thickCm > 0))

  const res = useMemo(
    () =>
      valid
        ? calculateConcrete({
            foundation: hasF
              ? { houseLength, houseWidth, interior, width: widthCm / 100, depth: depthCm / 100, bars, barDiameter: barD, stirrupDiameter: stirD, stirrupSpacing: stirCm / 100 }
              : undefined,
            slab: hasS ? { area, thickness: thickCm / 100, meshLayers: layers } : undefined,
            mix,
            concreteClass: cls,
          })
        : null,
    [valid, hasF, hasS, houseLength, houseWidth, interior, widthCm, depthCm, bars, barD, stirD, stirCm, area, thickCm, layers, mix, cls]
  )

  const lines: Line[] = []
  if (res) {
    if (mix === "statie") {
      lines.push({ name: `Beton gata preparat ${cls}`, quantity: res.orderM3, unit: "m³", note: `${fmt(res.concreteM3)} m³ calculat, cu 5% pierderi; se comandă de la stația de betoane` })
    } else {
      lines.push(
        { name: "Ciment Holcim ECOPlanet, 40 kg", quantity: res.cementBags, unit: "sac", note: `${fmt(res.cementKg, 0)} kg pentru ${cls}, aprox. ${fmt(res.cementPallets, 1)} paleți (40 de saci pe palet)`, href: "/products/ciment-holcim-ecoplanet-40-kg" },
        { name: "Nisip 0–4 mm", quantity: res.sandM3, unit: "m³", note: "agregat pentru beton, vrac" },
        { name: "Pietriș 4–31 mm", quantity: res.gravelM3, unit: "m³", note: `agregat pentru beton, vrac; apă aprox. ${fmt(res.waterL, 0)} l` },
      )
    }
    if (hasF && res.bars > 0) {
      lines.push(
        { name: `Oțel-beton B500C Ø${barD} mm, bare de 12 m`, quantity: res.bars, unit: "buc", note: `${bars} bare pe secțiune, +10% suprapuneri; aprox. ${fmt(res.barKg, 0)} kg`, href: `/products/otel-beton-b500c-bara-striat-${barD}-mm-12-m` },
        { name: `Oțel-beton colac Ø${stirD} mm, pentru etrieri`, quantity: res.stirrups ? res.stirrupKg : 0, unit: "kg", note: `${res.stirrups} etrieri de ${fmt((res.cage?.b ?? 0) * 100, 0)} × ${fmt((res.cage?.h ?? 0) * 100, 0)} cm, la ${stirCm} cm`, href: `/products/otel-beton-colac-${stirD}mm` },
      )
    }
    if (hasS && res.meshSheets > 0) {
      lines.push({ name: "Plasă sudată, 2 × 3 m", quantity: res.meshSheets, unit: "buc", note: `${fmt(res.meshM2, 0)} m² cu 15% suprapuneri${layers === 2 ? ", două rânduri" : ""}` })
    }
    if (res.barKg + res.stirrupKg > 0) {
      lines.push({ name: "Sârmă neagră pentru legat", quantity: Math.max(1, res.tieWireKg), unit: "kg", note: "aprox. 1% din greutatea armăturii" })
    }
  }

  const summary = [
    hasF ? `fundație continuă ${fmt(res?.axis ?? 0, 1)} m, ${widthCm} × ${depthCm} cm` : "",
    hasS ? `placă ${fmt(area, 1)} m² × ${thickCm} cm` : "",
    mix === "statie" ? `beton ${cls} de la stație` : `beton ${cls} preparat pe șantier`,
  ].filter(Boolean).join(", ")

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_400px] gap-5 items-start">
      <div className="flex flex-col gap-5">
        <Step n={1} title="Ce turnați">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            {([
              ["fundatie", "Fundație continuă", "sub pereți"],
              ["placa", "Placă", "pe sol sau radier"],
              ["ambele", "Fundație și placă", "casa completă"],
            ] as const).map(([k, t, sub]) => (
              <Choice key={k} selected={kind === k} onClick={() => setKind(k)} title={t} subtitle={sub} icon={<KindIcon kind={k} active={kind === k} />} />
            ))}
          </div>
        </Step>

        {hasF && (
          <Step n={2} title="Fundația" hint="Dimensiunile exterioare ale casei; calculăm lungimea fundației pe axul pereților.">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <NumberField id="f-l" label="Lungimea casei" value={houseLength} onChange={setHouseLength} unit="m" />
              <NumberField id="f-w" label="Lățimea casei" value={houseWidth} onChange={setHouseWidth} unit="m" />
              <NumberField id="f-i" label="Fundații sub pereți interiori" value={interior} onChange={setInterior} unit="m" step={0.5} />
              <NumberField id="f-b" label="Lățimea fundației" value={widthCm} onChange={setWidthCm} unit="cm" step={5} />
              <NumberField id="f-h" label="Înălțimea fundației" value={depthCm} onChange={setDepthCm} unit="cm" step={5} hint="Talpă și elevație, de la fundul săpăturii." />
            </div>
            <div className="border-t border-black/[0.07] mt-6 pt-5 grid grid-cols-1 sm:grid-cols-2 gap-5">
              <Chips label="Bare longitudinale pe secțiune" value={bars} options={[4, 6] as const} onChange={setBars} format={(v) => `${v} bare`} />
              <Chips label="Diametrul barelor" value={barD} options={[10, 12, 14] as const} onChange={setBarD} format={(v) => `Ø${v} mm`} />
              <Chips label="Etrieri" value={stirD} options={[6, 8] as const} onChange={setStirD} format={(v) => `Ø${v} mm`} />
              <Chips label="Distanța între etrieri" value={stirCm} options={[15, 20, 25] as const} onChange={setStirCm} format={(v) => `${v} cm`} />
            </div>
          </Step>
        )}

        {hasS && (
          <Step n={hasF ? 3 : 2} title="Placa">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <NumberField id="s-a" label="Suprafața plăcii" value={area} onChange={setArea} unit="m²" step={1} />
              <Chips label="Grosimea" value={thickCm} options={[10, 12, 15, 20] as const} onChange={setThickCm} format={(v) => `${v} cm`} />
              <Chips label="Plasă sudată" value={layers} options={[1, 2] as const} onChange={setLayers} format={(v) => (v === 1 ? "un rând" : "două rânduri")} />
            </div>
          </Step>
        )}

        <Step n={(hasF ? 1 : 0) + (hasS ? 1 : 0) + 2} title="Betonul">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mb-5">
            <Choice selected={mix === "statie"} onClick={() => setMix("statie")} title="Gata preparat, de la stație" subtitle="Calculăm metri cubi de comandat" />
            <Choice selected={mix === "santier"} onClick={() => setMix("santier")} title="Preparat pe șantier" subtitle="Calculăm cimentul, nisipul și pietrișul" />
          </div>
          <Chips label="Clasa betonului" value={cls} options={["C16/20", "C20/25"] as const} onChange={setCls} format={(v) => v} />
          <p className="text-[13px] text-[#6E6E73] mt-3">Clasa betonului și armarea se iau din proiectul de rezistență. Valorile de mai sus sunt cele întâlnite frecvent la case.</p>
        </Step>
      </div>

      <aside className="bg-white border border-[#D2D2D7] rounded-[26px] p-5 md:p-7 lg:sticky lg:top-36 flex flex-col gap-5">
        {res ? (
          <div className="grid grid-cols-3 gap-2">
            <div className="bg-[#F5F5F7] rounded-2xl p-3.5"><b className="block text-2xl font-semibold tracking-[-0.02em]">{fmt(res.concreteM3, 1)}</b><span className="text-xs text-[#6E6E73]">m³ beton</span></div>
            <div className="bg-[#F5F5F7] rounded-2xl p-3.5"><b className="block text-2xl font-semibold tracking-[-0.02em]">{fmt(res.foundationM3, 1)}</b><span className="text-xs text-[#6E6E73]">m³ fundație</span></div>
            <div className="bg-[#F5F5F7] rounded-2xl p-3.5"><b className="block text-2xl font-semibold tracking-[-0.02em]">{fmt(res.slabM3, 1)}</b><span className="text-xs text-[#6E6E73]">m³ placă</span></div>
          </div>
        ) : (
          <p className="text-sm text-red-600">Completați dimensiunile ca să vedem calculul.</p>
        )}
        {res && <ResultTable title="Materiale" lines={lines} />}
        {res && mix === "santier" && (
          <p className="text-sm text-gray-700 bg-[#FFF3E6] border border-[#F27A1A]/30 rounded-xl p-3">
            Rețeta pentru betonul preparat pe șantier este orientativă. Pentru fundații, betonul de la stație are o calitate constantă și se toarnă dintr-o dată.
          </p>
        )}
        {res && <SendToQuote calculator="fundație și beton" summary={summary} lines={lines} />}
        <Disclaimer>
          Cantitățile sunt orientative și nu înlocuiesc proiectul de rezistență. Înainte de comandă, un coleg verifică împreună cu dumneavoastră necesarul exact.
        </Disclaimer>
      </aside>
    </div>
  )
}
