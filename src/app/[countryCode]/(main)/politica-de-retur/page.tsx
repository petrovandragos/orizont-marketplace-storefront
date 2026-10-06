import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Politica de retur",
  description: "Politica de retur și dreptul de retragere — Orizont, materiale de construcții.",
}

const SECTIONS = [
  {
    title: "1. Dreptul de retragere (14 zile)",
    content: `Conform OUG nr. 34/2014 privind drepturile consumatorilor, aveți dreptul să vă retrageți din contract în termen de 14 zile calendaristice de la data primirii produselor, fără a invoca niciun motiv și fără costuri suplimentare (cu excepția costului returului).

Termenul de 14 zile începe din ziua în care dvs. sau o terță parte desemnată de dvs. (alta decât transportatorul) intră în posesia fizică a produselor.`,
  },
  {
    title: "2. Cum exercitați dreptul de retragere",
    content: `Înainte de a returna produsul, contactați-ne pentru a iniția procesul:
• E-mail: comenzi@orizont-srl.ro (indicați numărul comenzii și motivul)
• Telefon: 0730 076606 (Contact comenzi)

Puteți folosi formularul standard de retragere de mai jos sau orice altă declarație neechivocă. Ne veți notifica înainte de expirarea termenului de 14 zile.

După confirmare, returnați produsul la adresa: Str. Plevnei nr. 3, Sighetu Marmației, în termen de maximum 14 zile de la notificare.`,
  },
  {
    title: "3. Condiții pentru retur",
    content: `Produsele returnate trebuie să fie:
• în starea originală, nefolosite și nedeteriotate;
• în ambalajul original (sau ambalaj similar care să asigure protecția);
• însoțite de documentul de achiziție (factură sau bon fiscal).

Sunteți responsabil pentru manipularea produselor cu grijă pe durata deținerii și în timpul returului. Orizont poate deduce din rambursare orice depreciere a valorii produsului cauzată de manipularea dincolo de ceea ce este necesar pentru a stabili natura, caracteristicile și funcționarea acestuia.`,
  },
  {
    title: "4. Excepții — produse care nu pot fi returnate",
    content: `Dreptul de retragere nu se aplică pentru:
• produse confecționate la comandă sau personalizate conform specificațiilor clientului;
• produse care se deteriorează rapid sau au termen de garanție scurt;
• produse sigilate care nu pot fi returnate din motive de protecție a sănătății sau igienă, dacă sigiliul a fost rupt;
• produse care au fost amestecate cu alte produse și nu mai pot fi separate (ex: adezivi, vopsele deschise, materiale de etanșare utilizate);
• livrări de produse în cantități mari, tăiate la comandă (ex: profile, table, armătură).`,
  },
  {
    title: "5. Rambursarea",
    content: `Vom rambursa toate plățile primite de la dvs., inclusiv costurile de livrare inițiale (cu excepția costurilor suplimentare rezultate din alegerea altei metode de livrare decât cea standard oferită de noi), în termen de maximum 14 zile de la data la care am primit produsul returnat sau dovada că l-ați expediat.

Rambursarea se face prin același mijloc de plată folosit la comandă:
• Plată cu cardul: ramburs pe card (3-5 zile lucrătoare).
• Plată ramburs (cash): transfer bancar în contul indicat de dvs.

Costul returului este suportat de client, cu excepția cazului în care produsul este defect sau livrat eronat.`,
  },
  {
    title: "6. Produse defecte sau livrate eronat",
    content: `Dacă ați primit un produs defect, deteriorat în transport sau diferit față de cel comandat:
• Contactați-ne în termen de 48 de ore de la livrare la comenzi@orizont-srl.ro sau 0730 076606.
• Atașați fotografii ale produsului și ambalajului.

În acest caz, Orizont suportă costurile de retur și vă oferă, la alegere: înlocuirea produsului sau rambursarea integrală a sumei plătite.`,
  },
  {
    title: "7. Garanție legală de conformitate",
    content: `Separat de dreptul de retragere, beneficiați de garanția legală de conformitate de 2 ani de la data livrării, în conformitate cu Legea nr. 449/2003. În cazul unui produs neconform, aveți dreptul la reparare sau înlocuire gratuită, reducere de preț sau rezoluțiunea contractului.`,
  },
  {
    title: "8. Formular de retragere (model)",
    content: `Puteți folosi textul de mai jos trimis pe e-mail la comenzi@orizont-srl.ro:

---
Către: SC ORIZONT SIGHETU MARMATIEI SRL
Vă notific prin prezenta că mă retrag din contractul meu de vânzare a următoarelor produse:
[denumire produs, cod produs]
Comandat la data: [data]
Primit la data: [data]
Numele consumatorului: [nume și prenume]
Adresa consumatorului: [adresă]
Semnătura (dacă se trimite pe hârtie) / Data: [data]
---`,
  },
]

export default function PoliticaDeReturPage() {
  return (
    <div className="content-container py-12 md:py-16">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl md:text-3xl font-bold text-[#1A1A1A] mb-2">
          Politica de retur
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
          Pentru orice returnare sau reclamație, contactați-ne la{" "}
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
