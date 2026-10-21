/**
 * Fundație și beton: volumul de beton pentru o fundație continuă și/sau o placă,
 * cimentul și agregatele pentru betonul preparat pe șantier, armătura.
 *
 * Valori orientative (de confirmat cu Vlad / cu proiectul de rezistență):
 * - rețetă orientativă pe 1 m³: C16/20 — 300 kg ciment; C20/25 — 350 kg ciment;
 *   0,45 m³ nisip 0–4 mm, 0,85 m³ pietriș 4–31 mm, aprox. 180 l apă;
 * - pierderi beton 5%;
 * - bare longitudinale: +10% pentru suprapuneri și ancoraje la colțuri;
 * - etrieri: acoperire cu beton 5 cm pe fiecare parte, carcasă de max. 40 cm
 *   înălțime, cârlige 2 × 10 cm;
 * - plasă sudată: +15% pentru suprapuneri, plase de 2 × 3 m;
 * - sârmă pentru legat: aprox. 1% din greutatea armăturii;
 * - ciment Holcim 40 kg, 40 de saci pe palet (fișa produsului).
 */

export type ConcreteClass = "C16/20" | "C20/25"

export type ConcreteInput = {
  foundation?: {
    /** dimensiunile exterioare ale casei, m */
    houseLength: number
    houseWidth: number
    /** lungimea fundațiilor sub pereții interiori, m */
    interior: number
    /** lățimea și înălțimea fundației, m */
    width: number
    depth: number
    bars: number
    barDiameter: number
    stirrupDiameter: number
    /** distanța între etrieri, m */
    stirrupSpacing: number
  }
  slab?: {
    area: number
    /** grosime, m */
    thickness: number
    meshLayers: 1 | 2
  }
  mix: "statie" | "santier"
  concreteClass: ConcreteClass
}

/** kg/m pentru oțel-beton, după diametru (mm). */
export const STEEL_KG_PER_M: Record<number, number> = {
  6: 0.222, 8: 0.395, 10: 0.617, 12: 0.888, 14: 1.21, 16: 1.58,
}

export const CONCRETE_RULES = {
  waste: 0.05,
  cementKg: { "C16/20": 300, "C20/25": 350 } as Record<ConcreteClass, number>,
  sandM3: 0.45,
  gravelM3: 0.85,
  waterL: 180,
  cementBagKg: 40,
  cementBagsPerPallet: 40,
  barLength: 12,
  barOverlap: 0.1,
  cover: 0.05,
  maxCageHeight: 0.4,
  hooks: 0.2,
  meshOverlap: 0.15,
  meshSheetM2: 6,
  tieWire: 0.01,
}

const r2 = (n: number) => Math.round(n * 100) / 100

export function calculateConcrete(input: ConcreteInput) {
  const R = CONCRETE_RULES
  let foundationM3 = 0
  let slabM3 = 0
  let axis = 0
  let bars = 0
  let barKg = 0
  let stirrups = 0
  let stirrupLen = 0
  let stirrupKg = 0
  let cage: { b: number; h: number } | undefined
  let meshM2 = 0
  let meshSheets = 0

  const f = input.foundation
  if (f && f.houseLength > 0 && f.houseWidth > 0 && f.width > 0 && f.depth > 0) {
    // lungimea pe axul fundației: perimetrul exterior minus colțurile numărate de două ori
    axis = Math.max(0, 2 * (f.houseLength + f.houseWidth) - 4 * f.width) + Math.max(0, f.interior)
    foundationM3 = axis * f.width * f.depth

    const longTotal = axis * f.bars * (1 + R.barOverlap)
    bars = Math.ceil(longTotal / R.barLength - 1e-9)
    barKg = bars * R.barLength * (STEEL_KG_PER_M[f.barDiameter] ?? 0)

    const b = Math.max(0.1, f.width - 2 * R.cover)
    const h = Math.max(0.1, Math.min(f.depth - 2 * R.cover, R.maxCageHeight))
    cage = { b: r2(b), h: r2(h) }
    stirrups = Math.ceil(axis / f.stirrupSpacing) + 1
    stirrupLen = 2 * (b + h) + R.hooks
    stirrupKg = stirrups * stirrupLen * (STEEL_KG_PER_M[f.stirrupDiameter] ?? 0)
  }

  const s = input.slab
  if (s && s.area > 0 && s.thickness > 0) {
    slabM3 = s.area * s.thickness
    meshM2 = s.area * s.meshLayers * (1 + R.meshOverlap)
    meshSheets = Math.ceil(meshM2 / R.meshSheetM2 - 1e-9)
  }

  const net = foundationM3 + slabM3
  const concreteM3 = net * (1 + R.waste)
  const site = input.mix === "santier"
  const cementKg = site ? concreteM3 * R.cementKg[input.concreteClass] : 0
  const cementBags = Math.ceil(cementKg / R.cementBagKg - 1e-9)

  return {
    axis: r2(axis),
    foundationM3: r2(foundationM3),
    slabM3: r2(slabM3),
    netM3: r2(net),
    concreteM3: r2(concreteM3),
    /** la stație se comandă de obicei la 0,5 m³ */
    orderM3: Math.ceil(concreteM3 * 2 - 1e-9) / 2,
    cementKg: Math.round(cementKg),
    cementBags,
    cementPallets: r2(cementBags / R.cementBagsPerPallet),
    sandM3: site ? r2(concreteM3 * R.sandM3) : 0,
    gravelM3: site ? r2(concreteM3 * R.gravelM3) : 0,
    waterL: site ? Math.round(concreteM3 * R.waterL) : 0,
    bars,
    barKg: Math.round(barKg),
    stirrups,
    stirrupLen: r2(stirrupLen),
    stirrupKg: Math.ceil(stirrupKg),
    cage,
    meshM2: r2(meshM2),
    meshSheets,
    tieWireKg: Math.ceil((barKg + stirrupKg) * R.tieWire),
  }
}
