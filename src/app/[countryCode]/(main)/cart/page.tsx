import { retrieveCart } from "@lib/data/cart"
import { retrieveCustomer } from "@lib/data/customer"
import CartTemplate from "@modules/cart/templates"
import { Metadata } from "next"

// Cart contents are private and must never land in the shared page cache.
export const dynamic = "force-dynamic"

export const metadata: Metadata = {
  title: "Coșul de cumpărături",
  description: "Verificați produsele din coș și finalizați comanda.",
}

export default async function Cart() {
  const cart = await retrieveCart().catch(() => null)
  const customer = await retrieveCustomer().catch(() => null)

  return <CartTemplate cart={cart} customer={customer} />
}
