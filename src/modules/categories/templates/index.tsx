import { notFound } from "next/navigation"
import { HttpTypes } from "@medusajs/types"

import { CALCULATORS, CATEGORY_CALCULATOR } from "@lib/calculators/links"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import ProductCard from "@modules/products/components/product-card"
import FilterSidebar from "@modules/categories/components/filter-sidebar"
import SortAndCountBar from "@modules/categories/components/sort-and-count-bar"
import { listProducts } from "@lib/data/products"
import { sortProducts } from "@lib/util/sort-products"
import { SortOptions } from "@modules/store/components/refinement-list/sort-products"
import { getProductPrice } from "@lib/util/get-product-price"
import { getVariantQuantity } from "@modules/products/components/stock-badge"

// ── Types ─────────────────────────────────────────────────────────────────────

export type CategoryFilterParams = {
  sortBy?: string
  page?: string
  minPrice?: string
  maxPrice?: string
  brands?: string
  inStock?: string
}

// ── Helpers ───────────────────────────────────────────────────────────────────

const ITEMS_PER_PAGE = 12

function resolveSort(raw?: string): SortOptions {
  if (raw === "price_asc" || raw === "price_desc" || raw === "created_at") return raw
  return "created_at"
}

// ── Template ──────────────────────────────────────────────────────────────────

