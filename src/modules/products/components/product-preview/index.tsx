import { HttpTypes } from "@medusajs/types"
import ProductCard from "@modules/products/components/product-card"

/**
 * Cardul de produs din magazin și căutare. Folosește același card ca pagina
 * principală și categoriile, ca produsele să arate la fel peste tot.
 */
export default async function ProductPreview({
  product,
  region,
}: {
  product: HttpTypes.StoreProduct
  isFeatured?: boolean
  region: HttpTypes.StoreRegion
}) {
  return <ProductCard product={product} region={region} />
}
