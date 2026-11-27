import { cache } from "react"
import { Metadata } from "next"
import { notFound } from "next/navigation"
import { listProducts } from "@lib/data/products"
import { getRegion, listRegions } from "@lib/data/regions"
import ProductTemplate from "@modules/products/templates"
import { toMetaDescription } from "@lib/util/meta-description"

const PRODUCT_FIELDS =
  "*variants.calculated_price,+variants.inventory_quantity,+variants.manage_inventory,+variants.allow_backorder,+variants.metadata,+metadata,+tags,*categories"

// One catalog read per request, shared by generateMetadata and the page.
// Previously each called listProducts with `cache: "no-store"` and different fields.
const getProductByHandle = cache(async (countryCode: string, handle: string) => {
  const { response } = await listProducts({
    countryCode,
    queryParams: { handle, fields: PRODUCT_FIELDS },
  })
  return response.products[0] ?? null
})

type Props = {
  params: Promise<{ countryCode: string; handle: string }>
}

export async function generateStaticParams() {
  try {
    const countryCodes = await listRegions().then((regions) =>
      regions?.map((r) => r.countries?.map((c) => c.iso_2)).flat()
    )

    if (!countryCodes) {
      return []
    }

    const promises = countryCodes.map(async (country) => {
      const { response } = await listProducts({
        countryCode: country,
        queryParams: { limit: 100, fields: "handle" },
      })

      return {
        country,
        products: response.products,
      }
    })

    const countryProducts = await Promise.all(promises)

    return countryProducts
      .flatMap((countryData) =>
        countryData.products.map((product) => ({
          countryCode: countryData.country,
          handle: product.handle,
        }))
      )
      .filter((param) => param.handle)
  } catch (error) {
    console.error(
      `Failed to generate static paths for product pages: ${
        error instanceof Error ? error.message : "Unknown error"
      }.`
    )
    return []
  }
}

export async function generateMetadata(props: Props): Promise<Metadata> {
  const params = await props.params
  const { handle } = params
  const region = await getRegion(params.countryCode)

  if (!region) {
    notFound()
  }

  const product = await getProductByHandle(params.countryCode, handle)

  if (!product) {
    notFound()
  }

  const description = toMetaDescription(
    product.description,
    `${product.title} la Orizont Sighetu Marmației, depozit de materiale de construcții. Comandă online sau cere ofertă.`
  )

  return {
    // " | Orizont" se adaugă automat din layout
    title: product.title,
    description,
    alternates: {
      canonical: `/products/${handle}`,
    },
    openGraph: {
      title: `${product.title} | Orizont`,
      description,
      images: product.thumbnail ? [product.thumbnail] : [],
    },
  }
}

export default async function ProductPage(props: Props) {
  const params = await props.params
  const region = await getRegion(params.countryCode)

  if (!region) {
    notFound()
  }

  const pricedProduct = await getProductByHandle(
    params.countryCode,
    params.handle
  )

  if (!pricedProduct) {
    notFound()
  }

  return (
    <ProductTemplate
      product={pricedProduct}
      region={region}
      countryCode={params.countryCode}
    />
  )
}
