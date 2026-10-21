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
  {
    slug: "fundatie",
    title: "Calculator fundație și beton",
    short: "Fundație și beton",
    tagline: "Beton, ciment, armătură",
    text: "Câți metri cubi de beton, câți saci de ciment, câte bare de oțel-beton și câtă plasă sudată.",
  },
  {
    slug: "gresie-faianta",
    title: "Calculator gresie și faianță",
    short: "Gresie și faianță",
    tagline: "Cutii, adeziv, chit, hidroizolație",
    text: "Câte cutii de gresie și faianță, câți saci de adeziv, cât chit de rosturi și câtă hidroizolație.",
  },
] as const

/** Instrumentele pentru alegerea acoperișului (nu calculează cantități). */
export const ROOF_TOOLS = [
  {
    slug: "vizualizator-acoperis",
    title: "Vizualizator acoperiș",
    short: "Vizualizator",
    text: "Alegeți învelitoarea și culorile și vedeți pe loc cum arată casa, ziua sau seara.",
  },
  {
    slug: "comparator-invelitori",
    title: "Comparator învelitori",
    short: "Comparator",
    text: "Tablă sau țiglă? Greutate, pantă minimă, garanție, zgomot și buget, una lângă alta.",
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
  "Ciment-var-lianti": "fundatie",
  "armaturi-otel-beton": "fundatie",
  "Adeziv-pentru-ceramice": "gresie-faianta",
  Chituri: "gresie-faianta",
}
