import { HttpTypes } from "@medusajs/types"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import CheckoutProgress from "@modules/checkout/components/checkout-progress"

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

function formatDate(dateStr: string | null | undefined) {
  if (!dateStr) return "—"
  return new Intl.DateTimeFormat("ro-RO", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(new Date(dateStr))
}

// ── Section wrapper ───────────────────────────────────────────────────────────

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-y-3">
      <h3 className="text-sm font-bold text-[#1D1D1F] uppercase tracking-wide">{title}</h3>
      {children}
    </div>
  )
}

// ── Main template ─────────────────────────────────────────────────────────────

export default function OrderCompletedTemplate({
  order,
  customer,
}: {
  order: HttpTypes.StoreOrder
  customer: import("@medusajs/types").HttpTypes.StoreCustomer | null
}) {
  const items = order.items ?? []
  const addr = order.shipping_address
  const paymentSession = order.payment_collections?.[0]?.payment_sessions?.[0]

  const isManualPayment =
    !paymentSession || paymentSession.provider_id?.includes("system_default") ||
    paymentSession.provider_id?.includes("manual") ||
    paymentSession.provider_id?.includes("cash")

  const isPickup = order.shipping_methods?.some((m) =>
    m.name?.toLowerCase().includes("ridicare")
  ) ?? false

  return (
    <div className="max-w-screen-lg mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Progress — all done */}
      <div className="mb-10">
        <CheckoutProgress step="confirmation" />
      </div>

      {/* Success card */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 sm:p-8">

        {/* Header */}
        <div className="flex flex-col items-center text-center gap-y-4 pb-8 border-b border-gray-100">
          <div className="w-16 h-16 rounded-full bg-[#E8F5E9] flex items-center justify-center">
            <svg className="w-8 h-8 text-[#2E7D32]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-[#1D1D1F]">Comanda dumneavoastră a fost plasată.</h1>
            <p className="text-sm text-gray-500 mt-1">
              Vei primi o confirmare pe email la{" "}
              <span className="font-medium text-[#1D1D1F]">{order.email}</span>
            </p>
          </div>
          <div className="flex items-center gap-x-2 bg-[#FFF3E6] border border-[#F27A1A]/20 rounded-lg px-5 py-2.5">
            <span className="text-sm text-gray-500">Număr comandă:</span>
            <span className="text-base font-bold text-[#F27A1A]">#{order.display_id}</span>
          </div>
        </div>

        {/* Body — 2 columns on desktop */}
        <div className="pt-8 grid grid-cols-1 lg:grid-cols-2 gap-x-12 gap-y-8">

          {/* LEFT: Ordered items */}
          <Section title="Produse comandate">
            <ul className="flex flex-col divide-y divide-gray-100">
              {items.map((item) => (
                <li key={item.id} className="flex items-center gap-x-3 py-3">
                  <div className="w-12 h-12 rounded-lg bg-gray-50 border border-gray-100 overflow-hidden flex-shrink-0">
                    {item.thumbnail ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={item.thumbnail}
                        alt={item.product_title ?? ""}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-200">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1}
                            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-[#1D1D1F] truncate">{item.product_title}</p>
                    <p className="text-xs text-gray-400">
                      {item.quantity} × {formatRon(item.unit_price)}
                    </p>
                  </div>
                  <span className="text-sm font-semibold text-[#1D1D1F] flex-shrink-0">
                    {formatRon(item.total)}
                  </span>
                </li>
              ))}
            </ul>

            {/* Totals */}
            <div className="flex flex-col gap-y-2 border-t border-gray-100 pt-4 text-sm">
              <div className="flex justify-between text-gray-500">
                <span>Subtotal</span>
                <span>{formatRon(order.item_subtotal ?? order.subtotal)}</span>
              </div>
              <div className="flex justify-between text-gray-500">
                <span>Livrare</span>
                <span>
                  {(order.shipping_subtotal ?? 0) > 0
                    ? formatRon(order.shipping_subtotal)
                    : "Gratuită"}
                </span>
              </div>
              <div className="flex justify-between font-bold text-[#1D1D1F] pt-2 border-t border-gray-100 text-base">
                <span>Total</span>
                <span>{formatRon(order.total)}</span>
              </div>
            </div>
          </Section>

          {/* RIGHT: Delivery + payment info */}
          <div className="flex flex-col gap-y-6">

            {/* Delivery address */}
            <Section title="Adresă de livrare">
              {addr ? (
                <div className="text-sm text-gray-600 leading-relaxed">
                  <p className="font-medium text-[#1D1D1F]">
                    {addr.first_name} {addr.last_name}
                  </p>
                  <p>{addr.address_1}</p>
                  {addr.address_2 && <p>{addr.address_2}</p>}
                  <p>
                    {addr.postal_code && `${addr.postal_code}, `}
                    {addr.city}
                    {addr.province && `, ${addr.province}`}
                  </p>
                  <p>{addr.country_code?.toUpperCase()}</p>
                  {addr.phone && (
                    <p className="mt-1 text-gray-500">{addr.phone}</p>
                  )}
                </div>
              ) : (
                <p className="text-sm text-gray-400">—</p>
              )}
            </Section>

            {/* Payment method */}
            <Section title="Metodă de plată">
              <div className="flex items-center gap-x-3">
                <div className="w-9 h-9 rounded-lg bg-gray-100 flex items-center justify-center text-gray-500">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                </div>
                <span className="text-sm font-medium text-[#1D1D1F]">
                  {isManualPayment ? (isPickup ? "Plată la ridicare" : "Ramburs la livrare") : (paymentSession?.provider_id ?? "—")}
                </span>
              </div>
            </Section>

            {/* Date */}
            <Section title="Data comenzii">
              <p className="text-sm text-gray-600">{formatDate(order.created_at)}</p>
            </Section>
          </div>
        </div>

        {/* CTA buttons */}
        <div className="flex flex-col sm:flex-row gap-3 pt-8 mt-8 border-t border-gray-100">
          {customer && (
            <LocalizedClientLink href="/cont/comenzi" className="flex-1">
              <button className="w-full h-11 border-2 border-[#F27A1A] text-[#F27A1A] hover:bg-[#FFF3E6] font-semibold rounded-xl transition-colors duration-150 text-sm">
                Vedeți comenzile mele
              </button>
            </LocalizedClientLink>
          )}
          <LocalizedClientLink href="/store" className="flex-1">
            <button className="w-full h-11 bg-[#F27A1A] hover:bg-[#D4600E] text-white font-semibold rounded-xl transition-colors duration-150 text-sm">
              Înapoi la magazin
            </button>
          </LocalizedClientLink>
        </div>
      </div>
    </div>
  )
}
