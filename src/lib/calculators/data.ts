/**
 * Datele calculatoarelor, luate de la producători (octombrie 2026).
 * Fiecare valoare are sursa alături. „calculat” = derivat din cifrele
 * producătorului. Pentru tablă vezi data-roof.ts.
 */
import type { AdhesiveOption, EticsRules, FinishOption, InsulationOption } from "./etics"
import type { MasonryUnit } from "./masonry"

export { ROOF_MODELS, ROOF_RULES } from "./data-roof"

// ─────────────────────────────── ZIDĂRIE ───────────────────────────────

/**
 * Mortar Adeplast MZ5, sac 30 kg: 1,5–1,8 kg praf la 1 litru de rost
 * (fișa tehnică Adeplast MZ5) → aprox. 18 l de mortar dintr-un sac (calculat).
 */
const MZ5 = (lPerM2: number, src: string) => ({
  name: "Mortar pentru zidărie Adeplast MZ5, 30 kg",
  handle: "mortar-pentru-zidarie-adeplast-mz5-interior-exterior-30-kg",
  perM2: lPerM2, unit: "l" as const, bag: 18,
  note: `${String(lPerM2).replace(".", ",")} l mortar/m² (${src}), aprox. 18 l dintr-un sac`,
})

/** Spumă adezivă Porotherm Dryfix, doză 810 ml: m² de perete acoperiți de o doză. */
const DRYFIX = (m2PerCan: number, src: string) => ({
  name: "Spumă adezivă Porotherm Dryfix, 810 ml",
  perM2: 1 / m2PerCan, unit: "doză" as const, bag: 1,
  note: `o doză la ${m2PerCan} m² de perete (${src})`,
})

/** Macon: adeziv BCA, un sac la 1 m³ de zidărie (macon.ro, mortar adeziv BCA). */
const BCA_GLUE = (wallM: number) => ({
  name: "Mortar adeziv pentru BCA",
  perM2: wallM, unit: "sac" as const, bag: 1,
  note: "un sac la 1 m³ de zidărie (Macon)",
})

const P = "Wienerberger"
const C = "Cemacon"

