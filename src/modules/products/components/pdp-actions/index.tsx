"use client"

import { useEffect, useMemo, useState, useTransition } from "react"
import { useParams } from "next/navigation"
import { isEqual } from "lodash"
import { HttpTypes } from "@medusajs/types"

import { addToCart, retrieveCart } from "@lib/data/cart"
import { getProductPrice } from "@lib/util/get-product-price"
import { getPricingUnit } from "@lib/util/format-price"
import { getVariantQuantity } from "@modules/products/components/stock-badge"
import PriceDisplay from "@modules/common/components/price-display"
import StockBadge from "@modules/products/components/stock-badge"
import { useCartDrawer } from "@modules/cart/context/cart-drawer-context"
import CereOfertaForm from "@modules/products/components/cere-oferta-form"
import AddToQuoteButton from "@modules/quote/components/add-to-quote-button"

// ── Helpers ───────────────────────────────────────────────────────────────────

const optionsAsKeymap = (
  variantOptions: HttpTypes.StoreProductVariant["options"]
): Record<string, string> =>
  variantOptions?.reduce((acc: Record<string, string>, vo: any) => {
    acc[vo.option_id] = vo.value
    return acc
  }, {}) ?? {}

// ── Component ─────────────────────────────────────────────────────────────────

type PdpActionsProps = {
  product: HttpTypes.StoreProduct
  onVariantChange?: (variant: HttpTypes.StoreProductVariant | undefined) => void
}

