import { Metadata } from "next"

import Hero from "@modules/home/components/hero"
import CategoriesSection from "@modules/home/components/categories-section"
import PopularProducts from "@modules/home/components/popular-products"
import { getRegion } from "@lib/data/regions"
import { listCategories } from "@lib/data/categories"
import { getBaseURL } from "@lib/util/env"

export const metadata: Metadata = {
  // "absolute" ca să nu se mai adauge " | Orizont" din layout la final
  title: { absolute: "Orizont Sighetu Marmației — Depozit materiale de construcții" },
  description:
    "Depozit de materiale de construcții în Sighetu Marmației, Maramureș: ciment, cărămidă Porotherm, izolații, acoperișuri, oțel beton. Livrare la șantier. Tel. 0730 076 606.",
  alternates: { canonical: "/" },
}

// Datele firmei pentru Google (rezultate locale și căutări pe brand)
function businessJsonLd() {
  const baseUrl = getBaseURL()

  return {
    "@context": "https://schema.org",
    "@type": "HardwareStore",
    name: "Orizont",
    legalName: "ORIZONT SIGHETU MARMAȚIEI SRL",
    description:
      "Depozit de materiale de construcții în Sighetu Marmației, Maramureș.",
    url: baseUrl,
    logo: `${baseUrl}/logo.png`,
    image: `${baseUrl}/logo.png`,
    telephone: "+40730076606",
    email: "comenzi@orizont-srl.ro",
    address: {
      "@type": "PostalAddress",
      streetAddress: "Str. Plevnei nr. 3",
      addressLocality: "Sighetu Marmației",
      addressRegion: "Maramureș",
      postalCode: "435500",
      addressCountry: "RO",
    },
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        opens: "08:00",
        closes: "17:00",
      },
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: "Saturday",
        opens: "08:00",
        closes: "13:00",
      },
    ],
  }
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
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(businessJsonLd()) }}
      />
      <Hero />
      <CategoriesSection categories={categories} />
      <PopularProducts region={region} />
    </>
  )
}