export const MASONRY_UNITS: MasonryUnit[] = [
  // ── Wienerberger Porotherm, rost clasic (wienerberger.ro, fișe tehnice și catalog Porotherm)
  { id: "p-115", group: "Porotherm", name: "Porotherm 11.5 N+F", handle: "porotherm-115-nf", size: "500×115×238", wallCm: 11.5, perM2: 8, perPallet: 90, binder: MZ5(8, `catalog ${P}`) },
  { id: "p-15", group: "Porotherm", name: "Porotherm 15 N+F", handle: "porotherm-15-nf", size: "500×150×238", wallCm: 15, perM2: 8, perPallet: 64, binder: MZ5(9.5, `${P}, 63 l/m³`) },
  { id: "p-20", group: "Porotherm", name: "Porotherm 20 N+F", handle: "porotherm-20-nf", size: "500×200×238", wallCm: 20, perM2: 8, perPallet: 48, binder: MZ5(13, `catalog ${P}`) },
  { id: "p-25", group: "Porotherm", name: "Porotherm 25 N+F", handle: "porotherm-25-nf", size: "375×250×238", wallCm: 25, perM2: 11, perPallet: 60, binder: MZ5(16, `catalog ${P}`) },
  { id: "p-2530", group: "Porotherm", name: "Porotherm 25/30 ECO", handle: "porotherm-2530-eco", size: "250×300×238", wallCm: 30, perM2: 16, perPallet: 80,
    note: "Consumul de mortar nu e publicat de producător; îl stabilim împreună la ofertă." },
  { id: "p-30sth", group: "Porotherm", name: "Porotherm 30 STh", handle: "porotherm-30-sth", size: "250×300×238", wallCm: 30, perM2: 16, perPallet: 80, binder: MZ5(51, `catalog ${P}`),
    note: "Wienerberger recomandă pentru acest bloc și mortarul termoizolant Porotherm TM." },
  { id: "p-38sth", group: "Porotherm", name: "Porotherm 38 STh", handle: "porotherm-38-sth", size: "250×380×238", wallCm: 38, perM2: 16, perPallet: 60, binder: MZ5(65, `catalog ${P}`),
    note: "Wienerberger recomandă pentru acest bloc și mortarul termoizolant Porotherm TM." },
  { id: "p-38r", group: "Porotherm", name: "Porotherm 38 Robust", handle: "porotherm-38-robust", size: "250×380×238", wallCm: 38, perM2: 16, perPallet: 60, binder: MZ5(44, `catalog ${P}`) },
  { id: "p-20sono", group: "Porotherm", name: "Porotherm 20 N+F Sono", handle: "porotherm-20-nf-sono", size: "200×200×238", wallCm: 20, perM2: 20, binder: MZ5(9.6, `catalog ${P}`) },

  // ── Porotherm Profi, rost subțire cu spumă Dryfix
  { id: "pp-115", group: "Porotherm Profi", name: "Porotherm 11.5 N+F Profi", handle: "porotherm-115-nf-profi", size: "500×115×249", wallCm: 11.5, perM2: 8, perPallet: 100, binder: DRYFIX(12, `catalog ${P}`) },
  { id: "pp-12", group: "Porotherm Profi", name: "Porotherm 12 N+F Profi", handle: "porotherm-12-nf-profi", size: "500×120×249", wallCm: 12, perM2: 8, perPallet: 100, binder: DRYFIX(12, `catalog ${P}`) },
  { id: "pp-25", group: "Porotherm Profi", name: "Porotherm 25 N+F Profi", handle: "porotherm-25-nf-profi", size: "375×250×249", wallCm: 25, perM2: 11, perPallet: 60, binder: DRYFIX(5, `fișa tehnică ${P} 2024`) },
  { id: "pp-30", group: "Porotherm Profi", name: "Porotherm 30 N+F Profi", handle: "porotherm-30-nf-profi", size: "250×300×249", wallCm: 30, perM2: 16, perPallet: 80, binder: DRYFIX(6, `catalog ${P}`) },
  { id: "pp-38", group: "Porotherm Profi", name: "Porotherm 38 N+F Profi", handle: "porotherm-38-nf-profi", size: "250×380×249", wallCm: 38, perM2: 16, perPallet: 60, binder: DRYFIX(6, `catalog ${P}`) },

  // ── Cemacon Evoceramic (cemacon.ro, pagini de produs): mortar = l/m³ × grosimea peretelui (calculat)
  { id: "c-10", group: "Cemacon", name: "Cemacon Evoceramic 10 NF", handle: "evoceramic-10-nf", size: "500×100×238", wallCm: 10, perM2: 8, perPallet: 80, binder: MZ5(5, `${C}, 50 l/m³`) },
  { id: "c-12", group: "Cemacon", name: "Cemacon Evoceramic 12 NF", handle: "caramida-cemacon-evoceramic-12-nf", size: "460×120×238", wallCm: 12, perM2: 9, perPallet: 96, binder: MZ5(6.2, `${C}, 52 l/m³`) },
  { id: "c-12l", group: "Cemacon", name: "Cemacon Evoceramic 12 NF-L", handle: "evoceramic-12-nfl", size: "495×120×238", wallCm: 12, perM2: 8, perPallet: 96, binder: MZ5(6.2, `${C}, 52 l/m³`) },
  { id: "c-15", group: "Cemacon", name: "Cemacon Evoceramic 15 NF", handle: "evoceramic-15-nf", size: "500×150×238", wallCm: 15, perM2: 8, perPallet: 72, binder: MZ5(8.7, `${C}, 58 l/m³`) },
  { id: "c-20", group: "Cemacon", name: "Cemacon Evoceramic 20 NF", handle: "caramida-cemacon-evoceramic-20-nf", size: "450×200×238", wallCm: 20, perM2: 9, perPallet: 70, binder: MZ5(13.2, `${C}, 66 l/m³`) },
  { id: "c-24", group: "Cemacon", name: "Cemacon Evoceramic 24 NF", handle: "caramida-cemacon-evoceramic-24-nf", size: "430×240×238", wallCm: 24, perM2: 9, perPallet: 60, binder: MZ5(14.4, `${C}, 60 l/m³`) },
  { id: "c-24lm", group: "Cemacon", name: "Cemacon Evoceramic 24 LM", handle: "caramida-cemacon-evoceramic-24-lm", size: "430×240×238", wallCm: 24, perM2: 9, perPallet: 60, binder: MZ5(22.6, `${C}, 94 l/m³`) },
  { id: "c-25", group: "Cemacon", name: "Cemacon Evoceramic 25 NF", handle: "evoceramic-25-nf", size: "380×250×238", wallCm: 25, perM2: 10, perPallet: 72, binder: MZ5(15, `${C}, 60 l/m³`) },
  { id: "c-30", group: "Cemacon", name: "Cemacon Evoceramic 30 NF", handle: "evoceramic-30-nf", size: "250×300×238", wallCm: 30, perM2: 16, perPallet: 96, binder: MZ5(18, `${C}, 60 l/m³`) },
  { id: "c-29f", group: "Cemacon", name: "Cemacon Evoceramic 29 FORTE", handle: "evoceramic-29-forte", size: "240×290×238", wallCm: 29, perM2: 16.5, perPallet: 96, binder: MZ5(28.7, `${C}, 99 l/m³`) },
  { id: "c-44", group: "Cemacon", name: "Cemacon Evoceramic 44", handle: "evoceramic-44", size: "240×440×238", wallCm: 44, perM2: 16.5, perPallet: 60, binder: MZ5(28.6, `${C}, 65 l/m³`) },
  { id: "c-30fe", group: "Cemacon", name: "Cemacon Europoroton 30 F-E", handle: "caramida-cemacon-europoroton-30-f-e", size: "240×290×238", wallCm: 29, perM2: 16, binder: MZ5(25.2, `${C}, 86,9 l/m³`) },
  { id: "c-12vb", group: "Cemacon", name: "Cemacon Evoceramic 12 VB", handle: "evoceramic-12-vb", size: "460×120×238", wallCm: 12, perM2: 9, perPallet: 120, binder: MZ5(6.2, `${C}, 52 l/m³`) },
  { id: "c-24vb", group: "Cemacon", name: "Cemacon Evoceramic 24 VB", handle: "evoceramic-24-vb", size: "430×240×238", wallCm: 24, perM2: 9, perPallet: 60, binder: MZ5(14.4, `${C}, 60 l/m³`) },
  { id: "c-44vb", group: "Cemacon", name: "Cemacon Evoceramic 44 VB", handle: "evoceramic-44-vb", size: "240×440×240", wallCm: 44, perM2: 16.5, perPallet: 60, binder: MZ5(28.6, `${C}, 65 l/m³`) },

  // ── BCA Macon, 600×250 mm, 6,7 buc/m² la toate grosimile (macon.ro)
  ...([
    [100, 120], [125, 96], [150, 80], [200, undefined], [250, 48], [300, 40], [350, 32], [400, 32],
  ] as [number, number | undefined][]).map(([t, pal]) => ({
    id: `bca-${t}`, group: "BCA Macon", name: `BCA Macon ${t} mm`, handle: `bca-macon-${t}x250x600`,
    size: `600×${t}×250`, wallCm: t / 10, perM2: 6.7, perPallet: pal, binder: BCA_GLUE(t / 1000),
  })),
]

