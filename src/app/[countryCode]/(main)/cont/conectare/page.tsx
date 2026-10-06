import { Metadata } from "next"
import { redirect } from "next/navigation"
import { retrieveCustomer } from "@lib/data/customer"
import LoginCard from "@modules/account/components/login-card"

export const metadata: Metadata = {
  title: "Conectare",
  description: "Conectează-te în contul tău Orizont.",
}

type Props = {
  params: Promise<{ countryCode: string }>
  searchParams: Promise<{ redirectTo?: string }>
}

export default async function LoginPage({ params, searchParams }: Props) {
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
        <LoginCard redirectTo={redirectTo} />
      </div>
    </div>
  )
}
