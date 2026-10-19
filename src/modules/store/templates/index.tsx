import { listCategories } from "@lib/data/categories"
import { listProducts } from "@lib/data/products"
import { getRegion } from "@lib/data/regions"
import { getProductPrice } from "@lib/util/get-product-price"
import { sortProducts } from "@lib/util/sort-products"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import ProductPreview from "@modules/products/components/product-preview"
import { Pagination } from "@modules/store/components/pagination"
import RefinementList from "@modules/store/components/refinement-list"
import { SortOptions } from "@modules/store/components/refinement-list/sort-products"
import { HttpTypes } from "@medusajs/types"
import { notFound } from "next/navigation"

const ITEMS_PER_PAGE = 12

function resolveSort(raw?: string): SortOptions {
  if (raw === "price_asc" || raw === "price_desc" || raw === "created_at") return raw
  return "created_at"
}

const StoreTemplate = async ({
  sortBy,
  page,
  countryCode,
  selectedCategories,
  brands,
}: {
  sortBy?: SortOptions
  page?: string
  countryCode: string
  selectedCategories?: string
  brands?: string
}) => {
  const sort = resolveSort(sortBy)
  const currentPage = Math.max(1, page ? parseInt(page) : 1)
  const activeBrands = brands ? brands.split(",").filter(Boolean) : []

  const selectedIds = selectedCategories
    ? selectedCategories.split(",").filter(Boolean)
    : []

  // ── Parallel fetches ────────────────────────────────────────────────────────
  const [allCategories, region, { response: { products: allProducts } }] =
    await Promise.all([
      listCategories({
        fields: "id,name,handle,parent_category_id",
        limit: 200,
      }).catch(() => [] as HttpTypes.StoreProductCategory[]),

      getRegion(countryCode),

      listProducts({
        pageParam: 1,
        queryParams: {
          limit: 200,
          ...(selectedIds.length > 0 && { category_id: selectedIds }),
          fields:
            "*variants.calculated_price,+variants.inventory_quantity,+variants.manage_inventory,+variants.allow_backorder,+metadata",
        },
        countryCode,
      }).catch(() => ({
        response: { products: [] as HttpTypes.StoreProduct[], count: 0 },
        nextPage: null,
      })),
    ])

  if (!region) notFound()

  const rootCategories = allCategories
    .filter((c) => !c.parent_category_id)
    .sort((a, b) => a.name.localeCompare(b.name, "ro"))

  // ── Sort ────────────────────────────────────────────────────────────────────
  const sorted = sortProducts(allProducts, sort)

  const priceSort =
    sortBy === "price_asc" || sortBy === "price_desc" ? sortBy : null

  const afterSort = priceSort
    ? [...sorted].sort((a, b) => {
        const ap =
          getProductPrice({ product: a }).cheapestPrice
            ?.calculated_price_number ?? 0
        const bp =
          getProductPrice({ product: b }).cheapestPrice
            ?.calculated_price_number ?? 0
        return priceSort === "price_asc" ? ap - bp : bp - ap
      })
    : sorted

  // ── Filter by brand ─────────────────────────────────────────────────────────
  const filtered =
    activeBrands.length > 0
      ? afterSort.filter((p) => {
          const b = p.metadata?.brand as string | undefined
          return b && activeBrands.includes(b)
        })
      : afterSort

  // ── Paginate ────────────────────────────────────────────────────────────────
  const totalCount = filtered.length
  const totalPages = Math.max(1, Math.ceil(totalCount / ITEMS_PER_PAGE))
  const safePage = Math.min(currentPage, totalPages)
  const offset = (safePage - 1) * ITEMS_PER_PAGE
  const pageProducts = filtered.slice(offset, offset + ITEMS_PER_PAGE)

  // ── Brand counts (from all products, unfiltered by brand) ───────────────────
  const brandCounts: Record<string, number> = {}
  for (const p of allProducts) {
    const b = p.metadata?.brand as string | undefined
    if (b) brandCounts[b] = (brandCounts[b] ?? 0) + 1
  }
  const availableBrands = Object.keys(brandCounts).sort()

  return (
    <div
      className="flex flex-col gap-y-8 small:gap-y-10 pt-6 pb-4 small:pt-8 content-container"
      data-testid="category-container"
    >
      <div>
        <nav aria-label="Breadcrumb" className="text-[13px] text-[#6E6E73] mb-4">
          <LocalizedClientLink href="/" className="hover:text-[#1D1D1F] hover:underline">Acasă</LocalizedClientLink>
          <span className="mx-1.5 text-gray-300">›</span>
          <span className="text-[#1D1D1F]">Toate produsele</span>
        </nav>
        <h1 className="display-2" data-testid="store-page-title">Toate produsele</h1>
        <p className="lead mt-3 max-w-[52ch]">
          Catalogul complet de materiale de construcții, instalații, finisaje și scule din depozitul nostru.
        </p>
      </div>

      <div className="flex flex-col small:flex-row small:items-start gap-x-12 pt-4">
        <aside className="small:sticky small:top-28 w-full small:w-[260px] shrink-0 bg-[#F5F5F7] rounded-[22px] p-5 mb-8 small:mb-0">
          <RefinementList
            sortBy={sort}
            categories={rootCategories}
            selectedCategoryIds={selectedIds}
            availableBrands={availableBrands}
            brandCounts={brandCounts}
          />
        </aside>

        <div className="w-full">
          {pageProducts.length > 0 ? (
            <>
              <ul
                className="grid grid-cols-2 w-full small:grid-cols-3 gap-2.5 sm:gap-4"
                data-testid="products-list"
              >
                {pageProducts.map((p) => (
                  <li key={p.id}>
                    <ProductPreview product={p} region={region} />
                  </li>
                ))}
              </ul>
              {totalPages > 1 && (
                <Pagination
                  data-testid="product-pagination"
                  page={safePage}
                  totalPages={totalPages}
                />
              )}
            </>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <svg
                className="w-12 h-12 text-gray-300 mb-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1}
                  d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <p className="text-[#1D1D1F] font-medium">Niciun produs găsit</p>
              <p className="text-sm text-[#6E6E73]">
                Încercați să modificați filtrele aplicate.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default StoreTemplate
