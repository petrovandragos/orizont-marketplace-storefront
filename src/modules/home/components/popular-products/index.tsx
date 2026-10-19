import { getCollectionByHandle } from "@lib/data/collections"
import { listProducts } from "@lib/data/products"
import { HttpTypes } from "@medusajs/types"
import ProductCard from "@modules/products/components/product-card"
import ProductRail from "@modules/home/components/product-rail"

type PopularProductsProps = {
  region: HttpTypes.StoreRegion
}

const PopularProducts = async ({ region }: PopularProductsProps) => {
  const collection = await getCollectionByHandle("produse-populare").catch(() => null)

  const fetchProducts = (collectionId?: string) =>
    listProducts({
      regionId: region.id,
      queryParams: {
        limit: 10,
        fields:
          "*variants.calculated_price,+variants.inventory_quantity,+metadata",
        ...(collectionId ? { collection_id: collectionId } : {}),
        // fără colecție: cele mai noi produse
        ...(!collectionId ? { order: "-created_at" } : {}),
      },
    })
      .then(({ response }) => response.products)
      .catch(() => [] as HttpTypes.StoreProduct[])

  // Produsele din colecția „produse-populare” (se aleg din admin). Dacă
  // colecția lipsește sau e goală, arătăm cele mai noi produse, ca secțiunea
  // să nu rămână niciodată goală.
  let products = collection ? await fetchProducts(collection.id) : []
  if (products.length === 0) {
    products = await fetchProducts()
  }

  if (products.length === 0) return null

  return (
    <ProductRail title="Cele mai cerute.">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} region={region} />
      ))}
    </ProductRail>
  )
}

export default PopularProducts
