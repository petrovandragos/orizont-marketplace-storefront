"use client"

import { useRef, useState } from "react"
import { Turnstile } from "@marsidev/react-turnstile"
import { submitQuoteRequest } from "@lib/data/quote-requests"
import { track } from "@lib/util/analytics"

const inputClass =
  "w-full h-12 px-4 rounded-xl border border-transparent text-base bg-white focus:outline-none focus:ring-2 focus:ring-[#F27A1A]/40 focus:border-[#F27A1A] transition-colors"

const WHATSAPP_URL =
  "https://wa.me/40730076606?text=" +
  encodeURIComponent("Bună ziua, vă transmit lista de materiale pentru o ofertă.")

/**
 * Cerere de ofertă pentru o listă întreagă de materiale (nu pentru un singur
 * produs). Folosește același endpoint ca formularul de pe paginile de produs,
 * deci cererile apar în admin la „Cereri ofertă”, cu lista în titlu.
 */
export default function ListQuoteForm({ initialList = "" }: { initialList?: string }) {
  const [name, setName] = useState("")
  const [phone, setPhone] = useState("")
  const [email, setEmail] = useState("")
  const [list, setList] = useState(initialList)
  const [delivery, setDelivery] = useState<"livrare" | "ridicare">("livrare")
  const [address, setAddress] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null)
  const turnstileRef = useRef<any>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!turnstileToken) {
      setError("Vă rugăm să bifați verificarea de securitate de mai jos.")
      return
    }

    setSubmitting(true)
    setError(null)

    const result = await submitQuoteRequest({
      product_id: "lista-materiale",
      variant_id: null,
      product_title: `[Listă materiale] ${list.trim()}`,
      quantity: 1,
      delivery_type: delivery,
      full_name: name.trim(),
      phone: phone.trim(),
      email: email.trim(),
      address: delivery === "livrare" ? address.trim() || null : null,
      turnstileToken,
    })

    if ("error" in result) {
      setError(result.error)
      setTurnstileToken(null)
      turnstileRef.current?.reset()
    } else {
      track("cerere_oferta", { tip: "lista" })
      setSuccess(true)
      window.scrollTo({ top: 0, behavior: "smooth" })
    }
    setSubmitting(false)
  }

  if (success) {
    return (
      <div className="bg-[#F5F5F7] rounded-[26px] p-10 text-center">
        <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-green-50 flex items-center justify-center">
          <svg className="w-7 h-7 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <p className="text-2xl font-semibold tracking-[-0.02em] text-[#1D1D1F]">Vă mulțumim, am primit solicitarea</p>
        <p className="text-gray-600 mt-2">
          Un coleg vă va contacta în programul depozitului pentru a stabili necesarul și a vă transmite oferta.
        </p>
      </div>
    )
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-[#F5F5F7] rounded-[26px] p-5 md:p-8 flex flex-col gap-y-5"
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="flex flex-col gap-y-1.5">
          <label htmlFor="lq-name" className="text-sm font-medium text-[#1D1D1F]">
            Nume complet <span className="text-red-500">*</span>
          </label>
          <input id="lq-name" type="text" value={name} onChange={(e) => setName(e.target.value)}
            placeholder="Ion Popescu" autoComplete="name" required className={inputClass} />
        </div>
        <div className="flex flex-col gap-y-1.5">
          <label htmlFor="lq-phone" className="text-sm font-medium text-[#1D1D1F]">
            Număr de telefon <span className="text-red-500">*</span>
          </label>
          <input id="lq-phone" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)}
            placeholder="07xx xxx xxx" autoComplete="tel" required className={inputClass} />
        </div>
      </div>

      <div className="flex flex-col gap-y-1.5">
        <label htmlFor="lq-email" className="text-sm font-medium text-[#1D1D1F]">
          Adresă email <span className="text-red-500">*</span>
        </label>
        <input id="lq-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)}
          placeholder="exemplu@email.com" autoComplete="email" required className={inputClass} />
      </div>

      <div className="flex flex-col gap-y-1.5">
        <label htmlFor="lq-list" className="text-sm font-medium text-[#1D1D1F]">
          Lista de materiale și cantitățile <span className="text-red-500">*</span>
        </label>
        <textarea id="lq-list" value={list} onChange={(e) => setList(e.target.value)} required rows={7}
          placeholder={"Ex:\n20 saci ciment 40 kg\n3 paleți Porotherm 25\nplasă sudată 6 mm, 10 buc"}
          className={`${inputClass} h-auto py-3 resize-y leading-relaxed`} />
        <p className="text-[13px] text-[#6E6E73]">
          Nu este necesar să știți cantitățile exacte. Puteți descrie lucrarea și suprafața, iar noi vă ajutăm să stabiliți necesarul.
        </p>
      </div>

      <div className="flex flex-col gap-y-1.5">
        <span className="text-sm font-medium text-[#1D1D1F]">
          Tip livrare <span className="text-red-500">*</span>
        </span>
        <div className="grid grid-cols-2 gap-2">
          {(["livrare", "ridicare"] as const).map((type) => (
            <button key={type} type="button" onClick={() => setDelivery(type)} aria-pressed={delivery === type}
              className={`h-12 rounded-full text-[15px] font-medium border-2 transition-colors bg-white ${
                delivery === type
                  ? "border-[#1D1D1F] text-[#1D1D1F]"
                  : "border-transparent text-[#424245] hover:border-[#D2D2D7]"
              }`}>
              {type === "livrare" ? "Livrare la adresă" : "Ridicare din depozit"}
            </button>
          ))}
        </div>
      </div>

      {delivery === "livrare" && (
        <div className="flex flex-col gap-y-1.5">
          <label htmlFor="lq-address" className="text-sm font-medium text-[#1D1D1F]">
            Adresa de livrare <span className="text-red-500">*</span>
          </label>
          <input id="lq-address" type="text" value={address} onChange={(e) => setAddress(e.target.value)}
            placeholder="Str., nr., localitate, județ" autoComplete="street-address" required className={inputClass} />
        </div>
      )}

      <div className="flex justify-center pt-1">
        <Turnstile
          ref={turnstileRef}
          siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY!}
          onSuccess={(token) => setTurnstileToken(token)}
          onExpire={() => setTurnstileToken(null)}
          onError={() => setTurnstileToken(null)}
        />
      </div>

      {error && (
        <p role="alert" className="text-sm text-red-700 bg-red-50 px-4 py-2.5 rounded-2xl">
          {error}
        </p>
      )}

      <button type="submit" disabled={submitting}
        className="w-full btn-pill disabled:opacity-50 disabled:cursor-not-allowed">
        {submitting ? "Se trimite..." : "Trimiteți solicitarea"}
      </button>

      <div className="flex items-center gap-x-3 text-xs text-gray-400" aria-hidden="true">
        <span className="h-px flex-1 bg-[#D2D2D7]" />sau<span className="h-px flex-1 bg-[#D2D2D7]" />
      </div>

      <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer"
        className="w-full min-h-[48px] py-2 px-5 flex items-center justify-center gap-x-2 rounded-full text-[15px] sm:text-[17px] leading-tight text-center font-medium bg-white border border-[#D2D2D7] text-[#1D1D1F] hover:border-[#1D1D1F] transition-colors">
        <svg className="w-5 h-5 flex-none text-[#25D366]" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm5.2 13.9c-.2.6-1.3 1.2-1.8 1.3-.5.1-1 .1-1.7-.1-.4-.1-.9-.3-1.5-.6-2.6-1.1-4.3-3.8-4.5-4-.1-.2-1-1.3-1-2.5s.6-1.8.9-2c.2-.3.5-.3.7-.3h.5c.2 0 .4 0 .6.5l.8 2c.1.2.1.3 0 .5l-.3.4-.4.4c-.1.1-.3.3-.1.5.1.3.6 1 1.3 1.6.9.8 1.6 1 1.9 1.2.2.1.4.1.5-.1l.7-.9c.2-.2.3-.2.6-.1l1.9.9c.3.1.4.2.5.3.1.2.1.6-.1 1.2z" />
        </svg>
        Transmiteți fotografia listei pe WhatsApp
      </a>
    </form>
  )
}
