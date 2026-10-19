"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { HttpTypes } from "@medusajs/types"
import { useCartDrawer } from "@modules/cart/context/cart-drawer-context"
import { listProducts } from "@lib/data/products"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

function formatRon(n: number | null | undefined) {
  if (n == null) return "—"
  return (
    new Intl.NumberFormat("ro-RO", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(n) + " lei"
  )
}

function RecommendedProductSkeleton() {
  return (
    <div className="flex items-center gap-x-3 animate-pulse">
      <div className="w-14 h-14 rounded-lg bg-gray-100 flex-shrink-0" />
      <div className="flex-1 flex flex-col gap-y-1.5">
        <div className="h-3 bg-gray-100 rounded w-3/4" />
        <div className="h-3 bg-gray-100 rounded w-1/3" />
      </div>
    </div>
  )
}

export default function AddToCartDrawer() {
  const { isOpen, item, cartTotal, cartItemCount, closeDrawer } = useCartDrawer()
  const { countryCode } = useParams() as { countryCode: string }
  const [recs, setRecs] = useState<HttpTypes.StoreProduct[]>([])
  const [recsLoading, setRecsLoading] = useState(false)

  // Close on Escape
  useEffect(() => {
    if (!isOpen) return
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeDrawer()
    }
    document.addEventListener("keydown", handler)
    return () => document.removeEventListener("keydown", handler)
  }, [isOpen, closeDrawer])

  // Lock body scroll when open
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : ""
    return () => { document.body.style.overflow = "" }
  }, [isOpen])

  // Fetch recommendations when drawer opens
  useEffect(() => {
    if (!isOpen || !countryCode) return
    setRecsLoading(true)
    listProducts({ countryCode, queryParams: { limit: 6 } })
      .then(({ response }) => {
        const filtered = response.products
          .filter((p) => p.title !== item?.title)
          .slice(0, 4)
        setRecs(filtered)
      })
      .catch(() => setRecs([]))
      .finally(() => setRecsLoading(false))
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen])

  const productLabel = cartItemCount === 1 ? "produs" : "produse"

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={closeDrawer}
        className={`fixed inset-0 z-40 bg-black/40 backdrop-blur-sm transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        aria-hidden="true"
      />

      {/* Drawer */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Produs adăugat în coș"
        className={`fixed top-0 right-0 z-50 h-full w-full max-w-md bg-white shadow-2xl flex flex-col transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
          <div className="flex items-center gap-x-3">
            <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
              <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-base font-bold text-[#1D1D1F]">
              Produsul a fost adăugat în coș
            </h2>
          </div>
          <button
            onClick={closeDrawer}
            aria-label="Închide"
            className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-[#1D1D1F] hover:bg-gray-100 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto px-6 py-5 flex flex-col gap-y-5">

          {/* Added product card */}
          {item && (
            <div className="flex items-center gap-x-4 bg-gray-50 rounded-xl p-4 border border-gray-100">
              <div className="w-20 h-20 rounded-lg bg-white border border-gray-100 overflow-hidden flex-shrink-0">
                {item.thumbnail ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={item.thumbnail} alt={item.title} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-200">
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1}
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0 flex flex-col gap-y-1">
                <p className="text-sm font-semibold text-[#1D1D1F] leading-snug line-clamp-2">
                  {item.title}
                </p>
                <p className="text-xs text-gray-400">Cantitate: {item.quantity}</p>
                {item.price != null && (
                  <p className="text-base font-bold text-[#F27A1A]">
                    {formatRon(item.price * item.quantity)}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Cart total row */}
          <div className="flex items-center justify-between py-3 px-4 bg-[#FFF3E6] rounded-xl border border-[#F27A1A]/20">
            <span className="text-sm font-medium text-gray-600">
              Total coș
              {cartItemCount > 0 && (
                <span className="ml-1 text-gray-400">
                  ({cartItemCount} {productLabel})
                </span>
              )}
            </span>
            <span className="text-lg font-bold text-[#1D1D1F]">
              {formatRon(cartTotal)}
            </span>
          </div>

          {/* Recommendations */}
          <div className="flex flex-col gap-y-3">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
              Recomandate pentru dumneavoastră
            </p>

            <div className="flex flex-col divide-y divide-gray-100">
              {recsLoading
                ? Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="py-3 first:pt-0 last:pb-0">
                      <RecommendedProductSkeleton />
                    </div>
                  ))
                : recs.map((product) => {
                    const price = (product as any).variants?.[0]?.calculated_price?.calculated_amount
                      ?? (product as any).cheapest_price?.calculated_price_number
                      ?? null

                    return (
                      <LocalizedClientLink
                        key={product.id}
                        href={`/products/${product.handle}`}
                        onClick={closeDrawer}
                        className="flex items-center gap-x-3 py-3 first:pt-0 last:pb-0 hover:bg-gray-50 rounded-lg px-2 -mx-2 transition-colors group"
                      >
                        {/* Thumbnail */}
                        <div className="w-14 h-14 rounded-lg bg-gray-50 border border-gray-100 overflow-hidden flex-shrink-0">
                          {product.thumbnail ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={product.thumbnail}
                              alt={product.title ?? ""}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-200">
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1}
                                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                                />
                              </svg>
                            </div>
                          )}
                        </div>

                        {/* Info */}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-[#1D1D1F] line-clamp-2 leading-snug group-hover:text-[#F27A1A] transition-colors">
                            {product.title}
                          </p>
                          {price != null && (
                            <p className="text-sm font-semibold text-[#F27A1A] mt-0.5">
                              {formatRon(price)}
                            </p>
                          )}
                        </div>

                        {/* Arrow */}
                        <svg className="w-4 h-4 text-gray-300 group-hover:text-[#F27A1A] flex-shrink-0 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </LocalizedClientLink>
                    )
                  })}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="px-6 py-5 border-t border-gray-100 flex flex-col gap-y-3">
          <LocalizedClientLink href="/cart" onClick={closeDrawer}>
            <button className="w-full h-12 bg-[#F27A1A] hover:bg-[#D4600E] text-white font-semibold rounded-xl transition-colors duration-150 flex items-center justify-center gap-x-2 text-sm">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
              Vedeți coșul de cumpărături
            </button>
          </LocalizedClientLink>

          <button
            onClick={closeDrawer}
            className="w-full h-12 border-2 border-gray-200 text-[#1D1D1F] hover:border-[#F27A1A] hover:text-[#F27A1A] font-semibold rounded-xl transition-colors duration-150 text-sm"
          >
            Continuați cumpărăturile
          </button>
        </div>
      </div>
    </>
  )
}
