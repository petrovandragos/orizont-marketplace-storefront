"use client"

import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useCallback } from "react"

import SortProducts, { SortOptions } from "./sort-products"
import { HttpTypes } from "@medusajs/types"

type RefinementListProps = {
  sortBy: SortOptions
  search?: boolean
  categories?: HttpTypes.StoreProductCategory[]
  selectedCategoryIds?: string[]
  availableBrands?: string[]
  brandCounts?: Record<string, number>
  'data-testid'?: string
}

const RefinementList = ({
  sortBy,
  categories = [],
  selectedCategoryIds = [],
  availableBrands = [],
  brandCounts = {},
  'data-testid': dataTestId,
}: RefinementListProps) => {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const activeBrands = searchParams.get("brands")?.split(",").filter(Boolean) ?? []

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams)
      if (value) {
        params.set(name, value)
      } else {
        params.delete(name)
      }
      // Reset page on filter change
      params.delete("page")
      return params.toString()
    },
    [searchParams]
  )

  const setQueryParams = (name: string, value: SortOptions) => {
    const query = createQueryString(name, value)
    router.push(`${pathname}?${query}`)
  }

  const toggleCategory = (id: string) => {
    const current = new Set(selectedCategoryIds)
    if (current.has(id)) {
      current.delete(id)
    } else {
      current.add(id)
    }
    const value = Array.from(current).join(",")
    const params = new URLSearchParams(searchParams)
    if (value) {
      params.set("categories", value)
    } else {
      params.delete("categories")
    }
    params.delete("page")
    router.push(`${pathname}?${params.toString()}`)
  }

  const toggleBrand = (brand: string) => {
    const next = activeBrands.includes(brand)
      ? activeBrands.filter((b) => b !== brand)
      : [...activeBrands, brand]
    const params = new URLSearchParams(searchParams)
    if (next.length > 0) {
      params.set("brands", next.join(","))
    } else {
      params.delete("brands")
    }
    params.delete("page")
    router.push(`${pathname}?${params.toString()}`)
  }

  return (
    <div className="flex flex-col gap-y-8" data-testid={dataTestId}>
      <SortProducts sortBy={sortBy} setQueryParams={setQueryParams} />

      {availableBrands.length > 0 && (
        <div className="flex flex-col gap-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-[#1D1D1F] leading-none">
              Producător
            </span>
            {activeBrands.length > 0 && (
              <button
                onClick={() => {
                  const params = new URLSearchParams(searchParams)
                  params.delete("brands")
                  params.delete("page")
                  router.push(`${pathname}?${params.toString()}`)
                }}
                className="text-xs text-[#B9520A] hover:underline"
              >
                Ștergeți
              </button>
            )}
          </div>

          <div className="flex flex-col gap-y-1 max-h-56 overflow-y-auto pr-1">
            {availableBrands.map((brand) => {
              const isSelected = activeBrands.includes(brand)
              return (
                <button
                  key={brand}
                  onClick={() => toggleBrand(brand)}
                  className={`flex items-center justify-between gap-x-3 py-2 px-3 rounded-full cursor-pointer transition-colors duration-200 w-full text-left ${
                    isSelected
                      ? "bg-white text-[#1D1D1F]"
                      : "text-[#424245] hover:text-[#1D1D1F] hover:bg-white/70"
                  }`}
                >
                  <span className="flex items-center gap-x-2.5 min-w-0">
                    <span
                      className={`w-4 h-4 rounded flex-shrink-0 border flex items-center justify-center transition-all duration-200 ${
                        isSelected
                          ? "bg-[#F27A1A] border-[#F27A1A]"
                          : "border-gray-300 bg-white"
                      }`}
                    >
                      {isSelected && (
                        <svg className="w-2.5 h-2.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </span>
                    <span className="text-sm leading-tight truncate">
                      {brand}
                    </span>
                  </span>
                  <span className="text-[10px] text-gray-400 flex-shrink-0 font-normal normal-case tracking-normal">
                    ({brandCounts[brand] ?? 0})
                  </span>
                </button>
              )
            })}
          </div>
        </div>
      )}

      {categories.length > 0 && (
        <div className="flex flex-col gap-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-[#1D1D1F] leading-none">
              Categorii
            </span>
            {selectedCategoryIds.length > 0 && (
              <button
                onClick={() => {
                  const params = new URLSearchParams(searchParams)
                  params.delete("categories")
                  params.delete("page")
                  router.push(`${pathname}?${params.toString()}`)
                }}
                className="text-xs text-[#B9520A] hover:underline"
              >
                Ștergeți
              </button>
            )}
          </div>

          <div className="flex flex-col gap-y-1">
            {categories.map((cat) => {
              const isSelected = selectedCategoryIds.includes(cat.id)
              return (
                <button
                  key={cat.id}
                  onClick={() => toggleCategory(cat.id)}
                  className={`flex items-center gap-x-3 py-2 px-3 rounded-full cursor-pointer transition-colors duration-200 w-full text-left ${
                    isSelected
                      ? "bg-white text-[#1D1D1F]"
                      : "text-[#424245] hover:text-[#1D1D1F] hover:bg-white/70"
                  }`}
                >
                  {/* Custom checkbox */}
                  <span
                    className={`w-4 h-4 rounded flex-shrink-0 border flex items-center justify-center transition-all duration-200 ${
                      isSelected
                        ? "bg-[#F27A1A] border-[#F27A1A]"
                        : "border-gray-300 bg-white"
                    }`}
                  >
                    {isSelected && (
                      <svg className="w-2.5 h-2.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </span>
                  <span className="text-sm leading-tight">
                    {cat.name}
                  </span>
                </button>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}

export default RefinementList
