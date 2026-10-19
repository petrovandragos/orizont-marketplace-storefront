import { clx } from "@medusajs/ui"

import { getProductPrice } from "@lib/util/get-product-price"
import { HttpTypes } from "@medusajs/types"

export default function ProductPrice({
  product,
  variant,
}: {
  product: HttpTypes.StoreProduct
  variant?: HttpTypes.StoreProductVariant
}) {
  const { cheapestPrice, variantPrice } = getProductPrice({
    product,
    variantId: variant?.id,
  })

  const selectedPrice = variant ? variantPrice : cheapestPrice

  if (!selectedPrice) {
    return <div className="block w-32 h-9 bg-gray-100 rounded-lg animate-pulse" />
  }

  return (
    <div className="flex flex-col text-[#1D1D1F]">
      <span
        className={clx("text-2xl font-semibold", {
          "text-[#F27A1A]": selectedPrice.price_type === "sale",
        })}
      >
        {!variant && <span className="text-sm text-gray-400 font-normal mr-1">De la</span>}
        <span
          data-testid="product-price"
          data-value={selectedPrice.calculated_price_number}
        >
          {selectedPrice.calculated_price}
        </span>
      </span>
      {selectedPrice.price_type === "sale" && (
        <div className="flex items-center gap-x-2 mt-1">
          <span className="text-sm text-gray-400 line-through" data-testid="original-product-price" data-value={selectedPrice.original_price_number}>
            {selectedPrice.original_price}
          </span>
          <span className="text-xs font-medium text-[#F27A1A] bg-orange-50 px-2 py-0.5 rounded-full">
            -{selectedPrice.percentage_diff}%
          </span>
        </div>
      )}
    </div>
  )
}
