/**
 * Reguli „Ai nevoie și de”: pentru fiecare categorie, din ce alte categorii
 * arătăm produse pe pagina unui produs. Cheile și valorile sunt handle-urile
 * categoriilor din admin (partea din adresă după /categories/).
 *
 * Cum funcționează:
 *  1. Dacă produsul are în admin, la Metadata, cheia „recomandate” cu
 *     handle-uri de produse separate prin virgulă, se arată întâi acelea.
 *  2. Altfel se caută o regulă pentru categoria produsului; dacă nu există,
 *     pentru categoria-părinte, apoi pentru bunic.
 *  3. Dacă nu există nicio regulă, se arată alte produse din aceeași categorie.
 *
 * Categoriile care nu există (șterse sau redenumite) sunt ignorate automat.
 */
export const COMPLEMENTARY_RULES: Record<string, string[]> = {
  // ── Termoizolații
  Polistiren: ["Adeziv-pentru-polistiren", "termoizolatii", "tencuieli-decorative"],
  "Vata-bazaltica": ["Adeziv-pentru-vata", "termoizolatii", "tencuieli-decorative"],
  "Vata-minerala-de-sticla": ["placi", "Profile", "Accesorii"],
  termoizolatii: ["Adeziv-pentru-polistiren", "Adeziv-pentru-vata", "tencuieli-decorative"],
  "Adeziv-pentru-polistiren": ["Polistiren", "termoizolatii", "tencuieli-decorative"],
  "Adeziv-pentru-vata": ["Vata-bazaltica", "termoizolatii", "tencuieli-decorative"],

  // ── Zidărie și structură
  zidarie: ["Mortare", "Ciment-var-lianti", "Buiandrugi", "armaturi-otel-beton"],
  "Caramida-ceramica": ["Mortare", "Ciment-var-lianti", "Buiandrugi", "armaturi-otel-beton"],
  BCA: ["Mortare", "Buiandrugi", "Ciment-var-lianti"],
  "Boltari-beton": ["Mortare", "Ciment-var-lianti", "armaturi-otel-beton"],
  Buiandrugi: ["Caramida-ceramica", "BCA", "Mortare"],
  "Sisteme-coș-de-fum": ["Caramida-ceramica", "Mortare"],
  "Ciment-var-lianti": ["armaturi-otel-beton", "Plasă-sudată", "Mortare", "scule-manuale"],
  "armaturi-otel-beton": ["Ciment-var-lianti", "Plasă-sudată"],
  "Plasă-sudată": ["armaturi-otel-beton", "Ciment-var-lianti"],
  Mortare: ["zidarie", "Ciment-var-lianti", "scule-manuale"],
  "materiale-metalurgice": ["accesorii-si-consumabile", "scule-electrice"],
  "Profile-metalice": ["accesorii-si-consumabile", "scule-electrice"],
  "produse-din-lemn": ["elemente-de-imbinare-pentru-lemn", "accesorii-si-consumabile"],
  osb: ["elemente-de-imbinare-pentru-lemn", "membrane-bituminoase", "accesorii-si-consumabile"],

  // ── Acoperiș
  "invelitori-din-tabla": ["accesorii-acoperis", "jgheaburi-si-burlane", "membrane-bituminoase"],
  "tigla-ceramica-si-de-beton": ["accesorii-acoperis", "jgheaburi-si-burlane", "membrane-bituminoase"],
  "jgheaburi-si-burlane": ["accesorii-acoperis", "invelitori-din-tabla"],
  "accesorii-acoperis": ["invelitori-din-tabla", "jgheaburi-si-burlane"],
  "membrane-bituminoase": ["Hidroizolatii", "accesorii-acoperis"],

  // ── Finisaje
  "vopsele-si-grunduri": ["tencuieli-si-gleturi", "accesorii-si-consumabile"],
  Lavabile: ["tencuieli-si-gleturi", "accesorii-si-consumabile"],
  "Lacuri-diluanti": ["Email-si-vopsea-pentru-lemn-metal", "accesorii-si-consumabile"],
  "Email-si-vopsea-pentru-lemn-metal": ["Lacuri-diluanti", "accesorii-si-consumabile"],
  "tencuieli-si-gleturi": ["Lavabile", "vopsele-si-grunduri", "accesorii-si-consumabile"],
  "tencuieli-decorative": ["Adeziv-pentru-polistiren", "termoizolatii"],
  "gresie-si-faianta": ["Adeziv-pentru-ceramice", "Chituri", "sape"],
  Gresie: ["Adeziv-pentru-ceramice", "Chituri", "sape"],
  Faianta: ["Adeziv-pentru-ceramice", "Chituri", "Hidroizolatii"],
  "Adeziv-pentru-ceramice": ["Gresie", "Faianta", "Chituri"],
  Chituri: ["Adeziv-pentru-ceramice", "Silicoane-spume-etansante"],
  "Silicoane-spume-etansante": ["Chituri", "accesorii-si-consumabile"],
  sape: ["Ciment-var-lianti", "Gresie", "Parchet-laminat"],
  Hidroizolatii: ["membrane-bituminoase", "Adeziv-pentru-ceramice"],
  "Sisteme-de-gipscarton": ["placi", "Profile", "Accesorii", "tencuieli-si-gleturi"],
  placi: ["Profile", "Accesorii", "tencuieli-si-gleturi"],
  Profile: ["placi", "Accesorii"],
  Accesorii: ["placi", "Profile"],
  "Placi-si-panouri-decorative": ["Silicoane-spume-etansante", "vopsele-si-grunduri"],
  "Profile-decorative-polistiren": ["Silicoane-spume-etansante", "Lavabile"],
  "Riflaje-interior": ["Silicoane-spume-etansante", "accesorii-si-consumabile"],

  // ── Instalații sanitare și termice
  "tevi-si-fitinguri": ["robineti-si-racorduri"],
  "robineti-si-racorduri": ["tevi-si-fitinguri", "obiecte-sanitare"],
  "obiecte-sanitare": ["robineti-si-racorduri", "Silicoane-spume-etansante"],
  "canalizare-interioara": ["tevi-pvc-interior", "fitinguri-pvc-interior"],
  "tevi-pvc-interior": ["fitinguri-pvc-interior"],
  "fitinguri-pvc-interior": ["tevi-pvc-interior"],
  "canalizare-exterioara": ["tevi-pvc", "fitinguri-pvc", "camine-de-inspectie"],
  "tevi-pvc": ["fitinguri-pvc", "camine-de-inspectie"],
  "fitinguri-pvc": ["tevi-pvc", "camine-de-inspectie"],
  "camine-de-inspectie": ["tevi-pvc", "fitinguri-pvc"],
  "sisteme-de-incalzire": ["tevi-si-fitinguri", "robineti-si-racorduri"],
  radiatoare: ["tevi-si-fitinguri", "robineti-si-racorduri"],
  "incalzire-in-pardoseala": ["sape", "Polistiren"],
  "centrale-termice": ["radiatoare", "tevi-si-fitinguri", "robineti-si-racorduri"],
  "pompe-de-caldura": ["incalzire-in-pardoseala", "radiatoare", "tevi-si-fitinguri"],

  // ── Instalații electrice
  "cabluri-si-conductori": ["tuburi-si-accesorii-instalatii", "doze-si-conectori", "tablouri-electrice"],
  "prize-si-intrerupatoare": ["doze-si-conectori", "cabluri-si-conductori"],
  "doze-si-conectori": ["prize-si-intrerupatoare", "cabluri-si-conductori"],
  "tablouri-electrice": ["cabluri-si-conductori", "doze-si-conectori"],
  "tuburi-si-accesorii-instalatii": ["cabluri-si-conductori", "doze-si-conectori"],
  "corpuri-de-iluminat": ["cabluri-si-conductori", "prize-si-intrerupatoare"],

  // ── Amenajări exterioare
  "pavaje-si-borduri": ["Ciment-var-lianti", "beton-si-prefabricate"],
  "beton-si-prefabricate": ["pavaje-si-borduri", "armaturi-otel-beton"],
  "garduri-metalice-si-panouri": ["Profile-metalice", "accesorii-si-consumabile"],
  "iluminat-exterior": ["cabluri-si-conductori", "tuburi-si-accesorii-instalatii"],
  "sisteme-de-irigatii": ["tevi-si-fitinguri", "robineti-si-racorduri"],
  "elemente-de-imbinare-pentru-lemn": ["produse-din-lemn", "accesorii-si-consumabile"],
  "balamale-si-feronerie-pentru-usi": ["elemente-de-imbinare-pentru-lemn", "scule-manuale"],

  // ── Scule
  "scule-electrice": ["accesorii-si-consumabile", "echipamente-de-protectie"],
  "scule-manuale": ["echipamente-de-protectie", "accesorii-si-consumabile"],
  "accesorii-si-consumabile": ["scule-electrice", "scule-manuale"],
  "echipamente-de-protectie": ["scule-manuale", "scule-electrice"],
}
