// TEMPORAR: valori de test pentru interfață, se înlocuiesc cu datele producătorilor
import type { SheetModel, AccessoryRules } from "./roof"
import type { InsulationOption, FinishOption, EticsRules } from "./etics"
import type { MasonryUnit } from "./masonry"

export const ROOF_MODELS: SheetModel[] = [
  { id: "clasic", name: "Țiglă metalică Clasic", group: "Țiglă metalică", kind: "cut", usefulWidth: 1.1, module: 0.35, moduleAdd: 0.05, minLength: 0.5, maxLength: 7, overlap: 0.15, handle: "tigla-metalica-clasic" },
  { id: "t18", name: "Tablă cutată T18", group: "Tablă cutată", kind: "cut", usefulWidth: 1.1, minLength: 0.5, maxLength: 13.5, overlap: 0.2, handle: "tabla-cutata-t18" },
  { id: "nat", name: "Novatik Natura Classic", group: "Novatik", kind: "panel", panelArea: 0.46 },
]
export const ROOF_RULES: AccessoryRules = { trimUsefulLength: 1.9, screwsPerM2: 8, membraneRollM2: 75, membraneExtra: 0.15, gutterPerDownpipe: 10, panelWaste: 0.08 }
export const ETICS_INSULATION: InsulationOption[] = [
  { id: "eps", name: "Polistiren expandat EPS 80", thicknesses: [5, 8, 10, 15], packM2: { 5: 5, 8: 3, 10: 2.5, 15: 1.5 }, adhesive: { name: "Adeziv polistiren", bagKg: 25, bondKgM2: 5, meshKgM2: 4 }, dowelsPerM2: 6 },
  { id: "vata", name: "Vată bazaltică", thicknesses: [5, 10], packM2: { 5: 2.4, 10: 1.2 }, adhesive: { name: "Adeziv vată", bagKg: 25, bondKgM2: 6, meshKgM2: 5 }, dowelsPerM2: 8 },
]
export const ETICS_FINISHES: FinishOption[] = [{ id: "t15", name: "Tencuială decorativă 1,5 mm", kgM2: 2.5, bucketKg: 25, primer: { name: "Grund", kgM2: 0.3, bucketKg: 20 } }]
export const ETICS_RULES: EticsRules = { boardWaste: 0.05, meshRollM2: 50, meshOverlap: 0.1, profileLength: 2.5, dowelLengths: [90, 110, 120, 140, 160, 180, 200, 220, 260], dowelAnchorCm: 5 }
export const MASONRY_UNITS: MasonryUnit[] = [
  { id: "p25", name: "Porotherm 25/30 ECO", group: "Cărămidă", size: "300×250×238", wallCm: 25, perM2: 13.3, perPallet: 60, binder: { name: "Mortar zidărie", perM2: 27, unit: "l", bag: 25, bagUnit: "l" } },
]
