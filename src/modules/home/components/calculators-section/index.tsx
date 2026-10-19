import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { CALCULATORS } from "@lib/calculators/links"
import { CALCULATOR_ICONS, CalculatorGlyph } from "@modules/calculators/components/icons"

/** Bandă pe pagina principală: cele trei calculatoare de materiale. */
export default function CalculatorsSection() {
  return (
    <section className="content-container pt-8 md:pt-10" aria-labelledby="calc-title">
      <div className="relative overflow-hidden rounded-2xl bg-[#192335] text-white p-5 sm:p-7 md:p-8">
        <div className="relative flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4 mb-5 md:mb-6">
          <div className="max-w-xl">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-[#F27A1A] px-3 py-1 text-xs font-bold uppercase tracking-wide">
              <CalculatorGlyph className="w-3.5 h-3.5" /> Gratuit
            </span>
            <h2 id="calc-title" className="mt-3 text-2xl md:text-[28px] font-bold leading-tight !text-white">
              Calculați necesarul de materiale
            </h2>
            <p className="mt-2 text-[15px] text-white/75">
              Introduceți dimensiunile, iar calculatorul vă spune ce materiale vă trebuie și în ce cantitate. Lista o puteți trimite direct pentru ofertă.
            </p>
          </div>
          <LocalizedClientLink href="/calculatoare" className="self-start lg:self-auto text-sm font-semibold text-[#FDBA74] hover:text-white whitespace-nowrap">
            Toate calculatoarele →
          </LocalizedClientLink>
        </div>
        <div className="relative grid grid-cols-1 md:grid-cols-3 gap-3">
          {CALCULATORS.map((c) => (
            <LocalizedClientLink key={c.slug} href={`/calculatoare/${c.slug}`}
              className="group flex items-center gap-4 rounded-xl bg-white p-4 text-[#1A1A1A] ring-2 ring-transparent hover:ring-[#F27A1A] transition">
              <span className="flex-shrink-0 w-14 h-14 rounded-xl bg-[#FFF3E6] flex items-center justify-center">{CALCULATOR_ICONS[c.slug]}</span>
              <span className="flex-1 min-w-0">
                <span className="block font-bold group-hover:text-[#F27A1A]">{c.title}</span>
                <span className="block text-sm text-gray-600 md:hidden">{c.tagline}</span>
                <span className="hidden md:block text-sm text-gray-600">{c.text}</span>
              </span>
              <span className="flex-shrink-0 w-9 h-9 rounded-full bg-[#F27A1A] text-white flex items-center justify-center group-hover:bg-[#D4600E]" aria-hidden="true">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" /></svg>
              </span>
            </LocalizedClientLink>
          ))}
        </div>
      </div>
    </section>
  )
}