// ───────────────────────────── TERMOSISTEM ─────────────────────────────

export const ETICS_INSULATION: InsulationOption[] = [
  {
    // Sikatherm EPS 80: plăci 1000×500 mm, pachet aprox. 0,25 m³ (fișa tehnică Sika) → m² = 0,25 / grosime (calculat)
    id: "eps", kind: "eps", name: "Polistiren expandat Sikatherm EPS 80",
    thicknesses: [5, 8, 10, 12, 15], packM2: (t) => 0.25 / (t / 100),
    handle: "polistiren-expandat-sikatherm-eps-80",
  },
  {
    // Rockwool Frontrock System, plăci 1200×600 mm: 3,60 m² (5–8 cm), 2,88 m² (10 cm), 1,44 m² (12–16 cm)
    id: "vata", kind: "vata", name: "Vată bazaltică pentru fațade",
    thicknesses: [5, 8, 10, 12, 15], packM2: (t) => (t <= 8 ? 3.6 : t <= 10 ? 2.88 : 1.44),
    note: "Pachete după Rockwool Frontrock System",
  },
]

export const ETICS_ADHESIVES: AdhesiveOption[] = [
  // Ceresit Thermo Universal: EPS 4,0 kg/m², vată 5,0; șpăcluire 4,0; amorsare vată ~1 kg/m² (fișa tehnică Ceresit 2024)
  { id: "ceresit", name: "Ceresit Thermo Universal, 25 kg", handle: "adeziv-polistiren-vata-minerala-ceresit-thermo-universal-interior-exterior-25-kg",
    bagKg: 25, bond: { eps: 4, vata: 5 }, mesh: 4, woolPrime: 1 },
  // SikaHome Insulate Polystyrene: lipire 5 kg/m² (pe toată suprafața), șpăcluire 4 kg/m² (fișa tehnică Sika)
  { id: "sika", name: "SikaHome Insulate, 25 kg", handle: "adeziv-polistiren-sikahome-inuslate", bagKg: 25, bond: { eps: 5 }, mesh: 4 },
  // Adeplast Polistirol Premium: lipire 4,0–5,0 kg/m² (gletieră 10×10), șpăcluire 3,9–5,5 kg/m² → valori medii
  { id: "adeplast", name: "Adeplast Polistirol Premium, 25 kg", handle: "adeziv-polistiren-adeplast-polistirol-premium-interior-exterior-alb-25-kg",
    bagKg: 25, bond: { eps: 4.5 }, mesh: 4.7 },
]

