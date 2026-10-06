import { redirect } from "next/navigation"
import { Metadata } from "next"
import { retrieveCart, initiatePaymentSession, placeOrder } from "@lib/data/cart"
import { getEuplatescOrderId } from "@lib/data/euplatesc"

export const metadata: Metadata = {
  title: "Procesare plată",
}

/**
 * EuPlătesc returns these GET params on the back_ref redirect.
 *
 * Note: EuPlătesc replaces (not appends to) the back_ref query string,
 * so cart_id from our original back_ref URL is lost. We reconstruct it
 * from invoice_id which is always echoed back.
 */
type EpParams = {
  cart_id?: string
  amount?: string
  curr?: string
  invoice_id?: string
  ep_id?: string
  merch_id?: string
  action?: string    // "0" = approved
  message?: string
  approval?: string
  timestamp?: string
  nonce?: string
  fp_hash?: string
}

type Props = {
  params: Promise<{ countryCode: string }>
  searchParams: Promise<EpParams>
}

export default async function EuplatescSuccessPage({ params, searchParams }: Props) {
  const { countryCode } = await params
  const sp = await searchParams

  // Prefer cart_id if somehow present; otherwise reconstruct from invoice_id
  const cartId = sp.cart_id ?? (sp.invoice_id ? `cart_${sp.invoice_id}` : null)
  const invoiceId = sp.invoice_id ?? sp.cart_id?.replace(/^cart_/, "") ?? null

  if (!cartId || !invoiceId) {
    redirect(`/${countryCode}/checkout?step=payment`)
  }

  // EuPlătesc signals success with action="0"
  if (sp.action !== "0") {
    const msg = sp.message ? encodeURIComponent(sp.message) : ""
    redirect(
      `/${countryCode}/checkout/euplatesc/fail?cart_id=${cartId}${msg ? `&message=${msg}` : ""}`
    )
  }

  // ── Primary path: IPN already placed the order ────────────────────────────
  // The IPN handler fires before EuPlătesc shows its receipt page, so by the
  // time the browser arrives here (after the 5-second countdown) the order
  // should already exist. If found, redirect straight to order confirmation.
  const existingOrderId = await getEuplatescOrderId(invoiceId!)

  if (existingOrderId) {
    redirect(`/api/checkout/clear-cart?redirect=/order/${existingOrderId}/confirmed`)
  }

  // ── Fallback path: IPN failed or hasn't fired yet ────────────────────────
  // Initiate the payment session and complete the cart here. This handles
  // edge cases such as IPN network timeouts or transient backend errors.
  const cart = await retrieveCart(cartId!)

  if (!cart) {
    redirect(`/${countryCode}/checkout?step=payment`)
  }

  // Ignore errors — the IPN may have already initiated the session
  await initiatePaymentSession(cart!, { provider_id: "pp_system_default" }).catch(() => {})

  try {
    // placeOrder calls sdk.store.cart.complete() which, on success, calls
    // redirect('/order/{id}/confirmed') internally — so it never returns normally.
    await placeOrder(cartId!)

    // If we reach here, cart.complete() returned without redirecting — unexpected.
    redirect(
      `/${countryCode}/checkout/euplatesc/fail?cart_id=${cartId}&message=${encodeURIComponent(
        "Comanda nu a putut fi finalizată. Contactează-ne."
      )}`
    )
  } catch (e: any) {
    // Next.js redirect() throws an object with a `digest` field — always rethrow.
    if (e?.digest) throw e

    redirect(
      `/${countryCode}/checkout/euplatesc/fail?cart_id=${cartId}&message=${encodeURIComponent(
        "Eroare la finalizarea comenzii. Contactează-ne."
      )}`
    )
  }
}
