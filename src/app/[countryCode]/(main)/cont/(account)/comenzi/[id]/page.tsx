import { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { retrieveOrder } from "@lib/data/orders"
import { getOrderStatusDisplay, formatRon, formatDate } from "@modules/account/components/cont-shared/utils"
import { HttpTypes } from "@medusajs/types"

export const metadata: Metadata = {
  title: "Detalii comandă",
}

type Props = {
  params: Promise<{ countryCode: string; id: string }>
}

// ── Progress stepper ──────────────────────────────────────────────────────────

const STEPS = [
  {
    key: "plasata",
    label: "Plasată",
    desc: "Comanda a fost primită",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  {
    key: "confirmata",
    label: "Confirmată",
    desc: "Plata a fost procesată",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
          d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
      </svg>
    ),
  },
  {
    key: "pregatita",
    label: "Pregătită",
    desc: "Comanda este pregătită",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
          d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
      </svg>
    ),
  },
  {
    key: "livrata",
    label: "Livrată / Ridicată",
    desc: "Comanda a ajuns la tine",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
          d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
    ),
  },
]

function OrderProgressStepper({ order }: { order: HttpTypes.StoreOrder }) {
  const { step } = getOrderStatusDisplay(order)
  const isCanceled = order.status === "canceled"

  if (isCanceled) {
    return (
      <div className="bg-red-50 border border-red-100 rounded-xl p-5 flex items-center gap-x-3">
        <div className="w-9 h-9 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
          <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </div>
        <div>
          <p className="text-sm font-bold text-red-600">Comandă anulată</p>
          <p className="text-xs text-red-400 mt-0.5">Această comandă a fost anulată.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
      <h2 className="text-base font-bold text-[#1A1A1A] mb-5">Statusul comenzii</h2>
      <div className="flex items-start gap-x-0">
        {STEPS.map((s, i) => {
          const done = step >= i + 1
          const active = step === i
          const isLast = i === STEPS.length - 1

          return (
            <div key={s.key} className="flex-1 flex flex-col items-center relative">
              {/* Connector line */}
              {!isLast && (
                <div className="absolute top-4 left-1/2 w-full h-0.5 z-0"
                  style={{ left: "50%" }}>
                  <div className={`h-full transition-colors duration-300 ${done ? "bg-[#F27A1A]" : "bg-gray-200"}`} />
                </div>
              )}

              {/* Circle */}
              <div className={`relative z-10 w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300 ${
                done
                  ? "bg-[#F27A1A] text-white shadow-md shadow-[#F27A1A]/30"
                  : active
                  ? "bg-white border-2 border-[#F27A1A] text-[#F27A1A]"
                  : "bg-gray-100 text-gray-400"
              }`}>
                {done ? (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  <div className={`w-5 h-5 ${active ? "text-[#F27A1A]" : "text-gray-400"}`}>
                    {s.icon}
                  </div>
                )}
              </div>

              {/* Label */}
              <div className="mt-2 text-center px-1">
                <p className={`text-[10px] font-bold uppercase tracking-wide leading-tight ${
                  done || active ? "text-[#1A1A1A]" : "text-gray-400"
                }`}>
                  {s.label}
                </p>
                <p className="text-[9px] text-gray-400 mt-0.5 leading-tight hidden sm:block">
                  {s.desc}
                </p>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default async function OrderDetailPage({ params }: Props) {
  const { countryCode, id } = await params
  const order = await retrieveOrder(id).catch(() => null)

  if (!order) notFound()

  const { label, className } = getOrderStatusDisplay(order)
  const shippingAddress = order.shipping_address

  return (
    <div className="flex flex-col gap-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
        <div className="flex items-start justify-between">
          <div>
            <Link
              href={`/cont/comenzi`}
              className="text-sm text-gray-400 hover:text-[#F27A1A] transition-colors flex items-center gap-x-1 mb-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Înapoi la comenzi
            </Link>
            <h1 className="text-xl font-bold text-[#1A1A1A]">
              Comanda #{order.display_id}
            </h1>
            <p className="text-sm text-gray-500 mt-0.5">
              Plasată pe {formatDate(order.created_at)}
            </p>
          </div>
          <span className={`text-[11px] font-semibold px-3 py-1.5 rounded-full ${className}`}>
            {label}
          </span>
        </div>
      </div>

      {/* Progress stepper */}
      <OrderProgressStepper order={order} />

      {/* Products */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
        <div className="p-5 border-b border-gray-100">
          <h2 className="text-base font-bold text-[#1A1A1A]">Produse comandate</h2>
        </div>
        <ul className="divide-y divide-gray-100">
          {order.items?.map((item) => (
            <li key={item.id} className="flex items-center gap-x-4 px-5 py-4">
              {item.thumbnail && (
                <img
                  src={item.thumbnail}
                  alt={item.title}
                  className="w-16 h-16 object-cover rounded-lg border border-gray-100 flex-shrink-0"
                />
              )}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-[#1A1A1A] truncate">{item.title}</p>
                {item.variant_title && (
                  <p className="text-xs text-gray-400 mt-0.5">{item.variant_title}</p>
                )}
                <p className="text-xs text-gray-400 mt-0.5">Cantitate: {item.quantity}</p>
              </div>
              <div className="text-right flex-shrink-0">
                <p className="text-sm font-bold text-[#1A1A1A]">
                  {formatRon(item.unit_price * item.quantity)}
                </p>
                <p className="text-xs text-gray-400">{formatRon(item.unit_price)} / buc.</p>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* Summary + Address */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Order summary */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
          <h2 className="text-base font-bold text-[#1A1A1A] mb-4">Sumar comandă</h2>
          <dl className="flex flex-col gap-y-2">
            <div className="flex justify-between text-sm">
              <dt className="text-gray-500">Subtotal</dt>
              <dd className="font-medium text-[#1A1A1A]">{formatRon(order.subtotal)}</dd>
            </div>
            {(order.discount_total ?? 0) > 0 && (
              <div className="flex justify-between text-sm">
                <dt className="text-gray-500">Reducere</dt>
                <dd className="font-medium text-green-600">-{formatRon(order.discount_total)}</dd>
              </div>
            )}
            <div className="flex justify-between text-sm">
              <dt className="text-gray-500">Transport</dt>
              <dd className="font-medium text-[#1A1A1A]">
                {(order.shipping_total ?? 0) === 0 ? "Gratuit" : formatRon(order.shipping_total)}
              </dd>
            </div>
            <div className="flex justify-between text-sm">
              <dt className="text-gray-500">TVA</dt>
              <dd className="font-medium text-[#1A1A1A]">{formatRon(order.tax_total)}</dd>
            </div>
            <div className="h-px bg-gray-100 my-1" />
            <div className="flex justify-between text-sm font-bold">
              <dt className="text-[#1A1A1A]">Total</dt>
              <dd className="text-[#1A1A1A]">{formatRon(order.total)}</dd>
            </div>
          </dl>
        </div>

        {/* Shipping address */}
        {shippingAddress && (
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
            <h2 className="text-base font-bold text-[#1A1A1A] mb-4">Adresă de livrare</h2>
            <address className="not-italic text-sm text-gray-600 flex flex-col gap-y-1">
              <span className="font-semibold text-[#1A1A1A]">
                {shippingAddress.first_name} {shippingAddress.last_name}
              </span>
              {shippingAddress.company && <span>{shippingAddress.company}</span>}
              <span>{shippingAddress.address_1}</span>
              {shippingAddress.address_2 && <span>{shippingAddress.address_2}</span>}
              <span>
                {shippingAddress.postal_code} {shippingAddress.city}
                {shippingAddress.province ? `, ${shippingAddress.province}` : ""}
              </span>
              {shippingAddress.phone && <span>{shippingAddress.phone}</span>}
            </address>
          </div>
        )}
      </div>
    </div>
  )
}
