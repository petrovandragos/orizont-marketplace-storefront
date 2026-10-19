"use client"

import { useRef, useState, useCallback } from "react"
import { HttpTypes } from "@medusajs/types"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

function formatRon(n: number | null | undefined) {
  if (n == null) return "—"
  return (
    new Intl.NumberFormat("ro-RO", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(n) + " lei"
  )
}

type Props = {
  cart: HttpTypes.StoreCart | null
  itemCount: number
}

export default function NavCartDropdown({ cart, itemCount }: Props) {
  const [open, setOpen] = useState(false)
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const handleEnter = useCallback(() => {
    if (closeTimer.current) clearTimeout(closeTimer.current)
    setOpen(true)
  }, [])

  const handleLeave = useCallback(() => {
    closeTimer.current = setTimeout(() => setOpen(false), 120)
  }, [])

  const items = cart?.items ?? []
  const previewItems = items.slice(0, 4)
  const extraCount = Math.max(0, items.length - 4)

  return (
    <div
      className="relative flex items-center"
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
    >
      {/* Trigger */}
      <LocalizedClientLink
        href="/cart"
        aria-label={`Coș de cumpărături${itemCount > 0 ? ` — ${itemCount} produse` : ""}`}
        data-testid="nav-cart-link"
        className={`relative flex items-center transition-colors duration-150 ${
          open ? "text-[#1D1D1F]" : "text-[#424245] hover:text-[#1D1D1F]"
        }`}
      >
        <svg className="w-[22px] h-[22px]" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinejoin="round" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M5 8h14l-1 12H6L5 8Z" /><path d="M9 8V6a3 3 0 0 1 6 0v2" />
        </svg>
        {itemCount > 0 && (
          <span
            className="absolute -top-1.5 -right-1.5 min-w-[18px] h-[18px] px-0.5 bg-[#F27A1A] text-white text-[10px] font-bold leading-none rounded-full flex items-center justify-center"
            aria-hidden="true"
          >
            {itemCount > 99 ? "99+" : itemCount}
          </span>
        )}
      </LocalizedClientLink>

      {/* Dropdown panel */}
      <div
        className={`absolute top-full right-0 mt-3 w-80 transition-all duration-200 origin-top-right ${
          open
            ? "opacity-100 scale-100 translate-y-0 pointer-events-auto"
            : "opacity-0 scale-95 -translate-y-1 pointer-events-none"
        }`}
        style={{ filter: "drop-shadow(0 8px 32px rgba(0,0,0,0.12))" }}
      >
        {/* Arrow */}
        <div className="absolute -top-1.5 right-4 w-3 h-3 bg-white border-l border-t border-gray-100 rotate-45 z-10" />

        <div className="relative bg-white rounded-2xl border border-gray-100 overflow-hidden">

          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3.5 border-b border-gray-100">
            <div className="flex items-center gap-x-2">
              <svg className="w-4 h-4 text-[#F27A1A]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <span className="text-sm font-semibold text-[#1D1D1F]">Coșul de cumpărături</span>
            </div>
            {itemCount > 0 && (
              <span className="text-xs font-medium text-gray-400">
                {itemCount} {itemCount === 1 ? "produs" : "produse"}
              </span>
            )}
          </div>

          {/* Items or empty state */}
          {previewItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 gap-y-2">
              <svg className="w-10 h-10 text-gray-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <p className="text-sm font-medium text-gray-500">Coșul este gol</p>
              <LocalizedClientLink
                href="/store"
                onClick={() => setOpen(false)}
                className="mt-1 text-xs text-[#F27A1A] hover:text-[#D4600E] font-medium transition-colors"
              >
                Vedeți produsele →
              </LocalizedClientLink>
            </div>
          ) : (
            <>
              <ul className="divide-y divide-gray-50 max-h-56 overflow-y-auto">
                {previewItems.map((item) => (
                  <li key={item.id} className="flex items-center gap-x-3 px-4 py-3">
                    {/* Thumbnail */}
                    <div className="w-11 h-11 rounded-lg bg-gray-50 border border-gray-100 overflow-hidden flex-shrink-0">
                      {item.thumbnail ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={item.thumbnail} alt={item.product_title ?? ""} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-200">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1}
                              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        </div>
                      )}
                    </div>
                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-[#1D1D1F] truncate">{item.product_title}</p>
                      <p className="text-xs text-gray-400">x{item.quantity}</p>
                    </div>
                    {/* Price */}
                    <span className="text-xs font-bold text-[#1D1D1F] flex-shrink-0">
                      {formatRon(item.total)}
                    </span>
                  </li>
                ))}
              </ul>

              {extraCount > 0 && (
                <p className="text-xs text-center text-gray-400 py-2 border-t border-gray-50">
                  + {extraCount} {extraCount === 1 ? "produs" : "produse"} în coș
                </p>
              )}

              {/* Total */}
              <div className="flex items-center justify-between px-4 py-3 bg-gray-50 border-t border-gray-100">
                <span className="text-sm font-medium text-gray-500">Subtotal</span>
                <span className="text-sm font-bold text-[#1D1D1F]">
                  {formatRon(cart?.subtotal)}
                </span>
              </div>
            </>
          )}

          {/* CTA */}
          {items.length > 0 && (
            <div className="p-3 border-t border-gray-100 flex flex-col gap-y-2">
              <LocalizedClientLink href="/checkout?step=delivery" onClick={() => setOpen(false)}>
                <button className="w-full h-10 bg-[#F27A1A] hover:bg-[#D4600E] text-white text-sm font-semibold rounded-xl transition-colors duration-150 flex items-center justify-center gap-x-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                  Finalizați comanda
                </button>
              </LocalizedClientLink>
              <LocalizedClientLink href="/cart" onClick={() => setOpen(false)}>
                <button className="w-full h-9 border border-gray-200 text-[#424245] hover:border-[#F27A1A] hover:text-[#F27A1A] text-sm font-medium rounded-xl transition-colors duration-150">
                  Vedeți coșul
                </button>
              </LocalizedClientLink>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
