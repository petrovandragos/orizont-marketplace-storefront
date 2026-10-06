import { retrieveCart } from "@lib/data/cart"
import { retrieveCustomer } from "@lib/data/customer"
import CartTemplate from "@modules/cart/templates"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Coșul tău",
  description: "Verifică produsele din coșul tău și finalizează comanda.",
}

export default async function Cart() {
  const cart = await retrieveCart().catch(() => null)
  const customer = await retrieveCustomer().catch(() => null)

  return <CartTemplate cart={cart} customer={customer} />
}
