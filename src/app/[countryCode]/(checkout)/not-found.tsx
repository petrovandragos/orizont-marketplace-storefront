import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "404",
  description: "Ceva nu a mers bine",
}

export default async function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)] px-4 text-center">
      <div className="w-20 h-20 rounded-full bg-[#FFF3E6] flex items-center justify-center mb-6">
        <svg className="w-10 h-10 text-[#F27A1A]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
            d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>

      <p className="text-[#F27A1A] text-xs uppercase tracking-wider mb-2">Eroare 404</p>
      <h1 className="text-3xl font-semibold text-[#1D1D1F] mb-3">Pagina nu a fost găsită</h1>
      <p className="text-gray-500 max-w-sm mb-8">
        Pagina pe care ai încercat să o accesezi nu există.
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
