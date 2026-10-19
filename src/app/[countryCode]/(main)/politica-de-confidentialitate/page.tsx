import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Politica de confidențialitate",
  description: "Politica de confidențialitate și prelucrarea datelor cu caracter personal de către Orizont.",
}

const SECTIONS = [
  {
    title: "1. Identitatea operatorului",
    content: `SC Orizont Sighetu Marmației SRL, cu sediul în Str. Plevnei nr. 3, Sighetu Marmației, județul Maramureș, CIF RO 2204805, înregistrată la Registrul Comerțului sub nr. J24/461/1991, în calitate de operator de date cu caracter personal, prelucrează datele dumneavoastră în conformitate cu Regulamentul (UE) 2016/679 privind protecția persoanelor fizice în ceea ce privește prelucrarea datelor cu caracter personal (GDPR) și cu legislația națională aplicabilă.

Ne puteți contacta la:
• E-mail: comenzi@orizont-srl.ro
• Telefon: 0730 076 606
• Adresă: Str. Plevnei nr. 3, Sighetu Marmației, județul Maramureș`,
  },
  {
    title: "2. Ce date colectăm",
    content: `Colectăm următoarele categorii de date cu caracter personal:

• Date de identificare: nume, prenume, adresă de e-mail, număr de telefon.
• Date de livrare: adresă de livrare (stradă, număr, localitate, județ, cod poștal).
• Date de cont: adresă de e-mail și parolă criptată, utilizate pentru autentificarea în platformă.
• Date de comandă: produsele achiziționate, cantitățile, prețurile, metoda de plată și statutul comenzii.
• Date de navigare: adresa IP, tipul de browser, paginile vizitate, ora accesării — colectate automat prin logurile serverului și, dacă este cazul, prin cookie-uri tehnice.`,
  },
  {
    title: "3. Scopurile și temeiul juridic al prelucrării",
    content: `Prelucrăm datele dumneavoastră în următoarele scopuri:

a) Executarea contractului (art. 6 alin. 1 lit. b GDPR)
• Procesarea și livrarea comenzilor dumneavoastră.
• Gestionarea contului de client și a istoricului comenzilor.
• Comunicarea cu privire la statutul comenzii (confirmare, livrare, retur).

b) Obligații legale (art. 6 alin. 1 lit. c GDPR)
• Emiterea de documente fiscale (facturi) și arhivarea acestora conform legislației contabile.
• Răspunsul la solicitările autorităților competente.

c) Interesul legitim al operatorului (art. 6 alin. 1 lit. f GDPR)
• Prevenirea fraudelor și a accesului neautorizat la platformă (inclusiv prin verificarea Cloudflare Turnstile).
• Îmbunătățirea funcționării platformei și rezolvarea problemelor tehnice.

d) Consimțământ (art. 6 alin. 1 lit. a GDPR)
• Trimiterea de comunicări de marketing (newsletter, oferte), doar dacă vă exprimați explicit acordul.`,
  },
  {
    title: "4. Destinatarii datelor",
    content: `Datele dumneavoastră pot fi transmise către:

• Furnizori de servicii de curierat și transport — pentru efectuarea livrărilor.
• Procesatorul de plăți EuPlătesc.ro (SC MB TELECOM SRL) — pentru procesarea plăților cu cardul; EuPlătesc nu stochează datele complete ale cardului pe serverele noastre.
• Furnizorul de e-mail tranzacțional Resend Inc. — pentru trimiterea confirmărilor de comandă.
• Furnizorul de hosting și infrastructură — serverele noastre sunt găzduite pe Hetzner Online GmbH (Germania, UE).
• Cloudflare Inc. — pentru protecția anti-bot (Turnstile) și servicii CDN/DNS; datele sunt procesate conform Privacy Shield și Clauzelor Contractuale Standard.

Nu vindem și nu cedăm datele dumneavoastră personale unor terțe părți în scopuri de marketing.`,
  },
  {
    title: "5. Durata păstrării datelor",
    content: `Păstrăm datele dumneavoastră pe durata necesară îndeplinirii scopurilor pentru care au fost colectate:

• Date de cont: pe durata existenței contului și 3 ani după ultima activitate sau ștergerea contului.
• Date de comandă și facturare: 10 ani de la emiterea documentului fiscal, conform legislației contabile.
• Date de navigare / loguri tehnice: maximum 90 de zile.
• Date de marketing (dacă v-ați dat consimțământul): până la retragerea consimțământului.

La expirarea perioadei de retenție, datele sunt șterse sau anonimizate.`,
  },
  {
    title: "6. Drepturile dumneavoastră",
    content: `Conform GDPR, beneficiați de următoarele drepturi:

• Dreptul de acces — puteți solicita o copie a datelor pe care le deținem despre dumneavoastră.
• Dreptul la rectificare — puteți solicita corectarea datelor inexacte sau incomplete.
• Dreptul la ștergere („dreptul de a fi uitat") — puteți solicita ștergerea datelor, în condițiile prevăzute de GDPR.
• Dreptul la restricționarea prelucrării — puteți solicita limitarea utilizării datelor în anumite situații.
• Dreptul la portabilitatea datelor — puteți solicita datele dumneavoastră într-un format structurat, lizibil automat.
• Dreptul de opoziție — vă puteți opune prelucrării bazate pe interesul legitim sau în scopuri de marketing direct.
• Dreptul de a retrage consimțământul — în orice moment, fără a afecta legalitatea prelucrării anterioare.
• Dreptul de a depune o plângere — la Autoritatea Națională de Supraveghere a Prelucrării Datelor cu Caracter Personal (ANSPDCP), cu sediul în B-dul G-ral. Gheorghe Magheru 28–30, Sector 1, București, www.dataprotection.ro.

Pentru exercitarea oricăruia dintre aceste drepturi, ne puteți contacta la comenzi@orizont-srl.ro. Vom răspunde în termen de maximum 30 de zile.`,
  },
  {
    title: "7. Cookie-uri",
    content: `Platforma utilizează cookie-uri strict necesare pentru funcționarea corectă a serviciului (sesiune, coș de cumpărături, autentificare). Aceste cookie-uri nu necesită consimțământ, deoarece sunt esențiale pentru furnizarea serviciului solicitat.

Cookie-uri de statistică (Google Analytics): doar dacă alegeți „Accept” în bannerul de cookie-uri, folosim Google Analytics (Google Ireland Limited) pentru a număra vizitele și a vedea ce pagini și produse sunt consultate. Datele sunt agregate, iar adresa IP este anonimizată. Dacă alegeți „Refuz”, aceste cookie-uri nu se încarcă. Vă puteți schimba oricând alegerea din linkul „Setări cookie-uri” din subsolul site-ului.

Nu utilizăm cookie-uri de publicitate comportamentală.`,
  },
  {
    title: "8. Securitatea datelor",
    content: `Implementăm măsuri tehnice și organizatorice adecvate pentru a proteja datele dumneavoastră împotriva accesului neautorizat, pierderii sau distrugerii:

• Comunicațiile sunt criptate prin HTTPS/TLS.
• Parolele sunt stocate exclusiv sub formă criptată (hash).
• Accesul la sistemele interne este restricționat pe baza principiului necesității minime de cunoaștere.
• Utilizăm servicii de protecție anti-bot (Cloudflare Turnstile) pentru a preveni înregistrările și autentificările automate abuzive.`,
  },
  {
    title: "9. Transferuri internaționale",
    content: `Unii dintre furnizorii noștri de servicii (Cloudflare, Resend) sunt stabiliți în Statele Unite ale Americii. Aceste transferuri se realizează pe baza Clauzelor Contractuale Standard adoptate de Comisia Europeană sau a altor mecanisme de transfer recunoscute de GDPR, care asigură un nivel adecvat de protecție a datelor.`,
  },
  {
    title: "10. Modificarea politicii",
    content: `Ne rezervăm dreptul de a actualiza prezenta Politică de Confidențialitate oricând este necesar, de exemplu ca urmare a modificărilor legislative sau a unor noi funcționalități ale platformei. Versiunea actualizată va fi publicată pe această pagină cu indicarea datei ultimei modificări. Vă recomandăm să consultați periodic această pagină.`,
  },
]

