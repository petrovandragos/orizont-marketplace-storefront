/**
 * Date tehnice pentru calculatorul de tablă, luate de la producători
 * (octombrie 2026). Lățimile sunt în metri.
 *
 * Bilka: paginile de produs https://www.bilka.ro/<produs>/ și fișele tehnice
 *   https://www.bilka.ro/bilka/fise_tehnice/…
 *   Suprapunerea pe lungime la țigla metalică: 150 mm, „indiferent de lungime
 *   sau grosime” (https://www.bilka.ro/tigla-metalica/).
 *   Retro Panel: suprapunere aprox. 150 mm (Ghid-montaj-retro-panel.pdf).
 * Novatik: fișele tehnice https://novatik.ro/media (module/m², dimensiuni).
 *
 * De confirmat cu producătorul / depozitul (nu apar în surse):
 *   - regula exactă de lungime la țigla Bilka (aici: multiplu de modul 350 mm)
 *   - suprapunerea la tabla cutată și Retro Duo (aici: 150 mm, ca la țiglă)
 *   - lungimea utilă a pieselor de coamă și bordură (aici: 2 m − 10 cm)
 *   - mărimea rolei de folie (aici: 75 m²)
 *
 * Țiglă ceramică și de beton: datele din fișele produselor din magazin
 * (bucăți pe m², distanța dintre șipci, bucăți pe palet, greutate, panta
 * minimă), de la Leier, swissporTON și Bramac. Reguli de montaj din
 * „Ghid de montaj țiglă ceramică și de beton” (Leier, 2025):
 *   - o țiglă de ventilație la 10 m²; țigle de margine: una pe rând de șipcă;
 *   - opritoare de zăpadă: 2 buc/m; folie minimum 120 g/m², suprafață + 15%;
 *   - șipci minimum 30×50 mm, contrașipci 50×50 mm;
 *   - coamă la țigla de beton: 2,7 buc/m (folosit și la ceramică, de confirmat).
 * De confirmat: Rapido (doar „de la 8,1 buc/m²” la producător, distanța dintre
 * șipci luată 40 cm), Bramac Romana (10 buc/m², ca restul formatului 420×330),
 * distanța dintre șipci la Bramac (33 cm), rezerva la tăieri (3%, 8% la patru
 * ape) și distanța dintre căpriori (90 cm).
 */
import type { AccessoryRules, SheetModel } from "./roof"

const tile = (id: string, name: string, useful: number, maxLength = 7, handle?: string): SheetModel => ({
  id, name, group: "Țiglă metalică", kind: "cut", usefulWidth: useful, module: 0.35, moduleAdd: 0,
  minLength: 0.5, maxLength, overlap: 0.15, handle: handle ?? `tigla-metalica-${id}`,
  source: `https://www.bilka.ro/tigla-metalica-${id}/`,
})

const cut = (id: string, name: string, useful: number, handle: string, src: string, maxLength = 13.5): SheetModel => ({
  id, name, group: "Tablă cutată", kind: "cut", usefulWidth: useful, minLength: 0.5, maxLength, overlap: 0.15, handle, source: src,
})

type TileData = { perM2: number; lath?: number; perPallet?: number; kg?: number; minPitch?: number; side?: boolean }
const ceramic = (id: string, name: string, handle: string, d: TileData, group = "Țiglă ceramică"): SheetModel => ({
  id, name, group, kind: "tile", handle, perM2: d.perM2, lath: d.lath, perPallet: d.perPallet,
  kgPerPiece: d.kg, minPitch: d.minPitch, sideTiles: d.side ?? false, source: `https://orizont-srl.ro/products/${handle}`,
})
const concrete = (id: string, name: string, handle: string, d: TileData) => ceramic(id, name, handle, { lath: 0.33, side: true, ...d }, "Țiglă de beton")

const novatik = (id: string, name: string, perM2: number, handle: string): SheetModel => ({
  id, name, group: "Novatik", kind: "panel", panelArea: Math.round((1 / perM2) * 10000) / 10000, handle, source: "https://novatik.ro/media",
})

