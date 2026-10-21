"use client"

import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { quoteCount, useQuoteList } from "@lib/quote-list"

/**
 * Butonul din antet: „Cereți ofertă”, iar când lista are produse,
 * „Lista de ofertă” cu numărul lor. Pe telefon apare doar iconița cu număr.
 */
export default function QuoteListNav() {
  const count = quoteCount(useQuoteList())

  return (
    <>
      <LocalizedClientLink href="/cerere-oferta" className="hidden md:inline-flex btn-pill-sm gap-x-2">
        {count > 0 ? (
          <>
            Lista de ofertă
            <span className="min-w-[22px] h-[22px] px-1.5 -mr-1.5 rounded-full bg-white text-[#B9520A] text-[13px] font-semibold flex items-center justify-center tabular-nums">
              {count}
            </span>
          </>
        ) : (
          "Cereți ofertă"
        )}
      </LocalizedClientLink>

      {count > 0 && (
        <LocalizedClientLink
          href="/cerere-oferta"
          className="md:hidden relative flex items-center text-[#424245]"
          aria-label={`Lista de ofertă: ${count} ${count === 1 ? "element" : "elemente"}`}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75}
              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 7h6m-6 4h4" />
          </svg>
          <span className="absolute -top-1.5 -right-2 min-w-[18px] h-[18px] px-1 rounded-full bg-[#F27A1A] text-white text-[11px] font-semibold flex items-center justify-center tabular-nums">
            {count}
          </span>
        </LocalizedClientLink>
      )}
    </>
  )
}
