"use client"

import OrderCard from "../order-card"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { HttpTypes } from "@medusajs/types"

const OrderOverview = ({ orders }: { orders: HttpTypes.StoreOrder[] }) => {
  if (orders?.length) {
    return (
      <div className="flex flex-col gap-y-8 w-full">
        {orders.map((o) => (
          <div
            key={o.id}
            className="border-b border-gray-200 pb-6 last:pb-0 last:border-none"
          >
            <OrderCard order={o} />
          </div>
        ))}
      </div>
    )
  }

  return (
    <div
      className="w-full flex flex-col items-center gap-y-4 py-12 text-center"
      data-testid="no-orders-container"
    >
      <div className="w-16 h-16 rounded-full bg-[#FFF3E6] flex items-center justify-center">
        <svg className="w-8 h-8 text-[#F27A1A]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
      </div>
      <h2 className="text-xl font-semibold text-[#1D1D1F]">Nicio comandă încă</h2>
      <p className="text-sm text-gray-500 max-w-xs">
        Nu ați plasat încă nicio comandă. Vedeți catalogul nostru pentru a găsi ce vă trebuie.
      </p>
      <LocalizedClientLink
        href="/store"
        className="mt-2 px-8 py-3 bg-[#F27A1A] hover:bg-[#D4600E] text-white font-medium rounded-xl transition-colors duration-200 text-sm"
        data-testid="continue-shopping-button"
      >
        Mergeți la magazin
      </LocalizedClientLink>
    </div>
  )
}

export default OrderOverview
