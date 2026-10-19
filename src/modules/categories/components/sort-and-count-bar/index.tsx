"use client"

import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useState } from "react"
import FilterSidebar, { type FilterSidebarPassedProps } from "../filter-sidebar"

const SORT_OPTIONS = [
  { value: "created_at", label: "Cele mai noi" },
  { value: "popularity", label: "Cele mai populare" },
  { value: "price_asc", label: "Preț crescător" },
  { value: "price_desc", label: "Preț descrescător" },
] as const

type SortAndCountBarProps = {
  count: number
  currentSort: string
  filterProps: FilterSidebarPassedProps
  /** True when any filter is currently active — drives the orange indicator dot */
  hasActiveFilters: boolean
}

const SortAndCountBar = ({
  count,
  currentSort,
  filterProps,
  hasActiveFilters,
}: SortAndCountBarProps) => {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [drawerOpen, setDrawerOpen] = useState(false)

  const handleSortChange = (value: string) => {
    const p = new URLSearchParams(searchParams.toString())
    p.set("sortBy", value)
    p.delete("page")
    router.push(`${pathname}?${p.toString()}`)
  }

  return (
    <>
      <div className="flex items-center justify-between gap-x-3">
        {/* Left: mobile filter button + product count */}
        <div className="flex items-center gap-x-3">
          {/* "Filtre" button — mobile only */}
          <button
            onClick={() => setDrawerOpen(true)}
            className="lg:hidden flex items-center gap-x-1.5 h-9 px-4 rounded-full bg-[#F5F5F7] text-sm font-medium text-[#1D1D1F] hover:bg-[#E8E8ED] transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M3 4h18M7 12h10M11 20h2" />
            </svg>
            Filtre
            {hasActiveFilters && (
              <span className="w-2 h-2 rounded-full bg-[#F27A1A]" aria-hidden="true" />
            )}
          </button>

          <span className="text-sm text-gray-500">
            <span className="font-semibold text-[#1D1D1F]">{count}</span>
            {" "}produse
          </span>
        </div>

        {/* Right: sort dropdown */}
        <div className="flex items-center gap-x-2 flex-shrink-0">
          <label htmlFor="sort-select" className="hidden sm:block text-sm text-gray-500 flex-shrink-0">
            Ordonați după
          </label>
          <div className="relative">
            <select
              id="sort-select"
              value={currentSort}
              onChange={(e) => handleSortChange(e.target.value)}
              className="h-9 pl-4 pr-8 text-sm border-0 rounded-full bg-[#F5F5F7] text-[#1D1D1F] appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#F27A1A] focus:border-transparent"
            >
              {SORT_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
            <span className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2">
              <svg className="w-3.5 h-3.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </span>
          </div>
        </div>
      </div>

      {/* ── Mobile filter drawer ── */}
      {drawerOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40 bg-black/40 lg:hidden"
            aria-hidden="true"
            onClick={() => setDrawerOpen(false)}
          />

          {/* Panel */}
          <div
            className="fixed inset-y-0 left-0 z-50 w-[85vw] max-w-sm bg-white shadow-2xl lg:hidden flex flex-col"
            role="dialog"
            aria-label="Filtre"
          >
            {/* Panel header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 flex-shrink-0">
              <h2 className="text-[17px] font-semibold text-[#1D1D1F]">Filtrați produsele</h2>
              <button
                onClick={() => setDrawerOpen(false)}
                className="p-1.5 rounded-lg text-gray-400 hover:text-[#F27A1A] hover:bg-gray-50 transition-colors"
                aria-label="Închide filtrele"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Scrollable filter content */}
            <div className="flex-1 overflow-y-auto px-5 py-2">
              <FilterSidebar {...filterProps} />
            </div>

            {/* Panel footer */}
            <div className="flex-shrink-0 px-5 py-4 border-t border-gray-100">
              <button
                onClick={() => setDrawerOpen(false)}
                className="w-full h-11 bg-[#F27A1A] hover:bg-[#DD6A0E] text-white font-medium rounded-full transition-colors"
              >
                Aplicați filtrele
              </button>
            </div>
          </div>
        </>
      )}
    </>
  )
}

export default SortAndCountBar