export default async function CategoryTemplate({
  category,
  sortBy,
  page,
  countryCode,
  minPrice,
  maxPrice,
  brands,
  inStock,
}: {
  category: HttpTypes.StoreProductCategory
  sortBy?: string
  page?: string
  countryCode: string
  minPrice?: string
  maxPrice?: string
  brands?: string
  inStock?: string
}) {
  if (!category || !countryCode) notFound()

  // ── Fetch ALL products for this category (paginate past 100) ───────────────
  const FETCH_LIMIT = 100
  const allProducts: HttpTypes.StoreProduct[] = []
  let fetchPage = 1
  let hasMore = true
  while (hasMore) {
    const { response: { products: batch }, nextPage } = await listProducts({
      pageParam: fetchPage,
      queryParams: {
        limit: FETCH_LIMIT,
        category_id: [category.id],
        fields:
          "*variants.calculated_price,+variants.inventory_quantity,+variants.manage_inventory,+variants.allow_backorder,+metadata",
      },
      countryCode,
    }).catch(() => ({ response: { products: [] as HttpTypes.StoreProduct[], count: 0 }, nextPage: null }))
    allProducts.push(...batch)
    hasMore = nextPage !== null
    fetchPage++
  }

  // ── Region (needed for ProductCard price) ───────────────────────────────────
  // We obtain the region via the first product's pricing, or fall back to fetching it
  // ProductCard handles its own region prop — we need to pass it through
  const { getRegion } = await import("@lib/data/regions")
  const region = await getRegion(countryCode)

  if (!region) notFound()

  // ── Sort ────────────────────────────────────────────────────────────────────
  const sort = resolveSort(sortBy)
  // "popularity" alias maps to "created_at" in sortProducts
  const effectiveSort: SortOptions =
    sortBy === "popularity" ? "created_at" : sort

  const sorted = sortProducts(allProducts, effectiveSort)

  // price-sort must be done manually since sortProducts only handles created_at / price variants
  const priceSort = sortBy === "price_asc" || sortBy === "price_desc" ? sortBy : null

  const afterPriceSort = priceSort
    ? [...sorted].sort((a, b) => {
        const ap = getProductPrice({ product: a }).cheapestPrice?.calculated_price_number ?? 0
        const bp = getProductPrice({ product: b }).cheapestPrice?.calculated_price_number ?? 0
        return priceSort === "price_asc" ? ap - bp : bp - ap
      })
    : sorted

  // ── Filter ──────────────────────────────────────────────────────────────────
  const minPriceNum = minPrice ? parseFloat(minPrice) : null
  const maxPriceNum = maxPrice ? parseFloat(maxPrice) : null
  const activeBrands = brands ? brands.split(",").filter(Boolean) : []
  const inStockOnly = inStock === "1"

  const filtered = afterPriceSort.filter((product) => {
    // Price filter
    const price =
      getProductPrice({ product }).cheapestPrice?.calculated_price_number ?? null
    if (minPriceNum !== null && (price === null || price < minPriceNum)) return false
    if (maxPriceNum !== null && (price === null || price > maxPriceNum)) return false

    // Brand filter
    if (activeBrands.length > 0) {
      const brand = product.metadata?.brand as string | undefined
      if (!brand || !activeBrands.includes(brand)) return false
    }

    // In-stock filter
    if (inStockOnly) {
      const firstVariant = product.variants?.[0] as
        | (HttpTypes.StoreProductVariant & { inventory_quantity?: number })
        | undefined
      if (getVariantQuantity(firstVariant) === 0) return false
    }

    return true
  })

  // ── Paginate ────────────────────────────────────────────────────────────────
  const currentPage = Math.max(1, page ? parseInt(page) : 1)
  const totalCount = filtered.length
  const totalPages = Math.max(1, Math.ceil(totalCount / ITEMS_PER_PAGE))
  const safeCurrentPage = Math.min(currentPage, totalPages)
  const offset = (safeCurrentPage - 1) * ITEMS_PER_PAGE
  const pageProducts = filtered.slice(offset, offset + ITEMS_PER_PAGE)

  // ── Brand counts (from all products, not filtered) ──────────────────────────
  const brandCounts: Record<string, number> = {}
  for (const p of allProducts) {
    const b = p.metadata?.brand as string | undefined
    if (b) brandCounts[b] = (brandCounts[b] ?? 0) + 1
  }
  const availableBrands = Object.keys(brandCounts).sort()

  // ── Breadcrumbs ─────────────────────────────────────────────────────────────
  const parents: HttpTypes.StoreProductCategory[] = []
  const collectParents = (cat: HttpTypes.StoreProductCategory) => {
    if (cat.parent_category) {
      collectParents(cat.parent_category)
      parents.push(cat.parent_category)
    }
  }
  collectParents(category)

  // ── hasActiveFilters ─────────────────────────────────────────────────────────
  const hasActiveFilters =
    !!minPrice || !!maxPrice || !!brands || inStock === "1"

  return (
    <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-6">

      {/* ── Breadcrumbs ── */}
      <nav aria-label="Breadcrumb" className="mb-5">
        <ol className="flex flex-wrap items-center gap-x-1.5 gap-y-1 text-sm text-gray-500">
          <li>
            <LocalizedClientLink href="/" className="hover:text-[#F27A1A] transition-colors">
              Acasă
            </LocalizedClientLink>
          </li>

          {parents.map((parent) => (
            <li key={parent.id} className="flex items-center gap-x-1.5">
              <svg className="w-3.5 h-3.5 text-gray-300 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
              <LocalizedClientLink
                href={`/categories/${parent.handle}`}
                className="hover:text-[#F27A1A] transition-colors"
              >
                {parent.name}
              </LocalizedClientLink>
            </li>
          ))}

          <li className="flex items-center gap-x-1.5">
            <svg className="w-3.5 h-3.5 text-gray-300 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            <span className="font-medium text-[#1A1A1A]" aria-current="page">
              {category.name}
            </span>
          </li>
        </ol>
      </nav>

      {/* ── Heading ── */}
      <h1 className="text-2xl font-bold text-[#1A1A1A] mb-4">{category.name}</h1>

      {/* ── Sub-category pills ── */}
      {(category.category_children?.length ?? 0) > 0 && (
        <div className="flex flex-wrap gap-2 mb-6">
          {category.category_children!.map((child) => (
            <LocalizedClientLink
              key={child.id}
              href={`/categories/${child.handle}`}
              className="inline-flex items-center h-8 px-3 text-sm font-medium text-[#333333] border border-gray-200 rounded-full bg-white hover:border-[#F27A1A] hover:text-[#F27A1A] transition-colors"
            >
              {child.name}
            </LocalizedClientLink>
          ))}
        </div>
      )}

      {/* ── Banda cu calculatorul potrivit categoriei ── */}
      {(() => {
        const slug = CATEGORY_CALCULATOR[category.handle ?? ""]
        const calc = CALCULATORS.find((c) => c.slug === slug)
        if (!calc) return null
        return (
          <LocalizedClientLink
            href={`/calculatoare/${calc.slug}`}
            className="mb-6 flex flex-col sm:flex-row sm:items-center gap-3 rounded-xl border-2 border-[#F27A1A] bg-[#FFF3E6] px-4 py-3.5 hover:bg-[#FFEAD5] transition-colors"
          >
            <span className="flex-1">
              <span className="block text-[15px] font-bold text-[#1A1A1A]">Calculați necesarul: {calc.short.toLowerCase()}</span>
              <span className="block text-sm text-gray-600">{calc.text}</span>
            </span>
            <span className="inline-flex items-center justify-center h-10 px-4 rounded-lg bg-[#F27A1A] text-white text-sm font-semibold whitespace-nowrap">Deschideți calculatorul</span>
          </LocalizedClientLink>
        )
      })()}

      {/* ── Main layout: sidebar + content ── */}
      <div className="flex gap-x-8 items-start">

        {/* Desktop filter sidebar */}
        <aside className="hidden lg:block w-60 flex-shrink-0 sticky top-[var(--header-height,120px)]">
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
            <FilterSidebar
              availableBrands={availableBrands}
              brandCounts={brandCounts}
            />
          </div>
        </aside>

        {/* Content */}
        <div className="min-w-0 flex-1">

          {/* Sort & count bar (includes mobile filter trigger) */}
          <div className="mb-5">
            <SortAndCountBar
              count={totalCount}
              currentSort={sortBy ?? "created_at"}
              filterProps={{ availableBrands, brandCounts }}
              hasActiveFilters={hasActiveFilters}
            />
          </div>

          {/* Product grid */}
          {pageProducts.length > 0 ? (
            <ul className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
              {pageProducts.map((product) => (
                <li key={product.id}>
                  <ProductCard product={product} region={region} />
                </li>
              ))}
            </ul>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 text-center gap-y-3">
              <svg className="w-12 h-12 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1}
                  d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-gray-500 font-medium">Niciun produs găsit</p>
              <p className="text-sm text-gray-400">Încearcă să ajustezi filtrele aplicate.</p>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <Pagination
              currentPage={safeCurrentPage}
              totalPages={totalPages}
              sortBy={sortBy}
              minPrice={minPrice}
              maxPrice={maxPrice}
              brands={brands}
              inStock={inStock}
            />
          )}
        </div>
      </div>
    </div>
  )
}

// ── Pagination component ───────────────────────────────────────────────────────

function Pagination({
  currentPage,
  totalPages,
  sortBy,
  minPrice,
  maxPrice,
  brands,
  inStock,
}: {
  currentPage: number
  totalPages: number
  sortBy?: string
  minPrice?: string
  maxPrice?: string
  brands?: string
  inStock?: string
}) {
  const buildHref = (p: number) => {
    const params = new URLSearchParams()
    if (sortBy) params.set("sortBy", sortBy)
    if (minPrice) params.set("minPrice", minPrice)
    if (maxPrice) params.set("maxPrice", maxPrice)
    if (brands) params.set("brands", brands)
    if (inStock) params.set("inStock", inStock)
    params.set("page", String(p))
    return `?${params.toString()}`
  }

  // Show at most 5 page numbers around current
  const pages: (number | "…")[] = []
  for (let i = 1; i <= totalPages; i++) {
    if (
      i === 1 ||
      i === totalPages ||
      (i >= currentPage - 1 && i <= currentPage + 1)
    ) {
      pages.push(i)
    } else if (pages[pages.length - 1] !== "…") {
      pages.push("…")
    }
  }

  return (
    <nav
      aria-label="Paginare"
      className="flex justify-center items-center gap-x-1 mt-10"
    >
      {/* Prev */}
      {currentPage > 1 ? (
        <LocalizedClientLink
          href={buildHref(currentPage - 1)}
          className="h-9 w-9 flex items-center justify-center rounded-lg border border-gray-200 text-gray-500 hover:border-[#F27A1A] hover:text-[#F27A1A] transition-colors"
          aria-label="Pagina anterioară"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </LocalizedClientLink>
      ) : (
        <span className="h-9 w-9 flex items-center justify-center rounded-lg border border-gray-100 text-gray-300 cursor-not-allowed" aria-hidden="true">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </span>
      )}

      {/* Page numbers */}
      {pages.map((p, i) =>
        p === "…" ? (
          <span key={`ellipsis-${i}`} className="h-9 w-9 flex items-center justify-center text-gray-400 text-sm">
            …
          </span>
        ) : (
          <LocalizedClientLink
            key={p}
            href={buildHref(p)}
            aria-current={p === currentPage ? "page" : undefined}
            className={`h-9 w-9 flex items-center justify-center rounded-lg text-sm font-medium transition-colors ${
              p === currentPage
                ? "bg-[#F27A1A] text-white border border-[#F27A1A]"
                : "border border-gray-200 text-gray-600 hover:border-[#F27A1A] hover:text-[#F27A1A]"
            }`}
          >
            {p}
          </LocalizedClientLink>
        )
      )}

      {/* Next */}
      {currentPage < totalPages ? (
        <LocalizedClientLink
          href={buildHref(currentPage + 1)}
          className="h-9 w-9 flex items-center justify-center rounded-lg border border-gray-200 text-gray-500 hover:border-[#F27A1A] hover:text-[#F27A1A] transition-colors"
          aria-label="Pagina următoare"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7 7-7" />
          </svg>
        </LocalizedClientLink>
      ) : (
        <span className="h-9 w-9 flex items-center justify-center rounded-lg border border-gray-100 text-gray-300 cursor-not-allowed" aria-hidden="true">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7 7-7" />
          </svg>
        </span>
      )}
    </nav>
  )
}
