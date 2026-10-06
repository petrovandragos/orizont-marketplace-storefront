import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Contact",
  description: "Contactează-ne — Orizont, materiale de construcții, Sighetu Marmației.",
}

const phoneIcon = (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75}
      d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
  </svg>
)

const emailIcon = (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75}
      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
  </svg>
)

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

const EMAIL_ROWS = [
  { label: "Comenzi", email: "comenzi@orizont-srl.ro" },
  { label: "Administrație", email: "vlad@orizont-srl.ro" },
  { label: "Director Financiar", email: "monica@orizont-srl.ro" },
  { label: "Asistență tehnică", email: "oliver@orizont-srl.ro" },
]

function toTelHref(num: string) {
  return "tel:" + num.replace(/\s/g, "")
}

export default function ContactPage() {
  return (
    <div className="content-container py-12 md:py-16">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl md:text-3xl font-bold text-[#1A1A1A] mb-2">Contact</h1>
        <div className="w-12 h-1 bg-[#F27A1A] rounded mb-8" />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">

          {/* Left — contact details */}
          <div className="flex flex-col gap-y-4">

            {/* Phone departments */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="flex items-center gap-x-3 px-5 py-3.5 border-b border-gray-100">
                <div className="w-8 h-8 rounded-lg bg-[#FFF3E6] flex items-center justify-center text-[#F27A1A]">
                  {phoneIcon}
                </div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Telefon</span>
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

            {/* Email + Address */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              {EMAIL_ROWS.map(({ label, email }, i) => (
                <div
                  key={label}
                  className={`flex items-start gap-x-4 px-5 py-4 ${i < EMAIL_ROWS.length - 1 ? "border-b border-gray-50" : ""}`}
                >
                  <div className="w-9 h-9 rounded-lg bg-[#FFF3E6] flex items-center justify-center text-[#F27A1A] flex-shrink-0 mt-0.5">
                    {emailIcon}
                  </div>
                  <div className="flex flex-col gap-y-0.5">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
                      {label}
                    </span>
                    <a href={`mailto:${email}`} className="text-sm font-medium text-[#1A1A1A] hover:text-[#F27A1A] transition-colors">
                      {email}
                    </a>
                  </div>
                </div>
              ))}
              <div className="flex items-start gap-x-4 px-5 py-4 border-t border-gray-50">
                <div className="w-9 h-9 rounded-lg bg-[#FFF3E6] flex items-center justify-center text-[#F27A1A] flex-shrink-0 mt-0.5">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75}
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75}
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <div className="flex flex-col gap-y-0.5">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
                    Adresă
                  </span>
                  <span className="text-sm font-medium text-[#1A1A1A]">
                    Str. Plevnei nr. 3, Sighetu Marmației
                  </span>
                </div>
              </div>
            </div>

            {/* Schedule */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="px-5 py-4 border-b border-gray-50">
                <h2 className="text-sm font-semibold text-[#1A1A1A] uppercase tracking-wider">
                  Program
                </h2>
              </div>
              {[
                { day: "Luni – Vineri", hours: "08:00 – 17:00", open: true },
                { day: "Sâmbătă", hours: "08:00 – 13:00", open: true },
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
          </div>

          {/* Right — Google Maps */}
          <div className="flex flex-col gap-y-3">
            <div className="rounded-2xl overflow-hidden border border-gray-200 shadow-sm" style={{ height: 420 }}>
              <iframe
                title="Orizont — Hartă"
                src="https://maps.google.com/maps?q=47.9359133,23.887697&hl=ro&z=16&output=embed"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
            <a
              href="https://www.google.com/maps/place/Orizont/@47.9359169,23.8851221,1048m/data=!3m2!1e3!4b1!4m6!3m5!1s0x4737bba71e1e2ba3:0x3c2a97e9bd96a70f!8m2!3d47.9359133!4d23.887697!16s%2Fg%2F1tgp90w4"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-x-2 w-full h-10 rounded-xl bg-[#F27A1A] hover:bg-[#D4600E] text-white text-sm font-semibold transition-colors duration-150"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              Deschide în Google Maps
            </a>
          </div>

        </div>
      </div>
    </div>
  )
}
