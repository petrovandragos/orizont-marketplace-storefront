import LocalizedClientLink from "@modules/common/components/localized-client-link"
import Chevron from "@modules/common/components/open-status/chevron"
import { CALCULATORS, ROOF_TOOLS } from "@lib/calculators/links"
import { CALCULATOR_ART } from "@modules/calculators/components/icons"
import HouseSVG from "@modules/calculators/components/house-svg"

const TITLES: Record<string, string> = { acoperis: "Acoperiș din tablă sau țiglă" }

/** Banda cu calculatoarele de materiale și vizualizatorul de acoperiș. */
export default function CalculatorsSection() {
  const [viz, cmp] = ROOF_TOOLS
  return (
    <section className="bg-[#F5F5F7] mt-20 md:mt-24 py-16 md:py-24" aria-labelledby="calc-title">
      <div className="content-container">
        <h2 id="calc-title" className="display-2 max-w-[20ch]">Știți dimensiunile. Noi calculăm restul.</h2>
        <p className="lead max-w-[46ch] mt-3">
          Calculatoarele vă dau lista de materiale, pe care o adăugați direct în oferta dumneavoastră.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mt-10">
          {CALCULATORS.map((c) => (
            <LocalizedClientLink key={c.slug} href={`/calculatoare/${c.slug}`}
              className="group bg-white rounded-[26px] p-6 lg:min-h-[300px] flex flex-col hover:shadow-[0_12px_40px_rgba(0,0,0,0.08)] transition-shadow">
              <span className="block w-[96px] h-16 text-[#F27A1A]">{CALCULATOR_ART[c.slug]}</span>
              <h3 className="text-[21px] font-semibold tracking-[-0.02em] leading-tight mt-6 lg:mt-10">{TITLES[c.slug] ?? c.short}</h3>
              <p className="text-[15px] text-[#6E6E73] mt-2">{c.tagline}</p>
              <span className="link-more mt-4 lg:mt-auto lg:pt-4">Calculați <Chevron /></span>
            </LocalizedClientLink>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)] gap-4 mt-4">
          <LocalizedClientLink href={`/calculatoare/${viz.slug}`}
            className="group bg-white rounded-[26px] overflow-hidden grid grid-cols-1 sm:grid-cols-[minmax(0,1fr)_minmax(0,1.3fr)] items-center hover:shadow-[0_12px_40px_rgba(0,0,0,0.08)] transition-shadow">
            <div className="p-7">
              <span className="text-[13px] font-semibold uppercase tracking-[0.08em] text-[#B9520A]">Nou</span>
              <h3 className="text-2xl font-semibold tracking-[-0.02em] mt-2">Cum arată casa dumneavoastră?</h3>
              <p className="text-base text-[#6E6E73] mt-2">{viz.text}</p>
              <span className="link-more mt-4">Deschideți vizualizatorul <Chevron /></span>
            </div>
            <HouseSVG
              config={{ material: "metal", roof: "7016", facade: "alb", frames: "antracit", gutters: "asortat", light: "seara" }}
              className="block w-full h-auto"
              title="Exemplu: casă cu țiglă metalică gri antracit, seara"
            />
          </LocalizedClientLink>
          <LocalizedClientLink href={`/calculatoare/${cmp.slug}`}
            className="group bg-[#192335] text-white rounded-[26px] p-7 flex flex-col hover:shadow-[0_12px_40px_rgba(0,0,0,0.18)] transition-shadow">
            <span className="block w-[96px] h-16 text-[#F27A1A]">{CALCULATOR_ART[cmp.slug]}</span>
            <h3 className="text-2xl font-semibold tracking-[-0.02em] text-white mt-6 lg:mt-auto">Tablă sau țiglă?</h3>
            <p className="text-base text-white/70 mt-2">{cmp.text}</p>
            <span className="mt-4 inline-flex items-center gap-x-1 text-[#FDBA74] text-[17px] group-hover:underline">Comparați <Chevron /></span>
          </LocalizedClientLink>
        </div>
      </div>
    </section>
  )
}
