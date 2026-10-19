import { Metadata } from "next"
import { CALCULATORS } from "@lib/calculators/links"
import { Breadcrumb } from "@modules/calculators/components/ui"
import { CALCULATOR_ICONS } from "@modules/calculators/components/icons"

export const metadata: Metadata = {
  title: "Calculatoare de materiale",
  description:
    "Calculați gratuit necesarul de tablă pentru acoperiș, materialele pentru termosistem și zidărie. Orizont, depozit de materiale de construcții în Sighetu Marmației.",
  alternates: { canonical: "/calculatoare" },
}

export default function CalculatoarePage() {
  return (
    <div className="content-container py-8 md:py-12">
      <Breadcrumb items={[{ label: "Acasă", href: "/" }, { label: "Calculatoare" }]} />
      <h1 className="text-2xl md:text-3xl font-bold text-[#1A1A1A]">Calculatoare de materiale</h1>
      <p className="text-gray-600 mt-2 max-w-2xl">
        Aflați în câteva minute ce materiale vă trebuie și în ce cantitate. La final puteți trimite lista direct pentru o ofertă.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
        {CALCULATORS.map((c) => (
          <a key={c.slug} href={`/calculatoare/${c.slug}`}
            className="group bg-white border border-gray-200 rounded-2xl p-6 flex flex-col gap-3 hover:border-[#F27A1A] transition-colors">
            <span className="w-16 h-16 rounded-xl bg-[#FFF3E6] flex items-center justify-center">{CALCULATOR_ICONS[c.slug]}</span>
            <span className="text-lg font-bold text-[#1A1A1A] group-hover:text-[#F27A1A]">{c.title}</span>
            <span className="text-[15px] text-gray-600 flex-1">{c.text}</span>
            <span className="text-sm font-semibold text-[#F27A1A]">Începeți calculul</span>
          </a>
        ))}
      </div>
    </div>
  )
}
