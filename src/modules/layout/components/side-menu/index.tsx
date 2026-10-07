"use client"

import { Popover, PopoverPanel, Transition } from "@headlessui/react"
import { XMark } from "@medusajs/icons"
import { useToggleState } from "@medusajs/ui"
import { Fragment, useState, type FormEvent } from "react"
import { usePathname } from "next/navigation"
import { useRouter, useParams } from "next/navigation"

import Image from "next/image"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import CountrySelect from "../country-select"
import LanguageSelect from "../language-select"
import { HttpTypes } from "@medusajs/types"
import { Locale } from "@lib/data/locales"

const NAV_LINKS = [
  { label: "Acasă", href: "/" },
  { label: "Toate produsele", href: "/store" },
  { label: "Cere ofertă", href: "/cerere-oferta" },
  { label: "Contul meu", href: "/cont" },
  { label: "Coș", href: "/cart" },
]

type SideMenuProps = {
  regions: HttpTypes.StoreRegion[] | null
  locales: Locale[] | null
  currentLocale: string | null
  categories: HttpTypes.StoreProductCategory[]
}

const SideMenu = ({ regions, locales, currentLocale, categories }: SideMenuProps) => {
  const topLevelCategories = categories
    .filter((c) => !c.parent_category_id)
    .sort((a, b) => (a.rank ?? 0) - (b.rank ?? 0))
  const countryToggleState = useToggleState()
  const languageToggleState = useToggleState()
  const [searchQuery, setSearchQuery] = useState("")
  const [expandedSlug, setExpandedSlug] = useState<string | null>(null)
  const router = useRouter()
  const { countryCode } = useParams() as { countryCode: string }
  const pathname = usePathname()

  const handleSearch = (e: FormEvent<HTMLFormElement>, close: () => void) => {
    e.preventDefault()
    const trimmed = searchQuery.trim()
    if (trimmed) {
      close()
      router.push(`/cautare?q=${encodeURIComponent(trimmed)}`)
    }
  }

  return (
    <div className="h-full">
      <div className="flex items-center h-full">
        <Popover className="h-full flex">
          {({ open, close }) => (
            <>
              <div className="relative flex h-full">
                <Popover.Button
                  data-testid="nav-menu-button"
                  className="relative h-full flex items-center px-1 transition-all ease-out duration-200 focus:outline-none text-[#333333] hover:text-[#F27A1A]"
                  aria-label="Deschide meniu"
                >
                  {/* Hamburger icon */}
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  </svg>
                </Popover.Button>
              </div>

              {open && (
                <div
                  className="fixed inset-0 z-[50] bg-black/40 pointer-events-auto"
                  onClick={close}
                  data-testid="side-menu-backdrop"
                />
              )}

              <Transition
                show={open}
                as={Fragment}
                enter="transition ease-out duration-200"
                enterFrom="-translate-x-full opacity-0"
                enterTo="translate-x-0 opacity-100"
                leave="transition ease-in duration-150"
                leaveFrom="translate-x-0 opacity-100"
                leaveTo="-translate-x-full opacity-0"
              >
                <PopoverPanel className="fixed top-0 left-0 h-full w-[85vw] max-w-sm z-[51] flex flex-col bg-white shadow-2xl overflow-y-auto">
                  {/* Header */}
                  <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
                    <LocalizedClientLink
                      href="/"
                      onClick={close}
                      className="inline-block"
                    >
                      <Image
                        src="/logo.png"
                        alt="Orizont Logo"
                        width={211}
                        height={55}
                        className="h-8 w-auto object-contain"
                        unoptimized
                      />
                    </LocalizedClientLink>
                    <button
                      data-testid="close-menu-button"
                      onClick={close}
                      className="p-1 text-gray-500 hover:text-[#F27A1A] transition-colors"
                      aria-label="Închide meniu"
                    >
                      <XMark className="w-5 h-5" />
                    </button>
                  </div>

                  {/* Search */}
                  <div className="px-5 py-4 border-b border-gray-100">
                    <form onSubmit={(e) => handleSearch(e, close)}>
                      <div className="relative">
                        <input
                          type="search"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          placeholder="Caută produse..."
                          className="w-full h-10 pl-4 pr-10 rounded-full border border-gray-300 bg-[#F5F5F5] text-sm focus:outline-none focus:ring-2 focus:ring-[#F27A1A] focus:border-transparent"
                        />
                        <button
                          type="submit"
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#F27A1A]"
                          aria-label="Caută"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                          </svg>
                        </button>
                      </div>
                    </form>
                  </div>

                  {/* Main navigation links */}
                  <div className="px-5 py-4 border-b border-gray-100">
                    <ul className="flex flex-col gap-y-1">
                      {NAV_LINKS.map(({ label, href }) => (
                        <li key={href}>
                          <LocalizedClientLink
                            href={href}
                            onClick={close}
                            className="flex items-center h-10 text-base font-medium text-[#333333] hover:text-[#F27A1A] transition-colors"
                          >
                            {label}
                          </LocalizedClientLink>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Categories */}
                  <div className="px-5 py-4 flex-1">
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
                      Categorii
                    </p>
                    <ul className="flex flex-col">
                      {topLevelCategories.map((cat) => {
                        const isExpanded = expandedSlug === cat.id
                        const isActive = pathname.includes(`/categories/${cat.handle}`)
                        const children = (cat.category_children ?? [])
                          .sort((a, b) => (a.rank ?? 0) - (b.rank ?? 0))
                        return (
                          <li key={cat.id}>
                            {/* Parent row */}
                            <div className="flex items-center justify-between">
                              <LocalizedClientLink
                                href={`/categories/${cat.handle}`}
                                onClick={close}
                                className={`flex-1 flex items-center h-10 text-sm font-medium transition-colors ${
                                  isActive ? "text-[#F27A1A]" : "text-[#333333] hover:text-[#F27A1A]"
                                }`}
                              >
                                {cat.name}
                              </LocalizedClientLink>
                              {children.length > 0 && (
                                <button
                                  onClick={() => setExpandedSlug(isExpanded ? null : cat.id)}
                                  aria-label={isExpanded ? "Restrânge" : "Extinde"}
                                  className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-[#F27A1A] transition-colors"
                                >
                                  <svg
                                    className={`w-4 h-4 transition-transform duration-200 ${isExpanded ? "rotate-180" : ""}`}
                                    fill="none" stroke="currentColor" viewBox="0 0 24 24"
                                  >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                  </svg>
                                </button>
                              )}
                            </div>

                            {/* Subcategories */}
                            {isExpanded && (
                              <ul className="mb-1 ml-3 border-l border-gray-100 pl-3 flex flex-col gap-y-0.5">
                                {children.map((sub) => (
                                  <li key={sub.id}>
                                    <LocalizedClientLink
                                      href={`/categories/${sub.handle}`}
                                      onClick={close}
                                      className="flex items-center h-8 text-xs text-gray-500 hover:text-[#F27A1A] transition-colors"
                                    >
                                      {sub.name}
                                    </LocalizedClientLink>
                                  </li>
                                ))}
                              </ul>
                            )}
                          </li>
                        )
                      })}
                    </ul>
                  </div>

                  {/* Region / Language (bottom) */}
                  {(!!locales?.length || regions) && (
                    <div className="px-5 py-4 border-t border-gray-100 flex flex-col gap-y-3">
                      {!!locales?.length && (
                        <div
                          className="flex justify-between"
                          onMouseEnter={languageToggleState.open}
                          onMouseLeave={languageToggleState.close}
                        >
                          <LanguageSelect
                            toggleState={languageToggleState}
                            locales={locales}
                            currentLocale={currentLocale}
                          />
                        </div>
                      )}
                      {regions && (
                        <div
                          className="flex justify-between"
                          onMouseEnter={countryToggleState.open}
                          onMouseLeave={countryToggleState.close}
                        >
                          <CountrySelect
                            toggleState={countryToggleState}
                            regions={regions}
                          />
                        </div>
                      )}
                    </div>
                  )}
                </PopoverPanel>
              </Transition>
            </>
          )}
        </Popover>
      </div>
    </div>
  )
}

export default SideMenu
