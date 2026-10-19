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
]

export const ROOF_RULES: AccessoryRules = {
  trimUsefulLength: 1.9, // piese de 2 m cu 10 cm suprapunere (de confirmat)
  screwsPerM2: 8, // Bilka Britanic: 8–10 /m²; Novatik: minim 8 /m²
  membraneRollM2: 75, // de confirmat după rolele din depozit
  membraneExtra: 0.15, // suprapuneri și racorduri
  gutterPerDownpipe: 10,
  panelWaste: 0.07, // Novatik: tăieri la margini și coame
}

/** Banda de coamă Bilka: o rolă de 5 m (catalog Bilka). */
export const RIDGE_BAND_ROLL_M = 5
