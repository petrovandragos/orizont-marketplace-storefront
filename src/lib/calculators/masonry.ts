/** Zidărie: elemente de zidărie și mortar din suprafața netă a pereților. */

export type MasonryUnit = {
  id: string
  name: string
  group: string
  handle?: string
  /** dimensiuni L × l × h, mm */
  size: string
  /** grosimea peretelui, cm */
  wallCm: number
  perM2: number
  perPallet?: number
  /** liant: perM2 în unitatea `unit`; bag = cât dă un sac, în aceeași unitate */
  binder?: { name: string; handle?: string; perM2: number; unit: "l" | "sac" | "doză"; bag: number; note: string }
  note?: string
}

export type MasonryInput = { length: number; height: number; openings: number; waste: number }

const r2 = (n: number) => Math.round(n * 100) / 100

export function calculateMasonry(input: MasonryInput, unit: MasonryUnit) {
  const area = Math.max(0, input.length * input.height - input.openings)
  const pieces = Math.ceil(area * unit.perM2 * (1 + input.waste))
  const pallets = unit.perPallet ? Math.ceil(pieces / unit.perPallet) : undefined
  const binderTotal = unit.binder ? area * unit.binder.perM2 : 0
  const bags = unit.binder ? Math.ceil(binderTotal / unit.binder.bag - 1e-9) : 0
  return {
    area: r2(area),
    volume: r2(area * unit.wallCm / 100),
    pieces,
    pallets,
    binderTotal: r2(binderTotal),
    bags,
  }
}
