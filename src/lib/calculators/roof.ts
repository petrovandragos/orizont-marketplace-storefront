/**
 * Calculul tablei pentru acoperiș: o apă, două ape, patru ape.
 *
 * Toate dimensiunile sunt în metri. Fiecare apă (față a acoperișului) e
 * un trapez: bază jos (streașina), bază sus (coama, centrată) și înălțime
 * (lungimea pantei, de la streașină la coamă). Dreptunghiul are baza de sus
 * egală cu cea de jos, triunghiul are baza de sus 0.
 *
 * Tabla se pune pe coloane de lățimea utilă a modelului. Pentru fiecare
 * coloană lungimea necesară e cea mai mare înălțime a apei pe lățimea ei,
 * rotunjită la modul (la țigla metalică) și împărțită în mai multe foi
 * dacă depășește lungimea maximă.
 */

export type RoofType = "o-apa" | "doua-ape" | "patru-ape"

export type SheetKind = "cut" | "panel"

export type SheetModel = {
  id: string
  name: string
  group: string
  /** handle-ul produsului pe site, pentru link */
  handle?: string
  kind: SheetKind
  /** lățimea utilă, m (pentru kind = "cut") */
  usefulWidth?: number
  /** pasul modulului, m (țiglă metalică); lipsă = se taie la orice lungime */
  module?: number
  /** se adaugă la n × modul, m (ex. 0,05 la unele țigle) */
  moduleAdd?: number
  minLength?: number
  maxLength?: number
  /** suprapunerea pe lungime când o foaie nu acoperă toată panta, m */
  overlap?: number
  /** pentru kind = "panel": m² acoperiți de un panou */
  panelArea?: number
  /** m² într-un pachet (dacă se vinde la pachet) */
  panelsPerPack?: number
  /** pentru afișare: unde am găsit datele */
  source?: string
}

export type Face = {
  name: string
  bottom: number
  top: number
  height: number
}

export type Column = { x0: number; x1: number; needed: number; pieces: number[] }

export type FaceResult = Face & { area: number; columns: Column[] }

export type RoofInput = {
  type: RoofType
  /** lungimea streașinii (latura lungă), m */
  length: number
  /** lățimea clădirii, latura scurtă (doar la patru ape), m */
  width: number
  /** lungimea pantei, de la streașină la coamă, m */
  slope: number
  chimneys: number
  /** alegerea clientului pentru lungimea foilor (lipsă = o foaie pe toată panta) */
  sheet?: SheetChoice
}

export type SheetChoice = {
  /** foaia cea mai lungă acceptată, m (pentru transport sau manevrare) */
  maxLength?: number
  /** la țigla metalică: cu cât poate fi foaia mai scurtă decât panta, m (sus o acoperă coama) */
  ridgeTolerance?: number
}

/** Cât poate lipsi sus, sub coamă, când foaia se ia cu un pas mai scurtă (de confirmat cu montatorii). */
export const RIDGE_TOLERANCE = 0.1

export function roofFaces(input: RoofInput): Face[] {
  const { type, length: L, width: l, slope: H } = input
  if (type === "o-apa") return [{ name: "Apa", bottom: L, top: L, height: H }]
  if (type === "doua-ape") {
    return [
      { name: "Apa 1", bottom: L, top: L, height: H },
      { name: "Apa 2", bottom: L, top: L, height: H },
    ]
  }
  const short = Math.min(L, l)
  const long = Math.max(L, l)
  const ridge = long - short
  return [
    { name: "Apa lungă 1", bottom: long, top: ridge, height: H },
    { name: "Apa lungă 2", bottom: long, top: ridge, height: H },
    { name: "Apa scurtă 1", bottom: short, top: 0, height: H },
    { name: "Apa scurtă 2", bottom: short, top: 0, height: H },
  ]
}

const round3 = (n: number) => Math.round(n * 1000) / 1000

