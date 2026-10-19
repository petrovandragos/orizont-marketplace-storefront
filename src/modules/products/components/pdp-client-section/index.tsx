"use client"

import { useMemo } from "react"
import { HttpTypes } from "@medusajs/types"
import PdpGallery from "@modules/products/components/pdp-gallery"
import PdpActions from "@modules/products/components/pdp-actions"

type Props = {
  product: HttpTypes.StoreProduct
  selectedVariant: HttpTypes.StoreProductVariant | undefined
  onVariantChange: (variant: HttpTypes.StoreProductVariant | undefined) => void
}

const PdpClientSection = ({ product, selectedVariant, onVariantChange }: Props) => {
  const brand = product.metadata?.brand as string | undefined
  const sku = (product as any).variants?.[0]?.sku as string | undefined

  const displayImages = useMemo(() => {
    const v = selectedVariant as any
    const metaImages: { url: string }[] | undefined = v?.metadata?.images
    if (metaImages?.length) {
      return metaImages.map((img, idx) => ({ id: `variant-img-${idx}`, url: img.url }))
    }
    return product.images ?? []
  }, [selectedVariant, product.images])

  return (
    <div className="flex flex-col md:flex-row md:gap-x-10 lg:gap-x-16 gap-y-8 md:items-start">

      {/* LEFT — Image gallery (50%) */}
      <div className="w-full md:w-[55%] md:sticky md:top-28">
        <PdpGallery
          key={selectedVariant?.id ?? "default"}
          images={displayImages}
          title={product.title ?? "Produs"}
        />
      </div>

      {/* RIGHT — Product info (50%) */}
      <div className="w-full md:w-[45%] flex flex-col gap-y-4 md:pt-4">

        {/* Brand */}
        {brand && (
          <span className="text-[15px] text-[#B9520A]">
            {brand}
          </span>
        )}

        {/* Name */}
        <h1 className="text-[30px] sm:text-[40px] font-semibold tracking-[-0.03em] text-[#1D1D1F] leading-[1.08]">
          {product.title}
        </h1>

        {/* SKU */}
        {sku && (
          <p className="text-[13px] text-[#6E6E73]">
            Cod produs: <span className="text-[#424245]">{sku}</span>
          </p>
        )}

        {/* Divider */}
        <div className="border-t border-[#D2D2D7]/70" />

        {/* Actions: price, stock, quantity, add-to-cart, quote form */}
        <PdpActions product={product} onVariantChange={onVariantChange} />
      </div>
    </div>
  )
}

export default PdpClientSection
