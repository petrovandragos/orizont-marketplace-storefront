/** Termosistem (izolarea fațadei): cantități din suprafața netă a fațadei. */

export type InsulationKind = "eps" | "vata"

export type InsulationOption = {
  id: string
  kind: InsulationKind
  name: string
  thicknesses: number[]
  /** m² într-un pachet, după grosime (cm) */
  packM2: (thicknessCm: number) => number
  handle?: string
  note?: string
}

export type AdhesiveOption = {
  id: string
  name: string
  handle?: string
  bagKg: number
  /** kg/m² la lipirea plăcilor, pe tip de izolație (lipsă = nu e pentru acel tip) */
  bond: Partial<Record<InsulationKind, number>>
  /** kg/m² la șpăcluire și înglobarea plasei */
  mesh: number
  /** kg/m² strat de amorsare pe vată, dacă producătorul îl cere */
  woolPrime?: number
}

export type FinishOption = { id: string; name: string; handle?: string; kgM2: number; bagKg: number; unit: "sac" | "găleată" }

export type EticsRules = {
  boardWaste: number
  meshRollM2: number
  meshM2PerM2: number
  meshHandle?: string
  dowelsPerM2: number
  /** lungimea diblului = grosimea izolației + atât, mm */
  dowelAddMm: number
  dowelLengths: number[]
  profileLength: number
  primerLM2: number
}

export type EticsInput = {
  perimeter: number
  height: number
  openings: number
  openingsPerimeter: number
  corners: number
  thickness: number
}

export type EticsLine = { key: string; name: string; quantity: number; unit: string; note?: string; handle?: string }

const r1 = (n: number) => Math.round(n * 10) / 10
const c1 = (n: number) => String(r1(n)).replace(".", ",")

export function dowelLength(thicknessCm: number, rules: EticsRules) {
  const need = thicknessCm * 10 + rules.dowelAddMm
  return rules.dowelLengths.find((l) => l >= need) ?? Math.ceil(need / 10) * 10
}

export function calculateEtics(
  input: EticsInput,
  ins: InsulationOption,
  adh: AdhesiveOption,
  finish: FinishOption | null,
  rules: EticsRules
) {
  const gross = input.perimeter * input.height
  const area = Math.max(0, gross - input.openings)
  const lines: EticsLine[] = []

  const boardM2 = area * (1 + rules.boardWaste)
  const pack = ins.packM2(input.thickness)
  lines.push({
    key: "placi", name: `${ins.name}, ${input.thickness} cm`, quantity: Math.ceil(boardM2 / pack - 1e-9), unit: "pachet",
    note: `${c1(boardM2)} m² cu 5% rezervă, ${c1(pack)} m² într-un pachet`, handle: ins.handle,
  })

  const bond = adh.bond[ins.kind] ?? 0
  const prime = ins.kind === "vata" ? adh.woolPrime ?? 0 : 0
  const kg = area * (bond + adh.mesh + prime)
  lines.push({
    key: "adeziv", name: adh.name, quantity: Math.ceil(kg / adh.bagKg - 1e-9), unit: "sac",
    note: `${Math.round(area * bond)} kg lipire + ${Math.round(area * adh.mesh)} kg șpăcluire${prime ? ` + ${Math.round(area * prime)} kg amorsare vată` : ""}, saci de ${adh.bagKg} kg`,
    handle: adh.handle,
  })

  const meshM2 = area * rules.meshM2PerM2
  lines.push({ key: "plasa", name: "Plasă de armare din fibră de sticlă", quantity: Math.ceil(meshM2 / rules.meshRollM2 - 1e-9), unit: "rolă",
    note: `${c1(meshM2)} m² cu suprapunere de 10 cm, role de ${rules.meshRollM2} m²`, handle: rules.meshHandle })

  const dl = dowelLength(input.thickness, rules)
  lines.push({ key: "dibluri", name: `Dibluri pentru termoizolație, minimum ${dl} mm`, quantity: Math.ceil((area * rules.dowelsPerM2) / 50) * 50, unit: "buc",
    note: `${rules.dowelsPerM2} buc/m²; la BCA sau pe tencuială veche, lungimea crește` })

  lines.push({ key: "soclu", name: `Profil de soclu pentru ${input.thickness} cm`, quantity: Math.ceil(input.perimeter / rules.profileLength - 1e-9), unit: "buc",
    note: `${c1(input.perimeter)} m, bare de ${String(rules.profileLength).replace(".", ",")} m` })

  const cornerM = input.corners * input.height + input.openingsPerimeter
  if (cornerM > 0) lines.push({ key: "coltar", name: "Profil colțar cu plasă", quantity: Math.ceil(cornerM / rules.profileLength - 1e-9), unit: "buc", note: `${c1(cornerM)} m la colțuri și glafuri` })

  if (finish) {
    lines.push({ key: "grund", name: "Grund pentru tencuiala decorativă", quantity: Math.ceil(area * rules.primerLM2), unit: "l", note: `aprox. ${String(rules.primerLM2).replace(".", ",")} l/m²` })
    const fk = area * finish.kgM2
    lines.push({ key: "tencuiala", name: finish.name, quantity: Math.ceil(fk / finish.bagKg - 1e-9), unit: finish.unit, note: `${Math.round(fk)} kg, ${String(finish.kgM2).replace(".", ",")} kg/m²`, handle: finish.handle })
  }

  return { gross: r1(gross), area: r1(area), lines, dowel: dl }
}
