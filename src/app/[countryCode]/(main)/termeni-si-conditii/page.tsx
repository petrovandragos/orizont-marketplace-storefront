import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Termeni și condiții",
  description: "Termenii și condițiile de utilizare ale platformei Orizont.",
}

const SECTIONS = [
  {
    title: "1. Definiții",
    content: `În sensul prezentului document, termenii de mai jos au următoarele semnificații:
• „Orizont" sau „Societatea" — SC Orizont Sighetu Marmației SRL, cu sediul în Str. Plevnei nr. 3, Sighetu Marmației.
• „Client" — orice persoană fizică sau juridică care accesează platforma și/sau plasează o comandă.
• „Platformă" — site-ul web accesibil la adresa orizont-srl.ro și toate paginile aferente.
• „Produse" — bunurile prezentate spre vânzare pe Platformă.`,
  },
  {
    title: "2. Obiectul contractului",
    content: `Prezentele Termeni și Condiții guvernează relația contractuală dintre Orizont și Clienți cu privire la utilizarea Platformei și achiziționarea Produselor prezentate. Prin accesarea Platformei și/sau plasarea unei comenzi, Clientul acceptă în mod expres și necondiționat prevederile prezentului document.`,
  },
  {
    title: "3. Plasarea comenzilor",
    content: `Comenzile pot fi plasate:
• online, prin intermediul Platformei, după crearea unui cont și autentificare;
• telefonic, la numărul 0730 076 606, în programul de lucru.

Comanda devine fermă numai după confirmarea în scris (e-mail) sau verbală (telefon) din partea unui reprezentant Orizont. Orizont își rezervă dreptul de a refuza sau anula orice comandă în cazul unor erori de preț sau indisponibilitate a stocului.`,
  },
  {
    title: "4. Prețuri și modalități de plată",
    content: `Prețurile afișate pe Platformă sunt exprimate în lei (RON) și includ TVA, cu excepția cazului în care se specifică altfel. Costul de transport nu este inclus în prețul produselor și va fi comunicat separat.

Plata se poate efectua:
• cu cardul bancar, prin procesatorul de plăți integrat;
• prin transfer bancar, pe baza facturii proforme emise de Orizont;
• cash, la ridicarea din depozit sau la livrare (ramburs), dacă opțiunea este disponibilă.`,
  },
  {
    title: "5. Livrare",
    content: `Livrarea se efectuează cu mijloacele de transport proprii ale Orizont sau prin firme de curierat partenere. Termenul orientativ de livrare este de 1–3 zile lucrătoare de la confirmarea comenzii, în funcție de disponibilitatea produselor și distanța de livrare.

Riscul privind produsele trece asupra Clientului în momentul predării acestora la adresa de livrare indicată. Clientul este responsabil pentru verificarea cantitativă și calitativă a produselor la momentul recepției.`,
  },
  {
    title: "6. Dreptul de retragere",
    content: `Clienții persoane fizice (consumatori) au dreptul de a se retrage din contract în termen de 14 zile calendaristice de la data primirii produselor, fără invocarea unui motiv, în conformitate cu OUG nr. 34/2014.

Dreptul de retragere nu se aplică în cazul:
• produselor confecționate la comandă sau personalizate;
• produselor care se pot deteriora rapid sau al căror termen de garanție a expirat;
• produselor care au fost utilizate sau deteriorate de Client.

Pentru exercitarea dreptului de retragere, Clientul trebuie să ne contacteze la comenzi@orizont-srl.ro sau telefonic, anterior returnării produselor.`,
  },
  {
    title: "7. Garanție și reclamații",
    content: `Produsele comercializate beneficiază de garanția oferită de producător. Orizont acordă garanție legală de conformitate de 2 ani de la data livrării, conform legislației aplicabile.

Reclamațiile privind produsele defecte sau neconforme vor fi transmise la comenzi@orizont-srl.ro în termen de maximum 2 zile lucrătoare de la constatarea defectului, însoțite de fotografia produsului și copia documentului de achiziție.`,
  },
  {
    title: "8. Răspundere",
    content: `Orizont nu răspunde pentru:
• utilizarea necorespunzătoare a produselor de către Client;
• pierderi indirecte sau daune consecutive utilizării Platformei;
• indisponibilitatea temporară a Platformei ca urmare a unor lucrări de mentenanță sau forță majoră.

Răspunderea totală a Orizont față de Client nu poate depăși valoarea comenzii care a generat litigiul.`,
  },
  {
    title: "9. Confidențialitate",
    content: `Datele cu caracter personal colectate prin intermediul Platformei sunt prelucrate în conformitate cu Regulamentul (UE) 2016/679 (GDPR) și cu Politica de Confidențialitate a Orizont, disponibilă la /politica-de-confidentialitate.`,
  },
  {
    title: "10. Modificarea termenilor",
    content: `Orizont își rezervă dreptul de a modifica prezentele Termeni și Condiții în orice moment. Modificările vor fi publicate pe Platformă și vor intra în vigoare de la data publicării. Utilizarea în continuare a Platformei după publicarea modificărilor constituie acceptarea acestora.`,
  },
  {
    title: "11. Legislație aplicabilă",
    content: `Prezentul contract este guvernat de legea română. Orice litigiu va fi soluționat pe cale amiabilă, iar în caz de eșec, de instanțele judecătorești competente din România.

Pentru soluționarea alternativă a litigiilor, Clientul poate apela la platforma europeană SOL: https://ec.europa.eu/consumers/odr.`,
  },
]

export default function TermeniPage() {
  return (
    <div className="content-container py-12 md:py-16">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl md:text-3xl font-bold text-[#1A1A1A] mb-2">
          Termeni și condiții
        </h1>
        <div className="w-12 h-1 bg-[#F27A1A] rounded mb-2" />
        <p className="text-xs text-gray-400 mb-8">
          Ultima actualizare: aprilie 2026
        </p>

        <div className="flex flex-col gap-y-8">
          {SECTIONS.map(({ title, content }) => (
            <section key={title}>
              <h2 className="text-sm font-semibold text-[#1A1A1A] mb-2">{title}</h2>
              <div className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">
                {content}
              </div>
            </section>
          ))}
        </div>

        <div className="mt-10 p-4 bg-[#FFF3E6] rounded-xl border border-orange-100 text-sm text-gray-600">
          Dacă ai întrebări legate de prezentele Termeni și Condiții, ne poți contacta la{" "}
          <a href="mailto:comenzi@orizont-srl.ro" className="text-[#F27A1A] font-medium hover:underline">
            comenzi@orizont-srl.ro
          </a>{" "}
          sau la numărul{" "}
          <a href="tel:0730076606" className="text-[#F27A1A] font-medium hover:underline">
            0730 076 606
          </a>.
        </div>
      </div>
    </div>
  )
}
