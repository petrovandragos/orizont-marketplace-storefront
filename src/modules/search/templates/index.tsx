import { Suspense } from "react"
import RefinementList from "@modules/store/components/refinement-list"
import { SortOptions } from "@modules/store/components/refinement-list/sort-products"
import SkeletonProductGrid from "@modules/skeletons/templates/skeleton-product-grid"
import PaginatedProducts from "@modules/store/templates/paginated-products"

type Props = {
  query: string
  sortBy?: SortOptions
  page?: string
  countryCode: string
}

export default function SearchResultsTemplate({
  query,
  sortBy,
  page,
  countryCode,
}: Props) {
  const pageNumber = page ? parseInt(page) : 1
  const sort = sortBy || "created_at"

  return (
    <div className="flex flex-col small:flex-row small:items-start gap-x-10 pt-6 pb-4 small:pt-8 content-container">
      <aside className="w-full small:w-[240px] shrink-0 bg-[#F5F5F7] rounded-[22px] p-5 mb-8 small:mb-0 small:sticky small:top-28">
        <RefinementList sortBy={sort} />
      </aside>

      <div className="w-full">
        <div className="mb-6">
          <h1 className="display-2">
            Rezultate pentru „{query}”
          </h1>
        </div>

        <Suspense fallback={<SkeletonProductGrid />}>
          <PaginatedProducts
            sortBy={sort}
            page={pageNumber}
            countryCode={countryCode}
            search={query}
          />
        </Suspense>
      </div>
    </div>
  )
}
