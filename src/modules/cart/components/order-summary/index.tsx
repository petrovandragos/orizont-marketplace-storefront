import { HttpTypes } from "@medusajs/types"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

// ── Helpers ───────────────────────────────────────────────────────────────────

function formatRon(amount: number | null | undefined): string {
  if (amount == null) return "—"
  return (
    new Intl.NumberFormat("ro-RO", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount) + " lei"
  )
}

function getCheckoutStep(cart: HttpTypes.StoreCart) {
  if (!cart?.shipping_address?.address_1 || !cart.email) return "address"
  if (!cart?.shipping_methods?.length) return "delivery"
  return "payment"
}

// ── Component ─────────────────────────────────────────────────────────────────

type OrderSummaryProps = {
  cart: HttpTypes.StoreCart
}

const OrderSummary = ({ cart }: OrderSummaryProps) => {
  const step = getCheckoutStep(cart)
  const subtotal = cart.item_subtotal ?? cart.subtotal ?? 0
  const discount = cart.discount_subtotal
  // Exclude any stale shipping cost attached from a previous checkout session —
  // shipping is chosen during checkout, not on the cart page.
  const total = (cart.total ?? 0) - (cart.shipping_total ?? 0)

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 flex flex-col gap-y-5">
      <h2 className="text-lg font-bold text-[#1D1D1F]">Sumar comandă</h2>

      {/* Line items */}
      <div className="flex flex-col gap-y-3 text-sm">
        <div className="flex items-center justify-between text-gray-500">
          <span>Subtotal produse</span>
          <span data-testid="cart-subtotal">{formatRon(subtotal)}</span>
        </div>

        {!!discount && discount > 0 && (
          <div className="flex items-center justify-between text-[#2E7D32]">
            <span>Reducere</span>
            <span data-testid="cart-discount">- {formatRon(discount)}</span>
          </div>
        )}

      </div>

      {/* Divider */}
      <div className="border-t border-gray-100" />

      {/* Total */}
      <div className="flex items-center justify-between">
        <span className="text-base font-semibold text-[#1D1D1F]">Total</span>
        <span
          className="text-xl font-bold text-[#1D1D1F]"
          data-testid="cart-total"
        >
          {formatRon(total)}
        </span>
      </div>

      {/* CTA */}
      <LocalizedClientLink href="/checkout?step=delivery">
        <button
          className="w-full h-12 bg-[#F27A1A] hover:bg-[#D4600E] text-white font-semibold rounded-xl transition-colors duration-150 flex items-center justify-center gap-x-2"
          data-testid="checkout-button"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
          Finalizați comanda
        </button>
      </LocalizedClientLink>

      <LocalizedClientLink
        href="/store"
        className="text-center text-sm text-gray-400 hover:text-[#F27A1A] transition-colors"
      >
        Continuați cumpărăturile
      </LocalizedClientLink>
    </div>
  )
}

export default OrderSummary
