import Image from "next/image"
import CookieSettingsButton from "@modules/analytics/components/cookie-settings-button"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

const INFO_LINKS = [
  { label: "Despre noi", href: "/despre-noi" },
  { label: "Livrare", href: "/livrare" },
  { label: "Contact", href: "/contact" },
  { label: "Serviciu Clienți", href: "/customer-service" },
]

const LEGAL_LINKS = [
  { label: "Termeni și condiții", href: "/termeni-si-conditii" },
  { label: "Politica de confidențialitate", href: "/politica-de-confidentialitate" },
  { label: "Politica de retur", href: "/politica-de-retur" },
]

const CERT_LINKS = [
  { label: "ISO 9001 : 2008", href: "/certificari" },
  { label: "ISO 14001 : 2005", href: "/certificari" },
  { label: "ISO 18001 : 2008", href: "/certificari" },
]

function FooterHeading({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="text-[11px] font-semibold text-gray-500 uppercase tracking-widest">
      {children}
    </h3>
  )
}

export default function Footer() {
  return (
    <footer className="w-full">
      {/* ── Orange banner ── */}
      <div className="bg-[#F27A1A]">
        <div className="content-container py-3.5 flex items-center justify-center">
          <p className="text-white text-sm font-medium text-center">
            <span className="font-bold">Orizont</span>
            {" — "}
            Materiale de construcții pentru proiectele tale
          </p>
        </div>
      </div>

      {/* ── Main body ── */}
      <div className="bg-[#1A1A1A]">
        <div className="content-container py-12 md:py-14">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-10 md:gap-8">

            {/* Column 1–2 — Company info */}
            <div className="flex flex-col gap-y-5 sm:col-span-2 lg:col-span-2">
              <LocalizedClientLink href="/" className="inline-block">
                <Image
                  src="/logo.png"
                  alt="Orizont"
                  width={211}
                  height={55}
                  className="h-9 w-auto object-contain brightness-0 invert"
                  unoptimized
                />
              </LocalizedClientLink>

              <p className="text-sm text-gray-400 leading-relaxed max-w-[280px]">
                Depozit de materiale de construcții cu o gamă completă de produse
                pentru orice proiect, de la fundație până la finisaje.
              </p>

              <ul className="flex flex-col gap-y-3 text-sm text-gray-400">
                {/* Address */}
                <li className="flex items-start gap-x-3">
                  <svg className="w-4 h-4 mt-0.5 flex-shrink-0 text-[#F27A1A]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span>Str. Plevnei nr. 3, Sighetu Marmației</span>
                </li>

                {/* Phone */}
                <li className="flex items-start gap-x-3">
                  <svg className="w-4 h-4 mt-1 flex-shrink-0 text-[#F27A1A]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  <div className="flex flex-col gap-y-0.5">
                    <span className="text-[10px] uppercase tracking-wider text-gray-500">Contact comenzi</span>
                    <a href="tel:0730076606" className="text-gray-300 font-semibold hover:text-white transition-colors">
                      0730 076 606
                    </a>
                  </div>
                </li>

                {/* Email */}
                <li className="flex items-center gap-x-3">
                  <svg className="w-4 h-4 flex-shrink-0 text-[#F27A1A]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <a href="mailto:comenzi@orizont-srl.ro" className="hover:text-white transition-colors">
                    comenzi@orizont-srl.ro
                  </a>
                </li>
              </ul>

              {/* Social */}
              <div className="flex flex-col gap-y-2">
                <a
                  href="https://www.facebook.com/OrizontSighetuMarmatiei"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Facebook Orizont"
                  className="flex items-center gap-x-2 text-sm text-gray-400 hover:text-white transition-colors w-fit"
                >
                  <svg className="w-5 h-5 text-[#F27A1A]" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M22 12c0-5.522-4.477-10-10-10S2 6.478 2 12c0 4.991 3.657 9.128 8.438 9.878V14.89h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
                  </svg>
                  <span>Facebook</span>
                </a>
                <a
                  href="https://www.instagram.com/orizont.sighetumarmatiei?igsh=Y2dnbjh5a3FnaGFu"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram Orizont"
                  className="flex items-center gap-x-2 text-sm text-gray-400 hover:text-white transition-colors w-fit"
                >
                  <svg className="w-5 h-5 text-[#F27A1A]" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                  </svg>
                  <span>Instagram</span>
                </a>
              </div>
            </div>

            {/* Column 3 — Informatii */}
            <div className="flex flex-col gap-y-4">
              <FooterHeading>Informații</FooterHeading>
              <ul className="flex flex-col gap-y-2.5">
                {INFO_LINKS.map(({ label, href }) => (
                  <li key={href}>
                    <LocalizedClientLink
                      href={href}
                      className="text-sm text-gray-400 hover:text-white transition-colors duration-150"
                    >
                      {label}
                    </LocalizedClientLink>
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 4 — Legal + Certificari */}
            <div className="flex flex-col gap-y-4">
              <FooterHeading>Legal</FooterHeading>
              <ul className="flex flex-col gap-y-2.5">
                {LEGAL_LINKS.map(({ label, href }) => (
                  <li key={href}>
                    <LocalizedClientLink
                      href={href}
                      className="text-sm text-gray-400 hover:text-white transition-colors duration-150"
                    >
                      {label}
                    </LocalizedClientLink>
                  </li>
                ))}
                <li>
                  <CookieSettingsButton className="text-sm text-gray-400 hover:text-white transition-colors duration-150 text-left" />
                </li>
              </ul>

              <div className="pt-2 border-t border-gray-800 flex flex-col gap-y-4">
                <FooterHeading>Certificări</FooterHeading>
                <ul className="flex flex-col gap-y-2.5">
                  {CERT_LINKS.map(({ label, href }) => (
                    <li key={label}>
                      <LocalizedClientLink
                        href={href}
                        className="text-sm text-gray-400 hover:text-white transition-colors duration-150"
                      >
                        {label}
                      </LocalizedClientLink>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Column 5 — Program */}
            <div className="flex flex-col gap-y-4">
              <FooterHeading>Program</FooterHeading>
              <ul className="flex flex-col gap-y-2.5 text-sm">
                <li className="flex justify-between gap-x-4 text-gray-400">
                  <span>Luni–Vineri</span>
                  <span className="text-white font-medium">08:00–17:00</span>
                </li>
                <li className="flex justify-between gap-x-4 text-gray-400">
                  <span>Sâmbătă</span>
                  <span className="text-white font-medium">08:00–13:00</span>
                </li>
                <li className="flex justify-between gap-x-4 text-gray-400">
                  <span>Duminică</span>
                  <span className="text-red-500 font-medium">Închis</span>
                </li>
              </ul>
            </div>

          </div>
        </div>

        {/* ── ANPC compliance row ── */}
        <div className="border-t border-gray-800">
          <div className="content-container py-6 flex flex-col sm:flex-row items-center justify-between gap-y-5 gap-x-8">
            <p className="text-xs text-gray-500 leading-relaxed max-w-sm text-center sm:text-left">
              Conform legislației în vigoare, ai dreptul la soluționarea alternativă
              sau online a litigiilor cu comercianții.
            </p>
            <div className="flex items-center gap-x-3 flex-shrink-0">
              <a
                href="https://anpc.ro/ce-este-sal/"
                target="_blank"
                rel="noopener noreferrer"
                title="Soluționarea Alternativă a Litigiilor — ANPC"
                className="group"
              >
                <div className="bg-white rounded-xl px-3 py-2 opacity-85 group-hover:opacity-100 transition-opacity duration-200 shadow-sm">
                  <Image
                    src="/anpc-sal.svg"
                    alt="ANPC — Soluționarea Alternativă a Litigiilor"
                    width={170}
                    height={44}
                    className="h-10 w-auto object-contain"
                    unoptimized
                  />
                </div>
              </a>
              <a
                href="https://ec.europa.eu/consumers/odr/main/index.cfm?event=main.home2.show&lng=RO"
                target="_blank"
                rel="noopener noreferrer"
                title="Soluționarea Online a Litigiilor — Comisia Europeană"
                className="group"
              >
                <div className="bg-white rounded-xl px-3 py-2 opacity-85 group-hover:opacity-100 transition-opacity duration-200 shadow-sm">
                  <Image
                    src="/anpc-sol.svg"
                    alt="SOL — Soluționarea Online a Litigiilor"
                    width={170}
                    height={44}
                    className="h-10 w-auto object-contain"
                    unoptimized
                  />
                </div>
              </a>
            </div>
          </div>
        </div>

        {/* ── Copyright bar ── */}
        <div className="border-t border-gray-800/50">
          <div className="content-container py-4 flex flex-col md:flex-row items-center justify-between gap-y-1.5 gap-x-4">
            <p className="text-xs text-gray-600 text-center md:text-left">
              © {new Date().getFullYear()} Orizont. Toate drepturile rezervate.
            </p>
            <p className="text-xs text-gray-700 text-center md:text-right">
              <span className="text-gray-600">SC Orizont Sighetu Marmatiei SRL</span>
              {"  ·  "}J1991000461241{"  ·  "}CIF RO 2204805
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
