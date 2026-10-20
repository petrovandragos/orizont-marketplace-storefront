"use client"

import { useMemo, useState } from "react"
import { calculateRoof, fmt, fmtLen, RoofType, SheetModel, FaceResult, unitLabel, sheetOptions } from "@lib/calculators/roof"
import { ROOF_MODELS, ROOF_RULES } from "@lib/calculators/data"
import { Choice, Disclaimer, NumberField, ResultTable, SendToQuote, Step, Stepper, Line } from "./ui"

const TYPES: { id: RoofType; title: string; subtitle: string }[] = [
  { id: "o-apa", title: "O apă", subtitle: "Anexe, garaje, magazii" },
  { id: "doua-ape", title: "Două ape", subtitle: "Cel mai des întâlnit la case" },
  { id: "patru-ape", title: "Patru ape", subtitle: "Cu streașină pe toate laturile" },
]

function RoofIcon({ type, active }: { type: RoofType; active: boolean }) {
  const c = active ? "#F27A1A" : "#94A3B8"
  const wall = active ? "#FED7AA" : "#E2E8F0"
  return (
    <svg width="64" height="44" viewBox="0 0 64 44" aria-hidden="true">
      <rect x="12" y="24" width="40" height="18" rx="1.5" fill={wall} />
      {type === "o-apa" && <polygon points="8,26 56,14 56,18 8,30" fill={c} />}
      {type === "doua-ape" && <polygon points="6,27 32,8 58,27 54,27 32,12 10,27" fill={c} />}
      {type === "patru-ape" && (
        <>
          <polygon points="6,27 20,11 44,11 58,27" fill={c} />
          <path d="M20 11 L26 27 M44 11 L38 27" fill="none" stroke="#fff" strokeOpacity=".5" strokeWidth="1.2" />
        </>
      )}
    </svg>
  )
}

function DimensionHint({ type }: { type: RoofType }) {
  return (
    <svg viewBox="0 0 260 140" className="w-full max-w-[300px] h-auto" aria-hidden="true">
      <defs>
        <marker id="ar" markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto-start-reverse"><path d="M0,0 L6,3 L0,6 z" fill="#192335" /></marker>
      </defs>
      {type === "patru-ape" ? (
        <>
          <polygon points="20,110 70,40 190,40 240,110" fill="#FFF3E6" stroke="#F27A1A" strokeWidth="2" />
          <line x1="20" y1="124" x2="240" y2="124" stroke="#192335" markerStart="url(#ar)" markerEnd="url(#ar)" />
          <text x="130" y="137" textAnchor="middle" fontSize="11" fill="#192335" fontWeight="700">A · lungimea casei</text>
          <line x1="130" y1="108" x2="130" y2="44" stroke="#192335" markerStart="url(#ar)" markerEnd="url(#ar)" />
          <text x="136" y="80" fontSize="11" fill="#192335" fontWeight="700">C · panta</text>
          <text x="226" y="66" textAnchor="middle" fontSize="11" fill="#192335" fontWeight="700">B · lățimea</text>
        </>
      ) : (
        <>
          <polygon points="30,110 230,110 230,30 30,30" fill="#FFF3E6" stroke="#F27A1A" strokeWidth="2" />
          <line x1="30" y1="124" x2="230" y2="124" stroke="#192335" markerStart="url(#ar)" markerEnd="url(#ar)" />
          <text x="130" y="137" textAnchor="middle" fontSize="11" fill="#192335" fontWeight="700">A · lungimea streașinii</text>
          <line x1="244" y1="110" x2="244" y2="30" stroke="#192335" markerStart="url(#ar)" markerEnd="url(#ar)" />
          <text x="236" y="22" textAnchor="end" fontSize="11" fill="#192335" fontWeight="700">C · panta (streașină → coamă)</text>
          <text x="130" y="75" textAnchor="middle" fontSize="11" fill="#9A3412">o apă văzută de sus</text>
        </>
      )}
    </svg>
  )
}

