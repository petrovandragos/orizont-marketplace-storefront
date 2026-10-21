/**
 * Vizualizator acoperiș: materialele, culorile și combinațiile afișate pe casa desenată.
 * Culorile sunt aproximări pe ecran ale nuanțelor RAL / ale gamei producătorilor;
 * disponibilitatea diferă de la model la model.
 */

export type RoofMaterial = "metal" | "faltuita" | "ceramica" | "beton"
export type Swatch = { id: string; name: string; hex: string; code?: string }

const RAL: Swatch[] = [
  { id: "8017", code: "RAL 8017", name: "Maro ciocolatiu", hex: "#4A3530" },
  { id: "7016", code: "RAL 7016", name: "Gri antracit", hex: "#3A4045" },
  { id: "9005", code: "RAL 9005", name: "Negru", hex: "#1C1C1E" },
  { id: "3011", code: "RAL 3011", name: "Roșu maroniu", hex: "#7A231C" },
  { id: "3009", code: "RAL 3009", name: "Roșu oxid", hex: "#6A2B26" },
  { id: "8004", code: "RAL 8004", name: "Cupru", hex: "#8F4E35" },
  { id: "6020", code: "RAL 6020", name: "Verde crom", hex: "#33402B" },
]

export const MATERIALS: { id: RoofMaterial; name: string; text: string; colors: Swatch[]; calc: string; category: string }[] = [
  { id: "metal", name: "Țiglă metalică", text: "Ușoară, montaj rapid", colors: RAL, calc: "/calculatoare/acoperis", category: "/categories/invelitori-din-tabla" },
  { id: "faltuita", name: "Tablă fălțuită", text: "Linii drepte, aspect modern", colors: RAL, calc: "/calculatoare/acoperis", category: "/categories/invelitori-din-tabla" },
  {
    id: "ceramica", name: "Țiglă ceramică", text: "Clasică, din argilă arsă", calc: "/calculatoare/acoperis", category: "/categories/tigla-ceramica-si-de-beton",
    colors: [
      { id: "rosu-natur", name: "Roșu natur", hex: "#B5542C" },
      { id: "antic", name: "Antic, flamat", hex: "#8C4A2F" },
      { id: "maro-angoba", name: "Maro, angobat", hex: "#6A3C28" },
      { id: "gri-angoba", name: "Gri ardezie, angobat", hex: "#4B4F53" },
      { id: "negru-angoba", name: "Negru, angobat", hex: "#2A292A" },
    ],
  },
  {
    id: "beton", name: "Țiglă de beton", text: "Robustă, cu greutate mare", calc: "/calculatoare/acoperis", category: "/categories/tigla-ceramica-si-de-beton",
    colors: [
      { id: "rosu", name: "Roșu", hex: "#9C3C27" },
      { id: "maro", name: "Maro", hex: "#5A3C2D" },
      { id: "gri-granit", name: "Gri granit", hex: "#5F6367" },
      { id: "negru", name: "Negru", hex: "#272727" },
    ],
  },
]

export const FACADES: Swatch[] = [
  { id: "alb", name: "Alb", hex: "#F3F1EB" },
  { id: "ivoire", name: "Ivoire", hex: "#ECE2CC" },
  { id: "nisip", name: "Bej nisip", hex: "#D8C6A6" },
  { id: "perla", name: "Gri perlă", hex: "#CACAC4" },
  { id: "salvie", name: "Verde salvie", hex: "#A9B49C" },
  { id: "ocru", name: "Ocru", hex: "#CDA35E" },
  { id: "teracota", name: "Teracotă", hex: "#B9724F" },
  { id: "antracit", name: "Gri antracit", hex: "#4C5157" },
]

export const FRAMES: Swatch[] = [
  { id: "alb", name: "Alb", hex: "#F7F7F5" },
  { id: "antracit", name: "Antracit", hex: "#383E42" },
  { id: "stejar", name: "Stejar auriu", hex: "#8A5A2B" },
  { id: "negru", name: "Negru", hex: "#1E1E1E" },
]

export const GUTTERS: Swatch[] = [
  { id: "asortat", name: "Asortate la acoperiș", hex: "" },
  { id: "alb", name: "Albe", hex: "#F2F2F0" },
  { id: "maro", name: "Maro", hex: "#4A3530" },
  { id: "antracit", name: "Antracit", hex: "#3A4045" },
  { id: "negru", name: "Negre", hex: "#1C1C1E" },
]

export type Light = "zi" | "apus" | "seara"

export type HouseConfig = {
  material: RoofMaterial
  roof: string
  facade: string
  frames: string
  gutters: string
  light: Light
}

export const DEFAULT_HOUSE: HouseConfig = {
  material: "metal", roof: "8017", facade: "alb", frames: "antracit", gutters: "asortat", light: "zi",
}

export function resolve(cfg: HouseConfig) {
  const m = MATERIALS.find((x) => x.id === cfg.material) ?? MATERIALS[0]
  const roof = m.colors.find((c) => c.id === cfg.roof) ?? m.colors[0]
  const facade = FACADES.find((c) => c.id === cfg.facade) ?? FACADES[0]
  const frames = FRAMES.find((c) => c.id === cfg.frames) ?? FRAMES[0]
  const g = GUTTERS.find((c) => c.id === cfg.gutters) ?? GUTTERS[0]
  const gutters = g.id === "asortat" ? { ...g, hex: roof.hex } : g
  return { material: m, roof, facade, frames, gutters }
}

/** Întunecă (f < 1) sau deschide (f > 1) o culoare hex. */
export function shade(hex: string, f: number) {
  const n = parseInt(hex.slice(1), 16)
  const ch = (v: number) => {
    const x = f <= 1 ? v * f : v + (255 - v) * (f - 1)
    return Math.max(0, Math.min(255, Math.round(x)))
  }
  const r = ch((n >> 16) & 255), g = ch((n >> 8) & 255), b = ch(n & 255)
  return `#${((1 << 24) | (r << 16) | (g << 8) | b).toString(16).slice(1)}`
}
