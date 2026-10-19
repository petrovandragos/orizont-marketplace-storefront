import React from "react"
import { Metadata } from "next"
import { CALCULATORS } from "@lib/calculators/links"
import { Breadcrumb } from "@modules/calculators/components/ui"

export const metadata: Metadata = {
  title: "Calculatoare de materiale",
  description:
    "Calculați gratuit necesarul de tablă pentru acoperiș, materialele pentru termosistem și zidărie. Orizont, depozit de materiale de construcții în Sighetu Marmației.",
  alternates: { canonical: "/calculatoare" },
}

const ICONS: Record<string, React.ReactNode> = {
  acoperis: <svg viewBox="0 0 48 40" className="w-12 h-10" aria-hidden="true"><rect x="10" y="22" width="28" height="16" rx="1.5" fill="#FED7AA" /><polygon points="4,24 24,6 44,24 40,24 24,10 8,24" fill="#F27A1A" /></svg>,
  termosistem: <svg viewBox="0 0 48 40" className="w-12 h-10" aria-hidden="true"><rect x="6" y="4" width="14" height="32" fill="#FDBA74" /><rect x="20" y="4" width="13" height="32" fill="#fff" stroke="#F27A1A" /><rect x="33" y="4" width="4" height="32" fill="#F27A1A" /></svg>,
  zidarie: <svg viewBox="0 0 48 40" className="w-12 h-10" aria-hidden="true">{[0, 1, 2].map((r) => [0, 1].map((k) => <rect key={`${r}${k}`} x={(r % 2 ? -8 : 3) + k * 22} y={5 + r * 11} width="20" height="9" rx="1" fill="#FED7AA" stroke="#F27A1A" />))}</svg>,
}

export default function CalculatoarePage() {
  return (
    <div className="content-container py-8 md:py-12">
      <Breadcrumb items={[{ label: "Acasă", href: "/" }, { label: "Calculatoare" }]} />
      <h1 className="text-2xl md:text-3xl font-bold text-[#1A1A1A]">Calculatoare de materiale</h1>
      <p className="text-gray-600 mt-2 max-w-2xl">
        Aflați în câteva minute ce materiale vă trebuie și în ce cantitate. La final puteți trimite lista direct pentru o ofertă.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
        {CALCULATORS.map((c) => (
          <a key={c.slug} href={`/calculatoare/${c.slug}`}
            className="group bg-white border border-gray-200 rounded-2xl p-6 flex flex-col gap-3 hover:border-[#F27A1A] transition-colors">
            <span className="w-16 h-16 rounded-xl bg-[#FFF3E6] flex items-center justify-center">{ICONS[c.slug]}</span>
            <span className="text-lg font-bold text-[#1A1A1A] group-hover:text-[#F27A1A]">{c.title}</span>
            <span className="text-[15px] text-gray-600 flex-1">{c.text}</span>
            <span className="text-sm font-semibold text-[#F27A1A]">Începeți calculul</span>
          </a>
        ))}
      </div>
    </div>
  )
}
