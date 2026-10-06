import { Metadata } from "next"
import { retrieveCustomer } from "@lib/data/customer"
import { notFound } from "next/navigation"
import ContProfileForm from "@modules/account/components/cont-profile-form"

export const metadata: Metadata = {
  title: "Informații personale",
}

export default async function InformatiiPage() {
  const customer = await retrieveCustomer().catch(() => null)

  if (!customer) notFound()

  return (
    <div className="flex flex-col gap-y-6">
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
        <h1 className="text-xl font-bold text-[#1A1A1A]">Informații personale</h1>
        <p className="text-sm text-gray-500 mt-1">
          Actualizează datele tale de contact.
        </p>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
        <ContProfileForm customer={customer} />
      </div>
    </div>
  )
}
