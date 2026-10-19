/** Termosistem (izolarea fațadei): cantități din suprafața netă a fațadei. */

export type InsulationOption = {
  id: string
  name: string
  /** grosimi disponibile, cm */
  thicknesses: number[]
  /** m² într-un pachet, pe grosime (cm → m²) */
  packM2: Record<number, number>
  /** produsul de pe site (handle), pentru link */
  handle?: string
  adhesive: AdhesiveOption
  /** dibluri pe m² în câmp curent */
  dowelsPerM2: number
}

export type AdhesiveOption = {
  name: string
  handle?: string
  bagKg: number
  /** kg/m² la lipirea plăcilor */
  bondKgM2: number
  /** kg/m² la șpăcluire și înglobarea plasei */
  meshKgM2: number
}

export type FinishOption = {
  id: string
  name: string
  handle?: string
  kgM2: number
  bucketKg: number
  primer?: { name: string; kgM2: number; bucketKg: number; handle?: string }
}

export type EticsRules = {
  boardWaste: number
  meshRollM2: number
  /** suprapunerea plăsii (procent adăugat) */
  meshOverlap: number
  profileLength: number
  dowelLengths: number[]
  /** cât intră diblul în zid + stratul de adeziv, cm */
  dowelAnchorCm: number
}

export type EticsInput = {
  perimeter: number
  height: number
  openings: number
  /** perimetrul golurilor (ferestre, uși), pentru colțare la glafuri */
  openingsPerimeter: number
  corners: number
  thickness: number
}

export type EticsLine = { key: string; name: string; quantity: number; unit: string; note?: string; handle?: string }

const r2 = (n: number) => Math.round(n * 100) / 100

export function pickDowel(thicknessCm: number, rules: EticsRules) {
  const need = (thicknessCm + rules.dowelAnchorCm) * 10
  return rules.dowelLengths.find((l) => l >= need) ?? rules.dowelLengths[rules.dowelLengths.length - 1]
}

export function calculateEtics(
  input: EticsInput,
  ins: InsulationOption,
  finish: FinishOption | null,
  rules: EticsRules
) {
  const gross = input.perimeter * input.height
  const area = Math.max(0, gross - input.openings)
  const lines: EticsLine[] = []

  const boardM2 = area * (1 + rules.boardWaste)
  const pack = ins.packM2[input.thickness]
  lines.push(
    pack
      ? { key: "placi", name: `${ins.name} ${input.thickness} cm`, quantity: Math.ceil(boardM2 / pack), unit: "pachet", note: `${r2(boardM2)} m², ${pack} m²/pachet`, handle: ins.handle }
      : { key: "placi", name: `${ins.name} ${input.thickness} cm`, quantity: Math.ceil(boardM2), unit: "m²", handle: ins.handle }
  )

  const bondKg = area * ins.adhesive.bondKgM2
  const meshKg = area * ins.adhesive.meshKgM2
  lines.push({ key: "adeziv", name: ins.adhesive.name, quantity: Math.ceil((bondKg + meshKg) / ins.adhesive.bagKg), unit: "sac",
    note: `${Math.round(bondKg)} kg lipire + ${Math.round(meshKg)} kg șpăcluire, sac ${ins.adhesive.bagKg} kg`, handle: ins.adhesive.handle })

  const meshM2 = area * (1 + rules.meshOverlap)
  lines.push({ key: "plasa", name: "Plasă din fibră de sticlă", quantity: Math.ceil(meshM2 / rules.meshRollM2), unit: "rolă", note: `${r2(meshM2)} m², rolă ${rules.meshRollM2} m²` })

  const dowel = pickDowel(input.thickness, rules)
  const dowels = Math.ceil((area * ins.dowelsPerM2) / 50) * 50
  lines.push({ key: "dibluri", name: `Dibluri pentru termoizolație ${dowel} mm`, quantity: dowels, unit: "buc", note: `${ins.dowelsPerM2} buc/m²` })

  const starter = Math.ceil(input.perimeter / rules.profileLength)
  lines.push({ key: "soclu", name: `Profil de soclu ${input.thickness} cm`, quantity: starter, unit: "buc", note: `${r2(input.perimeter)} m, bare de ${rules.profileLength} m` })

  const cornerM = input.corners * input.height + input.openingsPerimeter
  if (cornerM > 0) lines.push({ key: "coltar", name: "Profil colțar cu plasă", quantity: Math.ceil(cornerM / rules.profileLength), unit: "buc", note: `${r2(cornerM)} m` })

  if (finish) {
    if (finish.primer) {
      const pk = area * finish.primer.kgM2
      lines.push({ key: "grund", name: finish.primer.name, quantity: Math.ceil(pk / finish.primer.bucketKg), unit: "găleată", note: `${Math.round(pk)} kg`, handle: finish.primer.handle })
    }
    const fk = area * finish.kgM2
    lines.push({ key: "tencuiala", name: finish.name, quantity: Math.ceil(fk / finish.bucketKg), unit: "găleată", note: `${Math.round(fk)} kg, ${finish.kgM2} kg/m²`, handle: finish.handle })
  }

  return { gross: r2(gross), area: r2(area), lines, dowel }
}
