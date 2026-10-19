import { HttpTypes } from "@medusajs/types"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

type ProductInfoProps = {
  product: HttpTypes.StoreProduct
}

const ProductInfo = ({ product }: ProductInfoProps) => {
  return (
    <div id="product-info">
      <div className="flex flex-col gap-y-4 lg:max-w-[500px] mx-auto">
        {product.collection && (
          <LocalizedClientLink
            href={`/collections/${product.collection.handle}`}
            className="text-sm text-[#F27A1A] hover:text-[#D4600E] transition-colors duration-200"
          >
            {product.collection.title}
          </LocalizedClientLink>
        )}
        <h2
          className="text-2xl font-semibold text-[#1D1D1F] leading-snug"
          data-testid="product-title"
        >
          {product.title}
        </h2>

        <p
          className="text-sm text-gray-500 leading-relaxed whitespace-pre-line"
          data-testid="product-description"
        >
          {product.description}
        </p>
      </div>
    </div>
  )
}

export default ProductInfo
