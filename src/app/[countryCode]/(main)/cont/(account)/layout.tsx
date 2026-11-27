import { redirect } from "next/navigation"
import { retrieveCustomer } from "@lib/data/customer"
import ContSidebar from "@modules/account/components/cont-sidebar"

// Account pages include the signed-in customer. Keep them fully dynamic.
export const dynamic = "force-dynamic"

type Props = {
  children: React.ReactNode
  params: Promise<{ countryCode: string }>
}

export default async function ContAccountLayout({ children, params }: Props) {
  const { countryCode } = await params

  const customer = await retrieveCustomer().catch(() => null)

  if (!customer) {
    // Encode the current intended destination so login can redirect back
    redirect(`/cont/conectare?redirectTo=/cont`)
  }

  return (
    <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col lg:flex-row gap-x-8 gap-y-6 items-start">
        {/* Sidebar */}
        <ContSidebar customer={customer} />

        {/* Content */}
        <div className="flex-1 min-w-0">{children}</div>
      </div>
    </div>
  )
}