/** Înălțimea apei la poziția x, de la marginea din stânga a streașinii. */
function faceHeightAt(face: Face, x: number) {
  const inset = (face.bottom - face.top) / 2
  if (inset <= 1e-9) return face.height
  if (x < inset) return (face.height * x) / inset
  if (x > face.bottom - inset) return (face.height * (face.bottom - x)) / inset
  return face.height
}

/** Cea mai mare înălțime pe intervalul [x0, x1]. */
function maxHeightIn(face: Face, x0: number, x1: number) {
  const inset = (face.bottom - face.top) / 2
  const mid0 = inset
  const mid1 = face.bottom - inset
  if (x1 >= mid0 && x0 <= mid1) return face.height
  return Math.max(faceHeightAt(face, x0), faceHeightAt(face, Math.min(x1, face.bottom)))
}

/** Lungimea comandată pentru o lungime necesară, după regulile modelului. */
export function orderLength(model: SheetModel, needed: number, tolerance = 0) {
  const min = model.minLength ?? 0
  let len = Math.max(needed, min)
  if (model.module) {
    const add = model.moduleAdd ?? 0
    let n = Math.max(1, Math.ceil((len - add - 1e-9) / model.module))
    // cu un pas mai scurtă, dacă lipsa de sus o acoperă coama
    const shorter = (n - 1) * model.module + add
    if (tolerance > 0 && n > 1 && shorter >= min - 1e-9 && shorter >= needed - tolerance - 1e-9) n -= 1
    len = n * model.module + add
  } else {
    len = Math.ceil(len * 100 - 1e-6) / 100 // la centimetru
  }
  return round3(len)
}

/** Împarte o coloană în foi, dacă panta e mai lungă decât foaia maximă. */
/** Lungimea maximă a foii: a modelului, sau mai mică dacă a ales-o clientul (la țiglă, pe pas întreg). */
export function maxSheetLength(model: SheetModel, choice?: SheetChoice) {
  let max = model.maxLength ?? Infinity
  if (choice?.maxLength && choice.maxLength < max) {
    max = choice.maxLength
    if (model.module) {
      const add = model.moduleAdd ?? 0
      max = Math.max(1, Math.floor((max - add + 1e-9) / model.module)) * model.module + add
    }
    max = Math.max(max, model.minLength ?? 0)
  }
  return round3(max)
}

export function splitColumn(model: SheetModel, needed: number, choice?: SheetChoice): number[] {
  const max = maxSheetLength(model, choice)
  const tol = model.module ? choice?.ridgeTolerance ?? 0 : 0
  const single = orderLength(model, needed, tol)
  if (single <= max + 1e-9) return [single]
  const overlap = model.overlap ?? 0.15
  const usefulPerPiece = max - overlap
  const count = Math.ceil((needed - overlap) / usefulPerPiece - 1e-9)
  // foi egale, fiecare cu suprapunerea inclusă
  const each = (needed + overlap * (count - 1)) / count
  return Array.from({ length: count }, () => Math.min(orderLength(model, each), max))
}

/** Variantele de lungime a foii pe care le arătăm clientului, după panta cea mai lungă. */
/** Lungimea unei foi, mereu cu două zecimale: 4,90 m. */
export const fmtLen = (n: number) => n.toLocaleString("ro-RO", { minimumFractionDigits: 2, maximumFractionDigits: 2 })

