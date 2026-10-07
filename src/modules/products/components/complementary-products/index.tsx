import { sdk } from "@lib/config"
import { COMPLEMENTARY_RULES } from "@lib/data/complementary-rules"
import { HttpTypes } from "@medusajs/types"
import ProductCard from "@modules/products/components/product-card"

type Props = {
  product: HttpTypes.StoreProduct
  region: HttpTypes.StoreRegion
}

type Cat = { id: string; handle: string; parent_category_id: string | null }

const CARD_FIELDS = "*variants.calculated_price,+variants.inventory_quantity,+metadata"
const MAX = 4
const CACHE = { revalidate: 600 }

async function fetchCategories(): Promise<Cat[]> {
  const { product_categories } = await sdk.client.fetch<{ product_categories: Cat[] }>(
    "/store/product-categories",
    { query: { fields: "id,handle,parent_category_id", limit: 500 }, next: CACHE }
  )
  return product_categories ?? []
}

async function fetchProducts(
  query: Record<string, unknown>,
  regionId: string
): Promise<HttpTypes.StoreProduct[]> {
  const { products } = await sdk.client.fetch<{ products: HttpTypes.StoreProduct[] }>(
    "/store/products",
    { query: { region_id: regionId, fields: CARD_FIELDS, ...query }, next: CACHE }
  )
  return products ?? []
}

/** Un număr stabil din id-ul produsului, ca fiecare produs să arate altă selecție. */
function seed(id: string) {
  let h = 0
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) >>> 0
  return h
}

/** Ia câte unul din fiecare listă, pe rând, până la `max`. */
function interleave(
  lists: HttpTypes.StoreProduct[][],
  max: number,
  skip: Set<string>,
  offset: number
) {
  const out: HttpTypes.StoreProduct[] = []
  const rotated = lists.map((l) => (l.length ? [...l.slice(offset % l.length), ...l.slice(0, offset % l.length)] : l))
  for (let round = 0; out.length < max; round++) {
    let added = false
    for (const list of rotated) {
      const p = list[round]
      if (!p) continue
      added = true
      if (skip.has(p.id)) continue
      skip.add(p.id)
      out.push(p)
      if (out.length >= max) break
    }
    if (!added) break
  }
  return out
}

/**
 * „Ai nevoie și de”: produse complementare pe pagina unui produs, alese
 * automat după regulile din complementary-rules.ts. Vezi explicația de acolo.
 */
export default async function ComplementaryProducts({ product, region }: Props) {
  try {
    const skip = new Set<string>([product.id])
    const offset = seed(product.id)
    let picked: HttpTypes.StoreProduct[] = []

    // 1. Alese manual din admin: metadata „recomandate” = handle-uri de produse
    const manual = String((product.metadata as any)?.recomandate ?? "")
      .split(",")
      .map((h) => h.trim())
      .filter(Boolean)
    if (manual.length) {
      const found = await fetchProducts({ handle: manual, limit: manual.length }, region.id)
      const order = new Map(manual.map((h, i) => [h, i]))
      found.sort((a, b) => (order.get(a.handle ?? "") ?? 99) - (order.get(b.handle ?? "") ?? 99))
      picked = interleave([found], MAX, skip, 0)
    }

    // 2. Regula categoriei (sau a părintelui / bunicului)
    let fromRules = picked.length > 0
    const own = product.categories ?? []
    if (picked.length < MAX && own.length) {
      const cats = await fetchCategories()
      const byId = new Map(cats.map((c) => [c.id, c]))
      const byHandle = new Map(cats.map((c) => [c.handle, c]))

      let targets: string[] | null = null
      for (const start of own) {
        let cur: Cat | undefined = byId.get(start.id)
        for (let depth = 0; cur && depth < 4 && !targets; depth++) {
          targets = COMPLEMENTARY_RULES[cur.handle] ?? null
          cur = cur.parent_category_id ? byId.get(cur.parent_category_id) : undefined
        }
        if (targets) break
      }

      const ownIds = new Set(own.map((c) => c.id))
      const targetIds = (targets ?? [])
        .map((h) => byHandle.get(h)?.id)
        .filter((id): id is string => !!id && !ownIds.has(id))

      if (targetIds.length) {
        const lists = await Promise.all(
          targetIds.map((id) => fetchProducts({ category_id: [id], limit: 6 }, region.id).catch(() => []))
        )
        const more = interleave(lists, MAX - picked.length, skip, offset)
        if (more.length) fromRules = true
        picked = [...picked, ...more]
      }

      // 3. Fără regulă: alte produse din aceeași categorie
      if (picked.length < MAX) {
        const same = await fetchProducts({ category_id: [own[0].id], limit: 12 }, region.id).catch(() => [])
        picked = [...picked, ...interleave([same], MAX - picked.length, skip, offset)]
      }
    }

    if (!picked.length) return null

    return (
      <section className="mt-12 md:mt-16" aria-labelledby="complementare-titlu">
        <h2 id="complementare-titlu" className="text-xl md:text-2xl font-bold text-[#1A1A1A] mb-5">
          {fromRules ? "Ai nevoie și de" : "Produse similare"}
        </h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-5">
          {picked.map((p) => (
            <ProductCard key={p.id} product={p} region={region} />
          ))}
        </div>
      </section>
    )
  } catch (e) {
    console.error("[ComplementaryProducts]", e)
    return null
  }
}
