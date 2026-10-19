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
    <div className="content-container pt-6 pb-4 md:pt-8">
      <Breadcrumb items={[{ label: "Acasă", href: "/" }, { label: "Calculatoare", href: "/calculatoare" }, { label: "Calculator termosistem" }]} />
      <h1 className="display-2">Calculator termosistem</h1>
      <p className="lead mt-3 mb-10 max-w-[52ch]">Introduceți dimensiunile fațadei și alegeți materialul izolant. Calculăm tot ce vă trebuie pentru termosistem.</p>
      <EticsCalculator />
    </div>
  )
}
