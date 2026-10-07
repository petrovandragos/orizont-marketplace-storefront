import { Suspense } from "react"

import { listRegions } from "@lib/data/regions"
import { listLocales } from "@lib/data/locales"
import { getLocale } from "@lib/data/locale-actions"
import { retrieveCustomer } from "@lib/data/customer"
import { listCategories } from "@lib/data/categories"
import { StoreRegion } from "@medusajs/types"

import Image from "next/image"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import TopBar from "@modules/layout/components/top-bar"
import SearchBar from "@modules/layout/components/search-bar"
import CategoryNav from "@modules/layout/components/category-nav"
import HeaderCartButton from "@modules/layout/components/header-cart-button"
import NavAccountDropdown from "@modules/layout/components/nav-account-dropdown"
import SideMenu from "@modules/layout/components/side-menu"

export default async function Nav() {
  const [regions, locales, currentLocale, customer, categories] = await Promise.all([
    listRegions().then((r: StoreRegion[]) => r),
    listLocales(),
    getLocale(),
    retrieveCustomer().catch(() => null),
    listCategories().catch(() => []),
  ])

  return (
    <div>
      {/* ── Row 1: Top info bar — scrolls away, hidden on mobile ── */}
      <TopBar />

      {/* ── Rows 2 & 3: Sticky — main header + category nav ── */}
      <div className="sticky top-0 inset-x-0 z-50 shadow-sm">

        {/* ── Row 2: Main header ── */}
        <header className="bg-white border-b border-gray-100 relative z-10">
          <div className="content-container flex items-center gap-x-3 md:gap-x-5 h-16">

            {/* Mobile: Hamburger — hidden on md+ */}
            <div className="flex md:hidden flex-shrink-0">
              <SideMenu
                regions={regions}
                locales={locales}
                currentLocale={currentLocale}
                categories={categories}
              />
            </div>

            {/* Logo */}
            <LocalizedClientLink
              href="/"
              className="flex-shrink-0"
              data-testid="nav-store-link"
            >
                <Image
                  src="/logo.png"
                  alt="Orizont Logo"
                  width={211}
                  height={55}
                  className="h-8 md:h-10 w-auto object-contain"
                  priority
                  unoptimized
                />
            </LocalizedClientLink>

            {/* Search bar — hidden on mobile, shown on md+ */}
            <div className="hidden md:flex flex-1 min-w-0">
              <SearchBar />
            </div>

            {/* Right actions */}
            <div className="flex items-center gap-x-4 ml-auto flex-shrink-0">
              {/* Cere ofertă — desktop (pe telefon e în meniu) */}
              <LocalizedClientLink
                href="/cerere-oferta"
                className="hidden md:inline-flex items-center gap-x-2 h-10 px-4 rounded-full bg-[#F27A1A] hover:bg-[#D4600E] text-white text-sm font-semibold transition-colors whitespace-nowrap"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Cere ofertă
              </LocalizedClientLink>

              {/* Account dropdown — desktop only */}
              <NavAccountDropdown customer={customer} />

              {/* Cart dropdown — always visible */}
              <Suspense
                fallback={
                  <div className="relative flex items-center text-[#333333]">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75}
                        d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                      />
                    </svg>
                  </div>
                }
              >
                <HeaderCartButton />
              </Suspense>
            </div>
          </div>

          {/* Mobile search bar — full-width row below the icon row */}
          <div className="flex md:hidden px-4 pb-3">
            <div className="w-full">
              <SearchBar />
            </div>
          </div>
        </header>

        {/* ── Row 3: Category navigation (with mega-menu) — desktop only ── */}
        <div className="hidden md:block">
          <CategoryNav categories={categories} />
        </div>
      </div>
    </div>
  )
}
