import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Protecția datelor",
  description: "Politica de confidențialitate și protecția datelor cu caracter personal — Orizont.",
}

const SECTIONS = [
  {
    title: "1. Cine suntem",
    content: `Operatorul datelor cu caracter personal este SC ORIZONT SIGHETU MARMATIEI SRL, cu sediul în Str. Plevnei nr. 3, Sighetu Marmației, înregistrată la Registrul Comerțului Maramureș sub nr. J1991000461241, CIF RO 2204805 (denumită în continuare „Orizont").

Ne puteți contacta la:
• E-mail: comenzi@orizont-srl.ro
• Telefon: 0730 076606`,
  },
  {
    title: "2. Ce date colectăm",
    content: `Colectăm datele pe care ni le furnizați direct, inclusiv:
• Date de identificare: nume, prenume, adresă de e-mail, număr de telefon.
• Date de livrare: adresă de livrare, județ, cod poștal.
• Date de facturare: adresă de facturare, CUI/CNP (dacă este cazul).
• Date de autentificare: adresă de e-mail și parolă (stocată criptat).
• Date de comandă: istoricul achizițiilor, preferințe de livrare.
• Date tehnice: adresă IP, browser, dispozitiv, pagini vizitate (prin cookie-uri).`,
  },
  {
    title: "3. Scopurile și temeiul prelucrării",
    content: `Prelucrăm datele dvs. în următoarele scopuri:
• Executarea contractului (art. 6 alin. 1 lit. b GDPR): procesarea comenzilor, livrarea produselor, emiterea facturilor, gestionarea returnărilor.
• Obligații legale (art. 6 alin. 1 lit. c GDPR): păstrarea documentelor contabile și fiscale conform legislației române.
• Interesul legitim (art. 6 alin. 1 lit. f GDPR): prevenirea fraudelor, securitatea platformei, statistici anonimizate de utilizare.
• Consimțământ (art. 6 alin. 1 lit. a GDPR): trimiterea de newsletter-uri și oferte promoționale, dacă v-ați exprimat acordul.`,
  },
  {
    title: "4. Cât timp păstrăm datele",
    content: `• Date de comandă și facturare: 10 ani, conform obligațiilor fiscale și contabile.
• Date de cont: pe durata existenței contului dvs. și 3 ani după ștergere.
• Date de marketing: până la retragerea consimțământului.
• Date tehnice (log-uri): maximum 12 luni.`,
  },
  {
    title: "5. Cui transmitem datele",
    content: `Nu vindem datele dvs. cu caracter personal. Le putem transmite, strict necesar, către:
• Furnizori de servicii de curierat (pentru livrarea comenzilor).
• Procesator de plăți (EuPlătesc) — pentru procesarea tranzacțiilor cu cardul.
• Furnizor de servicii e-mail (Resend) — pentru confirmări de comandă.
• Autorități publice (ANAF, instanțe) — când suntem obligați legal.

Toți partenerii noștri prelucrează datele în conformitate cu GDPR.`,
  },
  {
    title: "6. Transferuri internaționale",
    content: `Datele dvs. sunt procesate în principal pe servere situate în Uniunea Europeană. Orice transfer în afara UE se face cu garanțiile adecvate prevăzute de GDPR (clauze contractuale standard sau decizii de adecvare ale Comisiei Europene).`,
  },
  {
    title: "7. Drepturile dvs.",
    content: `Conform GDPR, aveți următoarele drepturi:
• Dreptul de acces — să obțineți o copie a datelor pe care le deținem despre dvs.
• Dreptul la rectificare — să corectați datele inexacte sau incomplete.
• Dreptul la ștergere („dreptul de a fi uitat") — în condițiile prevăzute de lege.
• Dreptul la restricționarea prelucrării — în anumite circumstanțe.
• Dreptul la portabilitate — să primiți datele dvs. într-un format structurat.
• Dreptul de opoziție — față de prelucrările bazate pe interes legitim sau marketing direct.
• Dreptul de a retrage consimțământul — fără a afecta legalitatea prelucrărilor anterioare.

Pentru exercitarea acestor drepturi, scrieți-ne la comenzi@orizont-srl.ro. Vom răspunde în termen de 30 de zile.`,
  },
  {
    title: "8. Cookie-uri",
    content: `Platforma utilizează cookie-uri tehnice necesare funcționării (sesiune, coș de cumpărături). Puteți gestiona preferințele de cookie-uri din setările browser-ului. Dezactivarea cookie-urilor tehnice poate afecta funcționalitatea platformei.`,
  },
  {
    title: "9. Securitate",
    content: `Implementăm măsuri tehnice și organizatorice adecvate pentru protecția datelor dvs.: conexiuni HTTPS criptate, parole stocate hash, acces restricționat la date. În cazul unui incident de securitate care vă afectează drepturile, vă vom notifica conform obligațiilor legale.`,
  },
  {
    title: "10. Plângeri",
    content: `Dacă considerați că prelucrarea datelor dvs. încalcă GDPR, aveți dreptul să depuneți o plângere la Autoritatea Națională de Supraveghere a Prelucrării Datelor cu Caracter Personal (ANSPDCP):
• Site: www.dataprotection.ro
• E-mail: anspdcp@dataprotection.ro
• Adresă: B-dul G-ral. Gheorghe Magheru 28-30, București

Recomandăm să ne contactați direct înainte de a formula o plângere — rezolvăm orice problemă cu promptitudine.`,
  },
  {
    title: "11. Modificări",
    content: `Putem actualiza această politică periodic. Versiunea actualizată va fi publicată pe această pagină cu data revizuirii. Vă recomandăm să verificați periodic această pagină.`,
  },
]

export default function ProtectiaDatelorPage() {
  return (
    <div className="content-container py-12 md:py-16">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl md:text-3xl font-bold text-[#1A1A1A] mb-2">
          Protecția datelor
        </h1>
        <div className="w-12 h-1 bg-[#F27A1A] rounded mb-2" />
        <p className="text-xs text-gray-400 mb-8">
          Politică de confidențialitate · Ultima actualizare: aprilie 2026
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
          Întrebări? Contactați-ne la{" "}
          <a href="mailto:comenzi@orizont-srl.ro" className="text-[#F27A1A] font-medium hover:underline">
            comenzi@orizont-srl.ro
          </a>{" "}
          sau{" "}
          <a href="tel:0730076606" className="text-[#F27A1A] font-medium hover:underline">
            0730 076606
          </a>.
        </div>
      </div>
    </div>
  )
}
