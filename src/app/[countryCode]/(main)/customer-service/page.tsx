import { Metadata } from "next"
import AvailabilityBadge from "@modules/layout/components/availability-badge"

export const metadata: Metadata = {
  title: "Serviciu Clienți",
  description: "Suntem aici să te ajutăm. Contactează echipa noastră de suport pentru orice întrebare legată de comenzi, livrare sau produse.",
}

const FAQ_ITEMS = [
  {
    q: "Cum pot urmări comanda mea?",
    a: "După plasarea comenzii vei primi un email de confirmare cu numărul comenzii. Ne poți contacta telefonic sau pe email cu numărul comenzii și îți oferim imediat statusul acesteia.",
  },
  {
    q: "Care este termenul de livrare?",
    a: "Livrăm în 1–3 zile lucrătoare în Sighetu Marmației și împrejurimi. Pentru localitățile mai îndepărtate, termenul poate fi de 2–5 zile lucrătoare. Vei fi contactat înainte de livrare pentru confirmare.",
  },
  {
    q: "Pot modifica sau anula o comandă?",
    a: "Da, poți solicita modificarea sau anularea unei comenzi dacă aceasta nu a intrat încă în procesare. Contactează-ne cât mai rapid la numerele de telefon de mai jos.",
  },
  {
    q: "Cum funcționează returul?",
    a: "Produsele pot fi returnate în termen de 14 zile calendaristice de la primire, dacă sunt în starea originală și ambalate corespunzător. Contactează-ne pentru a iniția procesul de retur.",
  },
  {
    q: "Oferiți consultanță pentru proiecte de construcții?",
    a: "Absolut! Echipa noastră de specialiști te poate ghida în alegerea materialelor potrivite pentru proiectul tău. Sună-ne sau vino direct la depozit.",
  },
  {
    q: "Cum plătesc comanda?",
    a: "Acceptăm plata online cu cardul la finalizarea comenzii sau plata ramburs la livrare. Pentru comenzi mari, contactează-ne pentru opțiuni de plată personalizate.",
  },
]

const TOPICS = [
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75}
          d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
      </svg>
    ),
    title: "Comenzi",
    desc: "Urmărire, modificări, anulări",
    href: "tel:0730076606",
    contact: "0730 076 606",
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75}
          d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
      </svg>
    ),
    title: "Livrare",
    desc: "Termene, zone, programare",
    href: "/livrare",
    contact: null,
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75}
          d="M16 15v-1a4 4 0 00-4-4H8m0 0l3 3m-3-3l3-3m9 14V5a2 2 0 00-2-2H6a2 2 0 00-2 2v16l4-2 4 2 4-2 4 2z" />
      </svg>
    ),
    title: "Returnări",
    desc: "Politică, procedură, ramburs",
    href: "mailto:comenzi@orizont-srl.ro",
    contact: "comenzi@orizont-srl.ro",
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75}
          d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
      </svg>
    ),
    title: "Produse & Stoc",
    desc: "Disponibilitate, specificații",
    href: "tel:0730076606",
    contact: "0730 076 606",
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75}
          d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    title: "Facturare & Plăți",
    desc: "Facturi, metode de plată",
    href: "mailto:comenzi@orizont-srl.ro",
    contact: "comenzi@orizont-srl.ro",
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75}
          d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
      </svg>
    ),
    title: "Consultanță tehnică",
    desc: "Alegerea materialelor potrivite",
    href: "tel:0729148110",
    contact: "0729 148 110",
  },
]

const PHONE_DEPTS = [
  { label: "Comenzi", numbers: ["0730 076 606"] },
  { label: "Obiecte sanitare, gresie și faianță", numbers: ["0730 076 593"] },
  { label: "Materiale de construcții", numbers: ["0729 148 110", "0755 612 281"] },
  { label: "Finisaje", numbers: ["0730 076 597", "0730 076 593"] },
  { label: "Instalații sanitare", numbers: ["0730 076 595"] },
  { label: "Instalații electrice", numbers: ["0730 076 595"] },
  { label: "Scule și echipamente", numbers: ["0730 076 595"] },
  { label: "Amenajări exterioare", numbers: ["0729 148 110"] },
]

