import Image from "next/image"
import CookieSettingsButton from "@modules/analytics/components/cookie-settings-button"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

const INFO_LINKS = [
  { label: "Despre noi", href: "/despre-noi" },
  { label: "Livrare", href: "/livrare" },
  { label: "Calculatoare materiale", href: "/calculatoare" },
  { label: "Contact", href: "/contact" },
  { label: "Serviciu clienți", href: "/customer-service" },
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
  return <h3 className="text-xs font-semibold text-[#1D1D1F] mb-3">{children}</h3>
}

const linkCls = "text-xs text-[#6E6E73] hover:text-[#1D1D1F] hover:underline transition-colors"

export default function Footer() {
  return (
    <footer className="w-full bg-[#F5F5F7] text-[#6E6E73] mt-16">
      <div className="content-container pt-12 pb-8">
        <div className="grid grid-cols-2 lg:grid-cols-12 gap-x-6 gap-y-10 pb-10 border-b border-[#D2D2D7]">

          {/* Firma */}
          <div className="col-span-2 lg:col-span-4 flex flex-col gap-y-4">
            <LocalizedClientLink href="/" className="inline-block w-fit">
              <Image src="/logo.png" alt="Orizont" width={211} height={55} className="h-9 w-auto object-contain" unoptimized />
            </LocalizedClientLink>
            <p className="text-xs leading-relaxed max-w-[300px]">
              Depozit de materiale de construcții cu o gamă completă de produse
              pentru orice proiect, de la fundație până la finisaje.
            </p>
            <ul className="flex flex-col gap-y-1.5 text-xs">
              <li>Str. Plevnei nr. 3, Sighetu Marmației</li>
              <li><a href="tel:0730076606" className="text-[#1D1D1F] font-medium hover:underline">0730 076 606</a></li>
              <li><a href="mailto:comenzi@orizont-srl.ro" className="hover:text-[#1D1D1F] hover:underline">comenzi@orizont-srl.ro</a></li>
            </ul>
            <div className="flex items-center gap-x-3">
              <a href="https://www.facebook.com/OrizontSighetuMarmatiei" target="_blank" rel="noopener noreferrer" aria-label="Facebook Orizont"
                className="w-9 h-9 rounded-full bg-white flex items-center justify-center text-[#424245] hover:text-[#1D1D1F]">
                <svg className="w-[18px] h-[18px]" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M22 12c0-5.522-4.477-10-10-10S2 6.478 2 12c0 4.991 3.657 9.128 8.438 9.878V14.89h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
                </svg>
              </a>
              <a href="https://www.instagram.com/orizont.sighetumarmatiei?igsh=Y2dnbjh5a3FnaGFu" target="_blank" rel="noopener noreferrer" aria-label="Instagram Orizont"
                className="w-9 h-9 rounded-full bg-white flex items-center justify-center text-[#424245] hover:text-[#1D1D1F]">
                <svg className="w-[18px] h-[18px]" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Informații */}
          <div className="lg:col-span-2">
            <FooterHeading>Informații</FooterHeading>
            <ul className="flex flex-col gap-y-2">
              {INFO_LINKS.map(({ label, href }) => (
                <li key={href}><LocalizedClientLink href={href} className={linkCls}>{label}</LocalizedClientLink></li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div className="lg:col-span-2">
            <FooterHeading>Legal</FooterHeading>
            <ul className="flex flex-col gap-y-2">
              {LEGAL_LINKS.map(({ label, href }) => (
                <li key={href}><LocalizedClientLink href={href} className={linkCls}>{label}</LocalizedClientLink></li>
              ))}
              <li><CookieSettingsButton className={`${linkCls} text-left`} /></li>
            </ul>
          </div>

          {/* Certificări */}
          <div className="lg:col-span-2">
            <FooterHeading>Certificări</FooterHeading>
            <ul className="flex flex-col gap-y-2">
              {CERT_LINKS.map(({ label, href }) => (
                <li key={label}><LocalizedClientLink href={href} className={linkCls}>{label}</LocalizedClientLink></li>
              ))}
            </ul>
          </div>

          {/* Program */}
          <div className="lg:col-span-2">
            <FooterHeading>Program</FooterHeading>
            <ul className="flex flex-col gap-y-2 text-xs">
              <li className="flex justify-between gap-x-4"><span>Luni–Vineri</span><span className="text-[#1D1D1F]">08:00–17:00</span></li>
              <li className="flex justify-between gap-x-4"><span>Sâmbătă</span><span className="text-[#1D1D1F]">08:00–13:00</span></li>
              <li className="flex justify-between gap-x-4"><span>Duminică</span><span className="text-[#1D1D1F]">Închis</span></li>
            </ul>
          </div>
        </div>

        {/* ANPC */}
        <div className="py-6 flex flex-col sm:flex-row items-center justify-between gap-y-4 gap-x-8 border-b border-[#D2D2D7]">
          <p className="text-xs leading-relaxed max-w-md text-center sm:text-left">
            Conform legislației în vigoare, aveți dreptul la soluționarea alternativă
            sau online a litigiilor cu comercianții.
          </p>
          <div className="flex items-center gap-x-3 flex-shrink-0">
            <a href="https://anpc.ro/ce-este-sal/" target="_blank" rel="noopener noreferrer" title="Soluționarea Alternativă a Litigiilor — ANPC"
              className="bg-white rounded-xl px-3 py-2 hover:shadow-sm transition-shadow">
              <Image src="/anpc-sal.svg" alt="ANPC — Soluționarea Alternativă a Litigiilor" width={170} height={44} className="h-9 w-auto object-contain" unoptimized />
            </a>
            <a href="https://ec.europa.eu/consumers/odr/main/index.cfm?event=main.home2.show&lng=RO" target="_blank" rel="noopener noreferrer" title="Soluționarea Online a Litigiilor — Comisia Europeană"
              className="bg-white rounded-xl px-3 py-2 hover:shadow-sm transition-shadow">
              <Image src="/anpc-sol.svg" alt="SOL — Soluționarea Online a Litigiilor" width={170} height={44} className="h-9 w-auto object-contain" unoptimized />
            </a>
          </div>
        </div>

        {/* Copyright */}
        <div className="pt-4 flex flex-col md:flex-row items-center justify-between gap-y-1.5 gap-x-4 text-xs">
          <p>© {new Date().getFullYear()} Orizont. Toate drepturile rezervate.</p>
          <p>SC Orizont Sighetu Marmației SRL, J1991000461241, CIF RO 2204805</p>
        </div>
      </div>
    </footer>
  )
}