function FaceSketch({ face, label }: { face: FaceResult; label: string }) {
  const padX = 34, padTop = 14, padBottom = 30
  const W = 620
  const scale = (W - padX * 2) / Math.max(face.bottom, 0.1)
  const drawH = Math.min(face.height * scale, 340)
  const vScale = drawH / Math.max(face.height, 0.1)
  const H = drawH + padTop + padBottom
  const inset = ((face.bottom - face.top) / 2) * scale
  const y0 = padTop + drawH
  const y1 = padTop
  const xR = padX + face.bottom * scale
  const pts = `${padX},${y0} ${xR},${y0} ${xR - inset},${y1} ${padX + inset},${y1}`
  const id = label.replace(/\W+/g, "")
  return (
    <figure className="m-0">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto" role="img" aria-label={`Schița pentru ${label}`}>
        <clipPath id={`clip-${id}`}><polygon points={pts} /></clipPath>
        <g clipPath={`url(#clip-${id})`}>
          {face.columns.map((c, i) => {
            const x = padX + c.x0 * scale
            const w = (c.x1 - c.x0) * scale
            const top = y0 - c.needed * vScale
            return (
              <g key={i}>
                <rect x={x} y={top} width={w} height={c.needed * vScale} fill={i % 2 ? "#FDBA74" : "#FB923C"} fillOpacity=".6" stroke="#fff" strokeWidth="1" />
                {c.pieces.length > 1 &&
                  c.pieces.slice(1).map((_, k) => {
                    const yy = y0 - (c.needed / c.pieces.length) * (k + 1) * vScale
                    return <line key={k} x1={x} x2={x + w} y1={yy} y2={yy} stroke="#9A3412" strokeDasharray="4 3" />
                  })}
              </g>
            )
          })}
        </g>
        <polygon points={pts} fill="none" stroke="#F27A1A" strokeWidth="2" />
        {face.columns.map((c, i) => {
          const x = padX + (c.x0 + (c.x1 - c.x0) / 2) * scale
          const w = (c.x1 - c.x0) * scale
          const hpx = c.needed * vScale
          if (hpx < 28) return null
          const txt = c.pieces.length > 1 ? `${c.pieces.length}×${fmtLen(c.pieces[0])}` : fmtLen(c.pieces[0])
          return w >= 30 ? (
            <text key={i} x={x} y={y0 - hpx / 2} textAnchor="middle" dominantBaseline="middle" fontSize="11" fontWeight="700" fill="#7C2D12"
              transform={`rotate(-90 ${x} ${y0 - hpx / 2})`}>{txt} m</text>
          ) : null
        })}
        <line x1={padX} x2={xR} y1={y0 + 14} y2={y0 + 14} stroke="#192335" />
        <text x={(padX + xR) / 2} y={y0 + 26} textAnchor="middle" fontSize="12" fontWeight="700" fill="#192335">{fmt(face.bottom)} m</text>
        <line x1={padX - 16} x2={padX - 16} y1={y0} y2={y1} stroke="#192335" />
        <text x={padX - 22} y={(y0 + y1) / 2} textAnchor="middle" fontSize="12" fontWeight="700" fill="#192335" transform={`rotate(-90 ${padX - 22} ${(y0 + y1) / 2})`}>{fmt(face.height)} m</text>
      </svg>
      <figcaption className="text-sm text-gray-600 mt-1">
        <b className="text-[#1D1D1F]">{label}</b> · {fmt(face.area)} m² · {face.columns.length} coloane de tablă
      </figcaption>
    </figure>
  )
}

function uniqueFaces(faces: FaceResult[]) {
  const out: { face: FaceResult; count: number }[] = []
  for (const f of faces) {
    const same = out.find((o) => o.face.bottom === f.bottom && o.face.top === f.top && o.face.height === f.height)
    if (same) same.count++
    else out.push({ face: f, count: 1 })
  }
  return out
}

