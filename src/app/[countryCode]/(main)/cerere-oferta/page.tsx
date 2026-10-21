import { Metadata } from "next"
import ListQuoteForm from "@modules/quote/components/list-quote-form"

export const metadata: Metadata = {
  title: "Cerere de ofertă pentru materiale de construcții",
  description:
    "Transmiteți-ne lista de materiale, iar noi stabilim împreună necesarul și vă trimitem oferta pentru întreaga cantitate, cu livrare. Orizont, Sighetu Marmației.",
  alternates: { canonical: "/cerere-oferta" },
}

const STEPS: { title: string; text: string }[] = [
  { title: "Ne transmiteți proiectul sau lista de materiale", text: "" },
  { title: "Stabilim împreună necesarul exact", text: "și vă recomandăm soluțiile potrivite" },
  { title: "Primiți oferta personalizată", text: "și organizăm livrarea pe șantier sau ridicarea din depozit" },
]

export default async function CerereOfertaPage(props: { searchParams: Promise<{ lista?: string }> }) {
  const { lista } = await props.searchParams
  const initialList = typeof lista === "string" ? lista.slice(0, 2000) : ""
  return (
    <div className="content-container pt-6 pb-4 md:pt-8">
      <nav className="text-[13px] text-[#6E6E73] mb-4" aria-label="Breadcrumb">
        <a href="/" className="hover:text-[#1D1D1F] hover:underline">Acasă</a>
        <span className="mx-2 text-gray-300">›</span>
        <span className="text-[#1D1D1F]">Cerere de ofertă</span>
      </nav>

      <h1 className="display-2">Cereți o ofertă</h1>
      <p className="lead mt-3 max-w-[52ch]">
        Adăugați în listă produsele din catalog și rezultatele calculatoarelor sau scrieți-ne direct
        materialele de care aveți nevoie. Vă pregătim oferta pentru întreaga cantitate, cu livrare.
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_360px] gap-6 lg:gap-8 mt-10 items-start">
        <ListQuoteForm initialList={initialList} />

        <aside className="bg-white border border-[#D2D2D7] rounded-[26px] p-6 md:p-7 lg:sticky lg:top-36">
          <h2 className="text-[21px] font-semibold tracking-[-0.02em] text-[#1D1D1F] mb-5">Cum funcționează</h2>
          <ol className="flex flex-col gap-y-4">
            {STEPS.map((step, i) => (
              <li key={step.title} className="flex gap-x-3">
                <span className="w-8 h-8 rounded-full bg-[#1D1D1F] text-white text-sm font-semibold flex items-center justify-center flex-shrink-0">
                  {i + 1}
                </span>
                <span className="text-[15px] text-[#6E6E73] pt-1">
                  <strong className="font-semibold text-[#1D1D1F]">{step.title}</strong>
                  {step.text && <> {step.text}</>}
                </span>
              </li>
            ))}
          </ol>
          <div className="border-t border-[#D2D2D7]/70 mt-6 pt-6">
            <p className="text-sm text-[#6E6E73]">Preferați să ne sunați?</p>
            <a href="tel:0730076606" className="block text-[28px] font-semibold tracking-[-0.02em] text-[#1D1D1F] hover:text-[#B9520A] mt-1">
              0730 076 606
            </a>
            <p className="text-sm text-[#6E6E73] mt-1">
              Luni–Vineri 08:00–17:00
              <br />
              Sâmbătă 08:00–13:00
            </p>
          </div>
          <a href="/calculatoare" className="mt-6 flex items-center justify-between gap-x-3 rounded-[18px] bg-[#FFF3E6] px-4 py-3.5 text-sm font-medium text-[#B9520A] hover:bg-[#FFEAD5]">
            Nu știți cantitățile? Folosiți calculatoarele de materiale
            <span aria-hidden="true">›</span>
          </a>
        </aside>
      </div>
    </div>
  )
}