export function sheetOptions(model: SheetModel, longest: number) {
  const out: { id: string; title: string; subtitle: string; choice?: SheetChoice }[] = []
  if (model.kind !== "cut" || !(longest > 0)) return out
  const full = splitColumn(model, longest)
  out.push({
    id: "auto",
    title: full.length === 1 ? `O foaie de ${fmtLen(full[0])} m` : `${full.length} foi de ${fmtLen(full[0])} m`,
    subtitle: full.length === 1
      ? model.module ? `pe toată panta, rotunjită în sus la pasul de ${fmt(model.module * 100, 0)} cm` : "pe toată panta"
      : `foaia cea mai lungă pentru acest model e de ${fmt(model.maxLength ?? 0)} m`,
  })
  if (model.module && full.length === 1) {
    const short = orderLength(model, longest, RIDGE_TOLERANCE)
    if (short < full[0] - 1e-9) {
      out.push({
        id: "coama",
        title: `O foaie de ${fmtLen(short)} m`,
        subtitle: `cu ${fmt((longest - short) * 100, 0)} cm mai scurtă decât panta, o acoperă coama`,
        choice: { ridgeTolerance: RIDGE_TOLERANCE },
      })
    }
  }
  const overlap = model.overlap ?? 0.15
  for (let k = full.length + 1; k <= full.length + 2; k++) {
    const each = orderLength(model, (longest + overlap * (k - 1)) / k)
    if (each < (model.minLength ?? 0) + 0.3) break
    out.push({
      id: `foi-${k}`,
      title: `${k} foi de ${fmtLen(each)} m`,
      subtitle: `mai ușor de transportat, se suprapun ${fmt(overlap * 100, 0)} cm`,
      choice: { maxLength: each },
    })
  }
  return out
}

export function layoutFace(face: Face, model: SheetModel, choice?: SheetChoice): FaceResult {
  const area = ((face.bottom + face.top) / 2) * face.height
  const W = model.usefulWidth ?? 1
  const count = Math.max(1, Math.ceil(face.bottom / W - 1e-9))
  const columns: Column[] = []
  for (let i = 0; i < count; i++) {
    const x0 = i * W
    const x1 = Math.min((i + 1) * W, face.bottom)
    const needed = maxHeightIn(face, x0, x1)
    if (needed < 0.05) continue
    columns.push({ x0, x1, needed: round3(needed), pieces: splitColumn(model, needed, choice) })
  }
  return { ...face, area: round3(area), columns }
}

export type SheetLine = { length: number; count: number }

export type AccessoryLine = {
  key: string
  name: string
  quantity: number
  unit: string
  note?: string
}

export type RoofResult = {
  faces: FaceResult[]
  roofArea: number
  /** doar pentru modele tăiate pe lungime */
  sheets: SheetLine[]
  sheetCount: number
  /** m² utili comandați (lungime × lățime utilă), cum se vinde de obicei tabla */
  orderedArea: number
  /** pentru panouri */
  panels?: number
  wastePercent: number
  edges: { eaves: number; ridge: number; hips: number; gables: number; wallTop: number }
  accessories: AccessoryLine[]
}

export type AccessoryRules = {
  /** lungimea utilă a unei piese de coamă / bordură / streașină, m */
  trimUsefulLength: number
  screwsPerM2: number
  membraneRollM2: number
  membraneExtra: number
  /** câți metri de jgheab deservește un burlan */
  gutterPerDownpipe: number
  panelWaste: number
}