const PdpActions = ({ product, onVariantChange }: PdpActionsProps) => {
  const { countryCode } = useParams() as { countryCode: string }
  const [isPending, startTransition] = useTransition()
  const [quantity, setQuantity] = useState(1)
  const { openDrawer } = useCartDrawer()

  // ── Variant selection ───────────────────────────────────────────────────────
  const [options, setOptions] = useState<Record<string, string | undefined>>({})

  // Pre-select if single variant
  useEffect(() => {
    if (product.variants?.length === 1) {
      setOptions(optionsAsKeymap(product.variants[0].options))
    }
  }, [product.variants])

  const selectedVariant = useMemo(() => {
    if (!product.variants?.length) return undefined
    return product.variants.find((v) =>
      isEqual(optionsAsKeymap(v.options), options)
    ) as (HttpTypes.StoreProductVariant & { inventory_quantity?: number; manage_inventory?: boolean; allow_backorder?: boolean }) | undefined
  }, [product.variants, options])

  // Notify parent when selected variant changes
  useEffect(() => {
    onVariantChange?.(selectedVariant)
  }, [selectedVariant])

  // ── Stock ───────────────────────────────────────────────────────────────────
  const stockQty = getVariantQuantity(selectedVariant as any)
  const isOutOfStock = selectedVariant ? stockQty === 0 : false
  const maxQty = stockQty >= 999 ? 99 : stockQty // cap display at 99

  // Keep quantity in bounds when variant changes
  useEffect(() => {
    if (maxQty > 0) setQuantity((q) => Math.min(q, maxQty))
    else setQuantity(1)
  }, [maxQty])

  // ── Price ───────────────────────────────────────────────────────────────────
  const { cheapestPrice, variantPrice } = getProductPrice({ product, variantId: selectedVariant?.id })
  const isPriceOnRequest = cheapestPrice === null
  const displayPrice = variantPrice ?? cheapestPrice
  const amount = displayPrice?.calculated_price_number ?? null
  const compareAt = displayPrice?.original_price_number ?? null
  const isSale = compareAt != null && compareAt > 0 && compareAt > (amount ?? 0)
  const pricingUnit = getPricingUnit(product.metadata)

  // ── Quantity handlers ───────────────────────────────────────────────────────
  const decQty = () => setQuantity((q) => Math.max(1, q - 1))
  const incQty = () => setQuantity((q) => Math.min(maxQty || 99, q + 1))
  const handleQtyInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value)
    if (isNaN(val)) return
    setQuantity(Math.min(Math.max(1, val), maxQty || 99))
  }

  // ── Add to cart ─────────────────────────────────────────────────────────────
  const handleAdd = () => {
    if (!selectedVariant?.id || isOutOfStock || isPending) return
    startTransition(async () => {
      await addToCart({ variantId: selectedVariant.id, quantity, countryCode })
      const cart = await retrieveCart()
      const cartItemCount = cart?.items?.reduce((s, i) => s + i.quantity, 0) ?? 0
      openDrawer(
        {
          title: product.title ?? "",
          thumbnail: product.thumbnail ?? null,
          price: amount,
          quantity,
        },
        cart?.total ?? null,
        cartItemCount
      )
    })
  }

  const hasMultipleVariants = (product.variants?.length ?? 0) > 1
  const canAdd = !!selectedVariant && !isOutOfStock && !isPending

  // ── Packaging info ──────────────────────────────────────────────────────────
  const packaging = product.metadata?.packaging as string | undefined

  return (
    <div className="flex flex-col gap-y-5">

      {/* ── Variant options ── */}
      {hasMultipleVariants && product.options && product.options.length > 0 && (
        <div className="flex flex-col gap-y-4">
          {product.options.map((option) => (
            <div key={option.id} className="flex flex-col gap-y-2">
              <span className="text-sm font-semibold text-[#1D1D1F]">{option.title}</span>
              <div className="flex flex-wrap gap-2">
                {(option.values ?? []).map((v) => (
                  <button
                    key={v.value}
                    onClick={() => setOptions((prev) => ({ ...prev, [option.id]: v.value }))}
                    className={`h-10 px-4 rounded-full text-sm font-medium border transition-all duration-150 ${
                      options[option.id] === v.value
                        ? "bg-white text-[#1D1D1F] border-[#1D1D1F] border-2"
                        : "bg-white text-[#424245] border-[#D2D2D7] hover:border-[#86868B]"
                    }`}
                  >
                    {v.value}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── Price ── */}
      {amount != null ? (
        <PriceDisplay
          amount={amount}
          unit={pricingUnit}
          compareAtPrice={isSale ? compareAt : null}
          size="lg"
        />
      ) : (
        <span className="text-[21px] font-semibold tracking-[-0.02em] text-[#1D1D1F]">Preț la cerere</span>
      )}

      {/* ── Stock badge ── */}
      {selectedVariant && <StockBadge quantity={stockQty} />}

      {/* ── Packaging info ── */}
      {packaging && (
        <div className="flex items-center gap-x-2 px-4 py-3 bg-[#F5F5F7] rounded-2xl">
          <svg className="w-4 h-4 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
            />
          </svg>
          <span className="text-sm text-[#424245]">{packaging}</span>
        </div>
      )}

      {/* ── Quantity + Add to cart ── */}
      {!isPriceOnRequest && <div className="flex flex-col gap-y-3">
        {/* Quantity selector — only shown when variant is selected and in stock */}
        {selectedVariant && !isOutOfStock && (
          <div className="flex items-center gap-x-3">
            <span className="text-sm font-medium text-[#424245] flex-shrink-0">Cantitate:</span>
            <div className="flex items-center border border-[#D2D2D7] rounded-full overflow-hidden">
              <button
                onClick={decQty}
                disabled={quantity <= 1 || isPending}
                aria-label="Scădeți cantitatea"
                className="w-9 h-9 flex items-center justify-center text-gray-500 hover:text-[#1D1D1F] hover:bg-[#F5F5F7] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                </svg>
              </button>
              <input
                type="number"
                min={1}
                max={maxQty || 99}
                value={quantity}
                onChange={handleQtyInput}
                disabled={isPending}
                className="w-12 h-9 text-center text-sm font-semibold text-[#1D1D1F] border-x border-[#D2D2D7] focus:outline-none focus:bg-[#F5F5F7] transition-colors [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
              />
              <button
                onClick={incQty}
                disabled={(maxQty > 0 && quantity >= maxQty) || isPending}
                aria-label="Creșteți cantitatea"
                className="w-9 h-9 flex items-center justify-center text-gray-500 hover:text-[#1D1D1F] hover:bg-[#F5F5F7] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </button>
            </div>
          </div>
        )}

        {/* Add to cart button */}
        {isOutOfStock ? (
          <button
            disabled
            className="w-full h-12 flex items-center justify-center gap-x-2 rounded-full text-base font-medium bg-[#F5F5F7] text-gray-400 cursor-not-allowed"
          >
            Stoc epuizat
          </button>
        ) : !selectedVariant ? (
          <button
            disabled
            className="w-full h-12 flex items-center justify-center gap-x-2 rounded-full text-base font-medium bg-[#F5F5F7] text-gray-400 cursor-not-allowed"
          >
            Alegeți varianta
          </button>
        ) : (
          <button
            onClick={handleAdd}
            disabled={!canAdd}
            className="w-full h-12 flex items-center justify-center gap-x-2 rounded-full text-[17px] font-medium bg-[#F27A1A] hover:bg-[#DD6A0E] text-white disabled:opacity-60 disabled:cursor-not-allowed transition-colors duration-150"
          >
            {isPending ? (
              <>
                <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                </svg>
                Se adaugă...
              </>
            ) : (
              <>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
                Adăugați în coș
              </>
            )}
          </button>
        )}
      </div>}

      {/* Cere Ofertă */}
      <CereOfertaForm product={product} selectedVariantId={selectedVariant?.id} />

      {/* Lista de ofertă: produsul se trimite împreună cu altele, într-o singură cerere */}
      <AddToQuoteButton
        size="pdp"
        handle={product.handle ?? ""}
        title={product.title ?? ""}
        thumbnail={product.thumbnail ?? null}
        unit={pricingUnit}
      />

    </div>
  )
}

export default PdpActions
