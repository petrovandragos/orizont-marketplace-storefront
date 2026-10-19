import Image from "next/image"
import { HttpTypes } from "@medusajs/types"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import Chevron from "@modules/common/components/open-status/chevron"
import { CATEGORY_ASSETS } from "@lib/content/categories"

/** Celelalte categorii principale (după primele trei din hero), câte două pe rând. */
export default function CategoryTiles({ categories }: { categories: HttpTypes.StoreProductCategory[] }) {
  const rest = categories
    .filter((c) => !c.parent_category_id)
    .sort((a, b) => (a.rank ?? 0) - (b.rank ?? 0))
    .filter((c) => CATEGORY_ASSETS[c.handle!])
    .slice(3)
  if (!rest.length) return null

  return (
    <section className="content-container mt-20 md:mt-28">
      <h2 className="display-2 max-w-[20ch] mb-10">Și pentru instalații, curte și atelier.</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
        {rest.map((c) => {
          const a = CATEGORY_ASSETS[c.handle!]
          return (
            <LocalizedClientLink key={c.id} href={`/categories/${c.handle}`}
              className="group bg-[#F5F5F7] rounded-[26px] overflow-hidden flex flex-col md:aspect-[1/1.1]">
              <div className="text-center px-6 pt-10 md:pt-12 pb-7">
                <h3 className="text-[26px] md:text-[36px] font-semibold tracking-[-0.03em] leading-tight">{c.name}</h3>
                <p className="text-[17px] text-[#6E6E73] mt-1.5">{a.sub}</p>
                <span className="link-more mt-2.5 text-[17px]">Vedeți produsele <Chevron /></span>
              </div>
              <div className="relative mx-4 mb-4 md:mx-[18px] md:mb-[18px] rounded-[18px] overflow-hidden aspect-[4/3] md:aspect-auto md:flex-1">
                <Image src={a.image} alt="" fill sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]" />
              </div>
            </LocalizedClientLink>
          )
        })}
      </div>
    </section>
  )
}