export function calculateRoof(
  input: RoofInput,
  model: SheetModel,
  rules: AccessoryRules
): RoofResult {
  const faces = roofFaces(input).map((f) => layoutFace(f, model, input.sheet))
  const roofArea = round3(faces.reduce((s, f) => s + f.area, 0))

  // ── muchii
  const { type, length: L, width: l, slope: H } = input
  let eaves = 0, ridge = 0, hips = 0, gables = 0
  let wallTop = 0
  if (type === "o-apa") {
    eaves = L; wallTop = L; gables = 2 * H
  } else if (type === "doua-ape") {
    eaves = 2 * L; ridge = L; gables = 4 * H
  } else {
    const short = Math.min(L, l)
    const long = Math.max(L, l)
    eaves = 2 * (long + short)
    ridge = long - short
    hips = 4 * Math.sqrt(H * H + (short / 2) ** 2)
  }

  // ── tablă
  let sheets: SheetLine[] = []
  let sheetCount = 0
  let orderedArea = 0
  let panels: number | undefined
  if (model.kind === "panel") {
    const per = model.panelArea ?? 1
    panels = Math.ceil((roofArea * (1 + rules.panelWaste)) / per)
    orderedArea = round3(panels * per)
  } else {
    const map = new Map<number, number>()
    for (const f of faces) for (const c of f.columns) for (const p of c.pieces) map.set(p, (map.get(p) ?? 0) + 1)
    sheets = Array.from(map.entries()).map(([length, count]) => ({ length, count })).sort((a, b) => b.length - a.length)
    sheetCount = sheets.reduce((s, x) => s + x.count, 0)
    const w = model.usefulWidth ?? 1
    orderedArea = round3(sheets.reduce((s, x) => s + x.length * x.count * w, 0))
  }
  const wastePercent = roofArea > 0 ? Math.max(0, Math.round(((orderedArea - roofArea) / orderedArea) * 100)) : 0

  // ── accesorii
  const pieces = (m: number) => Math.ceil(m / rules.trimUsefulLength - 1e-9)
  const acc: AccessoryLine[] = []
  if (ridge + hips > 0) acc.push({ key: "coama", name: "Coamă", quantity: pieces(ridge + hips), unit: "buc", note: `${fmt(ridge + hips)} m de coamă${hips ? " și muchii" : ""}` })
  if (ridge + hips > 0) acc.push({ key: "banda-coama", name: "Bandă de coamă (aerisire)", quantity: Math.ceil((ridge + hips) / 5 - 1e-9), unit: "rolă", note: "role de 5 m" })
  if (gables > 0) acc.push({ key: "bordura", name: "Bordură laterală (fronton)", quantity: pieces(gables), unit: "buc", note: `${fmt(gables)} m` })
  if (wallTop > 0) acc.push({ key: "bordura-perete", name: "Bordură la perete (sus)", quantity: pieces(wallTop), unit: "buc", note: `${fmt(wallTop)} m` })
  acc.push({ key: "streasina", name: "Picurător streașină", quantity: pieces(eaves), unit: "buc", note: `${fmt(eaves)} m` })
  acc.push({ key: "folie", name: "Folie anticondens", quantity: Math.ceil((roofArea * (1 + rules.membraneExtra)) / rules.membraneRollM2), unit: "rolă", note: `${fmt(roofArea * (1 + rules.membraneExtra))} m²` })
  acc.push({ key: "suruburi", name: "Șuruburi autoforante", quantity: Math.ceil((roofArea * rules.screwsPerM2) / 50) * 50, unit: "buc" })
  acc.push({ key: "jgheab", name: "Jgheab", quantity: Math.ceil(eaves), unit: "m" })
  const downpipes = type === "patru-ape" ? Math.max(4, Math.ceil(eaves / rules.gutterPerDownpipe)) : Math.max(type === "doua-ape" ? 2 : 1, Math.ceil(eaves / rules.gutterPerDownpipe))
  acc.push({ key: "burlan", name: "Burlane", quantity: downpipes, unit: "buc", note: "lungimea depinde de înălțimea casei" })
  if (input.chimneys > 0) acc.push({ key: "cos", name: "Bandă etanșare coș de fum", quantity: input.chimneys, unit: "rolă" })

  return { faces, roofArea, sheets, sheetCount, orderedArea, panels, wastePercent, edges: { eaves: round3(eaves), ridge: round3(ridge), hips: round3(hips), gables: round3(gables), wallTop: round3(wallTop) }, accessories: acc }
}

export function fmt(n: number, digits = 2) {
  return n.toLocaleString("ro-RO", { maximumFractionDigits: digits, minimumFractionDigits: 0 })
}

/** Unitatea la plural, unde e cazul: 1 rolă, 2 role. */
export function unitLabel(unit: string, q: number) {
  if (unit === "rolă") return q === 1 ? "rolă" : "role"
  if (unit === "sac") return q === 1 ? "sac" : "saci"
  if (unit === "găleată") return q === 1 ? "găleată" : "găleți"
  if (unit === "pachet") return q === 1 ? "pachet" : "pachete"
  if (unit === "palet") return q === 1 ? "palet" : "paleți"
  if (unit === "foaie") return q === 1 ? "foaie" : "foi"
  if (unit === "panou") return q === 1 ? "panou" : "panouri"
  if (unit === "doză") return q === 1 ? "doză" : "doze"
  return unit
}
