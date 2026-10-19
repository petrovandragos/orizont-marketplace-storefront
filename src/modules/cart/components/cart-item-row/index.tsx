"use client"

import Image from "next/image"
import { useTransition } from "react"
import { HttpTypes } from "@medusajs/types"

import { updateLineItem, deleteLineItem } from "@lib/data/cart"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

// ── Helpers ───────────────────────────────────────────────────────────────────

function formatRon(amount: number): string {
  return (
    new Intl.NumberFormat("ro-RO", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount) + " lei"
  )
}

// ── Component ─────────────────────────────────────────────────────────────────

type CartItemRowProps = {
  item: HttpTypes.StoreCartLineItem
}

const CartItemRow = ({ item }: CartItemRowProps) => {
  const [isPending, startTransition] = useTransition()

  const handleQtyChange = (newQty: number) => {
    if (newQty < 1 || isPending) return
    startTransition(async () => {
      await updateLineItem({ lineId: item.id, quantity: newQty })
    })
  }

  const handleRemove = () => {
    if (isPending) return
    startTransition(async () => {
      await deleteLineItem(item.id)
    })
  }

  const variantTitle =
    item.variant?.title && item.variant.title !== "Default Title"
      ? item.variant.title
      : null

  const unitPrice = item.unit_price ?? 0
  const lineTotal = item.total ?? 0

  return (
    <div
      className={`flex gap-x-4 py-5 transition-opacity duration-200 ${
        isPending ? "opacity-50 pointer-events-none" : ""
      }`}
      data-testid="cart-item"
    >
      {/* Thumbnail */}
      <LocalizedClientLink
        href={`/products/${item.product_handle}`}
        className="flex-shrink-0"
        tabIndex={-1}
        aria-hidden="true"
      >
        <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-lg overflow-hidden bg-gray-50 border border-gray-100">
          {item.thumbnail ? (
            <Image
              src={item.thumbnail}
              alt={item.product_title ?? "Produs"}
              fill
              sizes="96px"
              className="object-cover object-center"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center text-gray-300">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
          )}
        </div>
      </LocalizedClientLink>

      {/* Info + controls */}
      <div className="flex-1 min-w-0 flex flex-col gap-y-2">
        {/* Name + remove button */}
        <div className="flex items-start justify-between gap-x-2">
          <div className="min-w-0">
            <LocalizedClientLink href={`/products/${item.product_handle}`}>
              <h3 className="text-sm font-semibold text-[#1D1D1F] hover:text-[#F27A1A] transition-colors line-clamp-2 leading-snug">
                {item.product_title}
              </h3>
            </LocalizedClientLink>
            {variantTitle && (
              <p className="text-xs text-gray-400 mt-0.5">{variantTitle}</p>
            )}
          </div>

          {/* Remove */}
          <button
            onClick={handleRemove}
            disabled={isPending}
            aria-label="Ștergeți produsul"
            className="flex-shrink-0 p-1.5 text-gray-300 hover:text-red-500 transition-colors rounded-lg hover:bg-red-50 disabled:cursor-not-allowed"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
          </button>
        </div>

        {/* Price row */}
        <div className="flex items-center justify-between gap-x-4 flex-wrap gap-y-2">
          {/* Unit price */}
          <span className="text-sm text-gray-500">
            {formatRon(unitPrice)} / buc.
          </span>

          {/* Quantity selector */}
          <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
            <button
              onClick={() => handleQtyChange(item.quantity - 1)}
              disabled={item.quantity <= 1 || isPending}
              aria-label="Scădeți cantitatea"
              className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-[#F27A1A] hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
              </svg>
            </button>
            <span className="w-10 text-center text-sm font-semibold text-[#1D1D1F]">
              {item.quantity}
            </span>
            <button
              onClick={() => handleQtyChange(item.quantity + 1)}
              disabled={isPending}
              aria-label="Creșteți cantitatea"
              className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-[#F27A1A] hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </button>
          </div>

          {/* Line total */}
          <span className="text-base font-bold text-[#1D1D1F] min-w-[80px] text-right">
            {formatRon(lineTotal)}
          </span>
        </div>
      </div>
    </div>
  )
}

export default CartItemRow
