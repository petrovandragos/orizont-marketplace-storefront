"use client"

import { useState, useTransition, useEffect, useRef } from "react"
import { useParams, useRouter, useSearchParams } from "next/navigation"
import { HttpTypes } from "@medusajs/types"
import { initiatePaymentSession, placeOrder } from "@lib/data/cart"
import { getEuplatescFormData, type EuplatescFormData } from "@lib/data/euplatesc"

// ── Helpers ───────────────────────────────────────────────────────────────────

function formatRon(n: number | null | undefined) {
  if (n == null) return "—"
  return (
    new Intl.NumberFormat("ro-RO", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(n) + " lei"
  )
}

// ── Payment option card ───────────────────────────────────────────────────────

function PaymentCard({
  label,
  description,
  smallText,
  badge,
  icon,
  selected,
  onSelect,
}: {
  label: string
  description: string
  smallText?: string
  badge?: React.ReactNode
  icon: React.ReactNode
  selected: boolean
  onSelect: () => void
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={`w-full flex items-start gap-x-4 p-4 rounded-xl border-2 text-left transition-all duration-150 ${
        selected
          ? "border-[#F27A1A] bg-[#FFF3E6]"
          : "border-gray-200 bg-white hover:border-gray-300"
      }`}
      aria-pressed={selected}
    >
      {/* Radio indicator */}
      <div
        className={`flex-shrink-0 mt-0.5 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
          selected ? "border-[#F27A1A]" : "border-gray-300"
        }`}
      >
        {selected && <div className="w-2.5 h-2.5 rounded-full bg-[#F27A1A]" />}
      </div>

      {/* Icon */}
      <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center text-gray-600">
        {icon}
      </div>

      {/* Text */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-x-2 flex-wrap">
          <span className="text-sm font-semibold text-[#1D1D1F]">{label}</span>
          {badge}
        </div>
        <p className="text-xs text-gray-500 mt-0.5">{description}</p>
        {smallText && (
          <p className="text-[11px] text-gray-400 mt-1 leading-snug">{smallText}</p>
        )}
      </div>
    </button>
  )
}

// ── Provider ID sets for COD detection ───────────────────────────────────────

const COD_PROVIDER_IDS = ["pp_system_default", "manual", "cash_on_delivery", "ramburs"]

// ── Main component ────────────────────────────────────────────────────────────

type StepPaymentProps = {
  cart: HttpTypes.StoreCart
  availablePaymentMethods: HttpTypes.StorePaymentProvider[]
}

type PaymentMethod = "cod" | "card"

export default function StepPayment({ cart, availablePaymentMethods }: StepPaymentProps) {
  const { countryCode } = useParams() as { countryCode: string }
  const router = useRouter()
  const searchParams = useSearchParams()
  const deliveryMethod = searchParams.get("method") ?? "livrare"
  const isPickup = deliveryMethod === "pickup"
  const [isPending, startTransition] = useTransition()
  const [isRedirecting, setIsRedirecting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>("card")
  const [epFormData, setEpFormData] = useState<EuplatescFormData | null>(null)
  const formRef = useRef<HTMLFormElement>(null)

  // Find the COD/manual provider
  const codProvider =
    availablePaymentMethods.find((p) =>
      COD_PROVIDER_IDS.some((id) => p.id.includes(id))
    ) ??
    availablePaymentMethods[0] ??
    null

  // Auto-submit the hidden EuPlătesc form as soon as the data is ready
  useEffect(() => {
    if (epFormData && formRef.current) {
      formRef.current.submit()
    }
  }, [epFormData])

  const notReady =
    !cart.shipping_address ||
    !cart.email ||
    (!isPickup && (cart.shipping_methods?.length ?? 0) === 0)

  const total = cart.total ?? 0

  const handlePlaceOrder = () => {
    if (isPending || isRedirecting || notReady) return
    setError(null)

    if (selectedMethod === "cod") {
      // ── Ramburs: initiate session + complete cart ─────────────────────────
      startTransition(async () => {
        try {
          await initiatePaymentSession(cart, {
            provider_id: codProvider?.id ?? "pp_system_default",
          })
          // placeOrder redirects to /order/[id]/confirmed on success
          await placeOrder()
        } catch (e: any) {
          setError(e.message ?? "A apărut o eroare la plasarea comenzii.")
        }
      })
    } else {
      // ── Card: get EuPlătesc form data then auto-submit ────────────────────
      startTransition(async () => {
        try {
          const result = await getEuplatescFormData(countryCode)
          if (typeof result === "string") {
            setError(result)
            return
          }
          // useEffect will auto-submit formRef when epFormData is set
          setIsRedirecting(true)
          setEpFormData(result)
        } catch (e: any) {
          setError(e.message ?? "A apărut o eroare la inițierea plății cu cardul.")
        }
      })
    }
  }

  const buttonLabel =
    selectedMethod === "card"
      ? `Plătiți cu cardul — ${formatRon(total)}`
      : `Plasați comanda — ${formatRon(total)}`

  return (
    <div className="flex flex-col gap-y-6">
      {/* Back to address step */}
      <button
        type="button"
        onClick={() =>
          router.push(`/checkout?step=address&method=${deliveryMethod}`)
        }
        className="flex items-center gap-x-1.5 text-sm text-gray-400 hover:text-[#F27A1A] transition-colors w-fit"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        {isPickup ? "Modifică datele de facturare" : "Modifică adresa de livrare"}
      </button>

      {/*
        Hidden form for EuPlătesc redirect.
        Populated and auto-submitted via the useEffect above.
      */}
      {epFormData && (
        <form
          ref={formRef}
          method="POST"
          action={epFormData.action_url}
          style={{ display: "none" }}
          aria-hidden="true"
        >
          {Object.entries(epFormData.form_fields).map(([name, value]) => (
            <input key={name} type="hidden" name={name} value={value} />
          ))}
        </form>
      )}

      <h2 className="text-lg font-bold text-[#1D1D1F]">Metodă de plată</h2>

      {/* ── Payment options ─────────────────────────────────────────────────── */}
      <div className="flex flex-col gap-y-3">
        {/* Option A — Card via EuPlătesc — selected by default */}
        <PaymentCard
          label="Plată cu cardul"
          description="Plată securizată prin EuPlătesc.ro — Visa, Mastercard, Maestro"
          smallText="Vei fi redirecționat către pagina securizată EuPlătesc pentru a finaliza plata."
          badge={
            <span className="inline-flex items-center gap-x-1 text-[10px] font-semibold bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2.5}
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
              Securizat 3D Secure
            </span>
          }
          selected={selectedMethod === "card"}
          onSelect={() => setSelectedMethod("card")}
          icon={
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
              />
            </svg>
          }
        />

        {/* Option B — Ramburs / Plată la ridicare (COD) */}
        <PaymentCard
          label={isPickup ? "Plată la ridicare" : "Ramburs la livrare"}
          description={isPickup ? "Plătești numerar când ridici comanda din magazin." : "Plătești numerar la primirea coletului."}
          selected={selectedMethod === "cod"}
          onSelect={() => setSelectedMethod("cod")}
          icon={
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
          }
        />
      </div>

      {/* ── Card logos ─────────────────────────────────────────────────────── */}
      {selectedMethod === "card" && (
        <div className="flex items-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="https://secure.eupayment.eu/tdsprocess/images/logo/vm1.png"
            alt="Visa, Mastercard, Maestro"
            className="h-8 object-contain"
          />
        </div>
      )}

      {/* ── Terms ──────────────────────────────────────────────────────────── */}
      <p className="text-xs text-gray-400 leading-relaxed">
        Prin plasarea comenzii confirmi că ai citit și ești de acord cu{" "}
        <a
          href="/termeni-si-conditii"
          target="_blank"
          rel="noopener noreferrer"
          className="text-[#F27A1A] underline hover:text-[#D4600E]"
        >
          Termenii și Condițiile
        </a>{" "}
        și{" "}
        <a
          href="/politica-de-confidentialitate"
          target="_blank"
          rel="noopener noreferrer"
          className="text-[#F27A1A] underline hover:text-[#D4600E]"
        >
          Politica de Confidențialitate
        </a>{" "}
        Orizont.
      </p>

      {/* ── Warnings ───────────────────────────────────────────────────────── */}
      {notReady && (
        <p className="text-xs text-amber-600 bg-amber-50 border border-amber-200 rounded-lg px-4 py-2.5">
          Informațiile de livrare sunt incomplete. Reveniți la pasul anterior.
        </p>
      )}

      {error && (
        <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-2.5">
          {error}
        </p>
      )}

      {/* ── CTA button ─────────────────────────────────────────────────────── */}
      <button
        type="button"
        onClick={handlePlaceOrder}
        disabled={isPending || isRedirecting || notReady}
        data-testid="submit-order-button"
        className="w-full h-12 bg-[#F27A1A] hover:bg-[#D4600E] text-white font-semibold rounded-xl transition-colors duration-150 flex items-center justify-center gap-x-2 disabled:opacity-60 disabled:cursor-not-allowed text-sm"
      >
        {isPending || isRedirecting ? (
          <>
            <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
              />
            </svg>
            {selectedMethod === "card" ? "Redirecționare spre EuPlătesc..." : "Se plasează comanda..."}
          </>
        ) : (
          <>
            {selectedMethod === "card" ? (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            )}
            {buttonLabel}
          </>
        )}
      </button>

      {selectedMethod === "card" && !isPending && !isRedirecting && (
        <p className="text-[11px] text-center text-gray-400 -mt-2">
          Vei fi redirecționat automat către pagina securizată EuPlătesc.
        </p>
      )}
    </div>
  )
}
