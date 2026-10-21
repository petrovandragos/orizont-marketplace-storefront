"use client"

import { useState } from "react"
import Image from "next/image"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import {
  QuoteList,
  clearQuoteList,
  removeCalc,
  removeProduct,
  setProductQuantity,
} from "@lib/quote-list"

const RemoveButton = ({ onClick, label }: { onClick: () => void; label: string }) => (
  <button
    type="button"
    onClick={onClick}
    aria-label={label}
    className="w-9 h-9 flex-none flex items-center justify-center rounded-full text-[#86868B] hover:text-[#1D1D1F] hover:bg-[#F5F5F7] transition-colors"
  >
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
  </button>
)

function QtyInput({ handle, quantity, unit, title }: { handle: string; quantity: number; unit: string; title: string }) {
  const [draft, setDraft] = useState<string | null>(null)
  const commit = (v: string) => {
    const n = parseInt(v, 10)
    if (!isNaN(n)) setProductQuantity(handle, n)
    setDraft(null)
  }
  return (
    <div className="flex items-center gap-x-2">
      <div className="flex items-center border border-[#D2D2D7] rounded-full overflow-hidden bg-white">
        <button type="button" onClick={() => setProductQuantity(handle, quantity - 1)} disabled={quantity <= 1}
          aria-label={`Scădeți cantitatea pentru ${title}`}
          className="w-8 h-8 flex items-center justify-center text-[#6E6E73] hover:text-[#1D1D1F] disabled:opacity-40">
          −
        </button>
        <input
          type="number"
          inputMode="numeric"
          min={1}
          value={draft ?? String(quantity)}
          onChange={(e) => setDraft(e.target.value)}
          onBlur={(e) => commit(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), commit((e.target as HTMLInputElement).value))}
          aria-label={`Cantitate pentru ${title}`}
          className="w-14 h-8 text-center text-[15px] font-semibold text-[#1D1D1F] border-x border-[#D2D2D7] focus:outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
        />
        <button type="button" onClick={() => setProductQuantity(handle, quantity + 1)}
          aria-label={`Creșteți cantitatea pentru ${title}`}
          className="w-8 h-8 flex items-center justify-center text-[#6E6E73] hover:text-[#1D1D1F]">
          +
        </button>
      </div>
      <span className="text-[13px] text-[#6E6E73]">× {unit}</span>
    </div>
  )
}

/** Lista de ofertă afișată în pagina „Cereți o ofertă”. */
export default function QuoteListItems({ list }: { list: QuoteList }) {
  return (
    <div className="bg-white rounded-[22px] p-4 md:p-5">
      <div className="flex items-center justify-between gap-x-3 mb-2">
        <h2 className="text-[19px] font-semibold tracking-[-0.015em] text-[#1D1D1F]">Lista dumneavoastră</h2>
        <button type="button" onClick={clearQuoteList} className="text-sm text-[#6E6E73] hover:text-[#1D1D1F] hover:underline">
          Goliți lista
        </button>
      </div>

      <ul className="divide-y divide-black/[0.07]">
        {list.products.map((p) => (
          <li key={p.handle} className="flex items-center gap-x-3 py-3">
            <LocalizedClientLink href={`/products/${p.handle}`} className="relative w-14 h-14 flex-none rounded-xl bg-[#F5F5F7] overflow-hidden">
              {p.thumbnail && (
                <Image src={p.thumbnail} alt="" fill sizes="56px" className="object-contain p-1.5" />
              )}
            </LocalizedClientLink>
            <div className="min-w-0 flex-1">
              <LocalizedClientLink href={`/products/${p.handle}`}
                className="block text-[15px] font-medium text-[#1D1D1F] leading-snug line-clamp-2 hover:text-[#B9520A]">
                {p.title}
              </LocalizedClientLink>
              <div className="mt-1.5">
                <QtyInput handle={p.handle} quantity={p.quantity} unit={p.unit} title={p.title} />
              </div>
            </div>
            <RemoveButton onClick={() => removeProduct(p.handle)} label={`Eliminați ${p.title} din listă`} />
          </li>
        ))}

        {list.calcs.map((c) => (
          <li key={c.id} className="py-3">
            <div className="flex items-start gap-x-3">
              <span className="w-14 h-14 flex-none rounded-xl bg-[#FFF3E6] text-[#B9520A] flex items-center justify-center" aria-hidden="true">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <rect x="5" y="3" width="14" height="18" rx="2.5" strokeWidth={1.6} />
                  <path strokeLinecap="round" strokeWidth={1.6} d="M8.5 7h7M8.5 11h1M12 11h1M15.5 11h0M8.5 14.5h1M12 14.5h1M8.5 18h1M12 18h1M15.5 14.5V18" />
                </svg>
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-[15px] font-semibold text-[#1D1D1F] leading-snug">{c.title}</p>
                <p className="text-[13px] text-[#6E6E73] leading-snug mt-0.5">{c.summary}</p>
                <details className="group mt-1.5">
                  <summary className="text-[13px] font-medium text-[#B9520A] cursor-pointer list-none [&::-webkit-details-marker]:hidden">
                    <span className="group-open:hidden">Vedeți cele {c.lines.length} materiale ›</span>
                    <span className="hidden group-open:inline">Ascundeți materialele</span>
                  </summary>
                  <ul className="mt-2 flex flex-col gap-y-1">
                    {c.lines.map((l) => (
                      <li key={l.name + l.amount} className="flex justify-between gap-x-3 text-[13px]">
                        <span className="text-[#424245] min-w-0">{l.name}</span>
                        <span className="font-semibold text-[#1D1D1F] whitespace-nowrap">{l.amount}</span>
                      </li>
                    ))}
                  </ul>
                </details>
                {c.href && (
                  <LocalizedClientLink href={c.href} className="inline-block mt-1.5 text-[13px] text-[#6E6E73] hover:text-[#1D1D1F] hover:underline">
                    Modificați calculul
                  </LocalizedClientLink>
                )}
              </div>
              <RemoveButton onClick={() => removeCalc(c.id)} label={`Eliminați ${c.title} din listă`} />
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
