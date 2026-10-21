export const CALCULATORS = [
  {
    slug: "acoperis",
    title: "Calculator acoperiș",
    short: "Acoperiș",
    tagline: "Tablă sau țiglă, cu accesorii",
    text: "Câte foi de tablă sau câte țigle ceramice ori de beton vă trebuie, plus coame, folie, șipci și jgheaburi.",
  },
  {
    slug: "termosistem",
    title: "Calculator termosistem",
    short: "Termosistem",
    tagline: "Izolație, adeziv, plasă, dibluri",
    text: "Polistiren sau vată bazaltică, adeziv, plasă, dibluri, profile și tencuială pentru izolarea fațadei.",
  },
  {
    slug: "zidarie",
    title: "Calculator zidărie",
    short: "Zidărie",
    tagline: "Bucăți, paleți și mortar",
    text: "Câte cărămizi sau blocuri BCA, câți paleți și cât mortar sau adeziv pentru pereții casei.",
  },
] as const

/** În ce categorii arătăm banda „Calculați necesarul”. */
export const CATEGORY_CALCULATOR: Record<string, (typeof CALCULATORS)[number]["slug"]> = {
  "acoperisuri-si-sisteme": "acoperis",
  "invelitori-din-tabla": "acoperis",
  "accesorii-acoperis": "acoperis",
  "jgheaburi-si-burlane": "acoperis",
  "tigla-ceramica-si-de-beton": "acoperis",
  termoizolatii: "termosistem",
  Polistiren: "termosistem",
  "Vata-bazaltica": "termosistem",
  "Vata-minerala-de-sticla": "termosistem",
  "Adeziv-pentru-polistiren": "termosistem",
  "Adeziv-pentru-vata": "termosistem",
  "tencuieli-decorative": "termosistem",
  zidarie: "zidarie",
  "Caramida-ceramica": "zidarie",
  BCA: "zidarie",
  "Boltari-beton": "zidarie",
  Mortare: "zidarie",
  "Ciment-var-lianti": "zidarie",
}
