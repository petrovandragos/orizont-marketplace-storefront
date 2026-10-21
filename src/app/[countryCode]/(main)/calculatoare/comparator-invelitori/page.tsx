import { Metadata } from "next"
import RoofComparator from "@modules/calculators/components/roof-comparator"
import { Breadcrumb } from "@modules/calculators/components/ui"

export const metadata: Metadata = {
  title: "Comparator învelitori: tablă, țiglă ceramică sau de beton",
  description: "Comparați țigla metalică, tabla fălțuită, țigla cu rocă, țigla ceramică și cea de beton: greutate, pantă minimă, garanție, zgomot și buget.",
  alternates: { canonical: "/calculatoare/comparator-invelitori" },
}

export default function Page() {
  return (
    <div className="content-container pt-6 pb-4 md:pt-8">
      <Breadcrumb items={[{ label: "Acasă", href: "/" }, { label: "Calculatoare", href: "/calculatoare" }, { label: "Comparator învelitori" }]} />
      <h1 className="display-2">Tablă sau țiglă?</h1>
      <p className="lead mt-3 mb-10 max-w-[56ch]">Comparați învelitorile după greutate, pantă, garanție și buget. Introduceți suprafața și panta acoperișului, iar noi vă arătăm ce se potrivește.</p>
      <RoofComparator />
    </div>
  )
}
