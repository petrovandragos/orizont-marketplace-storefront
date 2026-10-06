import { getCollectionByHandle } from "@lib/data/collections"
import { listProducts } from "@lib/data/products"
import { HttpTypes } from "@medusajs/types"
import ProductCard from "@modules/products/components/product-card"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

type PopularProductsProps = {
  region: HttpTypes.StoreRegion
}

const PopularProducts = async ({ region }: PopularProductsProps) => {
  const collection = await getCollectionByHandle("produse-populare").catch(() => null)

  const fetchProducts = (collectionId?: string) =>
    listProducts({
      regionId: region.id,
      queryParams: {
        limit: 8,
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

  return (
    <section className="content-container py-12 md:py-16">
      {/* Section heading */}
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl md:text-3xl font-bold text-[#1A1A1A]">
          Produse populare
        </h2>
        <LocalizedClientLink
          href="/store"
          className="hidden sm:flex items-center gap-x-1 text-sm font-medium text-[#F27A1A] hover:text-[#D4600E] transition-colors"
        >
          Vezi toate
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </LocalizedClientLink>
      </div>

      {/* Product grid */}
      {products.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} region={region} />
          ))}
        </div>
      ) : (
        /* Empty state */
        <div className="flex flex-col items-center justify-center py-16 gap-y-4 text-center">
          <div className="w-16 h-16 rounded-full bg-[#FFF3E6] flex items-center justify-center">
            <svg
              className="w-8 h-8 text-[#F27A1A]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
              />
            </svg>
          </div>
          <p className="text-lg font-semibold text-[#1A1A1A]">
            Produsele vor fi disponibile în curând
          </p>
          <p className="text-sm text-gray-500 max-w-sm">
            Momentan nu există produse în catalog. Reveniți în curând sau
            contactați-ne pentru mai multe informații.
          </p>
          <a
            href="/contact"
            className="mt-2 inline-flex items-center gap-x-2 px-5 py-2.5 rounded-full bg-[#F27A1A] text-white text-sm font-semibold hover:bg-[#D4600E] transition-colors"
          >
            Contactează-ne
          </a>
        </div>
      )}
    </section>
  )
}

export default PopularProducts
