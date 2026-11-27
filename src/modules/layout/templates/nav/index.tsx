import { listRegions } from "@lib/data/regions"
import { listCategories } from "@lib/data/categories"
import { unstable_noStore as noStore } from "next/cache"
import { StoreRegion } from "@medusajs/types"

import Image from "next/image"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import TopBar from "@modules/layout/components/top-bar"
import SearchBar from "@modules/layout/components/search-bar"
import CategoryNav from "@modules/layout/components/category-nav"
import HeaderCartButton from "@modules/layout/components/header-cart-button"
import QuoteListNav from "@modules/quote/components/quote-list-nav"
import NavAccountDropdown from "@modules/layout/components/nav-account-dropdown"
import SideMenu from "@modules/layout/components/side-menu"

export default async function Nav() {
  let regions: StoreRegion[] = []
  let categories: Awaited<ReturnType<typeof listCategories>> = []

  try {
    // A failed catalog read must not be frozen into the shared HTML cache
    // (an empty menu served for the whole revalidate window).
    ;[regions, categories] = await Promise.all([
      listRegions(),
      listCategories(),
    ])
  } catch {
    noStore()
  }

  return (
    <div>
      {/* ── Row 1: Top info bar — scrolls away, hidden on mobile ── */}
      <TopBar />

      {/* ── Rows 2 & 3: Sticky — main header + category nav ── */}
      <div className="sticky top-0 inset-x-0 z-50 border-b border-black/[0.08]">
        {/* Fundalul translucid stă într-un strat separat: backdrop-filter pe
            containerul însuși ar prinde meniul de pe telefon (position: fixed) în antet. */}
        <div aria-hidden="true" className="absolute inset-0 -z-10 bg-white/80 backdrop-blur-xl backdrop-saturate-150" />

        {/* ── Row 2: Main header ── */}
        <header className="relative z-10">
          <div className="content-container flex items-center gap-x-3 md:gap-x-6 h-16 md:h-[72px]">

            {/* Mobile: Hamburger — hidden on md+ */}
            <div className="flex md:hidden flex-shrink-0">
              <SideMenu
                regions={regions}
                locales={null}
                currentLocale={null}
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
                  className="h-9 md:h-11 w-auto object-contain"
                  priority
                  unoptimized
                />
            </LocalizedClientLink>

            {/* Search bar — hidden on mobile, shown on md+ */}
            <div className="hidden md:flex flex-1 min-w-0 max-w-[560px] mx-auto">
              <SearchBar />
            </div>

            {/* Right actions */}
            <div className="flex items-center gap-x-5 ml-auto md:ml-0 flex-shrink-0">
              {/* Cere ofertă — desktop (pe telefon e în meniu) */}
              <QuoteListNav />

              {/* Account dropdown — desktop only */}
              <NavAccountDropdown />

              {/* Cart dropdown — count loads from the private session, not the HTML cache */}
              <HeaderCartButton />
            </div>
          </div>

          {/* Mobile search bar — full-width row below the icon row */}
          <div className="flex md:hidden px-4 pb-2.5">
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
