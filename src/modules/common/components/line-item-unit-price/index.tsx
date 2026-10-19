import { convertToLocale } from "@lib/util/money"
import { HttpTypes } from "@medusajs/types"
import { clx } from "@medusajs/ui"

type LineItemUnitPriceProps = {
  item: HttpTypes.StoreCartLineItem | HttpTypes.StoreOrderLineItem
  style?: "default" | "tight"
  currencyCode: string
}

const LineItemUnitPrice = ({
  item,
  style = "default",
  currencyCode,
}: LineItemUnitPriceProps) => {
  const total = item.total ?? 0
  const original_total = item.original_total ?? 0
  const hasReducedPrice = total < original_total

  const percentage_diff = original_total > 0
    ? Math.round(((original_total - total) / original_total) * 100)
    : 0

  return (
    <div className="flex flex-col text-gray-500 justify-center h-full">
      {hasReducedPrice && (
        <>
          <p className="text-xs">
            {style === "default" && (
              <span className="text-gray-400">Original: </span>
            )}
            <span className="line-through text-gray-400" data-testid="product-unit-original-price">
              {convertToLocale({
                amount: original_total / item.quantity,
                currency_code: currencyCode,
              })}
            </span>
          </p>
          {style === "default" && (
            <span className="text-[#F27A1A] text-xs font-medium">-{percentage_diff}%</span>
          )}
        </>
      )}
      <span
        className={clx("text-sm font-medium text-[#1D1D1F]", {
          "text-[#F27A1A]": hasReducedPrice,
        })}
        data-testid="product-unit-price"
      >
        {convertToLocale({
          amount: total / item.quantity,
          currency_code: currencyCode,
        })}
      </span>
    </div>
  )
}

export default LineItemUnitPrice
