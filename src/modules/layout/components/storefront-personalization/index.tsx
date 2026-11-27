"use client"

import CartMismatchBanner from "@modules/layout/components/cart-mismatch-banner"
import { useStorefrontSession } from "@modules/layout/components/storefront-session"
import FreeShippingPriceNudge from "@modules/shipping/components/free-shipping-price-nudge"

/**
 * Cart mismatch and the free-shipping nudge. Loaded after paint from the
 * private session endpoint so the document shell does not wait on the cart.
 */
export default function StorefrontPersonalization() {
  const { ready, customer, cart, shippingOptions } = useStorefrontSession()

  if (!ready || !cart) return null

  return (
    <>
      {customer ? <CartMismatchBanner customer={customer} cart={cart} /> : null}
      <FreeShippingPriceNudge
        variant="popup"
        cart={cart}
        shippingOptions={shippingOptions}
      />
    </>
  )
}