export default function PoliticaDeConfidentialitate() {
  return (
    <div className="content-container pt-8 pb-4 md:pt-12">
      <div className="max-w-3xl mx-auto">
        <h1 className="display-2 mb-3">
          Politica de confidențialitate
        </h1>
        <p className="text-sm text-[#6E6E73] mb-10">
          Ultima actualizare: aprilie 2026
        </p>

        <div className="flex flex-col gap-y-8">
          {SECTIONS.map(({ title, content }) => (
            <section key={title}>
              <h2 className="text-[19px] font-semibold tracking-[-0.015em] text-[#1D1D1F] mb-2">{title}</h2>
              <div className="text-[15px] text-[#424245] leading-relaxed whitespace-pre-line">
                {content}
              </div>
            </section>
          ))}
        </div>

        <div className="mt-12 p-5 bg-[#F5F5F7] rounded-[22px] text-[15px] text-[#424245]">
          Pentru orice întrebare sau solicitare legată de datele dumneavoastră personale, ne puteți contacta la{" "}
          <a href="mailto:comenzi@orizont-srl.ro" className="text-[#1D1D1F] font-medium hover:underline">
            comenzi@orizont-srl.ro
          </a>{" "}
          sau la{" "}
          <a href="tel:0730076606" className="text-[#1D1D1F] font-medium hover:underline">
            0730 076 606
          </a>.
        </div>
      </div>
    </div>
  )
}
