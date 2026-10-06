import { retrieveCart, clearCartShippingMethods } from "@lib/data/cart"
import { retrieveCustomer } from "@lib/data/customer"
import CheckoutForm from "@modules/checkout/templates/checkout-form"
import CheckoutAuthChoice from "@modules/checkout/components/checkout-auth-choice"
import { Metadata } from "next"
import { notFound } from "next/navigation"

export const metadata: Metadata = {
  title: "Finalizare comandă",
  description: "Finalizează comanda ta de materiale de construcții.",
}

type Props = {
  searchParams: Promise<{ step?: string; method?: string; guest?: string }>
}

export default async function Checkout({ searchParams }: Props) {
  const { step = "delivery", method = "livrare", guest } = await searchParams

  let cart = step === "delivery"
    ? await clearCartShippingMethods().catch(() => retrieveCart().catch(() => null))
    : await retrieveCart().catch(() => null)

  if (!cart || !cart.items?.length) {
    return notFound()
  }

  const customer = await retrieveCustomer().catch(() => null)

  // Show login/guest choice on the first step when not logged in and not already a guest
  if (!customer && step === "delivery" && !guest) {
    return <CheckoutAuthChoice />
  }

  return <CheckoutForm cart={cart} customer={customer} step={step} method={method} />
}