function toTelHref(num: string) {
  return "tel:" + num.replace(/\s/g, "")
}

export default function CustomerServicePage() {
  return (
    <div className="content-container py-12 md:py-16">
      <div className="max-w-4xl mx-auto">

        {/* ── Header ── */}
        <div className="mb-10">
          <h1 className="text-2xl md:text-3xl font-bold text-[#1A1A1A] mb-2">
            Serviciu Clienți
          </h1>
          <div className="w-12 h-1 bg-[#F27A1A] rounded mb-4" />
          <p className="text-gray-500 text-base max-w-xl">
            Suntem aici pentru tine. Echipa noastră îți stă la dispoziție pentru orice întrebare sau problemă legată de comanda ta.
          </p>
        </div>

        {/* ── Contact channels ── */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-12">
          {/* Phone */}
          <a
            href="tel:0730076606"
            className="group flex flex-col items-center gap-y-3 p-6 bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-md hover:border-[#F27A1A] transition-all duration-200 text-center"
          >
            <div className="w-12 h-12 rounded-full bg-[#FFF3E6] flex items-center justify-center text-[#F27A1A] group-hover:bg-[#F27A1A] group-hover:text-white transition-colors duration-200">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-1">Telefon comenzi</p>
              <p className="text-sm font-semibold text-[#1A1A1A]">0730 076 606</p>
            </div>
            <AvailabilityBadge />
          </a>

          {/* Email */}
          <a
            href="mailto:comenzi@orizont-srl.ro"
            className="group flex flex-col items-center gap-y-3 p-6 bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-md hover:border-[#F27A1A] transition-all duration-200 text-center"
          >
            <div className="w-12 h-12 rounded-full bg-[#FFF3E6] flex items-center justify-center text-[#F27A1A] group-hover:bg-[#F27A1A] group-hover:text-white transition-colors duration-200">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-1">Email</p>
              <p className="text-sm font-semibold text-[#1A1A1A]">comenzi@orizont-srl.ro</p>
            </div>
            <span className="mt-1 text-xs text-gray-400">Răspuns în max. 24h</span>
          </a>

          {/* Visit */}
          <a
            href="/contact"
            className="group flex flex-col items-center gap-y-3 p-6 bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-md hover:border-[#F27A1A] transition-all duration-200 text-center"
          >
            <div className="w-12 h-12 rounded-full bg-[#FFF3E6] flex items-center justify-center text-[#F27A1A] group-hover:bg-[#F27A1A] group-hover:text-white transition-colors duration-200">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-1">Vizitează-ne</p>
              <p className="text-sm font-semibold text-[#1A1A1A]">Str. Plevnei nr. 3</p>
              <p className="text-sm text-gray-500">Sighetu Marmației</p>
            </div>
            <span className="mt-1 text-xs text-gray-400">Vezi pe hartă →</span>
          </a>
        </div>

        {/* ── Topics ── */}
        <div className="mb-12">
          <h2 className="text-lg font-bold text-[#1A1A1A] mb-1">Cu ce te putem ajuta?</h2>
          <p className="text-sm text-gray-500 mb-5">Alege un subiect și te redirecționăm rapid.</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
            {TOPICS.map(({ icon, title, desc, href, contact }) => (
              <a
                key={title}
                href={href}
                className="group flex items-start gap-x-3 p-4 bg-white border border-gray-100 rounded-xl shadow-sm hover:shadow-md hover:border-[#F27A1A] transition-all duration-200"
              >
                <div className="w-9 h-9 rounded-lg bg-[#FFF3E6] flex items-center justify-center text-[#F27A1A] flex-shrink-0 group-hover:bg-[#F27A1A] group-hover:text-white transition-colors duration-200">
                  {icon}
                </div>
                <div>
                  <p className="text-sm font-semibold text-[#1A1A1A] leading-tight">{title}</p>
                  <p className="text-xs text-gray-400 mt-0.5 leading-tight">{desc}</p>
                  {contact && (
                    <p className="text-xs font-semibold text-[#F27A1A] mt-1.5 leading-tight">{contact}</p>
                  )}
                </div>
              </a>
            ))}
          </div>

          {/* Phone directory */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="flex items-center gap-x-3 px-5 py-3.5 border-b border-gray-100">
              <svg className="w-4 h-4 text-[#F27A1A]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Telefoane departamente</span>
            </div>
            {PHONE_DEPTS.map(({ label, numbers }, i) => (
              <div
                key={label}
                className={`flex items-start justify-between gap-x-4 px-5 py-3 ${i < PHONE_DEPTS.length - 1 ? "border-b border-gray-50" : ""}`}
              >
                <span className="text-sm text-gray-500 flex-1">{label}</span>
                <div className="flex flex-col items-end gap-y-0.5">
                  {numbers.map(n => (
                    <a key={n} href={toTelHref(n)} className="text-sm font-semibold text-[#F27A1A] hover:text-[#D4600E] transition-colors whitespace-nowrap">
                      {n}
                    </a>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── FAQ ── */}
        <div className="mb-12">
          <h2 className="text-lg font-bold text-[#1A1A1A] mb-1">Întrebări frecvente</h2>
          <p className="text-sm text-gray-500 mb-5">Răspunsuri rapide la cele mai comune întrebări.</p>
          <div className="flex flex-col gap-y-2">
            {FAQ_ITEMS.map(({ q, a }) => (
              <details
                key={q}
                className="group bg-white border border-gray-100 rounded-xl shadow-sm overflow-hidden"
              >
                <summary className="flex items-center justify-between gap-x-4 px-5 py-4 cursor-pointer select-none list-none">
                  <span className="text-sm font-semibold text-[#1A1A1A]">{q}</span>
                  <svg
                    className="w-4 h-4 text-[#F27A1A] flex-shrink-0 transition-transform duration-200 group-open:rotate-45"
                    fill="none" stroke="currentColor" viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                </summary>
                <div className="px-5 pb-4 text-sm text-gray-500 leading-relaxed border-t border-gray-50 pt-3">
                  {a}
                </div>
              </details>
            ))}
          </div>
        </div>

        {/* ── Schedule + CTA banner ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Schedule */}
          <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-50">
              <h3 className="text-sm font-semibold text-[#1A1A1A] uppercase tracking-wider">
                Program suport
              </h3>
            </div>
            {[
              { day: "Luni – Vineri", hours: "07:00 – 18:00", open: true },
              { day: "Sâmbătă", hours: "08:00 – 14:00", open: true },
              { day: "Duminică", hours: "Închis", open: false },
            ].map(({ day, hours, open }) => (
              <div key={day} className="flex items-center justify-between px-5 py-3 border-b border-gray-50 last:border-b-0">
                <span className="text-sm text-gray-600">{day}</span>
                <span className={`text-sm font-semibold ${open ? "text-[#1A1A1A]" : "text-[#D32F2F]"}`}>
                  {hours}
                </span>
              </div>
            ))}
          </div>

          {/* CTA card */}
          <div className="bg-[#F27A1A] rounded-2xl shadow-sm p-6 flex flex-col justify-between gap-y-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-orange-100 mb-2">
                Nevoie urgentă?
              </p>
              <h3 className="text-lg font-bold text-white leading-snug">
                Sună-ne direct și rezolvăm imediat.
              </h3>
              <p className="text-sm text-orange-100 mt-2">
                Echipa noastră răspunde rapid în orele de program.
              </p>
            </div>
            <a
              href="tel:0730076606"
              className="flex items-center justify-center gap-x-2 w-full h-10 rounded-xl bg-white text-[#F27A1A] text-sm font-bold hover:bg-orange-50 transition-colors duration-150"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              0730 076 606
            </a>
          </div>
        </div>

      </div>
    </div>
  )
}
