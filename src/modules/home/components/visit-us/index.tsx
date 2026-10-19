import OpenStatus from "@modules/common/components/open-status"
import { CONTACT } from "@lib/content/categories"

/** Banda bleumarin cu adresa, programul și butoanele de contact. */
export default function VisitUs() {
  return (
    <section className="mt-24 md:mt-28 px-3 sm:px-6">
      <div className="max-w-[1320px] mx-auto bg-[#192335] text-white rounded-[26px] md:rounded-[32px] px-6 py-12 md:px-14 md:py-16 grid grid-cols-1 lg:grid-cols-[1.2fr_1fr] gap-10 lg:gap-12 lg:items-end">
        <div>
          <h2 className="display-2 !text-white">Vă așteptăm la depozit.</h2>
          <p className="lead !text-white/65 mt-3 max-w-[40ch]">Veniți să vedeți materialele sau sunați-ne. Vă ajutăm să alegeți.</p>
          <OpenStatus className="text-sm text-white/80 mt-6" />
          <div className="flex flex-wrap gap-3 mt-7">
            <a href={`tel:${CONTACT.tel}`} className="btn-pill">Sunați acum</a>
            <a href={`https://wa.me/${CONTACT.whatsapp}`} target="_blank" rel="noopener noreferrer" className="btn-pill !bg-white/10 hover:!bg-white/20">WhatsApp</a>
          </div>
        </div>
        <dl className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-base">
          <div><dt className="text-[13px] text-white/55">Adresa</dt><dd>{CONTACT.address}</dd></div>
          <div><dt className="text-[13px] text-white/55">Telefon</dt><dd><a href={`tel:${CONTACT.tel}`} className="hover:underline">{CONTACT.phone}</a></dd></div>
          <div><dt className="text-[13px] text-white/55">E-mail</dt><dd><a href={`mailto:${CONTACT.email}`} className="hover:underline break-all">{CONTACT.email}</a></dd></div>
          <div><dt className="text-[13px] text-white/55">Program</dt><dd>{CONTACT.week}<br />{CONTACT.saturday}</dd></div>
        </dl>
      </div>
    </section>
  )
}
