import { Metadata } from "next"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import CheckoutProgress from "@modules/checkout/components/checkout-progress"

export const metadata: Metadata = {
  title: "Plată eșuată",
}

type Props = {
  params: Promise<{ countryCode: string }>
  searchParams: Promise<{ cart_id?: string; message?: string }>
}

export default async function EuplatescFailPage({ params, searchParams }: Props) {
  const { countryCode } = await params
  const { cart_id, message } = await searchParams

  const errorMessage =
    message ??
    "Plata nu a putut fi procesată. Poți încerca din nou sau alege plata ramburs."

  return (
    <div className="max-w-screen-lg mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Progress bar — stuck at payment step */}
      <div className="mb-10">
        <CheckoutProgress step="payment" />
      </div>

      {/* Error card */}
      <div className="max-w-lg mx-auto bg-white rounded-xl border border-gray-100 shadow-sm p-8">
        {/* Header */}
        <div className="flex flex-col items-center text-center gap-y-4 pb-8 border-b border-gray-100">
          <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center">
            <svg
              className="w-8 h-8 text-red-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2.5}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </div>

          <div>
            <h1 className="text-xl font-bold text-[#1A1A1A]">Plata nu a fost procesată</h1>
            <p className="text-sm text-gray-500 mt-1 max-w-xs">
              {errorMessage}
            </p>
          </div>
        </div>

        {/* Options */}
        <div className="pt-8 flex flex-col gap-y-3">
          <p className="text-sm font-semibold text-[#1A1A1A] mb-1">Ce dorești să faci?</p>

          {/* Retry card payment */}
          <LocalizedClientLink
            href={`/checkout?step=payment${cart_id ? `&cart_id=${cart_id}` : ""}`}
          >
            <button className="w-full h-12 bg-[#F27A1A] hover:bg-[#D4600E] text-white font-semibold rounded-xl transition-colors duration-150 flex items-center justify-center gap-x-2 text-sm">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
              Încearcă din nou cu cardul
            </button>
          </LocalizedClientLink>

          {/* Divider */}
          <div className="flex items-center gap-x-3 my-1">
            <div className="flex-1 h-px bg-gray-100" />
            <span className="text-xs text-gray-400">sau</span>
            <div className="flex-1 h-px bg-gray-100" />
          </div>

          {/* Switch to COD — go back to payment step */}
          <LocalizedClientLink
            href={`/checkout?step=payment${cart_id ? `&cart_id=${cart_id}` : ""}`}
          >
            <button className="w-full h-12 border-2 border-gray-200 text-[#333333] hover:border-[#F27A1A] hover:text-[#F27A1A] font-semibold rounded-xl transition-colors duration-150 flex items-center justify-center gap-x-2 text-sm">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
              Plătește ramburs la livrare
            </button>
          </LocalizedClientLink>

          {/* Back to cart */}
          <LocalizedClientLink href="/cart">
            <button className="w-full h-10 text-sm text-gray-400 hover:text-[#F27A1A] transition-colors duration-150">
              ← Înapoi la coș
            </button>
          </LocalizedClientLink>
        </div>
      </div>

      {/* Help text */}
      <p className="text-center text-xs text-gray-400 mt-6">
        Dacă problema persistă, contactează-ne la{" "}
        <a href="mailto:comenzi@orizont-srl.ro" className="text-[#F27A1A] hover:underline">
          comenzi@orizont-srl.ro
        </a>
      </p>
    </div>
  )
}
