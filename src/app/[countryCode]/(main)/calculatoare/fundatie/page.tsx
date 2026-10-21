import { Metadata } from "next"
import FoundationCalculator from "@modules/calculators/components/foundation-calculator"
import { Breadcrumb } from "@modules/calculators/components/ui"

export const metadata: Metadata = {
  title: "Calculator fundație și beton",
  description: "Calculați câți metri cubi de beton, câți saci de ciment și câtă armătură vă trebuie pentru fundația și placa casei.",
  alternates: { canonical: "/calculatoare/fundatie" },
}

export default function Page() {
  return (
    <div className="content-container pt-6 pb-4 md:pt-8">
      <Breadcrumb items={[{ label: "Acasă", href: "/" }, { label: "Calculatoare", href: "/calculatoare" }, { label: "Calculator fundație și beton" }]} />
      <h1 className="display-2">Calculator fundație și beton</h1>
      <p className="lead mt-3 mb-10 max-w-[52ch]">Introduceți dimensiunile casei și ale fundației. Calculăm betonul, cimentul și agregatele, armătura și plasa sudată.</p>
      <FoundationCalculator />
    </div>
  )
}
