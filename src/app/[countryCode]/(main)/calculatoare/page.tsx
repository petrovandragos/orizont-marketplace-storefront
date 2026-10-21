import { Metadata } from "next"
import { CALCULATORS, ROOF_TOOLS } from "@lib/calculators/links"
import { Breadcrumb } from "@modules/calculators/components/ui"
import { CALCULATOR_ART } from "@modules/calculators/components/icons"
import HouseSVG from "@modules/calculators/components/house-svg"

export const metadata: Metadata = {
  title: "Calculatoare de materiale",
  description:
    "Calculați gratuit necesarul pentru acoperiș, termosistem, zidărie, fundație și gresie. Vizualizați culorile acoperișului și comparați învelitorile. Orizont, Sighetu Marmației.",
  alternates: { canonical: "/calculatoare" },
}

export default function CalculatoarePage() {
  const [viz, cmp] = ROOF_TOOLS
  return (
    <div className="content-container pt-6 pb-4 md:pt-8">
      <Breadcrumb items={[{ label: "Acasă", href: "/" }, { label: "Calculatoare" }]} />
      <h1 className="display-2">Calculatoare de materiale</h1>
      <p className="lead mt-3 max-w-[48ch]">
        Aflați în câteva minute ce materiale vă trebuie și în ce cantitate. La final, adăugați lista în oferta dumneavoastră.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-10">
        {CALCULATORS.map((c) => (
          <a key={c.slug} href={`/calculatoare/${c.slug}`}
            className="group bg-[#F5F5F7] rounded-[26px] p-7 flex flex-col gap-3 hover:shadow-[0_12px_40px_rgba(0,0,0,0.08)] transition-shadow">
            <span className="block w-[120px] h-20 text-[#F27A1A] mb-6">{CALCULATOR_ART[c.slug]}</span>
            <span className="text-2xl font-semibold tracking-[-0.02em] text-[#1D1D1F]">{c.title}</span>
            <span className="text-base text-[#6E6E73] flex-1">{c.text}</span>
            <span className="text-base text-[#B9520A] group-hover:underline">Începeți calculul ›</span>
          </a>
        ))}
        <a href={`/calculatoare/${cmp.slug}`}
          className="group bg-[#192335] text-white rounded-[26px] p-7 flex flex-col gap-3 hover:shadow-[0_12px_40px_rgba(0,0,0,0.18)] transition-shadow">
          <span className="block w-[120px] h-20 text-[#F27A1A] mb-6">{CALCULATOR_ART[cmp.slug]}</span>
          <span className="text-2xl font-semibold tracking-[-0.02em]">{cmp.title}</span>
          <span className="text-base text-white/70 flex-1">{cmp.text}</span>
          <span className="text-base text-[#FDBA74] group-hover:underline">Comparați învelitorile ›</span>
        </a>
      </div>

      <a href={`/calculatoare/${viz.slug}`}
        className="group mt-4 grid grid-cols-1 md:grid-cols-[minmax(0,1fr)_minmax(0,1.25fr)] items-center gap-6 bg-[#F5F5F7] rounded-[26px] overflow-hidden hover:shadow-[0_12px_40px_rgba(0,0,0,0.08)] transition-shadow">
        <div className="p-7 md:p-10 flex flex-col gap-3">
          <span className="text-[13px] font-semibold uppercase tracking-[0.08em] text-[#B9520A]">Nou</span>
          <span className="display-2 text-[#1D1D1F]">{viz.title}</span>
          <span className="lead">{viz.text}</span>
          <span className="text-base text-[#B9520A] group-hover:underline mt-2">Încercați vizualizatorul ›</span>
        </div>
        <HouseSVG
          config={{ material: "ceramica", roof: "rosu-natur", facade: "ivoire", frames: "antracit", gutters: "asortat", light: "apus" }}
          className="block w-full h-auto"
          title="Exemplu: casă cu țiglă ceramică roșie și fațadă ivoire"
        />
      </a>
    </div>
  )
}