export const ETICS_FINISHES: FinishOption[] = [
  // RÖFIX 713 NATURA, granulație 0–1,5 mm: 2,3 kg/m², sac 25 kg (hasit.ro)
  { id: "rofix713", name: "RÖFIX 713 NATURA, tencuială decorativă 1,5 mm", handle: "rofix-713-natura-tencuiala-decorativa", kgM2: 2.3, bagKg: 25, unit: "sac" },
  // CERESIT HYDRO FLEX: tencuială decorativă siliconică, granulație 1,5 mm, găleată 25 kg, consum orientativ 2,5 kg/m² (fișa produsului)
  { id: "hydroflex", name: "CERESIT HYDRO FLEX, tencuială decorativă siliconică 1,5 mm", handle: "ceresit-hydro-flex", kgM2: 2.5, bagKg: 25, unit: "găleată" },
]

export const ETICS_RULES: EticsRules = {
  boardWaste: 0.05,
  meshRollM2: 50, // RÖFIX P50: rolă 50 × 1 m
  meshM2PerM2: 1.1, // RÖFIX P50: 1,1 m² plasă / m² perete (suprapunere 10 cm)
  meshHandle: "rofix-p50-plasa-de-armare",
  dowelsPerM2: 6, // Ceresit Thermo Universal: minimum 6/m², 8/m² la 2 m de colțuri
  dowelAddMm: 35, // Baumit: lungime diblu = grosime izolație + 35 mm
  dowelLengths: [95, 115, 135, 155, 175, 195, 215, 235, 255, 295],
  profileLength: 2.5,
  primerLM2: 0.3, // Ceresit CT 16: 0,3 l/m² primul strat
}
