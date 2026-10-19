import Image from "next/image"
import { HttpTypes } from "@medusajs/types"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

// Design assets for each top-level category.
// Only image + color live here — everything else (name, subcategories) comes from the backend.
// Add an entry here when a new top-level category is created in admin.
const CATEGORY_ASSETS: Record<string, { image: string; color: string }> = {
  "materiale-de-constructii":  { image: "/categorii/Materiale-construcții.jpg",  color: "#E65100" },
  "acoperisuri-si-sisteme":    { image: "/categorii/acoperisuri-si-sisteme-pluviale.jpg",     color: "#4527A0" },
  "finisaje":                  { image: "/categorii/Finisaje.jpg",                color: "#00838F" },
  "instalatii-sanitare":       { image: "/categorii/Instalații-sanitare.jpg",     color: "#1565C0" },
  "instalatii-electrice":      { image: "/categorii/Instalații-electrice.jpg",    color: "#F57F17" },
  "amenajari-exterioare":          { image: "/categorii/curte-gradina.jpeg",          color: "#2E7D32" },
  "scule-si-echipamente":      { image: "/categorii/Scule-echipamente.jpg",       color: "#37474F" },
}

const FALLBACK_IMAGE = "/categorii/placeholder.jpg"
const FALLBACK_COLOR = "#9E9E9E"

type Props = {
  categories: HttpTypes.StoreProductCategory[]
}

const CategoriesSection = ({ categories }: Props) => {
  const topLevel = categories
    .filter((c) => !c.parent_category_id)
    .sort((a, b) => (a.rank ?? 0) - (b.rank ?? 0))

  return (
    <section className="content-container py-12 md:py-16">
      {/* Section heading */}
      <div className="mb-8">
        <h2 className="text-2xl md:text-3xl font-bold text-[#1D1D1F]">
          Categorii de produse
        </h2>
      </div>

      {/* Category grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-4">
        {topLevel.map((cat) => {
          const assets = CATEGORY_ASSETS[cat.handle!] ?? {
            image: FALLBACK_IMAGE,
            color: FALLBACK_COLOR,
          }

          return (
            <LocalizedClientLink
              key={cat.id}
              href={`/categories/${cat.handle}`}
              className="
                group flex flex-col items-center text-center
                bg-white rounded-xl p-5 md:p-6
                border border-gray-100
                shadow-sm hover:shadow-md
                transition-all duration-300 hover:-translate-y-1
              "
            >
              {/* Image container */}
              <div
                className="
                  relative w-20 h-20 md:w-24 md:h-24
                  rounded-2xl overflow-hidden mb-4
                  border-2 border-transparent
                  transition-all duration-300
                  group-hover:scale-105 group-hover:shadow-md
                "
                style={{ borderColor: assets.color + "33" }}
              >
                <Image
                  src={assets.image}
                  alt={cat.name}
                  fill
                  sizes="(max-width: 768px) 80px, 96px"
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                />
              </div>

              {/* Category name */}
              <span className="text-sm md:text-base font-bold text-[#1D1D1F] leading-snug group-hover:text-[#F27A1A] transition-colors duration-150">
                {cat.name}
              </span>
            </LocalizedClientLink>
          )
        })}
      </div>
    </section>
  )
}

export default CategoriesSection
