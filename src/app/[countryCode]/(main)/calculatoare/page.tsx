import { Metadata } from "next"
import { CALCULATORS } from "@lib/calculators/links"
import { Breadcrumb } from "@modules/calculators/components/ui"
import { CALCULATOR_ART } from "@modules/calculators/components/icons"

export const metadata: Metadata = {
  title: "Calculatoare de materiale",
  description:
    "Calculați gratuit necesarul de tablă pentru acoperiș, materialele pentru termosistem și zidărie. Orizont, depozit de materiale de construcții în Sighetu Marmației.",
  alternates: { canonical: "/calculatoare" },
}

export default function CalculatoarePage() {
  return (
    <div className="content-container pt-6 pb-4 md:pt-8">
      <Breadcrumb items={[{ label: "Acasă", href: "/" }, { label: "Calculatoare" }]} />
      <h1 className="display-2">Calculatoare de materiale</h1>
      <p className="lead mt-3 max-w-[48ch]">
        Aflați în câteva minute ce materiale vă trebuie și în ce cantitate. La final puteți trimite lista direct pentru o ofertă.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-10">
        {CALCULATORS.map((c) => (
          <a key={c.slug} href={`/calculatoare/${c.slug}`}
            className="group bg-[#F5F5F7] rounded-[26px] p-7 flex flex-col gap-3 hover:shadow-[0_12px_40px_rgba(0,0,0,0.08)] transition-shadow">
            <span className="block w-[120px] h-20 text-[#F27A1A] mb-6">{CALCULATOR_ART[c.slug]}</span>
            <span className="text-2xl font-semibold tracking-[-0.02em] text-[#1D1D1F]">{c.title}</span>
            <span className="text-base text-[#6E6E73] flex-1">{c.text}</span>
            <span className="text-base text-[#B9520A] group-hover:underline">Începeți calculul ›</span>
          </a>
        ))}
      </div>
    </div>
  )
}
