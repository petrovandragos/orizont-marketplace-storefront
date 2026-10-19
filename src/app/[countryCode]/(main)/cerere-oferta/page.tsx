import { Metadata } from "next"
import ListQuoteForm from "@modules/quote/components/list-quote-form"

export const metadata: Metadata = {
  title: "Cere ofertă pentru materiale de construcții",
  description:
    "Transmiteți-ne lista de materiale, iar noi stabilim împreună necesarul și vă trimitem oferta pentru întreaga cantitate, cu livrare. Orizont, Sighetu Marmației.",
  alternates: { canonical: "/cerere-oferta" },
}

const STEPS: { title: string; text: string }[] = [
  { title: "Ne transmiteți proiectul sau lista de materiale", text: "" },
  { title: "Stabilim împreună necesarul exact", text: "și vă recomandăm soluțiile potrivite" },
  { title: "Primiți oferta personalizată", text: "și organizăm livrarea pe șantier sau ridicarea din depozit" },
]

export default function CerereOfertaPage() {
  return (
    <div className="content-container py-8 md:py-12">
      <nav className="text-sm text-gray-500 mb-4" aria-label="Breadcrumb">
        <a href="/" className="hover:text-[#F27A1A]">Acasă</a>
        <span className="mx-2 text-gray-300">›</span>
        <span className="text-[#1A1A1A] font-medium">Cere ofertă</span>
      </nav>

      <h1 className="text-2xl md:text-3xl font-bold text-[#1A1A1A]">Cere ofertă</h1>
      <p className="text-gray-600 mt-2 max-w-2xl">
        Aveți o listă de materiale pentru o casă, un acoperiș sau o renovare? Transmiteți-ne-o, iar
        noi vă pregătim oferta pentru întreaga cantitate, cu livrare.
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_340px] gap-6 mt-6 items-start">
        <ListQuoteForm />

        <aside className="bg-white border border-gray-200 rounded-2xl p-6 lg:sticky lg:top-36">
          <h2 className="text-lg font-bold text-[#1A1A1A] mb-4">Cum funcționează</h2>
          <ol className="flex flex-col gap-y-4">
            {STEPS.map((step, i) => (
              <li key={step.title} className="flex gap-x-3">
                <span className="w-8 h-8 rounded-full bg-[#FFF3E6] text-[#F27A1A] font-bold flex items-center justify-center flex-shrink-0">
                  {i + 1}
                </span>
                <span className="text-[15px] text-gray-700 pt-1">
                  <strong className="font-semibold text-[#1A1A1A]">{step.title}</strong>
                  {step.text && <> {step.text}</>}
                </span>
              </li>
            ))}
          </ol>
          <div className="border-t border-gray-100 mt-5 pt-5">
            <p className="text-sm text-gray-500">Preferați să ne sunați?</p>
            <a href="tel:0730076606" className="block text-2xl font-bold text-[#F27A1A] mt-1">
              0730 076 606
            </a>
            <p className="text-sm text-gray-500 mt-1">
              Luni–Vineri 08:00–17:00
              <br />
              Sâmbătă 08:00–13:00
            </p>
          </div>
        </aside>
      </div>
    </div>
  )
}
