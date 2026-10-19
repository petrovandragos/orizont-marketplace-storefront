"use client"

import { useDeliveryMethod } from "@modules/checkout/context/delivery-method-context"

const DELIVERY_COST_LEI = 25

function formatRon(n: number) {
  return (
    new Intl.NumberFormat("ro-RO", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(n) + " lei"
  )
}

export default function CartTotalPreview({ baseTotal }: { baseTotal: number }) {
  const { method } = useDeliveryMethod()
  const total = method === "livrare" ? baseTotal + DELIVERY_COST_LEI : baseTotal

  return (
    <div className="flex items-center justify-between">
      <span className="text-sm text-gray-500">Total</span>
      <span className="text-base font-bold text-[#1D1D1F]">{formatRon(total)}</span>
    </div>
  )
}
