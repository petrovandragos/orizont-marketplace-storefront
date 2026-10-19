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
  binder: { name: string; handle?: string; perM2: number; unit: "l" | "kg"; bag: number; bagUnit: "l" | "kg"; yieldNote?: string }
}

export type MasonryInput = { length: number; height: number; openings: number; waste: number }

const r2 = (n: number) => Math.round(n * 100) / 100

export function calculateMasonry(input: MasonryInput, unit: MasonryUnit) {
  const area = Math.max(0, input.length * input.height - input.openings)
  const pieces = Math.ceil(area * unit.perM2 * (1 + input.waste))
  const pallets = unit.perPallet ? Math.ceil(pieces / unit.perPallet) : undefined
  const binderTotal = area * unit.binder.perM2
  const bags = Math.ceil(binderTotal / unit.binder.bag)
  return {
    area: r2(area),
    volume: r2(area * unit.wallCm / 100),
    pieces,
    pallets,
    binderTotal: r2(binderTotal),
    bags,
  }
}
