"use client"

import { XMark } from "@medusajs/icons"
import { HttpTypes } from "@medusajs/types"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import Help from "@modules/order/components/help"
import Items from "@modules/order/components/items"
import OrderDetails from "@modules/order/components/order-details"
import OrderSummary from "@modules/order/components/order-summary"
import ShippingDetails from "@modules/order/components/shipping-details"
import React from "react"

type OrderDetailsTemplateProps = {
  order: HttpTypes.StoreOrder
}

const OrderDetailsTemplate: React.FC<OrderDetailsTemplateProps> = ({
  order,
}) => {
  return (
    <div className="flex flex-col justify-center gap-y-4">
      <div className="flex flex-col gap-y-2 pb-8 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-black tracking-tighter text-gray-900">Detalii comandă</h1>
          <LocalizedClientLink
            href="/cont/comenzi"
            className="flex items-center gap-x-2 text-xs font-black text-gray-400 hover:text-black transition-colors uppercase tracking-widest group"
            data-testid="back-to-overview-button"
          >
            <XMark className="group-hover:rotate-90 transition-transform" /> 
            Înapoi la Comenzi
          </LocalizedClientLink>
        </div>
        <p className="text-gray-500 font-medium">Informațiile complete despre comandă și starea livrării.</p>
      </div>
      <div
        className="flex flex-col gap-4 h-full bg-white w-full"
        data-testid="order-details-container"
      >
        <OrderDetails order={order} showStatus />
        <Items order={order} />
        <ShippingDetails order={order} />
        <OrderSummary order={order} />
        <Help />
      </div>
    </div>
  )
}

export default OrderDetailsTemplate
