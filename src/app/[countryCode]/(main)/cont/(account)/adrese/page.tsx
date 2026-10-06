import { Metadata } from "next"
import { retrieveCustomer } from "@lib/data/customer"
import { notFound } from "next/navigation"
import ContAddressBook from "@modules/account/components/cont-address-book"

export const metadata: Metadata = {
  title: "Adresele mele",
}

export default async function AdresePage() {
  const customer = await retrieveCustomer().catch(() => null)

  if (!customer) notFound()

  return (
    <div className="flex flex-col gap-y-6">
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
        <h1 className="text-xl font-bold text-[#1A1A1A]">Adresele mele</h1>
        <p className="text-sm text-gray-500 mt-1">
          Gestionează adresele tale de livrare salvate.
        </p>
      </div>

      <ContAddressBook customer={customer} />
    </div>
  )
}
