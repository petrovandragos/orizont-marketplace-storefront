import { Metadata } from "next"
import RoofVisualizer from "@modules/calculators/components/roof-visualizer"
import { Breadcrumb } from "@modules/calculators/components/ui"

export const metadata: Metadata = {
  title: "Vizualizator acoperiș și fațadă",
  description: "Alegeți învelitoarea, culoarea acoperișului, a fațadei și a tâmplăriei și vedeți cum arată casa înainte de a comanda materialele.",
  alternates: { canonical: "/calculatoare/vizualizator-acoperis" },
}

export default function Page() {
  return (
    <div className="content-container pt-6 pb-4 md:pt-8">
      <Breadcrumb items={[{ label: "Acasă", href: "/" }, { label: "Calculatoare", href: "/calculatoare" }, { label: "Vizualizator acoperiș" }]} />
      <h1 className="display-2">Cum arată casa dumneavoastră?</h1>
      <p className="lead mt-3 mb-10 max-w-[52ch]">Alegeți învelitoarea și culorile, comparați variantele și trimiteți-ne combinația preferată pentru o ofertă.</p>
      <RoofVisualizer />
    </div>
  )
}
