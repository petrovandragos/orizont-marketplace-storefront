export const CALCULATORS = [
  {
    slug: "acoperis",
    title: "Calculator tablă acoperiș",
    short: "Tablă acoperiș",
    text: "Câte foi de țiglă metalică sau tablă cutată vă trebuie, pe ce lungimi, plus coamă, borduri, folie și jgheaburi.",
  },
  {
    slug: "termosistem",
    title: "Calculator termosistem",
    short: "Termosistem",
    text: "Polistiren sau vată bazaltică, adeziv, plasă, dibluri, profile și tencuială pentru izolarea fațadei.",
  },
  {
    slug: "zidarie",
    title: "Calculator zidărie",
    short: "Zidărie",
    text: "Câte cărămizi, blocuri BCA sau bolțari și câți saci de mortar sau adeziv pentru pereții casei.",
  },
] as const

/** În ce categorii arătăm banda „Calculați necesarul”. */
export const CATEGORY_CALCULATOR: Record<string, (typeof CALCULATORS)[number]["slug"]> = {
  "acoperisuri-si-sisteme": "acoperis",
  "invelitori-din-tabla": "acoperis",
  "accesorii-acoperis": "acoperis",
  "jgheaburi-si-burlane": "acoperis",
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
