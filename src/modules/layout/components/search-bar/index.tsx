"use client"

import { useRouter, useParams } from "next/navigation"
import { useState, useRef, useEffect, type FormEvent } from "react"

type AutocompleteProduct = {
  id: string
  title: string
  handle: string
  thumbnail: string | null
  variants?: Array<{
    calculated_price?: {
      calculated_amount: number
      currency_code: string
    }
  }>
  categories?: Array<{ name: string }>
  metadata?: Record<string, unknown>
}

function formatPrice(amount: number, unit: string): string {
  const formatted = new Intl.NumberFormat("ro-RO", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount)
  return `${formatted} lei / ${unit}`
}

const SearchBar = () => {
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<AutocompleteProduct[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const abortRef = useRef<AbortController | null>(null)
  const router = useRouter()
  const { countryCode } = useParams() as { countryCode: string }

  // Debounced search
  useEffect(() => {
    const trimmed = query.trim()

    if (trimmed.length < 2) {
      setResults([])
      setIsOpen(false)
      return
    }

    const timer = setTimeout(async () => {
      // Cancel any in-flight request
      abortRef.current?.abort()
      abortRef.current = new AbortController()

      setIsLoading(true)
      try {
        const res = await fetch(
          `/api/search?q=${encodeURIComponent(trimmed)}&countryCode=${countryCode}`,
          { signal: abortRef.current.signal }
        )
        const data = await res.json()
        setResults(data.products ?? [])
        setIsOpen(true)
      } catch (err: any) {
        if (err?.name !== "AbortError") {
          setResults([])
        }
      } finally {
        setIsLoading(false)
      }
    }, 300)

    return () => clearTimeout(timer)
  }, [query, countryCode])

  // Close on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  // Close on Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsOpen(false)
        inputRef.current?.blur()
      }
    }
    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [])

  const navigate = (q: string) => {
    setIsOpen(false)
    router.push(`/cautare?q=${encodeURIComponent(q)}`)
  }

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const trimmed = query.trim()
    if (trimmed) navigate(trimmed)
  }

  const searchUrl = `/cautare?q=${encodeURIComponent(query.trim())}`

  return (
    <div ref={containerRef} className="relative w-full">
      <form onSubmit={handleSubmit} role="search" className="relative">
        <input
          ref={inputRef}
          type="search"
          name="q"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => {
            if (results.length > 0) setIsOpen(true)
          }}
          placeholder="Căutați produse"
          autoComplete="off"
          className="w-full h-10 pl-11 pr-4 rounded-full border-0 bg-[#F0F0F3] text-base md:text-[15px] text-[#1D1D1F] placeholder-[#86868B] focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#F27A1A] transition-colors duration-150"
        />
        <button
          type="submit"
          aria-label="Căutați"
          className="absolute left-1 top-0 h-10 w-10 flex items-center justify-center rounded-full text-[#86868B] hover:text-[#1D1D1F] transition-colors duration-150"
        >
          {isLoading ? (
            <svg
              className="w-4 h-4 animate-spin"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
              />
            </svg>
          ) : (
            <svg
              width="18"
              height="18"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          )}
        </button>
      </form>

      {/* Autocomplete dropdown */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl border border-black/[0.06] shadow-[0_20px_60px_rgba(0,0,0,0.14)] z-50 overflow-hidden">
          {results.length > 0 ? (
            <>
              <ul className="divide-y divide-gray-50">
                {results.map((product) => {
                  const cheapestVariant = product.variants
                    ?.filter((v) => v.calculated_price?.calculated_amount != null)
                    .sort(
                      (a, b) =>
                        (a.calculated_price?.calculated_amount ?? 0) -
                        (b.calculated_price?.calculated_amount ?? 0)
                    )[0]

                  const price = cheapestVariant?.calculated_price
                  const unit =
                    (product.metadata?.pricing_unit as string) || "bucată"
                  const priceDisplay =
                    price?.calculated_amount != null
                      ? formatPrice(price.calculated_amount, unit)
                      : null

                  const categoryName =
                    product.categories?.[0]?.name ?? null

                  return (
                    <li key={product.id}>
                      <a
                        href={`/products/${product.handle}`}
                        className="flex items-center gap-x-3 px-4 py-3 hover:bg-gray-50 transition-colors"
                        onClick={() => setIsOpen(false)}
                      >
                        {/* Thumbnail */}
                        <div className="w-11 h-11 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100 border border-gray-100">
                          {product.thumbnail ? (
                            <img
                              src={product.thumbnail}
                              alt={product.title}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-300">
                              <svg
                                className="w-5 h-5"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={1.5}
                                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                                />
                              </svg>
                            </div>
                          )}
                        </div>

                        {/* Info */}
                        <div className="flex-1 min-w-0">
                          {categoryName && (
                            <p className="text-xs text-[#6E6E73] truncate mb-0.5">
                              {categoryName}
                            </p>
                          )}
                          <p className="text-sm font-medium text-[#1D1D1F] truncate">
                            {product.title}
                          </p>
                          {priceDisplay && (
                            <p className="text-xs font-semibold text-[#F27A1A] mt-0.5">
                              {priceDisplay}
                            </p>
                          )}
                        </div>

                        {/* Arrow */}
                        <svg
                          className="w-4 h-4 text-gray-300 flex-shrink-0"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 5l7 7-7 7"
                          />
                        </svg>
                      </a>
                    </li>
                  )
                })}
              </ul>

              {/* See all results */}
              <div className="border-t border-gray-100">
                <a
                  href={searchUrl}
                  onClick={(e) => {
                    e.preventDefault()
                    navigate(query.trim())
                  }}
                  className="flex items-center justify-center gap-x-2 px-4 py-3 text-sm font-medium text-[#B9520A] hover:bg-[#F5F5F7] transition-colors"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                  Vedeți toate rezultatele pentru „{query}"
                </a>
              </div>
            </>
          ) : (
            <div className="px-4 py-6 text-center">
              <p className="text-sm text-gray-400">
                Nu s-au găsit produse pentru „{query}".
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default SearchBar
