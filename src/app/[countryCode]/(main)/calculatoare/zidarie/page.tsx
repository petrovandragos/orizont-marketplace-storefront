import { Metadata } from "next"
import MasonryCalculator from "@modules/calculators/components/masonry-calculator"
import { Breadcrumb } from "@modules/calculators/components/ui"

export const metadata: Metadata = {
  title: "Calculator zidărie",
  description: "Calculați câte cărămizi, blocuri BCA sau bolțari și câți saci de mortar sau adeziv vă trebuie pentru pereții casei.",
  alternates: { canonical: "/calculatoare/zidarie" },
}

export default function Page() {
  return (
    <div className="content-container py-8 md:py-12">
      <Breadcrumb items={[{ label: "Acasă", href: "/" }, { label: "Calculatoare", href: "/calculatoare" }, { label: "Calculator zidărie" }]} />
      <h1 className="text-2xl md:text-3xl font-bold text-[#1A1A1A]">Calculator zidărie</h1>
      <p className="text-gray-600 mt-2 mb-6 max-w-2xl">Alegeți elementul de zidărie și introduceți dimensiunile pereților. Calculăm bucățile, paleții și liantul.</p>
      <MasonryCalculator />
    </div>
  )
}
