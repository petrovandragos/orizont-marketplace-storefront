/**
 * Pozele și textele scurte pentru categoriile principale (pagina principală,
 * paginile de categorie). Numele și subcategoriile vin din admin; aici sunt
 * doar elementele de design. Adăugați o intrare când creați o categorie nouă.
 */
export type CategoryAsset = { image: string; short: string; sub: string }

export const CATEGORY_ASSETS: Record<string, CategoryAsset> = {
  "materiale-de-constructii": { image: "/categorii/Materiale-construcții.jpg", short: "Zidărie și structură", sub: "Cărămidă, BCA, ciment, oțel beton, OSB" },
  "acoperisuri-si-sisteme": { image: "/categorii/acoperisuri-si-sisteme-pluviale.jpg", short: "Țiglă, tablă, jgheaburi", sub: "Țiglă metalică, tablă, țiglă ceramică, jgheaburi" },
  finisaje: { image: "/categorii/Finisaje.jpg", short: "Pentru interior și fațadă", sub: "Adezivi, gresie și faianță, vopsele, termoizolații" },
  "instalatii-sanitare": { image: "/categorii/Instalații-sanitare.jpg", short: "Apă, canalizare, încălzire", sub: "Țevi, fitinguri, centrale, radiatoare" },
  "instalatii-electrice": { image: "/categorii/Instalații-electrice.jpg", short: "Cabluri, prize, iluminat", sub: "Cabluri, prize, tablouri, iluminat" },
  "amenajari-exterioare": { image: "/categorii/curte-gradina.jpeg", short: "Curte și grădină", sub: "Pavaje, garduri, iluminat exterior, irigații" },
  "scule-si-echipamente": { image: "/categorii/Scule-echipamente.jpg", short: "Scule și protecție", sub: "Scule electrice și manuale, echipamente de protecție" },
}

export const CONTACT = {
  phone: "0730 076 606",
  tel: "+40730076606",
  whatsapp: "40730076606",
  email: "comenzi@orizont-srl.ro",
  address: "Str. Plevnei nr. 3, Sighetu Marmației",
  week: "Luni–Vineri, 08:00–17:00",
  saturday: "Sâmbătă, 08:00–13:00",
}

export const QUOTE_STEPS = [
  { title: "Trimiteți lista", text: "Scrieți materialele de care aveți nevoie sau folosiți unul dintre calculatoare." },
  { title: "Stabilim împreună necesarul", text: "Un coleg vă sună, verifică lista și vă recomandă variantele potrivite." },
  { title: "Primiți oferta și livrarea", text: "Vă trimitem prețul final, iar materialele ajung direct pe șantier." },
]
