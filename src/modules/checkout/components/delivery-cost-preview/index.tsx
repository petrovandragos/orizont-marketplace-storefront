"use client"

import { useDeliveryMethod } from "@modules/checkout/context/delivery-method-context"

export default function DeliveryCostPreview() {
  const { method } = useDeliveryMethod()

  return (
    <div className="flex items-center justify-between text-sm text-gray-500">
      <span>Cost livrare</span>
      {method === "pickup" ? (
        <span className="font-bold text-green-600">GRATUIT</span>
      ) : (
        <span className="font-semibold text-[#1D1D1F]">25,00 lei</span>
      )}
    </div>
  )
}
