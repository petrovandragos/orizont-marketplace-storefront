import { Metadata } from "next"
import { redirect } from "next/navigation"
import { retrieveCustomer } from "@lib/data/customer"
import RegisterCard from "@modules/account/components/register-card"

export const metadata: Metadata = {
  title: "Înregistrare",
  description: "Creează un cont Orizont pentru o experiență completă de cumpărături.",
}

type Props = {
  params: Promise<{ countryCode: string }>
  searchParams: Promise<{ redirectTo?: string }>
}

export default async function RegisterPage({ params, searchParams }: Props) {
  const { countryCode } = await params
  const { redirectTo = "" } = await searchParams

  // If already logged in, redirect to account or the requested page
  const customer = await retrieveCustomer().catch(() => null)
  if (customer) {
    redirect(redirectTo || `/cont`)
  }

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-10rem)] py-12 px-4">
      <div className="w-full max-w-md">
        <RegisterCard redirectTo={redirectTo} />
      </div>
    </div>
  )
}
