import { Metadata } from "next"

import Hero from "@modules/home/components/hero"
import CategoriesSection from "@modules/home/components/categories-section"
import PopularProducts from "@modules/home/components/popular-products"
import { getRegion } from "@lib/data/regions"
import { listCategories } from "@lib/data/categories"

export const metadata: Metadata = {
  // "absolute" ca să nu se mai adauge " | Orizont" din layout la final
  title: { absolute: "Orizont Sighetu Marmației — Depozit materiale de construcții" },
  description:
    "Depozit de materiale de construcții în Sighetu Marmației, Maramureș: ciment, cărămidă Porotherm, izolații, acoperișuri, oțel beton. Livrare la șantier. Tel. 0730 076 606.",
  alternates: { canonical: "/" },
}

export default async function Home(props: {
  params: Promise<{ countryCode: string }>
}) {
  const params = await props.params

  const { countryCode } = params

  const [region, categories] = await Promise.all([
    getRegion(countryCode),
    listCategories().catch(() => []),
  ])

  if (!region) {
    return null
  }

  return (
    <>
      <Hero />
      <CategoriesSection categories={categories} />
      <PopularProducts region={region} />
    </>
  )
}
