import { ROOF_MODELS } from "./data-roof"
import { RoofMaterial } from "./visualizer"

/**
 * Comparator învelitori. Surse:
 * - țiglă metalică, tablă fălțuită: catalogul rezidențial Bilka (greutate 3–5 / 4–7 kg/m²,
 *   pantă minimă 14° — 8° fără îmbinări pe pantă; fălțuită 3°; garanție 10–30 ani după grosime);
 * - Novatik: certificatul de garanție Novatik NATURA (60 de ani etanșeitate, 30 de ani granule;
 *   pantă minimă 12° Classic, 16° celelalte) și fișa producătorului (6–7 kg/m²);
 * - țiglă ceramică și de beton: greutatea și panta din datele calculatorului de acoperiș
 *   (bucăți/m² × kg/bucată, din fișele Leier, swissporTON și Bramac).
 * Bugetul relativ și notele despre zgomot și montaj sunt orientative, de confirmat cu Vlad.
 */

export type Criterion = "greutate" | "liniste" | "clasic" | "buget" | "panta"

export const CRITERIA: { id: Criterion; name: string }[] = [
  { id: "greutate", name: "Greutate mică" },
  { id: "liniste", name: "Liniște la ploaie" },
  { id: "clasic", name: "Aspect tradițional" },
  { id: "buget", name: "Buget redus" },
  { id: "panta", name: "Pantă mică" },
]

export type Covering = {
  id: string
  name: string
  material: RoofMaterial
  /** kg/m², interval */
  kg: [number, number]
  /** pantă minimă, grade, interval după model */
  pitch: [number, number]
  pitchNote?: string
  warranty: string
  noise: string
  install: string
  structure: string
  budget: 1 | 2 | 3
  scores: Record<Criterion, 1 | 2 | 3>
  calc: string
  category: string
}

function tileRange(group: string) {
  const ms = ROOF_MODELS.filter((m) => m.group === group && m.perM2 && m.kgPerPiece)
  const kgs = ms.map((m) => m.perM2! * m.kgPerPiece!)
  const pitches = ROOF_MODELS.filter((m) => m.group === group && m.minPitch).map((m) => m.minPitch!)
  return {
    kg: [Math.round(Math.min(...kgs)), Math.round(Math.max(...kgs))] as [number, number],
    pitch: [Math.min(...pitches), Math.max(...pitches)] as [number, number],
  }
}

const ceramic = tileRange("Țiglă ceramică")
const concrete = tileRange("Țiglă de beton")

export const COVERINGS: Covering[] = [
  {
    id: "metal", name: "Țiglă metalică", material: "metal", kg: [4, 5], pitch: [8, 14],
    pitchNote: "8° dacă foile acoperă panta dintr-o bucată, altfel 14°",
    warranty: "10–30 de ani, după grosimea tablei",
    noise: "Se aude ploaia; izolația din pod o atenuează",
    install: "Rapid, foi pe toată lungimea pantei",
    structure: "Șarpantă ușoară",
    budget: 1,
    scores: { greutate: 3, liniste: 1, clasic: 2, buget: 3, panta: 2 },
    calc: "/calculatoare/acoperis", category: "/categories/invelitori-din-tabla",
  },
  {
    id: "faltuita", name: "Tablă fălțuită", material: "faltuita", kg: [4, 7], pitch: [3, 3],
    warranty: "10–30 de ani, după grosimea tablei",
    noise: "Se aude ploaia; izolația din pod o atenuează",
    install: "Necesită montatori cu experiență",
    structure: "Șarpantă ușoară",
    budget: 2,
    scores: { greutate: 3, liniste: 1, clasic: 1, buget: 2, panta: 3 },
    calc: "/calculatoare/acoperis", category: "/categories/invelitori-din-tabla",
  },
  {
    id: "novatik", name: "Țiglă metalică cu rocă (Novatik)", material: "metal", kg: [6, 7], pitch: [12, 16],
    pitchNote: "12° la Natura Classic, 16° la celelalte modele",
    warranty: "60 de ani etanșeitate, 30 de ani granulele",
    noise: "Redus, datorită stratului de granule",
    install: "Panouri mici, montaj mai lent decât la tablă",
    structure: "Șarpantă ușoară",
    budget: 3,
    scores: { greutate: 3, liniste: 2, clasic: 2, buget: 1, panta: 2 },
    calc: "/calculatoare/acoperis", category: "/categories/invelitori-din-tabla",
  },
  {
    id: "ceramica", name: "Țiglă ceramică", material: "ceramica", kg: ceramic.kg, pitch: ceramic.pitch,
    pitchNote: "după model",
    warranty: "Conform certificatului producătorului",
    noise: "Foarte redus",
    install: "Bucată cu bucată, pe șipci",
    structure: "Șarpantă dimensionată pentru greutate",
    budget: 3,
    scores: { greutate: 1, liniste: 3, clasic: 3, buget: 1, panta: 1 },
    calc: "/calculatoare/acoperis", category: "/categories/tigla-ceramica-si-de-beton",
  },
  {
    id: "beton", name: "Țiglă de beton", material: "beton", kg: concrete.kg, pitch: concrete.pitch,
    pitchNote: "după model",
    warranty: "Conform certificatului producătorului",
    noise: "Foarte redus",
    install: "Bucată cu bucată, pe șipci",
    structure: "Șarpantă dimensionată pentru greutate",
    budget: 2,
    scores: { greutate: 1, liniste: 3, clasic: 2, buget: 2, panta: 1 },
    calc: "/calculatoare/acoperis", category: "/categories/tigla-ceramica-si-de-beton",
  },
]

export function rank(coverings: Covering[], wanted: Criterion[], pitch: number) {
  return coverings
    .map((c, i) => ({
      c,
      fits: pitch >= c.pitch[0],
      score: wanted.reduce((s, k) => s + c.scores[k], 0),
      i,
    }))
    .sort((a, b) => Number(b.fits) - Number(a.fits) || b.score - a.score || a.i - b.i)
}
