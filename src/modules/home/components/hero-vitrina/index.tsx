import Image from "next/image"
import { HttpTypes } from "@medusajs/types"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import Chevron from "@modules/common/components/open-status/chevron"
import { CATEGORY_ASSETS } from "@lib/content/categories"

/** Primul ecran: titlul mare și primele trei categorii, în fotografii mari. */
export default function HeroVitrina({ categories }: { categories: HttpTypes.StoreProductCategory[] }) {
  const top = categories
    .filter((c) => !c.parent_category_id && CATEGORY_ASSETS[c.handle!])
    .sort((a, b) => (a.rank ?? 0) - (b.rank ?? 0))
    .slice(0, 3)

  return (
    <section className="content-container text-center pt-14 md:pt-20 pb-4">
      <h1 className="display-1 max-w-[15ch] mx-auto">Tot ce trebuie pentru casa dumneavoastră.</h1>
      <p className="lead max-w-[40ch] mx-auto mt-5">
        Materiale de construcții din depozitul nostru din Sighetu Marmației, livrate direct pe șantier.
      </p>
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-7 mt-8">
        <LocalizedClientLink href="/cerere-oferta" className="btn-pill">Cereți o ofertă</LocalizedClientLink>
        <LocalizedClientLink href="/store" className="link-more text-[17px]">Vedeți toate produsele <Chevron /></LocalizedClientLink>
      </div>

      {top.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-7 md:gap-3.5 mt-12 md:mt-14 text-left">
          {top.map((c, i) => {
            const a = CATEGORY_ASSETS[c.handle!]
            return (
              <LocalizedClientLink key={c.id} href={`/categories/${c.handle}`} className="group block">
                <div className="relative overflow-hidden rounded-[26px] bg-[#F5F5F7] aspect-[5/4] md:aspect-[4/5]">
                  <Image src={a.image} alt={c.name} fill priority={i === 0} sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]" />
                </div>
                <div className="px-1.5 pt-4">
                  <h2 className="text-[19px] font-semibold tracking-[-0.015em] text-[#1D1D1F]">{c.name}</h2>
                  <p className="text-[15px] text-[#6E6E73] mt-0.5">{a.short}</p>
                </div>
              </LocalizedClientLink>
            )
          })}
        </div>
      )}
    </section>
  )
}
