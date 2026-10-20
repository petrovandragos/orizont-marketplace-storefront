"use client"

import { useState, useRef, useEffect } from "react"
import { HttpTypes } from "@medusajs/types"
import { submitQuoteRequest } from "@lib/data/quote-requests"
import { track } from "@lib/util/analytics"
import { Turnstile } from "@marsidev/react-turnstile"

type Props = {
  product: HttpTypes.StoreProduct
  selectedVariantId?: string
}

const inputClass =
  "w-full h-11 px-4 rounded-xl border border-[#D2D2D7] text-base sm:text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#F27A1A]/40 focus:border-[#F27A1A] transition-colors"

export default function CereOfertaForm({ product, selectedVariantId }: Props) {
  const [open, setOpen] = useState(false)
  const [qty, setQty] = useState(1)
  const [delivery, setDelivery] = useState<"livrare" | "ridicare">("livrare")
  const [name, setName] = useState("")
  const [phone, setPhone] = useState("")
  const [email, setEmail] = useState("")
  const [address, setAddress] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null)
  const turnstileRef = useRef<any>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  // Butonul „Cere Ofertă” din listele de produse trimite aici cu ?oferta=1:
  // deschidem formularul și îl aducem în ecran.
  useEffect(() => {
    if (new URLSearchParams(window.location.search).get("oferta") === "1") {
      setOpen(true)
      setTimeout(() => {
        containerRef.current?.scrollIntoView({ behavior: "smooth", block: "center" })
      }, 100)
    }
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!turnstileToken) {
      setError("Vă rugăm să completați verificarea de securitate.")
      return
    }

    setSubmitting(true)
    setError(null)

    const result = await submitQuoteRequest({
      product_id: product.id,
      variant_id: selectedVariantId ?? null,
      product_title: product.title ?? "",
      quantity: qty,
      delivery_type: delivery,
      full_name: name.trim(),
      phone: phone.trim(),
      email: email.trim(),
      address: delivery === "livrare" ? address.trim() || null : null,
      turnstileToken,
    })

    if ("error" in result) {
      setError(result.error)
      // Reset turnstile so user can try again
      setTurnstileToken(null)
      turnstileRef.current?.reset()
    } else {
      track("cerere_oferta", { tip: "produs", produs: product.title ?? "" })
      setSuccess(true)
    }
    setSubmitting(false)
  }

  // ── Success state ────────────────────────────────────────────────────────────
  if (success) {
    return (
      <div className="flex items-start gap-x-3 p-5 bg-[#F0FAF2] rounded-[20px] text-sm text-green-900">
        <svg className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
        <div>
          <p className="font-semibold">Cererea a fost trimisă.</p>
          <p className="text-green-700 mt-0.5">
            Vă contactăm în cel mai scurt timp cu oferta.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div id="cere-oferta" ref={containerRef} className="flex flex-col gap-y-2 scroll-mt-32">
      {/* Toggle button */}
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className={`w-full flex items-center gap-x-3 pl-2 pr-5 h-14 rounded-full transition-colors duration-200 ${
          open
            ? "bg-[#DD6A0E] text-white"
            : "bg-[#F27A1A] text-white hover:bg-[#DD6A0E]"
        }`}
      >
        <span className="flex items-center justify-center w-10 h-10 rounded-full bg-white/20 flex-shrink-0">
          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
        </span>
        <div className="flex flex-col items-start flex-1 min-w-0">
          <span className="text-[17px] font-medium leading-tight">Cereți ofertă</span>
          <span className="text-xs font-normal text-white/85 mt-0.5">Vă trimitem prețul pentru cantitatea dorită</span>
        </div>
        <svg
          className={`w-4 h-4 flex-shrink-0 transition-transform duration-200 ${open ? "rotate-180" : ""} text-white`}
          fill="none" stroke="currentColor" viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Expandable form */}
      {open && (
        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-y-3 p-5 bg-[#F5F5F7] rounded-[22px]"
        >
          <p className="text-sm text-[#6E6E73]">
            Completați formularul și vă contactăm cu oferta.
          </p>

          {/* Quantity */}
          <div className="flex flex-col gap-y-1">
            <label className="text-sm font-medium text-[#1D1D1F]">
              Cantitate dorită <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              min={1}
              value={qty}
              onChange={(e) => setQty(Math.max(1, parseInt(e.target.value) || 1))}
              required
              className={inputClass}
            />
          </div>

          {/* Delivery type */}
          <div className="flex flex-col gap-y-1">
            <label className="text-sm font-medium text-[#1D1D1F]">
              Tip livrare <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-2 gap-x-2">
              {(["livrare", "ridicare"] as const).map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setDelivery(type)}
                  className={`h-10 rounded-full text-sm font-medium border-2 transition-all duration-150 ${
                    delivery === type
                      ? "border-[#1D1D1F] bg-white text-[#1D1D1F]"
                      : "border-transparent bg-white text-[#424245] hover:border-[#D2D2D7]"
                  }`}
                >
                  {type === "livrare" ? "Livrare la adresă" : "Ridicare personală"}
                </button>
              ))}
            </div>
          </div>

          {/* Address — only for livrare */}
          {delivery === "livrare" && (
            <div className="flex flex-col gap-y-1">
              <label className="text-sm font-medium text-[#1D1D1F]">
                Adresă <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Str., nr., localitate, județ"
                required
                className={inputClass}
              />
            </div>
          )}

          {/* Full name */}
          <div className="flex flex-col gap-y-1">
            <label className="text-sm font-medium text-[#1D1D1F]">
              Nume complet <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ion Popescu"
              required
              className={inputClass}
            />
          </div>

          {/* Phone */}
          <div className="flex flex-col gap-y-1">
            <label className="text-sm font-medium text-[#1D1D1F]">
              Număr de telefon <span className="text-red-500">*</span>
            </label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="07xx xxx xxx"
              required
              className={inputClass}
            />
          </div>

          {/* Email */}
          <div className="flex flex-col gap-y-1">
            <label className="text-sm font-medium text-[#1D1D1F]">
              Adresă email <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="exemplu@email.com"
              required
              className={inputClass}
            />
          </div>

          {/* Turnstile */}
          <div className="flex justify-center pt-1">
            <Turnstile
              ref={turnstileRef}
              siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY!}
              onSuccess={(token) => setTurnstileToken(token)}
              onExpire={() => setTurnstileToken(null)}
              onError={() => setTurnstileToken(null)}
            />
          </div>

          {/* Error */}
          {error && (
            <p className="text-sm text-red-700 bg-red-50 px-4 py-2.5 rounded-2xl">
              {error}
            </p>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={submitting || !turnstileToken}
            className="w-full h-12 flex items-center justify-center gap-x-2 rounded-full text-base font-medium bg-[#1D1D1F] hover:bg-black text-white transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed mt-1"
          >
            {submitting ? (
              <>
                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                </svg>
                Se trimite...
              </>
            ) : (
              "Trimiteți cererea"
            )}
          </button>
        </form>
      )}

      {/* WhatsApp */}
      <a
        href={"https://wa.me/40730076606?text=" + encodeURIComponent("Bună ziua, aș dori o ofertă pentru produsul: " + product.title + " (https://orizont-srl.ro/products/" + product.handle + ")")}
        target="_blank"
        rel="noopener noreferrer"
        className="w-full h-12 flex items-center justify-center gap-x-2 rounded-full text-base font-medium bg-white border border-[#D2D2D7] text-[#1D1D1F] hover:border-[#1D1D1F] transition-colors duration-150"
      >
        <svg className="w-5 h-5 text-[#25D366]" viewBox="0 0 24 24" fill="currentColor">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
        </svg>
        Cereți ofertă pe WhatsApp
      </a>
    </div>
  )
}
