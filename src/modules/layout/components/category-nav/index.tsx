"use client"

import { useState, useRef } from "react"
import { usePathname } from "next/navigation"
import { HttpTypes } from "@medusajs/types"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { CalculatorGlyph } from "@modules/calculators/components/icons"

type Props = {
  categories: HttpTypes.StoreProductCategory[]
}

export default function CategoryNav({ categories }: Props) {
  // Only top-level categories (no parent), preserving backend order
  const topLevel = categories
    .filter((c) => !c.parent_category_id)
    .sort((a, b) => (a.rank ?? 0) - (b.rank ?? 0))

  const pathname = usePathname()
  const [activeSlug, setActiveSlug] = useState<string | null>(null)
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  // The ONLY place we schedule a close is on the outer wrapper's mouseLeave.
  // This means moving from a tab into the dropdown panel never triggers a close.
  const scheduleClose = () => {
    closeTimer.current = setTimeout(() => setActiveSlug(null), 150)
  }

  const cancelClose = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current)
  }

  const handleTabEnter = (slug: string) => {
    cancelClose()
    setActiveSlug(slug)
  }

  const activeCategory = topLevel.find((c) => c.handle === activeSlug) ?? null

  return (
    // Outer wrapper: mouseLeave here is the ONLY close trigger
    <div
      className="relative"
      onMouseLeave={scheduleClose}
    >
      {/* ── Tab bar ── */}
      <nav aria-label="Categorii produse">
        <div className="content-container">
          <ul className="flex items-center overflow-x-auto no-scrollbar -mx-2.5">
            {topLevel.map((cat) => {
              const isActive = pathname.includes(`/categories/${cat.handle}`)
              const isOpen   = activeSlug === cat.handle

              return (
                <li key={cat.id} className="flex-shrink-0">
                  {/* onMouseEnter only — no onMouseLeave on individual tabs */}
                  <div onMouseEnter={() => handleTabEnter(cat.handle!)}>
                    <LocalizedClientLink
                      href={`/categories/${cat.handle}`}
                      className={`flex items-center gap-x-1 px-2.5 h-10 text-[13px] whitespace-nowrap border-b-2 transition-colors duration-150 ${
                        isActive
                          ? "border-[#F27A1A] text-[#1D1D1F] font-medium"
                          : isOpen
                            ? "border-transparent text-[#1D1D1F]"
                            : "border-transparent text-[#424245] hover:text-[#1D1D1F]"
                      }`}
                    >
                      {cat.name}
                      {(cat.category_children?.length ?? 0) > 0 && (
                        <svg
                          className={`w-2.5 h-2.5 opacity-60 flex-shrink-0 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
                          fill="none" stroke="currentColor" viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                        </svg>
                      )}
                    </LocalizedClientLink>
                  </div>
                </li>
              )
            })}
            <li className="flex-shrink-0 ml-auto pl-3 pr-2.5" onMouseEnter={() => setActiveSlug(null)}>
              <LocalizedClientLink
                href="/calculatoare"
                className={`flex items-center gap-1.5 rounded-full px-3 h-7 text-[13px] font-medium whitespace-nowrap transition-colors ${
                  pathname.includes("/calculatoare")
                    ? "bg-[#F27A1A] text-white"
                    : "bg-[#FFF3E6] text-[#B9520A] hover:bg-[#F27A1A] hover:text-white"
                }`}
              >
                <CalculatorGlyph className="w-3.5 h-3.5" />
                Calculatoare
              </LocalizedClientLink>
            </li>
          </ul>
        </div>
      </nav>

      {/* ── Mega-menu panel ── */}
      <div
        className={`absolute left-0 right-0 z-40 transition-all duration-200 origin-top ${
          activeCategory
            ? "opacity-100 translate-y-0 pointer-events-auto"
            : "opacity-0 -translate-y-1 pointer-events-none"
        }`}
      >
        {/* Keeps the panel "hot" even while animating out so mouse can re-enter */}
        <div className="bg-white border-b border-black/[0.08] shadow-[0_24px_48px_-24px_rgba(0,0,0,0.18)]">
          {activeCategory && (
            <div className="content-container pt-8 pb-10">
              <div className="flex gap-x-10">

                {/* Left: category header */}
                <div className="w-64 flex-shrink-0 flex flex-col gap-y-2">
                  <LocalizedClientLink
                    href={`/categories/${activeCategory.handle}`}
                    onClick={() => setActiveSlug(null)}
                    className="group flex items-center justify-between"
                  >
                    <span className="text-2xl font-semibold tracking-[-0.02em] text-[#1D1D1F] group-hover:text-[#B9520A] transition-colors">
                      {activeCategory.name}
                    </span>
                    <svg className="w-4 h-4 text-[#F27A1A] opacity-0 group-hover:opacity-100 -translate-x-1 group-hover:translate-x-0 transition-all duration-150" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </LocalizedClientLink>
                  {activeCategory.description && (
                    <p className="text-xs text-gray-400 leading-relaxed">
                      {activeCategory.description}
                    </p>
                  )}
                  <div className="mt-auto pt-4">
                    <LocalizedClientLink
                      href={`/categories/${activeCategory.handle}`}
                      onClick={() => setActiveSlug(null)}
                      className="inline-flex items-center gap-x-1 text-sm text-[#B9520A] hover:underline"
                    >
                      Vedeți toate produsele
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                      </svg>
                    </LocalizedClientLink>
                  </div>
                </div>

                {/* Divider */}
                <div className="w-px bg-black/[0.06] self-stretch" />

                {/* Right: subcategory grid */}
                <div className="flex-1 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-1">
                  {(activeCategory.category_children ?? [])
                    .sort((a, b) => (a.rank ?? 0) - (b.rank ?? 0))
                    .map((sub) => (
                      <LocalizedClientLink
                        key={sub.id}
                        href={`/categories/${sub.handle}`}
                        onClick={() => setActiveSlug(null)}
                        className="group flex items-center py-1.5"
                      >
                                                <span className="text-[15px] text-[#424245] group-hover:text-[#1D1D1F] group-hover:underline transition-colors">
                          {sub.name}
                        </span>
                      </LocalizedClientLink>
                    ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

    </div>
  )
}
