"use client"

import { ReactNode } from "react"
import { useRouter } from "next/navigation"
import { unitLabel, fmt } from "@lib/calculators/roof"
import { track } from "@lib/util/analytics"

export type Line = { name: string; quantity: number; unit: string; note?: string; href?: string }

export function Step({ n, title, hint, children }: { n: number; title: string; hint?: string; children: ReactNode }) {
  return (
    <section className="bg-white border border-gray-200 rounded-2xl p-5 md:p-6">
      <div className="flex items-start gap-x-3 mb-4">
        <span className="w-8 h-8 rounded-lg bg-[#F27A1A] text-white font-bold flex items-center justify-center flex-shrink-0">{n}</span>
        <div>
          <h2 className="text-lg font-bold text-[#1A1A1A] leading-tight pt-1">{title}</h2>
          {hint && <p className="text-sm text-gray-500 mt-1">{hint}</p>}
        </div>
      </div>
      {children}
    </section>
  )
}

export function Choice({
  selected, onClick, title, subtitle, icon,
}: { selected: boolean; onClick: () => void; title: string; subtitle?: string; icon?: ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className={`w-full text-left rounded-xl border-2 p-3.5 transition-colors flex items-center gap-x-3 ${
        selected ? "border-[#F27A1A] bg-[#FFF3E6]" : "border-gray-200 bg-white hover:border-gray-300"
      }`}
    >
      {icon && <span className="flex-shrink-0">{icon}</span>}
      <span className="min-w-0">
        <span className={`block text-[15px] font-semibold ${selected ? "text-[#F27A1A]" : "text-[#1A1A1A]"}`}>{title}</span>
        {subtitle && <span className="block text-xs text-gray-500 mt-0.5">{subtitle}</span>}
      </span>
    </button>
  )
}

export function NumberField({
  id, label, value, onChange, unit, step = 0.1, min = 0, hint,
}: {
  id: string; label: string; value: number; onChange: (v: number) => void
  unit: string; step?: number; min?: number; hint?: string
}) {
  return (
    <div className="flex flex-col gap-y-1.5">
      <label htmlFor={id} className="text-sm font-semibold text-gray-800">{label}</label>
      <div className="relative">
        <input
          id={id}
          type="number"
          inputMode="decimal"
          min={min}
          step={step}
          value={Number.isFinite(value) ? value : ""}
          onChange={(e) => onChange(parseFloat(e.target.value.replace(",", ".")))}
          className="w-full h-11 pl-3.5 pr-12 rounded-lg border border-gray-200 text-[15px] bg-white focus:outline-none focus:ring-2 focus:ring-[#F27A1A]/30 focus:border-[#F27A1A]"
        />
        <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-sm text-gray-500 pointer-events-none">{unit}</span>
      </div>
      {hint && <p className="text-xs text-gray-500">{hint}</p>}
    </div>
  )
}

export function Stepper({ label, value, onChange, min = 0, max = 20 }: { label: string; value: number; onChange: (v: number) => void; min?: number; max?: number }) {
  return (
    <div className="flex flex-col gap-y-1.5">
      <span className="text-sm font-semibold text-gray-800">{label}</span>
      <div className="flex items-center h-11 rounded-lg border border-gray-200 bg-white w-fit">
        <button type="button" aria-label="Mai puțin" onClick={() => onChange(Math.max(min, value - 1))} className="w-11 h-full text-lg text-gray-600 hover:text-[#F27A1A]">−</button>
        <span className="w-10 text-center font-semibold">{value}</span>
        <button type="button" aria-label="Mai mult" onClick={() => onChange(Math.min(max, value + 1))} className="w-11 h-full text-lg text-gray-600 hover:text-[#F27A1A]">+</button>
      </div>
    </div>
  )
}

export function ResultTable({ title, lines }: { title: string; lines: Line[] }) {
  if (!lines.length) return null
  return (
    <div>
      <h3 className="text-sm font-bold uppercase tracking-wide text-gray-500 mb-2">{title}</h3>
      <ul className="divide-y divide-gray-100">
        {lines.map((l) => (
          <li key={l.name + l.unit} className="flex items-start justify-between gap-x-4 py-2.5">
            <span className="min-w-0">
              {l.href ? (
                <a href={l.href} className="text-[15px] font-medium text-[#1A1A1A] hover:text-[#F27A1A] underline-offset-2 hover:underline">{l.name}</a>
              ) : (
                <span className="text-[15px] font-medium text-[#1A1A1A]">{l.name}</span>
              )}
              {l.note && <span className="block text-xs text-gray-500 mt-0.5">{l.note}</span>}
            </span>
            <span className="text-[15px] font-bold text-[#1A1A1A] whitespace-nowrap">
              {fmt(l.quantity)} {unitLabel(l.unit, l.quantity)}
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}

/** Trimite lista calculată în formularul de ofertă, deja completată. */
export function SendToQuote({ calculator, summary, lines }: { calculator: string; summary: string; lines: Line[] }) {
  const router = useRouter()
  const text = [
    `Calculator ${calculator}: ${summary}`,
    ...lines.map((l) => `- ${l.name}: ${fmt(l.quantity)} ${unitLabel(l.unit, l.quantity)}${l.note ? ` (${l.note})` : ""}`),
  ].join("\n")

  return (
    <button
      type="button"
      onClick={() => {
        track("calculator_oferta", { calculator })
        router.push(`/cerere-oferta?lista=${encodeURIComponent(text.slice(0, 1800))}`)
      }}
      className="w-full h-12 rounded-xl text-[15px] font-semibold bg-[#F27A1A] hover:bg-[#D4600E] text-white transition-colors"
    >
      Cereți ofertă pentru această listă
    </button>
  )
}

export function Disclaimer({ children }: { children?: ReactNode }) {
  return (
    <p className="text-xs text-gray-500 leading-relaxed">
      {children ??
        "Cantitățile sunt orientative, calculate după datele tehnice ale producătorilor. Înainte de comandă, un coleg verifică împreună cu dumneavoastră necesarul exact."}
    </p>
  )
}

export function Breadcrumb({ items }: { items: { label: string; href?: string }[] }) {
  return (
    <nav className="text-sm text-gray-500 mb-4" aria-label="Breadcrumb">
      {items.map((it, i) => (
        <span key={it.label}>
          {i > 0 && <span className="mx-2 text-gray-300">›</span>}
          {it.href ? <a href={it.href} className="hover:text-[#F27A1A]">{it.label}</a> : <span className="text-[#1A1A1A] font-medium">{it.label}</span>}
        </span>
      ))}
    </nav>
  )
}