export const ROOF_MODELS: SheetModel[] = [
  // Țiglă metalică Bilka — lățime utilă (mm): Clasic 1120, Balcanic 1080, Gotic 1100, Dacic 1055,
  // Hellenic 1095, Adriatic 1085, Romanic 1020, Iberic 1080, Britanic 1135 (lungime max. 4,5 m)
  tile("clasic", "Țiglă metalică Clasic", 1.12),
  tile("balcanic", "Țiglă metalică Balcanic", 1.08),
  tile("gotic", "Țiglă metalică Gotic", 1.1),
  tile("dacic", "Țiglă metalică Dacic", 1.055),
  tile("hellenic", "Țiglă metalică Hellenic", 1.095),
  tile("adriatic", "Țiglă metalică Adriatic", 1.085),
  tile("romanic", "Țiglă metalică Romanic", 1.02),
  tile("iberic", "Țiglă metalică Iberic", 1.08),
  tile("britanic", "Țiglă metalică Britanic", 1.135, 4.5),

  // Retro și fălțuită Bilka
  { id: "retro-panel", name: "Retro Panel", group: "Retro și fălțuită", kind: "cut", usefulWidth: 0.5, minLength: 1, maxLength: 8, overlap: 0.15, handle: "retro-panel", source: "https://www.bilka.ro/retro-panel/" },
  { id: "retro-panel-plus", name: "Retro Panel Plus", group: "Retro și fălțuită", kind: "cut", usefulWidth: 0.5, minLength: 1, maxLength: 8, overlap: 0.15, handle: "retro-panel-plus", source: "Catalog_produse_rezidential_BILKA.pdf" },
  { id: "retro-duo", name: "Retro Duo", group: "Retro și fălțuită", kind: "cut", usefulWidth: 1.065, minLength: 0.5, maxLength: 7, overlap: 0.15, handle: "retro-duo", source: "https://www.bilka.ro/retro-duo/" },
  { id: "faltuita-550", name: "Tablă fălțuită 560 mm", group: "Retro și fălțuită", kind: "cut", usefulWidth: 0.55, minLength: 0.5, maxLength: 7, overlap: 0.15, handle: "tabla-faltuita", source: "https://www.bilka.ro/tabla-faltuita/" },
  { id: "faltuita-345", name: "Tablă fălțuită 360 mm", group: "Retro și fălțuită", kind: "cut", usefulWidth: 0.345, minLength: 0.5, maxLength: 7, overlap: 0.15, handle: "tabla-faltuita", source: "https://www.bilka.ro/tabla-faltuita/" },

  // Tablă cutată Bilka recomandată și pentru acoperiș (T8 și T60–T200 sunt pentru fațade,
  // garduri sau acoperișuri industriale/terasă și nu apar în calculator)
  cut("t18", "Tablă cutată T18", 1.1, "tabla-cutata-t18", "https://www.bilka.ro/tabla-cutata-t18/"),
  cut("sinus-18", "Tablă cutată Sinus 18", 1.05, "sinus-18", "https://www.bilka.ro/tabla-cutata-s18-sinus/"),
  cut("t35", "Tablă cutată T35", 1.065, "t35", "https://www.bilka.ro/tabla-cutata-t35/"),
  cut("t45", "Tablă cutată T45", 0.98, "t45", "https://www.bilka.ro/tabla-cutata-t45/"),
  cut("t12", "Tablă cutată T12 (anexe)", 1.08, "tabla-cutata-t12", "https://www.bilka.ro/tabla-cutata-t12/"),

  // Novatik — module pe m² din fișele tehnice
  novatik("natura-roman", "Novatik Natura Roman", 2.13, "tigla-metalica-cu-acoperire-de-roca-vulcanica-novatik-natura-roman"),
  novatik("natura-classic", "Novatik Natura Classic", 2.15, "tigla-metalica-cu-acoperire-de-roca-vulcanica-novatik-natura-classic"),
  novatik("natura-slate", "Novatik Natura Slate", 2.21, "tigla-metalica-cu-acoperire-de-roca-vulcanica-si-aspect-de-ardezie-novatik-natura-slate"),
  novatik("natura-wood", "Novatik Natura Wood", 2.06, "sindrila-metalica-cu-acoperire-de-roca-vulcanica-novatik-natura-wood"),
  novatik("metal-classic", "Novatik Metal Classic", 2.15, "tigla-metalica-pentru-acoperis-novatik-metal-classic"),
  novatik("metal-wood", "Novatik Metal Wood", 2.08, "sindrila-metalica-pentru-acoperis-novatik-metal-wood"),
  novatik("metal-slate", "Novatik Metal Slate", 2.21, "panouri-metalice-pentru-acoperis-novatik-metal-slate"),

  // ── Țiglă ceramică: Leier (fișele produselor; țigle de margine conform ghidului Leier)
  ceramic("leier-francia", "Leier Francia", "tigla-ceramica-leier-francia", { perM2: 9.9, lath: 0.41, perPallet: 240, kg: 4.34, minPitch: 18, side: true }),
  ceramic("leier-baltica", "Leier Baltica", "tigla-ceramica-leier-baltica", { perM2: 9.8, lath: 0.42, perPallet: 240, kg: 4.32, minPitch: 18, side: true }),
  ceramic("leier-bavaria-duo", "Leier Bavaria Duo", "tigla-ceramica-leier-bavaria-duo", { perM2: 12.25, lath: 0.33, perPallet: 240, kg: 4, minPitch: 24, side: true }),
  ceramic("leier-marsilia", "Leier Marsilia", "tigla-ceramica-leier-marsilia", { perM2: 15.5, lath: 0.322, perPallet: 360, kg: 2.8, minPitch: 20, side: true }),
  ceramic("leier-portugheza", "Leier Portugheza", "tigla-ceramica-leier-portugheza", { perM2: 16, lath: 0.323, perPallet: 300, kg: 2.8, minPitch: 20, side: true }),
  ceramic("leier-valahia", "Leier Valahia", "tigla-ceramica-leier-valahia", { perM2: 16.4, lath: 0.32, perPallet: 360, kg: 2.4, minPitch: 24 }),
  ceramic("leier-bavaria", "Leier Bavaria (solzi)", "tigla-ceramica-leier-bavaria", { perM2: 34, lath: 0.16, perPallet: 520, kg: 1.75, minPitch: 24 }),
  ceramic("leier-andalusia-300", "Leier Andalusia 300 mm", "tigla-ceramica-leier-andalusia", { perM2: 48, perPallet: 400, kg: 1.34, minPitch: 18 }),
  ceramic("leier-andalusia-350", "Leier Andalusia 350 mm", "tigla-ceramica-leier-andalusia-350-mm", { perM2: 38, perPallet: 240, kg: 1.83, minPitch: 18 }),
  // ── Țiglă ceramică: swissporTON (valorile medii din fișe; panta minimă cu folie impermeabilă)
  ceramic("sw-balance", "swissporTON Balance", "tigla-ceramica-balance", { perM2: 8.7, lath: 0.419, perPallet: 192, kg: 4.9, minPitch: 10, side: true }),
  ceramic("sw-nomina", "swissporTON Nomina", "tigla-ceramica-nomina", { perM2: 8.9, lath: 0.402, perPallet: 192, kg: 5.1, minPitch: 10, side: true }),
  ceramic("sw-genevo", "swissporTON Genevo", "tigla-ceramica-genevo", { perM2: 8.9, lath: 0.402, perPallet: 192, kg: 5.1, minPitch: 10, side: true }),
  ceramic("sw-rapido", "swissporTON Rapido", "tigla-ceramica-rapido", { perM2: 8.1, lath: 0.4, kg: 5.2, side: true }),
  ceramic("sw-nivelo", "swissporTON Nivelo", "tigla-ceramica-nivelo", { perM2: 11.2, lath: 0.362, perPallet: 256, kg: 3.98, minPitch: 10, side: true }),
  ceramic("sw-profil", "swissporTON Profil", "tigla-ceramica-profil", { perM2: 19.5, lath: 0.285, perPallet: 324, kg: 2.5, minPitch: 10, side: true }),
  ceramic("sw-solzi", "swissporTON Solzi Classic", "tigla-ceramica-solzi-classic", { perM2: 36, lath: 0.155, perPallet: 480, kg: 1.8, minPitch: 10 }),
  // ── Țiglă de beton: Bramac, format 420×330 mm (fișele produselor)
  concrete("bramac-donau", "Bramac Donau", "bramac-donau-tigla-11", { perM2: 10, kg: 4.4, minPitch: 15 }),
  concrete("bramac-adria", "Bramac Adria", "bramac-adria-tigla-11", { perM2: 10, kg: 4.6, minPitch: 15 }),
  concrete("bramac-natura-plus", "Bramac Natura Plus", "bramac-natura-plus-tigla-11", { perM2: 10, kg: 4.25, minPitch: 15 }),
  concrete("bramac-romana", "Bramac Romana", "bramac-romana-tigla-11", { perM2: 10 }),
  concrete("bramac-viva", "Bramac Viva", "bramac-viva-tigla-11", { perM2: 11, lath: 0.31, kg: 4.55, minPitch: 25 }),
  concrete("bramac-textura", "Bramac TeXtura", "bramac-textura-tigla-11", { perM2: 11, lath: 0.31, kg: 4.6, minPitch: 25 }),
]

export const ROOF_RULES: AccessoryRules = {
  trimUsefulLength: 1.9, // piese de 2 m cu 10 cm suprapunere (de confirmat)
  screwsPerM2: 8, // Bilka Britanic: 8–10 /m²; Novatik: minim 8 /m²
  membraneRollM2: 75, // de confirmat după rolele din depozit
  membraneExtra: 0.15, // suprapuneri și racorduri
  gutterPerDownpipe: 10,
  panelWaste: 0.07, // Novatik: tăieri la margini și coame
  tileWaste: 0.03, // de confirmat
  tileWasteHips: 0.08, // tăieri pe muchii la patru ape (de confirmat)
  ridgeTilesPerM: 2.7, // Leier, țiglă de beton: 2,7 buc/m
  ventTileEveryM2: 10, // Leier: 1 buc la 10 m²
  rafterSpacing: 0.9, // de confirmat
  snowGuardsPerM: 2, // Leier: 2 buc/m
  ridgeBandRollM: 5, // banda de coamă Bilka
}

/** Banda de coamă Bilka: o rolă de 5 m (catalog Bilka). */
export const RIDGE_BAND_ROLL_M = 5
