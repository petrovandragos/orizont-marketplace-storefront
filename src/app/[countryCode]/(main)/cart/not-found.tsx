import { Metadata } from "next"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

export const metadata: Metadata = {
  title: "404",
  description: "Ceva nu a mers bine",
}

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)] px-4 text-center gap-y-4">
      <div className="w-20 h-20 rounded-full bg-[#FFF3E6] flex items-center justify-center">
        <svg className="w-10 h-10 text-[#F27A1A]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
            d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      </div>
      <h1 className="text-2xl font-semibold text-[#1D1D1F]">Coșul nu a fost găsit</h1>
      <p className="text-sm text-gray-500 max-w-sm">
        Coșul pe care ați încercat să îl accesați nu există. Ștergeți cookie-urile și încercați din nou.
      </p>
      <LocalizedClientLink
        href="/"
        className="px-8 py-3 bg-[#F27A1A] hover:bg-[#D4600E] text-white font-medium rounded-xl transition-colors duration-200 text-sm"
      >
        Mergeți la pagina principală
      </LocalizedClientLink>
    </div>
  )
}