export default function RoofCalculator() {
  const [type, setType] = useState<RoofType>("doua-ape")
  const groups = useMemo(() => Array.from(new Set(ROOF_MODELS.map((m) => m.group))), [])
  const [group, setGroup] = useState(groups[0])
  const [modelId, setModelId] = useState(ROOF_MODELS.find((m) => m.group === groups[0])?.id ?? "")
  const [length, setLength] = useState(10)
  const [width, setWidth] = useState(8)
  const [slope, setSlope] = useState(5)
  const [chimneys, setChimneys] = useState(1)
  const [sheetOpt, setSheetOpt] = useState("auto")

  const model = ROOF_MODELS.find((m) => m.id === modelId) as SheetModel
  const valid = length > 0 && slope > 0 && (type !== "patru-ape" || width > 0) && !!model
  // variantele de lungime a foii, după panta cea mai lungă (la toate formele, panta = C)
  const options = useMemo(() => (valid && model ? sheetOptions(model, slope) : []), [valid, model, slope])
  const option = options.find((o) => o.id === sheetOpt) ?? options[0]
  const result = useMemo(
    () => (valid ? calculateRoof({ type, length, width, slope, chimneys, sheet: option?.choice }, model, ROOF_RULES) : null),
    [valid, type, length, width, slope, chimneys, model, option]
  )

  const sheetLines: Line[] = result
    ? model.kind === "panel"
      ? [{ name: model.name, quantity: result.panels ?? 0, unit: "panou", note: `${fmt(result.orderedArea)} m² acoperiți`, href: model.handle ? `/products/${model.handle}` : undefined }]
      : result.sheets.map((s) => ({ name: `${model.name}, foaie de ${fmtLen(s.length)} m`, quantity: s.count, unit: "foaie", href: model.handle ? `/products/${model.handle}` : undefined }))
    : []
  const accLines: Line[] = result ? result.accessories.map((a) => ({ name: a.name, quantity: a.quantity, unit: a.unit, note: a.note })) : []
  const typeTitle = TYPES.find((t) => t.id === type)!.title

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_400px] gap-5 items-start">
      <div className="flex flex-col gap-5">
        <Step n={1} title="Forma acoperișului">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            {TYPES.map((t) => (
              <Choice key={t.id} selected={type === t.id} onClick={() => setType(t.id)} title={t.title} subtitle={t.subtitle}
                icon={<RoofIcon type={t.id} active={type === t.id} />} />
            ))}
          </div>
        </Step>

        <Step n={2} title="Modelul de tablă" hint="Alegeți tipul și modelul. Lățimea utilă e cea care acoperă efectiv, fără suprapunere.">
          <div className="flex flex-wrap gap-2 mb-3">
            {groups.map((g) => (
              <button key={g} type="button" aria-pressed={group === g}
                onClick={() => { setGroup(g); const first = ROOF_MODELS.find((m) => m.group === g); if (first) setModelId(first.id) }}
                className={`h-9 px-4 rounded-full text-sm font-semibold border ${group === g ? "bg-[#1D1D1F] text-white border-[#1D1D1F]" : "bg-white text-[#424245] border-transparent hover:border-[#D2D2D7]"}`}>
                {g}
              </button>
            ))}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-2.5">
            {ROOF_MODELS.filter((m) => m.group === group).map((m) => (
              <Choice key={m.id} selected={modelId === m.id} onClick={() => setModelId(m.id)} title={m.name}
                subtitle={m.kind === "panel" ? `${fmt(m.panelArea ?? 0, 3)} m² / panou` : `lățime utilă ${fmt((m.usefulWidth ?? 0) * 1000, 0)} mm${m.module ? ` · modul ${fmt(m.module * 1000, 0)} mm` : ""}`} />
            ))}
          </div>
        </Step>

        <Step n={3} title="Dimensiunile acoperișului" hint="Măsurați pe acoperiș, nu pe planul casei. Panta se măsoară de la marginea streașinii până la coamă.">
          <div className="grid grid-cols-1 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] gap-5 items-center">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <NumberField id="r-len" label={type === "patru-ape" ? "A · Lungimea casei" : "A · Lungimea streașinii"} value={length} onChange={setLength} unit="m" />
              {type === "patru-ape" && <NumberField id="r-wid" label="B · Lățimea casei" value={width} onChange={setWidth} unit="m" />}
              <NumberField id="r-slope" label="C · Lungimea pantei" value={slope} onChange={setSlope} unit="m" />
              <Stepper label="Coșuri de fum" value={chimneys} onChange={setChimneys} max={6} />
            </div>
            <div className="flex justify-center"><DimensionHint type={type} /></div>
          </div>
        </Step>

        {result && model.kind !== "panel" && (
          <Step n={4} title="Foile și schița acoperișului" hint="Alegeți lungimea foilor. În schiță, fiecare coloană e o foaie de tablă, cu lungimea scrisă pe ea; liniile punctate arată unde se îmbină foile.">
            {options.length > 1 && (
              <div className="mb-7">
                <span className="text-sm font-medium text-[#1D1D1F]">Lungimea foilor</span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mt-2">
                  {options.map((o) => (
                    <Choice key={o.id} selected={option?.id === o.id} onClick={() => setSheetOpt(o.id)} title={o.title} subtitle={o.subtitle} />
                  ))}
                </div>
              </div>
            )}
            <div className="flex flex-col gap-6">
              {uniqueFaces(result.faces).map(({ face, count }) => (
                <FaceSketch key={face.name} face={face} label={count > 1 ? `${face.name.replace(/ \d$/, "")} (de ${count} ori)` : face.name} />
              ))}
            </div>
            {result.wastePercent > 0 && (
              <p className="text-sm text-gray-500 mt-4">
                Pierdere estimată la tăiere și rotunjirea la modul: {result.wastePercent}%. La apele triunghiulare, montatorul poate refolosi o parte din resturi.
              </p>
            )}
          </Step>
        )}
      </div>

      <aside className="bg-white border border-[#D2D2D7] rounded-[26px] p-5 md:p-7 lg:sticky lg:top-32 flex flex-col gap-5">
        <div>
          <p className="text-sm text-gray-500">Acoperiș în {typeTitle.toLowerCase()}</p>
          {result ? (
            <div className="grid grid-cols-3 gap-2 mt-2">
              <div className="bg-[#F5F5F7] rounded-2xl p-3.5"><b className="block text-2xl font-semibold tracking-[-0.02em]">{fmt(result.roofArea, 1)}</b><span className="text-xs text-[#6E6E73]">m² acoperiș</span></div>
              <div className="bg-[#F5F5F7] rounded-2xl p-3.5"><b className="block text-2xl font-semibold tracking-[-0.02em]">{model.kind === "panel" ? result.panels : result.sheetCount}</b><span className="text-xs text-[#6E6E73]">{model.kind === "panel" ? unitLabel("panou", result.panels ?? 0) : unitLabel("foaie", result.sheetCount)}</span></div>
              <div className="bg-[#F5F5F7] rounded-2xl p-3.5"><b className="block text-2xl font-semibold tracking-[-0.02em]">{fmt(result.orderedArea, 1)}</b><span className="text-xs text-[#6E6E73]">m² tablă</span></div>
            </div>
          ) : (
            <p className="text-sm text-red-600 mt-2">Completați dimensiunile ca să vedem calculul.</p>
          )}
        </div>

        {result && <ResultTable title="Tablă" lines={sheetLines} />}
        {result && <ResultTable title="Accesorii" lines={accLines} />}
        {result && <SendToQuote calculator="acoperiș" summary={`acoperiș în ${typeTitle.toLowerCase()}, ${model.name}, A ${fmt(length)} m${type === "patru-ape" ? `, B ${fmt(width)} m` : ""}, pantă ${fmt(slope)} m${option && option.id !== "auto" ? `, lungimea foilor: ${option.title.toLowerCase()} (${option.subtitle})` : ""}`} lines={[...sheetLines, ...accLines]} />}
        <Disclaimer />
      </aside>
    </div>
  )
}
