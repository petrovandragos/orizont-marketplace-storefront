/**
 * Gresie și faianță: plăci (m² și cutii), adeziv, chit de rosturi, amorsă și,
 * pentru băi, hidroizolație sub plăci.
 *
 * Surse:
 * - adeziv: tabelul de consum Ceresit CM 12 (≤10 cm: 1,4 kg/m², ≤15 cm: 2,2,
 *   ≤25 cm: 2,8, ≤30 cm: 4,2 kg/m²); peste 30 cm, gletieră de 12 mm cu dublă
 *   lipire, 5 kg/m² (limita superioară din fișă) — de confirmat;
 * - chit: formula (A+B)/(A×B) × grosime × rost, cu un coeficient ales astfel
 *   încât să dea valorile orientative din fișa Ceresit CE 40 (30×30 cm, rost
 *   3 mm: 0,5 kg/m²; 60×60: 0,3; 60×120: 0,2), pentru plăci de 8 mm;
 * - amorsă Ceresit R766: 150–300 g/m² (fișă), luăm 200 g/m²;
 * - hidroizolație Ceresit CL 51: aprox. 1,1 kg/m² pentru ambele straturi (fișă).
 * De confirmat: pierderile (10% drept, 15% diagonal), m² pe cutie la fiecare format.
 */

export type TileFormat = { id: string; label: string; a: number; b: number; boxM2: number }

export const FLOOR_FORMATS: TileFormat[] = [
  { id: "30x30", label: "30 × 30", a: 30, b: 30, boxM2: 1.35 },
  { id: "33x33", label: "33 × 33", a: 33, b: 33, boxM2: 1.31 },
  { id: "45x45", label: "45 × 45", a: 45, b: 45, boxM2: 1.62 },
  { id: "60x60", label: "60 × 60", a: 60, b: 60, boxM2: 1.44 },
  { id: "60x120", label: "60 × 120", a: 60, b: 120, boxM2: 1.44 },
  { id: "20x120", label: "20 × 120", a: 20, b: 120, boxM2: 1.44 },
]

export const WALL_FORMATS: TileFormat[] = [
  { id: "20x25", label: "20 × 25", a: 20, b: 25, boxM2: 1.5 },
  { id: "25x40", label: "25 × 40", a: 25, b: 40, boxM2: 1.5 },
  { id: "30x60", label: "30 × 60", a: 30, b: 60, boxM2: 1.44 },
  { id: "60x60", label: "60 × 60", a: 60, b: 60, boxM2: 1.44 },
  { id: "60x120", label: "60 × 120", a: 60, b: 120, boxM2: 1.44 },
]

export type TileAdhesive = { id: string; name: string; handle: string; bagKg: number; note: string }

export const TILE_ADHESIVES: TileAdhesive[] = [
  { id: "cm12", name: "Ceresit CM 12, 25 kg", handle: "adeziv-pentru-gresie-si-faianta-ceresit-cm-12-interior-exterior-gri-25-kg", bagKg: 25, note: "Pentru gresie și faianță obișnuite" },
  { id: "cm16", name: "Ceresit CM 16 flexibil, 25 kg", handle: "adeziv-flexibil-pentru-gresie-si-faianta-ceresit-cm-16-interior-exterior-gri-25-kg", bagKg: 25, note: "Formate mari, încălzire în pardoseală" },
  { id: "cm17", name: "Ceresit CM 17 super-flexibil, 25 kg", handle: "adeziv-super-flexibil-pentru-gresie-si-faianta-ceresit-cm-17-interior-exterior-gri-25-kg", bagKg: 25, note: "Terase, balcoane, plăci peste plăci" },
]

export const TILE_RULES = {
  waste: { drept: 0.1, diagonal: 0.15 },
  /** pragurile din tabelul Ceresit CM 12: latura cea mai mare (cm) → kg/m², dinte gletieră (mm) */
  adhesive: [
    { max: 10, kg: 1.4, tooth: 4 },
    { max: 15, kg: 2.2, tooth: 6 },
    { max: 25, kg: 2.8, tooth: 8 },
    { max: 30, kg: 4.2, tooth: 10 },
    { max: Infinity, kg: 5, tooth: 12 },
  ],
  tileThicknessMm: 8,
  groutFactor: 3.3,
  primerKgM2: 0.2,
  primerCanKg: 10,
  waterproofKgM2: 1.1,
  waterproofBucketKg: 15,
}

export type TileSurface = { area: number; format: TileFormat; boxM2: number }

export type TilesInput = {
  floor?: TileSurface
  wall?: TileSurface
  pattern: "drept" | "diagonal"
  jointMm: number
  adhesive: TileAdhesive
  waterproof?: { area: number; perimeter: number }
}

const r2 = (n: number) => Math.round(n * 100) / 100

export function adhesiveFor(format: TileFormat) {
  const side = Math.max(format.a, format.b)
  return TILE_RULES.adhesive.find((r) => side <= r.max)!
}

export function groutKgM2(format: TileFormat, jointMm: number) {
  const A = format.a * 10
  const B = format.b * 10
  return ((A + B) / (A * B)) * TILE_RULES.tileThicknessMm * jointMm * TILE_RULES.groutFactor
}

function surface(s: TileSurface | undefined, input: TilesInput) {
  if (!s || s.area <= 0) return null
  const tileM2 = s.area * (1 + TILE_RULES.waste[input.pattern])
  const boxes = Math.ceil(tileM2 / s.boxM2 - 1e-9)
  const adh = adhesiveFor(s.format)
  return {
    area: r2(s.area),
    tileM2: r2(tileM2),
    boxes,
    boxM2Total: r2(boxes * s.boxM2),
    adhesiveKg: s.area * adh.kg,
    adhesiveRate: adh.kg,
    tooth: adh.tooth,
    groutKg: s.area * groutKgM2(s.format, input.jointMm),
  }
}

export function calculateTiles(input: TilesInput) {
  const floor = surface(input.floor, input)
  const wall = surface(input.wall, input)
  const area = (floor?.area ?? 0) + (wall?.area ?? 0)
  const adhesiveKg = (floor?.adhesiveKg ?? 0) + (wall?.adhesiveKg ?? 0)
  const groutKg = (floor?.groutKg ?? 0) + (wall?.groutKg ?? 0)
  const primerKg = area * TILE_RULES.primerKgM2
  const wp = input.waterproof
  const wpKg = wp ? wp.area * TILE_RULES.waterproofKgM2 : 0
  return {
    floor,
    wall,
    area: r2(area),
    adhesiveKg: Math.round(adhesiveKg),
    adhesiveBags: Math.ceil(adhesiveKg / input.adhesive.bagKg - 1e-9),
    groutKg: Math.max(1, Math.ceil(groutKg)),
    primerKg: r2(primerKg),
    primerCans: Math.max(1, Math.ceil(primerKg / TILE_RULES.primerCanKg - 1e-9)),
    waterproofKg: r2(wpKg),
    waterproofBuckets: wp ? Math.max(1, Math.ceil(wpKg / TILE_RULES.waterproofBucketKg - 1e-9)) : 0,
    waterproofTapeM: wp ? Math.ceil(wp.perimeter * 1.1) : 0,
  }
}
