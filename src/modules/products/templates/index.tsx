import { Suspense } from "react"
import { notFound } from "next/navigation"
import { HttpTypes } from "@medusajs/types"
import { productJsonLd } from "@lib/util/product-json-ld"
import ComplementaryProducts from "@modules/products/components/complementary-products"

import LocalizedClientLink from "@modules/common/components/localized-client-link"
import PdpBody from "@modules/products/components/pdp-body"

type ProductTemplateProps = {
  product: HttpTypes.StoreProduct
  region: HttpTypes.StoreRegion
  countryCode: string
}

const ProductTemplate = ({
  product,
  region,
  countryCode,
}: ProductTemplateProps) => {
  if (!product?.id) return notFound()

  // ── Breadcrumb category ─────────────────────────────────────────────────────
  const primaryCategory = product.categories?.[0] ?? null

  return (
    <div className="content-container pt-6 pb-4 md:pt-8">

      {/* ── Breadcrumbs ── */}
      <nav aria-label="Breadcrumb" className="mb-6">
        <ol className="flex flex-wrap items-center gap-x-1.5 gap-y-1 text-[13px] text-[#6E6E73]">
          <li>
            <LocalizedClientLink href="/" className="hover:text-[#1D1D1F] hover:underline transition-colors">
              Acasă
            </LocalizedClientLink>
          </li>

          {primaryCategory && (
            <li className="flex items-center gap-x-1.5">
              <svg className="w-3.5 h-3.5 text-gray-300 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
              <LocalizedClientLink
                href={`/categories/${primaryCategory.handle}`}
                className="hover:text-[#1D1D1F] hover:underline transition-colors"
              >
                {primaryCategory.name}
              </LocalizedClientLink>
            </li>
          )}

          <li className="flex items-center gap-x-1.5">
            <svg className="w-3.5 h-3.5 text-gray-300 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            <span className="font-medium text-[#1D1D1F] line-clamp-1" aria-current="page">
              {product.title}
            </span>
          </li>
        </ol>
      </nav>

      {/* ── Two-column layout + tabs (shares selected variant state) ── */}
      <PdpBody product={product} />

      {/* ── Ai nevoie și de (alese automat după categorie) ── */}
      <Suspense fallback={null}>
        <ComplementaryProducts product={product} region={region} />
      </Suspense>

      {/* ── Date structurate pentru Google ── */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd(product)).replace(/</g, "\\u003c") }}
      />
    </div>
  )
}

export default ProductTemplate
