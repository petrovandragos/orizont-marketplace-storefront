import type { MetadataRoute } from "next"
import { getBaseURL } from "@lib/util/env"

// Sitemap-ul se regenerează cel mult o dată pe oră.
export const revalidate = 3600

const BACKEND_URL = process.env.MEDUSA_BACKEND_URL || "http://localhost:9000"
const PUBLISHABLE_KEY = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || ""

const STATIC_PATHS = [
  "",
  "/store",
  "/cerere-oferta",
  "/contact",
  "/despre-noi",
  "/livrare",
  "/certificari",
  "/termeni-si-conditii",
  "/politica-de-retur",
  "/politica-de-confidentialitate",
  "/protectia-datelor",
  "/customer-service",
]

type Item = { handle?: string | null; updated_at?: string | Date | null }

/**
 * Citește toate înregistrările unei liste din Medusa, pagină cu pagină.
 * Folosim fetch direct (nu sdk) ca sitemap-ul să nu depindă de cookie-uri.
 */
async function fetchAll(path: string, key: string, fields: string): Promise<Item[]> {
  const items: Item[] = []
  const limit = 100

  for (let offset = 0; offset < 20000; offset += limit) {
    const url = `${BACKEND_URL}${path}?fields=${encodeURIComponent(fields)}&limit=${limit}&offset=${offset}`
    const res = await fetch(url, {
      headers: { "x-publishable-api-key": PUBLISHABLE_KEY },
      next: { revalidate: 3600 },
    })

    if (!res.ok) {
      throw new Error(`${path} a răspuns cu ${res.status}`)
    }

    const json = await res.json()
    const page: Item[] = json[key] ?? []
    items.push(...page)

    if (page.length < limit || items.length >= (json.count ?? 0)) {
      break
    }
  }

  return items
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = getBaseURL()
  const now = new Date()

  const entries: MetadataRoute.Sitemap = STATIC_PATHS.map((path) => ({
    url: `${baseUrl}${path}`,
    lastModified: now,
    changeFrequency: path === "" ? "daily" : "monthly",
    priority: path === "" ? 1 : 0.5,
  }))

  const [categories, products] = await Promise.all([
    fetchAll("/store/product-categories", "product_categories", "handle,updated_at").catch(
      (e) => {
        console.error("Sitemap: nu am putut citi categoriile.", e)
        return [] as Item[]
      }
    ),
    fetchAll("/store/products", "products", "handle,updated_at").catch((e) => {
      console.error("Sitemap: nu am putut citi produsele.", e)
      return [] as Item[]
    }),
  ])

  for (const c of categories) {
    if (!c.handle) continue
    entries.push({
      url: `${baseUrl}/categories/${c.handle}`,
      lastModified: c.updated_at ? new Date(c.updated_at) : now,
      changeFrequency: "weekly",
      priority: 0.8,
    })
  }

  for (const p of products) {
    if (!p.handle) continue
    entries.push({
      url: `${baseUrl}/products/${p.handle}`,
      lastModified: p.updated_at ? new Date(p.updated_at) : now,
      changeFrequency: "weekly",
      priority: 0.7,
    })
  }

  return entries
}
