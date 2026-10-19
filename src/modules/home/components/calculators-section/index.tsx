import LocalizedClientLink from "@modules/common/components/localized-client-link"
import Chevron from "@modules/common/components/open-status/chevron"
import { CALCULATORS } from "@lib/calculators/links"
import { CALCULATOR_ART } from "@modules/calculators/components/icons"

const TITLES: Record<string, string> = { acoperis: "Tablă pentru acoperiș", termosistem: "Termosistem", zidarie: "Zidărie" }

/** Banda cu cele trei calculatoare de materiale. */
export default function CalculatorsSection() {
  return (
    <section className="bg-[#F5F5F7] mt-20 md:mt-24 py-16 md:py-24" aria-labelledby="calc-title">
      <div className="content-container">
        <h2 id="calc-title" className="display-2 max-w-[20ch]">Știți dimensiunile. Noi calculăm restul.</h2>
        <p className="lead max-w-[46ch] mt-3">
          Calculatoarele vă dau lista de materiale, pe care o puteți trimite direct pentru ofertă.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-10">
          {CALCULATORS.map((c) => (
            <LocalizedClientLink key={c.slug} href={`/calculatoare/${c.slug}`}
              className="group bg-white rounded-[26px] p-7 md:min-h-[320px] flex flex-col hover:shadow-[0_12px_40px_rgba(0,0,0,0.08)] transition-shadow">
              <span className="block w-[120px] h-20 text-[#F27A1A]">{CALCULATOR_ART[c.slug]}</span>
              <h3 className="text-2xl font-semibold tracking-[-0.02em] mt-6 md:mt-16">{TITLES[c.slug] ?? c.short}</h3>
              <p className="text-base text-[#6E6E73] mt-2">{c.text}</p>
              <span className="link-more mt-4">Începeți calculul <Chevron /></span>
            </LocalizedClientLink>
          ))}
        </div>
      </div>
    </section>
  )
}
