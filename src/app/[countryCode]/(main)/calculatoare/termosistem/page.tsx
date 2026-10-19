import { Metadata } from "next"
import EticsCalculator from "@modules/calculators/components/etics-calculator"
import { Breadcrumb } from "@modules/calculators/components/ui"

export const metadata: Metadata = {
  title: "Calculator termosistem",
  description: "Calculați materialele pentru izolarea fațadei: polistiren sau vată bazaltică, adeziv, plasă, dibluri, profile și tencuială decorativă.",
  alternates: { canonical: "/calculatoare/termosistem" },
}

export default function Page() {
  return (
    <div className="content-container py-8 md:py-12">
      <Breadcrumb items={[{ label: "Acasă", href: "/" }, { label: "Calculatoare", href: "/calculatoare" }, { label: "Calculator termosistem" }]} />
      <h1 className="text-2xl md:text-3xl font-bold text-[#1A1A1A]">Calculator termosistem</h1>
      <p className="text-gray-600 mt-2 mb-6 max-w-2xl">Introduceți dimensiunile fațadei și alegeți materialul izolant. Calculăm tot ce vă trebuie pentru termosistem.</p>
      <EticsCalculator />
    </div>
  )
}
