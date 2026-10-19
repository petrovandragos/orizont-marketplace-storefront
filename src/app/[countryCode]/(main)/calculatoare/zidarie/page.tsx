import { Metadata } from "next"
import MasonryCalculator from "@modules/calculators/components/masonry-calculator"
import { Breadcrumb } from "@modules/calculators/components/ui"

export const metadata: Metadata = {
  title: "Calculator zidărie",
  description: "Calculați câte cărămizi sau blocuri BCA, câți paleți și cât mortar sau adeziv vă trebuie pentru pereții casei.",
  alternates: { canonical: "/calculatoare/zidarie" },
}

export default function Page() {
  return (
    <div className="content-container pt-6 pb-4 md:pt-8">
      <Breadcrumb items={[{ label: "Acasă", href: "/" }, { label: "Calculatoare", href: "/calculatoare" }, { label: "Calculator zidărie" }]} />
      <h1 className="display-2">Calculator zidărie</h1>
      <p className="lead mt-3 mb-10 max-w-[52ch]">Alegeți elementul de zidărie și introduceți dimensiunile pereților. Calculăm bucățile, paleții și liantul.</p>
      <MasonryCalculator />
    </div>
  )
}
