import { NextResponse } from "next/server"
import { listCartOptions, retrieveCart } from "@lib/data/cart"
import { getAuthHeaders, getCartId, hasAuthHeader } from "@lib/data/cookies"
import { retrieveCustomer } from "@lib/data/customer"
import { HttpTypes } from "@medusajs/types"

export const dynamic = "force-dynamic"

const PRIVATE_CACHE = {
  "Cache-Control": "private, no-store, max-age=0, must-revalidate",
}

const EMPTY = { customer: null, cart: null, shippingOptions: [] }

/**
 * Private session for the header (account, cart badge, free-shipping nudge).
 * Public HTML never waits on this and never includes it, so catalog pages can
 * be cached without leaking a customer or a cart.
 */
export async function GET() {
  try {
    const authHeaders = await getAuthHeaders()
    const cartId = await getCartId()
    const authenticated = hasAuthHeader(authHeaders)

    if (!authenticated && !cartId) {
      return NextResponse.json(EMPTY, { headers: PRIVATE_CACHE })
    }

    const [customer, cart] = await Promise.all([
      authenticated
        ? retrieveCustomer("id,email,first_name,last_name")
        : Promise.resolve(null),
      cartId ? retrieveCart() : Promise.resolve(null),
    ])

    let shippingOptions: HttpTypes.StoreCartShippingOption[] = []
    if (cart) {
      const options = await listCartOptions().catch(() => null)
      shippingOptions = options?.shipping_options ?? []
    }

    return NextResponse.json(
      {
        customer: customer
          ? {
              id: customer.id,
              email: customer.email,
              first_name: customer.first_name,
              last_name: customer.last_name,
            }
          : null,
        cart,
        shippingOptions,
      },
      { headers: PRIVATE_CACHE }
    )
  } catch {
    return NextResponse.json(EMPTY, { headers: PRIVATE_CACHE })
  }
}
