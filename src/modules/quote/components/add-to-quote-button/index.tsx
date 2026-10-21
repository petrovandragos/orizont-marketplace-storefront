"use client"

import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { addProduct, useQuoteList } from "@lib/quote-list"
import { track } from "@lib/util/analytics"

type Props = {
  handle: string
  title: string
  thumbnail?: string | null
  unit?: string
  size?: "card" | "pdp"
}

const PlusIcon = () => (
  <svg className="w-4 h-4 flex-none" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v14M5 12h14" />
  </svg>
)

const CheckIcon = () => (
  <svg className="w-4 h-4 flex-none" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M5 13l4 4L19 7" />
  </svg>
)

/** Adaugă produsul în lista de ofertă; după adăugare devine link spre listă. */
export default function AddToQuoteButton({ handle, title, thumbnail, unit = "bucată", size = "card" }: Props) {
  const list = useQuoteList()
  const inList = list.products.find((p) => p.handle === handle)

  const add = () => {
    addProduct({ handle, title, thumbnail, unit })
    track("lista_oferta_adaugare", { produs: title })
  }

  if (size === "card") {
    return inList ? (
      <LocalizedClientLink
        href="/cerere-oferta"
        className="w-full flex items-center justify-center gap-x-1.5 h-10 px-3 rounded-full text-sm font-medium bg-[#1D1D1F] text-white hover:bg-black transition-colors"
      >
        <CheckIcon />
        <span className="truncate">În ofertă<span className="hidden sm:inline"> · vedeți lista</span></span>
      </LocalizedClientLink>
    ) : (
      <button
        type="button"
        onClick={add}
        className="w-full flex items-center justify-center gap-x-1.5 h-10 px-3 rounded-full text-sm font-medium bg-white border border-[#D2D2D7] text-[#1D1D1F] hover:border-[#1D1D1F] transition-colors"
      >
        <PlusIcon />
        <span className="truncate">Adăugați în ofertă</span>
      </button>
    )
  }

  return inList ? (
    <div className="flex items-center gap-x-2">
      <button
        type="button"
        onClick={add}
        className="flex-1 h-12 flex items-center justify-center gap-x-2 rounded-full text-[15px] sm:text-[17px] font-medium bg-white border-2 border-[#1D1D1F] text-[#1D1D1F]"
        aria-label={`Adăugați încă o bucată în lista de ofertă (acum ${inList.quantity})`}
      >
        <CheckIcon />
        În lista de ofertă ({inList.quantity})
      </button>
      <LocalizedClientLink
        href="/cerere-oferta"
        className="h-12 px-5 flex items-center rounded-full text-[15px] font-medium bg-[#1D1D1F] text-white hover:bg-black whitespace-nowrap"
      >
        Vedeți lista ›
      </LocalizedClientLink>
    </div>
  ) : (
    <button
      type="button"
      onClick={add}
      className="w-full h-12 flex items-center justify-center gap-x-2 rounded-full text-[15px] sm:text-[17px] font-medium bg-white border border-[#D2D2D7] text-[#1D1D1F] hover:border-[#1D1D1F] transition-colors"
    >
      <PlusIcon />
      Adăugați în lista de ofertă
    </button>
  )
}
