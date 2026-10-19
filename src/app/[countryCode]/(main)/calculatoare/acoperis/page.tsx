import { Metadata } from "next"
import RoofCalculator from "@modules/calculators/components/roof-calculator"
import { Breadcrumb } from "@modules/calculators/components/ui"

export const metadata: Metadata = {
  title: "Calculator tablă acoperiș",
  description: "Calculați câte foi de țiglă metalică sau tablă cutată vă trebuie, pe ce lungimi, plus coamă, borduri, folie anticondens și jgheaburi. Pentru acoperișuri în una, două sau patru ape.",
  alternates: { canonical: "/calculatoare/acoperis" },
}

export default function Page() {
  return (
    <div className="content-container pt-6 pb-4 md:pt-8">
      <Breadcrumb items={[{ label: "Acasă", href: "/" }, { label: "Calculatoare", href: "/calculatoare" }, { label: "Calculator tablă acoperiș" }]} />
      <h1 className="display-2">Calculator tablă acoperiș</h1>
      <p className="lead mt-3 mb-10 max-w-[52ch]">Alegeți forma acoperișului și modelul de tablă, introduceți dimensiunile, iar noi calculăm foile, lungimile și accesoriile.</p>
      <RoofCalculator />
    </div>
  )
}
