"use client"

import { ReactNode } from "react"
import { useRouter } from "next/navigation"
import { unitLabel, fmt } from "@lib/calculators/roof"
import { track } from "@lib/util/analytics"
import { addCalc } from "@lib/quote-list"

export type Line = { name: string; quantity: number; unit: string; note?: string; href?: string }

export function Step({ n, title, hint, children }: { n: number; title: string; hint?: string; children: ReactNode }) {
  return (
    <section className="bg-[#F5F5F7] rounded-[26px] p-5 md:p-7">
      <div className="flex items-start gap-x-3 mb-5">
        <span className="w-8 h-8 rounded-full bg-[#1D1D1F] text-white text-sm font-semibold flex items-center justify-center flex-shrink-0">{n}</span>
        <div>
          <h2 className="text-[21px] font-semibold tracking-[-0.02em] text-[#1D1D1F] leading-tight pt-0.5">{title}</h2>
          {hint && <p className="text-[15px] text-[#6E6E73] mt-1">{hint}</p>}
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
      className={`w-full text-left rounded-[18px] border-2 p-3.5 transition-colors flex items-center gap-x-3 bg-white ${
        selected ? "border-[#F27A1A]" : "border-transparent hover:border-[#D2D2D7]"
      }`}
    >
      {icon && <span className="flex-shrink-0">{icon}</span>}
      <span className="min-w-0">
        <span className="block text-[15px] font-semibold text-[#1D1D1F]">{title}</span>
        {subtitle && <span className="block text-[13px] text-[#6E6E73] mt-0.5">{subtitle}</span>}
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
      <label htmlFor={id} className="text-sm font-medium text-[#1D1D1F]">{label}</label>
      <div className="relative">
        <input
          id={id}
          type="number"
          inputMode="decimal"
          min={min}
          step={step}
          value={Number.isFinite(value) ? value : ""}
          onChange={(e) => onChange(parseFloat(e.target.value.replace(",", ".")))}
          className="w-full h-12 pl-4 pr-12 rounded-xl border border-transparent text-[17px] bg-white focus:outline-none focus:ring-2 focus:ring-[#F27A1A]/40 focus:border-[#F27A1A]"
        />
        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-[#6E6E73] pointer-events-none">{unit}</span>
      </div>
      {hint && <p className="text-[13px] text-[#6E6E73]">{hint}</p>}
    </div>
  )
}

/** Opțiuni scurte, pe un rând (ex. diametre, grosimi). */
export function Chips<T extends string | number>({ label, value, options, onChange, format }: {
  label: string; value: T; options: readonly T[]; onChange: (v: T) => void; format: (v: T) => string
}) {
  return (
    <div className="flex flex-col gap-y-1.5">
      <span className="text-sm font-medium text-[#1D1D1F]">{label}</span>
      <div className="flex flex-wrap gap-2">
        {options.map((o) => (
          <button key={String(o)} type="button" aria-pressed={value === o} onClick={() => onChange(o)}
            className={`h-10 px-4 rounded-full text-sm font-semibold border ${value === o ? "bg-[#1D1D1F] text-white border-[#1D1D1F]" : "bg-white text-[#424245] border-transparent hover:border-[#D2D2D7]"}`}>
            {format(o)}
          </button>
        ))}
      </div>
    </div>
  )
}

export function Stepper({ label, value, onChange, min = 0, max = 20 }: { label: string; value: number; onChange: (v: number) => void; min?: number; max?: number }) {
  return (
    <div className="flex flex-col gap-y-1.5">
      <span className="text-sm font-medium text-[#1D1D1F]">{label}</span>
      <div className="flex items-center h-12 rounded-full bg-white w-fit">
        <button type="button" aria-label="Mai puțin" onClick={() => onChange(Math.max(min, value - 1))} className="w-12 h-full text-lg text-[#424245] hover:text-[#1D1D1F]">−</button>
        <span className="w-10 text-center font-semibold">{value}</span>
        <button type="button" aria-label="Mai mult" onClick={() => onChange(Math.min(max, value + 1))} className="w-12 h-full text-lg text-[#424245] hover:text-[#1D1D1F]">+</button>
      </div>
    </div>
  )
}

export function ResultTable({ title, lines }: { title: string; lines: Line[] }) {
  if (!lines.length) return null
  return (
    <div>
      <h3 className="text-sm font-semibold text-[#6E6E73] mb-1">{title}</h3>
      <ul className="divide-y divide-black/[0.07]">
        {lines.map((l) => (
          <li key={l.name + l.unit} className="flex items-start justify-between gap-x-4 py-2.5">
            <span className="min-w-0">
              {l.href ? (
                <a href={l.href} className="text-[15px] font-medium text-[#1D1D1F] hover:text-[#B9520A] underline-offset-2 hover:underline">{l.name}</a>
              ) : (
                <span className="text-[15px] font-medium text-[#1D1D1F]">{l.name}</span>
              )}
              {l.note && <span className="block text-xs text-[#6E6E73] mt-0.5">{l.note}</span>}
            </span>
            <span className="text-[15px] font-semibold text-[#1D1D1F] whitespace-nowrap">
              {fmt(l.quantity)} {unitLabel(l.unit, l.quantity)}
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}

/** Adaugă rezultatul în lista de ofertă (înlocuind un calcul anterior al aceluiași calculator) și deschide lista. */
export function SendToQuote({ calculator, summary, lines }: { calculator: string; summary: string; lines: Line[] }) {
  const router = useRouter()

  return (
    <button
      type="button"
      onClick={() => {
        track("calculator_oferta", { calculator })
        addCalc({
          id: calculator,
          title: `Calculator ${calculator}`,
          summary,
          lines: lines.map((l) => ({
            name: l.name,
            amount: `${fmt(l.quantity)} ${unitLabel(l.unit, l.quantity)}`,
            note: l.note,
            href: l.href,
          })),
          href: window.location.pathname,
        })
        router.push("/cerere-oferta")
      }}
      className="w-full btn-pill"
    >
      Adăugați în lista de ofertă
    </button>
  )
}

export function Disclaimer({ children }: { children?: ReactNode }) {
  return (
    <p className="text-xs text-[#6E6E73] leading-relaxed">
      {children ??
        "Cantitățile sunt orientative, calculate după datele tehnice ale producătorilor. Înainte de comandă, un coleg verifică împreună cu dumneavoastră necesarul exact."}
    </p>
  )
}

export function Breadcrumb({ items }: { items: { label: string; href?: string }[] }) {
  return (
    <nav className="text-[13px] text-[#6E6E73] mb-4" aria-label="Breadcrumb">
      {items.map((it, i) => (
        <span key={it.label}>
          {i > 0 && <span className="mx-2 text-gray-300">›</span>}
          {it.href ? <a href={it.href} className="hover:text-[#1D1D1F] hover:underline">{it.label}</a> : <span className="text-[#1D1D1F]">{it.label}</span>}
        </span>
      ))}
    </nav>
  )
}
