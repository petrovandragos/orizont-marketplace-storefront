import { HttpTypes } from "@medusajs/types"
import { listCartPaymentMethods } from "@lib/data/payment"

import CheckoutProgress from "@modules/checkout/components/checkout-progress"
import StepDeliveryMethod from "@modules/checkout/components/step-delivery-method"
import StepDelivery from "@modules/checkout/components/step-delivery"
import StepPayment from "@modules/checkout/components/step-payment"
import DeliveryCostPreview from "@modules/checkout/components/delivery-cost-preview"
import CartTotalPreview from "@modules/checkout/components/cart-total-preview"
import { DeliveryMethodProvider } from "@modules/checkout/context/delivery-method-context"

// ── Cart mini-summary ─────────────────────────────────────────────────────────

function formatRon(n: number | null | undefined) {
  if (n == null) return "—"
  return (
    new Intl.NumberFormat("ro-RO", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(n) +
    " lei"
  )
}

function CartMiniSummary({
  cart,
  showDeliveryPreview,
}: {
  cart: HttpTypes.StoreCart
  showDeliveryPreview?: boolean
}) {
  const items = cart.items ?? []
  const total = cart.total ?? 0
  const itemCount = items.reduce((s, i) => s + i.quantity, 0)

  // Strip any stale shipping cost from the base total used for the preview.
  // This makes the delivery/address steps correct regardless of whether a
  // previous shipping method is still attached to the cart.
  const productTotal = total - (cart.shipping_total ?? 0)

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 flex flex-col gap-y-4">
      <h3 className="text-sm font-bold text-[#1D1D1F]">
        Rezumat comandă ({itemCount} {itemCount === 1 ? "produs" : "produse"})
      </h3>

      <ul className="flex flex-col gap-y-3">
        {items.map((item) => (
          <li key={item.id} className="flex items-center gap-x-3">
            <div className="w-10 h-10 rounded-lg bg-gray-50 border border-gray-100 overflow-hidden flex-shrink-0">
              {item.thumbnail ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={item.thumbnail} alt={item.product_title ?? ""} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-200">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1}
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-[#1D1D1F] truncate">{item.product_title}</p>
              <p className="text-xs text-gray-400">x{item.quantity}</p>
            </div>
            <span className="text-xs font-semibold text-[#1D1D1F] flex-shrink-0">
              {formatRon(item.total)}
            </span>
          </li>
        ))}
      </ul>

      <div className="border-t border-gray-100 pt-3 flex flex-col gap-y-1.5">
        {showDeliveryPreview ? (
          <DeliveryCostPreview />
        ) : (cart.shipping_methods?.length ?? 0) > 0 ? (
          <div className="flex items-center justify-between text-sm text-gray-500">
            <span>Cost livrare</span>
            <span>{formatRon(cart.shipping_total)}</span>
          </div>
        ) : null}
        {showDeliveryPreview ? (
          <CartTotalPreview baseTotal={productTotal} />
        ) : (
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-500">Total</span>
            <span className="text-base font-bold text-[#1D1D1F]">{formatRon(total)}</span>
          </div>
        )}
      </div>
    </div>
  )
}

// ── Step resolver ─────────────────────────────────────────────────────────────

type ValidStep = "delivery" | "address" | "payment" | "confirmation"

function resolveStep(raw: string): ValidStep {
  if (raw === "address" || raw === "payment" || raw === "confirmation") return raw
  return "delivery"
}

// ── Main template ─────────────────────────────────────────────────────────────

type CheckoutFormProps = {
  cart: HttpTypes.StoreCart
  customer: HttpTypes.StoreCustomer | null
  step: string
  method: string
}

export default async function CheckoutForm({ cart, customer, step, method }: CheckoutFormProps) {
  const currentStep = resolveStep(step)
  const deliveryMethod = method === "pickup" ? "pickup" : "livrare"

  const paymentMethods =
    currentStep === "payment"
      ? await listCartPaymentMethods(cart.region?.id ?? "").catch(() => [])
      : []

  return (
    <DeliveryMethodProvider initialMethod={deliveryMethod}>
      <div className="max-w-screen-lg mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Progress bar */}
        <div className="mb-10">
          <CheckoutProgress step={currentStep} />
        </div>

        {/* Two-column layout */}
        <div className="flex flex-col lg:flex-row gap-x-10 gap-y-8 items-start">

          {/* LEFT — Active step form */}
          <div className="w-full lg:flex-1 bg-white rounded-xl border border-gray-100 shadow-sm p-6">
            {currentStep === "delivery" && (
              <StepDeliveryMethod />
            )}
            {currentStep === "address" && (
              <StepDelivery cart={cart} customer={customer} method={deliveryMethod} />
            )}
            {currentStep === "payment" && (
              <StepPayment cart={cart} availablePaymentMethods={paymentMethods ?? []} />
            )}
          </div>

          {/* RIGHT — Cart summary (sticky) */}
          <div className="w-full lg:w-80 lg:sticky lg:top-[var(--header-height,64px)]">
            <CartMiniSummary
              cart={cart}
              showDeliveryPreview={currentStep === "delivery" || currentStep === "address"}
            />
          </div>
        </div>
      </div>
    </DeliveryMethodProvider>
  )
}
