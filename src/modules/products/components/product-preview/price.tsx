import { clx } from "@medusajs/ui"
import { VariantPrice } from "types/global"

export default async function PreviewPrice({ price }: { price: VariantPrice }) {
  if (!price) {
    return null
  }

  return (
    <>
      {price.price_type === "sale" && (
        <span
          className="line-through text-gray-400 text-xs"
          data-testid="original-price"
        >
          {price.original_price}
        </span>
      )}
      <span
        className={clx("text-sm font-semibold text-[#1D1D1F]", {
          "text-[#F27A1A]": price.price_type === "sale",
        })}
        data-testid="price"
      >
        {price.calculated_price}
      </span>
    </>
  )
}
