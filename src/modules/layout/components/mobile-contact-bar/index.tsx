const PHONE = "0730076606"
const WHATSAPP = "40730076606"
const WHATSAPP_TEXT = "Bună ziua, am o întrebare despre materialele de construcții."

/**
 * Bară fixă jos pe ecran, doar pe telefon: Sună și WhatsApp.
 * Pe calculator nu apare (telefonul e deja în bara de sus).
 */
export default function MobileContactBar() {
  return (
    <>
      {/* Spațiu gol la final, ca bara să nu acopere subsolul paginii */}
      <div className="h-[76px] md:hidden" aria-hidden="true" />

      <nav
        aria-label="Contact rapid"
        className="md:hidden fixed inset-x-0 bottom-0 z-40 bg-white border-t border-gray-200 shadow-[0_-6px_16px_rgba(0,0,0,0.06)] px-3 pt-2.5 pb-[calc(0.625rem+env(safe-area-inset-bottom))]"
      >
        <div className="grid grid-cols-2 gap-2.5">
          <a
            href={`tel:${PHONE}`}
            className="h-12 flex items-center justify-center gap-x-2 rounded-xl bg-[#192335] text-white text-[15px] font-semibold active:opacity-90"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.4 1.8.7 2.7a2 2 0 0 1-.5 2.1L8.1 9.8a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.7.7a2 2 0 0 1 1.8 2z" />
            </svg>
            Sună
          </a>
          <a
            href={`https://wa.me/${WHATSAPP}?text=${encodeURIComponent(WHATSAPP_TEXT)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="h-12 flex items-center justify-center gap-x-2 rounded-xl bg-[#25D366] text-white text-[15px] font-semibold active:opacity-90"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm5.2 13.9c-.2.6-1.3 1.2-1.8 1.3-.5.1-1 .1-1.7-.1-.4-.1-.9-.3-1.5-.6-2.6-1.1-4.3-3.8-4.5-4-.1-.2-1-1.3-1-2.5s.6-1.8.9-2c.2-.3.5-.3.7-.3h.5c.2 0 .4 0 .6.5l.8 2c.1.2.1.3 0 .5l-.3.4-.4.4c-.1.1-.3.3-.1.5.1.3.6 1 1.3 1.6.9.8 1.6 1 1.9 1.2.2.1.4.1.5-.1l.7-.9c.2-.2.3-.2.6-.1l1.9.9c.3.1.4.2.5.3.1.2.1.6-.1 1.2z" />
            </svg>
            WhatsApp
          </a>
        </div>
      </nav>
    </>
  )
}
