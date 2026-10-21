import { Metadata } from "next"
import TileCalculator from "@modules/calculators/components/tile-calculator"
import { Breadcrumb } from "@modules/calculators/components/ui"

export const metadata: Metadata = {
  title: "Calculator gresie și faianță",
  description: "Calculați câte cutii de gresie și faianță, câți saci de adeziv, cât chit de rosturi și câtă hidroizolație vă trebuie pentru baie sau bucătărie.",
  alternates: { canonical: "/calculatoare/gresie-faianta" },
}

export default function Page() {
  return (
    <div className="content-container pt-6 pb-4 md:pt-8">
      <Breadcrumb items={[{ label: "Acasă", href: "/" }, { label: "Calculatoare", href: "/calculatoare" }, { label: "Calculator gresie și faianță" }]} />
      <h1 className="display-2">Calculator gresie și faianță</h1>
      <p className="lead mt-3 mb-10 max-w-[52ch]">Introduceți dimensiunile încăperii și formatul plăcilor. Calculăm cutiile, adezivul, chitul de rosturi, amorsa și hidroizolația.</p>
      <TileCalculator />
    </div>
  )
}
