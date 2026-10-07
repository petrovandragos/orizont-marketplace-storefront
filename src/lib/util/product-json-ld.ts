import { HttpTypes } from "@medusajs/types"
import { getBaseURL } from "@lib/util/env"

/**
 * Date structurate pentru Google pe pagina de produs:
 *  - BreadcrumbList (Acasă › Categorie › Produs), mereu
 *  - Product cu preț și stoc, doar dacă produsul are preț afișat
 *    (Google cere preț pentru Product; la „Preț la cerere” nu îl trimitem)
 */
export function productJsonLd(product: HttpTypes.StoreProduct) {
  const base = getBaseURL()
  const url = `${base}/products/${product.handle}`
  const category = product.categories?.[0]

  const breadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Acasă", item: base },
      ...(category
        ? [{ "@type": "ListItem", position: 2, name: category.name, item: `${base}/categories/${category.handle}` }]
        : []),
      { "@type": "ListItem", position: category ? 3 : 2, name: product.title, item: url },
    ],
  }

  const priced = (product.variants ?? []).filter(
    (v: any) => typeof v?.calculated_price?.calculated_amount === "number" && v.calculated_price.calculated_amount > 0
  ) as any[]

  if (!priced.length) return [breadcrumb]

  const cheapest = priced.reduce((a, b) =>
    a.calculated_price.calculated_amount <= b.calculated_price.calculated_amount ? a : b
  )
  const inStock = priced.some(
    (v) => v.manage_inventory === false || v.allow_backorder || (v.inventory_quantity ?? 0) > 0
  )
  const brand = (product.metadata as any)?.brand

  const productLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.title,
    url,
    ...(product.thumbnail ? { image: [product.thumbnail] } : {}),
    ...(product.description
      ? { description: product.description.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim().slice(0, 500) }
      : {}),
    ...(cheapest.sku ? { sku: cheapest.sku } : {}),
    ...(brand ? { brand: { "@type": "Brand", name: String(brand) } } : {}),
    ...(category ? { category: category.name } : {}),
    offers: {
      "@type": "Offer",
      url,
      priceCurrency: String(cheapest.calculated_price.currency_code || "ron").toUpperCase(),
      price: Number(cheapest.calculated_price.calculated_amount).toFixed(2),
      availability: inStock ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      itemCondition: "https://schema.org/NewCondition",
      seller: { "@type": "Organization", name: "Orizont" },
    },
  }

  return [breadcrumb, productLd]
}
