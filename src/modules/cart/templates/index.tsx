import { HttpTypes } from "@medusajs/types"

import CartItemRow from "@modules/cart/components/cart-item-row"
import OrderSummary from "@modules/cart/components/order-summary"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

// ── Empty state ───────────────────────────────────────────────────────────────

const EmptyCart = () => (
  <div className="flex flex-col items-center justify-center py-24 gap-y-6 text-center">
    {/* Illustration */}
    <div className="w-24 h-24 rounded-full bg-[#F5F5F7] flex items-center justify-center">
      <svg className="w-12 h-12 text-[#86868B]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
          d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
        />
      </svg>
    </div>

    <div className="flex flex-col gap-y-2">
      <p className="text-2xl font-semibold tracking-[-0.02em] text-[#1D1D1F]">Coșul este gol</p>
      <p className="text-sm text-gray-400 max-w-xs">
        Nu ați adăugat niciun produs în coș. Vedeți catalogul nostru de materiale de construcții.
      </p>
    </div>

    <LocalizedClientLink href="/store">
      <button className="btn-pill">
        Continuați cumpărăturile
      </button>
    </LocalizedClientLink>
  </div>
)

// ── Main template ─────────────────────────────────────────────────────────────

type CartTemplateProps = {
  cart: HttpTypes.StoreCart | null
  customer: HttpTypes.StoreCustomer | null
}

const CartTemplate = ({ cart }: CartTemplateProps) => {
  const items = cart?.items ?? []
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0)
  const isEmpty = items.length === 0

  return (
    <div className="content-container pt-8 pb-4 md:pt-12">

      {/* Heading */}
      <h1 className="display-2 mb-10">
        Coșul de cumpărături
        {!isEmpty && (
          <span className="ml-2 text-base font-normal text-gray-400">
            ({itemCount} {itemCount === 1 ? "produs" : "produse"})
          </span>
        )}
      </h1>

      {isEmpty ? (
        <EmptyCart />
      ) : (
        <div className="flex flex-col lg:flex-row gap-x-10 gap-y-8 items-start">

          {/* LEFT — Cart items (65%) */}
          <div className="w-full lg:w-[65%] bg-white rounded-[22px] border border-[#D2D2D7]/70 px-6">
            {/* Column headers — desktop only */}
            <div className="hidden sm:grid grid-cols-[1fr_auto_auto_auto] gap-x-4 py-3 border-b border-gray-100 text-xs font-semibold text-gray-400 uppercase tracking-wide">
              <span>Produs</span>
              <span className="w-24 text-center">Cantitate</span>
              <span className="w-24 text-right">Total</span>
              <span className="w-8" />
            </div>

            <div className="divide-y divide-gray-100">
              {items.map((item) => (
                <CartItemRow key={item.id} item={item} />
              ))}
            </div>
          </div>

          {/* RIGHT — Order summary (35%) */}
          {cart && (
            <div className="w-full lg:w-[35%] lg:sticky lg:top-[var(--header-height,120px)]">
              <OrderSummary cart={cart} />
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default CartTemplate
