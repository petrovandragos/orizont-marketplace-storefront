"use client"

import { useRef, useState } from "react"
import { Turnstile } from "@marsidev/react-turnstile"
import { submitQuoteRequest } from "@lib/data/quote-requests"

const inputClass =
  "w-full h-11 px-3.5 rounded-lg border border-gray-200 text-[15px] bg-white focus:outline-none focus:ring-2 focus:ring-[#F27A1A]/30 focus:border-[#F27A1A] transition-colors"

const WHATSAPP_URL =
  "https://wa.me/40730076606?text=" +
  encodeURIComponent("Bună ziua, vă trimit lista de materiale pentru o ofertă.")

/**
 * Cerere de ofertă pentru o listă întreagă de materiale (nu pentru un singur
 * produs). Folosește același endpoint ca formularul de pe paginile de produs,
 * deci cererile apar în admin la „Cereri ofertă”, cu lista în titlu.
 */
export default function ListQuoteForm() {
  const [name, setName] = useState("")
  const [phone, setPhone] = useState("")
  const [email, setEmail] = useState("")
  const [list, setList] = useState("")
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
      setError("Bifează verificarea de securitate de mai jos.")
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
      setSuccess(true)
      window.scrollTo({ top: 0, behavior: "smooth" })
    }
    setSubmitting(false)
  }

  if (success) {
    return (
      <div className="bg-white border border-gray-200 rounded-2xl p-8 text-center">
        <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-green-50 flex items-center justify-center">
          <svg className="w-7 h-7 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <p className="text-xl font-bold text-[#1A1A1A]">Am primit lista ta</p>
        <p className="text-gray-600 mt-2">
          Te sunăm în programul depozitului cu oferta pentru toată cantitatea.
        </p>
      </div>
    )
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white border border-gray-200 rounded-2xl p-5 md:p-7 flex flex-col gap-y-4"
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="flex flex-col gap-y-1.5">
          <label htmlFor="lq-name" className="text-sm font-semibold text-gray-800">
            Nume complet <span className="text-red-500">*</span>
          </label>
          <input id="lq-name" type="text" value={name} onChange={(e) => setName(e.target.value)}
            placeholder="Ion Popescu" autoComplete="name" required className={inputClass} />
        </div>
        <div className="flex flex-col gap-y-1.5">
          <label htmlFor="lq-phone" className="text-sm font-semibold text-gray-800">
            Număr de telefon <span className="text-red-500">*</span>
          </label>
          <input id="lq-phone" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)}
            placeholder="07xx xxx xxx" autoComplete="tel" required className={inputClass} />
        </div>
      </div>

      <div className="flex flex-col gap-y-1.5">
        <label htmlFor="lq-email" className="text-sm font-semibold text-gray-800">
          Adresă email <span className="text-red-500">*</span>
        </label>
        <input id="lq-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)}
          placeholder="exemplu@email.com" autoComplete="email" required className={inputClass} />
      </div>

      <div className="flex flex-col gap-y-1.5">
        <label htmlFor="lq-list" className="text-sm font-semibold text-gray-800">
          Lista de materiale și cantitățile <span className="text-red-500">*</span>
        </label>
        <textarea id="lq-list" value={list} onChange={(e) => setList(e.target.value)} required rows={7}
          placeholder={"Ex:\n20 saci ciment 40 kg\n3 paleți Porotherm 25\nplasă sudată 6 mm, 10 buc"}
          className={`${inputClass} h-auto py-3 resize-y leading-relaxed`} />
        <p className="text-xs text-gray-500">
          Scrie cum știi. Dacă nu ești sigur de cantități, scrie ce construiești și suprafața, te ajutăm noi.
        </p>
      </div>

      <div className="flex flex-col gap-y-1.5">
        <span className="text-sm font-semibold text-gray-800">
          Tip livrare <span className="text-red-500">*</span>
        </span>
        <div className="grid grid-cols-2 gap-2">
          {(["livrare", "ridicare"] as const).map((type) => (
            <button key={type} type="button" onClick={() => setDelivery(type)} aria-pressed={delivery === type}
              className={`h-11 rounded-lg text-sm font-medium border-2 transition-colors ${
                delivery === type
                  ? "border-[#F27A1A] bg-[#FFF3E6] text-[#F27A1A]"
                  : "border-gray-200 bg-white text-gray-600 hover:border-gray-300"
              }`}>
              {type === "livrare" ? "Livrare la adresă" : "Ridicare din depozit"}
            </button>
          ))}
        </div>
      </div>

      {delivery === "livrare" && (
        <div className="flex flex-col gap-y-1.5">
          <label htmlFor="lq-address" className="text-sm font-semibold text-gray-800">
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
        <p role="alert" className="text-sm text-red-600 bg-red-50 border border-red-100 px-3 py-2 rounded-lg">
          {error}
        </p>
      )}

      <button type="submit" disabled={submitting}
        className="w-full h-12 rounded-xl text-[15px] font-semibold bg-[#F27A1A] hover:bg-[#D4600E] text-white transition-colors disabled:opacity-60 disabled:cursor-not-allowed">
        {submitting ? "Se trimite..." : "Trimite cererea"}
      </button>

      <div className="flex items-center gap-x-3 text-xs text-gray-400" aria-hidden="true">
        <span className="h-px flex-1 bg-gray-200" />sau<span className="h-px flex-1 bg-gray-200" />
      </div>

      <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer"
        className="w-full h-12 flex items-center justify-center gap-x-2 rounded-xl text-[15px] font-semibold bg-[#25D366] hover:bg-[#1ebe5d] text-white transition-colors">
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm5.2 13.9c-.2.6-1.3 1.2-1.8 1.3-.5.1-1 .1-1.7-.1-.4-.1-.9-.3-1.5-.6-2.6-1.1-4.3-3.8-4.5-4-.1-.2-1-1.3-1-2.5s.6-1.8.9-2c.2-.3.5-.3.7-.3h.5c.2 0 .4 0 .6.5l.8 2c.1.2.1.3 0 .5l-.3.4-.4.4c-.1.1-.3.3-.1.5.1.3.6 1 1.3 1.6.9.8 1.6 1 1.9 1.2.2.1.4.1.5-.1l.7-.9c.2-.2.3-.2.6-.1l1.9.9c.3.1.4.2.5.3.1.2.1.6-.1 1.2z" />
        </svg>
        Trimite poza cu lista pe WhatsApp
      </a>
    </form>
  )
}
