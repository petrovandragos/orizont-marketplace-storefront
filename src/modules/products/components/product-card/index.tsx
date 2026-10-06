import Image from "next/image"
import { HttpTypes } from "@medusajs/types"

import LocalizedClientLink from "@modules/common/components/localized-client-link"
import PriceDisplay from "@modules/common/components/price-display"
import StockBadge, { getVariantQuantity } from "@modules/products/components/stock-badge"
import AddToCartButton from "@modules/products/components/add-to-cart-button"
import { getProductPrice } from "@lib/util/get-product-price"
import { getPricingUnit } from "@lib/util/format-price"

type ProductCardProps = {
  product: HttpTypes.StoreProduct
  region: HttpTypes.StoreRegion
}

const ProductCard = ({ product, region }: ProductCardProps) => {
  const { cheapestPrice } = getProductPrice({ product })

  // First variant drives stock + direct add-to-cart
  const firstVariant = product.variants?.[0] as
    | (HttpTypes.StoreProductVariant & { inventory_quantity?: number })
    | undefined

  // Single variant → direct add. Multiple → link to PDP to choose.
  const directVariantId =
    (product.variants?.length ?? 0) === 1 ? (firstVariant?.id ?? null) : null

  const quantity = getVariantQuantity(firstVariant)
  const isOutOfStock = quantity === 0

  const pricingUnit = getPricingUnit(product.metadata)
  const amount = cheapestPrice?.calculated_price_number ?? null
  const compareAt = cheapestPrice?.original_price_number ?? null
  const isSale = compareAt != null && compareAt > 0 && compareAt > (amount ?? 0)

  const brand = (product.metadata?.brand as string | undefined) ?? null

  return (
    <article className="group flex flex-col bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden">

      {/* ── Image ── */}
      <LocalizedClientLink
        href={`/products/${product.handle}`}
        className="relative block aspect-square bg-gray-50 overflow-hidden"
        tabIndex={-1}
        aria-hidden="true"
      >
        {product.thumbnail ? (
          <Image
            src={product.thumbnail}
            alt={product.title ?? "Produs"}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-cover object-center group-hover:scale-105 transition-transform duration-300"
            quality={75}
          />
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-y-2 text-gray-300">
            <svg className="w-14 h-14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <span className="text-xs text-gray-400">Fără imagine</span>
          </div>
        )}

        {/* Out-of-stock overlay */}
        {isOutOfStock && (
          <div className="absolute inset-0 bg-white/60 flex items-center justify-center">
            <span className="bg-white text-[#D32F2F] text-xs font-semibold px-3 py-1 rounded-full border border-[#D32F2F]/30 shadow-sm">
              Stoc epuizat
            </span>
          </div>
        )}

        {/* Sale badge */}
        {isSale && !isOutOfStock && (
          <span className="absolute top-2 left-2 bg-[#F27A1A] text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
            REDUCERE
          </span>
        )}
      </LocalizedClientLink>

      {/* ── Content ── */}
      <div className="flex flex-col flex-1 p-4 gap-y-2">
        {/* Brand */}
        {brand && (
          <span className="text-xs text-gray-400 font-medium uppercase tracking-wide truncate">
            {brand}
          </span>
        )}

        {/* Name */}
        <LocalizedClientLink href={`/products/${product.handle}`}>
          <h3 className="text-sm font-semibold text-[#1A1A1A] leading-snug line-clamp-2 group-hover:text-[#F27A1A] transition-colors duration-150 min-h-[2.5rem]">
            {product.title}
          </h3>
        </LocalizedClientLink>

        {/* Stock */}
        <StockBadge quantity={quantity} />

        {amount != null ? (
          <>
            <div className="mt-auto pt-2">
              <PriceDisplay
                amount={amount}
                unit={pricingUnit}
                compareAtPrice={isSale ? compareAt : null}
              />
            </div>
            <div className="pt-1">
              <AddToCartButton
                variantId={directVariantId}
                disabled={isOutOfStock}
                productHandle={product.handle ?? ""}
                productTitle={product.title ?? ""}
                productThumbnail={product.thumbnail ?? null}
                productPrice={amount}
              />
            </div>
          </>
        ) : (
          <>
            <div className="mt-auto pt-2">
              <span className="text-xs font-semibold uppercase tracking-wide text-[#F27A1A]">Preț la cerere</span>
            </div>
            <div className="pt-1">
              <LocalizedClientLink
                href={`/products/${product.handle}?oferta=1#cere-oferta`}
                className="w-full flex items-center justify-center px-4 py-2.5 rounded-lg text-sm font-semibold border-2 border-[#F27A1A] text-[#F27A1A] hover:bg-[#F27A1A] hover:text-white transition-colors duration-150"
              >
                Cere Ofertă
              </LocalizedClientLink>
            </div>
          </>
        )}
      </div>
    </article>
  )
}

export default ProductCard
