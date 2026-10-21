import { Metadata } from "next"
import RoofCalculator from "@modules/calculators/components/roof-calculator"
import { Breadcrumb } from "@modules/calculators/components/ui"

export const metadata: Metadata = {
  title: "Calculator acoperiș: tablă și țiglă",
  description: "Calculați câte foi de țiglă metalică sau tablă cutată ori câte țigle ceramice sau de beton vă trebuie, plus coame, folie anticondens, șipci și jgheaburi. Pentru acoperișuri în una, două sau patru ape.",
  alternates: { canonical: "/calculatoare/acoperis" },
}

export default function Page() {
  return (
    <div className="content-container pt-6 pb-4 md:pt-8">
      <Breadcrumb items={[{ label: "Acasă", href: "/" }, { label: "Calculatoare", href: "/calculatoare" }, { label: "Calculator acoperiș" }]} />
      <h1 className="display-2">Calculator acoperiș</h1>
      <p className="lead mt-3 mb-10 max-w-[52ch]">Alegeți forma acoperișului și învelitoarea, tablă sau țiglă, introduceți dimensiunile, iar noi calculăm cât material și ce accesorii vă trebuie.</p>
      <RoofCalculator />
    </div>
  )
}
