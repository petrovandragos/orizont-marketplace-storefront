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
    <div className="content-container py-8 md:py-12">
      <Breadcrumb items={[{ label: "Acasă", href: "/" }, { label: "Calculatoare", href: "/calculatoare" }, { label: "Calculator tablă acoperiș" }]} />
      <h1 className="text-2xl md:text-3xl font-bold text-[#1A1A1A]">Calculator tablă acoperiș</h1>
      <p className="text-gray-600 mt-2 mb-6 max-w-2xl">Alegeți forma acoperișului și modelul de tablă, introduceți dimensiunile, iar noi calculăm foile, lungimile și accesoriile.</p>
      <RoofCalculator />
    </div>
  )
}
