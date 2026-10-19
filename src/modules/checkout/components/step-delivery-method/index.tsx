"use client"

import { useRouter, useParams } from "next/navigation"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { useDeliveryMethod } from "@modules/checkout/context/delivery-method-context"

type DeliveryMethod = "livrare" | "pickup"

type MethodCardProps = {
  method: DeliveryMethod
  selected: boolean
  onSelect: () => void
  title: string
  description: string
  detail: string
  icon: React.ReactNode
}

function MethodCard({ selected, onSelect, title, description, detail, icon }: MethodCardProps) {
  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={selected}
      className={`w-full flex flex-col items-center text-center gap-y-3 p-6 rounded-2xl border-2 cursor-pointer transition-all duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F27A1A] ${selected
          ? "border-[#F27A1A] bg-[#FFF3E6] shadow-md"
          : "border-gray-200 bg-white hover:border-[#F27A1A]/40 hover:shadow-sm"
        }`}
    >
      {/* Radio dot */}
      <div className="self-end -mb-1 -mr-1">
        <div
          className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${selected ? "border-[#F27A1A]" : "border-gray-300"
            }`}
        >
          {selected && <div className="w-2.5 h-2.5 rounded-full bg-[#F27A1A]" />}
        </div>
      </div>

      {/* Icon */}
      <div
        className={`w-16 h-16 rounded-2xl flex items-center justify-center transition-colors ${selected ? "bg-[#F27A1A] text-white" : "bg-gray-100 text-gray-500"
          }`}
      >
        {icon}
      </div>

      {/* Text */}
      <div className="flex flex-col gap-y-1">
        <p className="text-base font-bold text-[#1D1D1F]">{title}</p>
        <p className="text-sm text-gray-500">{description}</p>
        <p className="text-xs text-gray-400">{detail}</p>
      </div>
    </button>
  )
}

export default function StepDeliveryMethod() {
  const { countryCode } = useParams() as { countryCode: string }
  const router = useRouter()
  const { method: selected, setMethod: setSelected } = useDeliveryMethod()

  const handleContinue = () => {
    router.push(`/checkout?step=address&method=${selected}`)
  }

  return (
    <div className="flex flex-col gap-y-6">
      {/* Back to cart */}
      <LocalizedClientLink
        href="/cart"
        className="flex items-center gap-x-1.5 text-sm text-gray-400 hover:text-[#F27A1A] transition-colors w-fit -mb-2"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Înapoi la coș
      </LocalizedClientLink>

      <h2 className="text-lg font-bold text-[#1D1D1F]">Cum doriți să primiți comanda?</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <MethodCard
          method="livrare"
          selected={selected === "livrare"}
          onSelect={() => setSelected("livrare")}
          title="Livrare la adresă"
          description="Coletul ajunge direct la dumneavoastră."
          detail="Alegeți adresa și metoda de livrare în pasul următor."
          icon={
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.75}
                d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"
              />
            </svg>
          }
        />

        <MethodCard
          method="pickup"
          selected={selected === "pickup"}
          onSelect={() => setSelected("pickup")}
          title="Ridicare din depozit"
          description="Ridicați comanda din depozitul nostru."
          detail="Str. Plevnei nr. 3, Sighetu Marmației. Program: luni–vineri 08:00–17:00, sâmbătă 08:00–13:00"
          icon={
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.75}
                d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
              />
            </svg>
          }
        />
      </div>

      {/* Cost livrare */}
      <div className="flex items-center justify-between text-sm bg-gray-50 border border-gray-100 rounded-xl px-4 py-3">
        <span className="text-gray-500">Cost livrare</span>
        {selected === "pickup" ? (
          <span className="font-bold text-green-600">GRATUIT</span>
        ) : (
          <span className="font-semibold text-[#1D1D1F]">25,00 lei</span>
        )}
      </div>

      <button
        type="button"
        onClick={handleContinue}
        className="w-full h-12 bg-[#F27A1A] hover:bg-[#D4600E] text-white font-semibold rounded-xl transition-colors duration-150 flex items-center justify-center gap-x-2 text-sm mt-2"
      >
        Continuă
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </div>
  )
}
