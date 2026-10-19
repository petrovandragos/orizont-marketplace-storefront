"use client"

import Back from "@modules/common/icons/back"
import FastDelivery from "@modules/common/icons/fast-delivery"
import Refresh from "@modules/common/icons/refresh"

import Accordion from "./accordion"
import { HttpTypes } from "@medusajs/types"

type ProductTabsProps = {
  product: HttpTypes.StoreProduct
}

const ProductTabs = ({ product }: ProductTabsProps) => {
  const tabs = [
    {
      label: "Informații produs",
      component: <ProductInfoTab product={product} />,
    },
    {
      label: "Livrare și returnări",
      component: <ShippingInfoTab />,
    },
  ]

  return (
    <div className="w-full">
      <Accordion type="multiple">
        {tabs.map((tab, i) => (
          <Accordion.Item
            key={i}
            title={tab.label}
            headingSize="medium"
            value={tab.label}
          >
            {tab.component}
          </Accordion.Item>
        ))}
      </Accordion>
    </div>
  )
}

const ProductInfoTab = ({ product }: ProductTabsProps) => {
  return (
    <div className="text-sm text-gray-600 py-6">
      <div className="grid grid-cols-2 gap-x-8 gap-y-4">
        <div className="flex flex-col gap-y-4">
          <div>
            <span className="text-xs text-gray-400 uppercase tracking-wider block mb-1">Material</span>
            <p className="text-[#1D1D1F]">{product.material ? product.material : "—"}</p>
          </div>
          <div>
            <span className="text-xs text-gray-400 uppercase tracking-wider block mb-1">Țara de origine</span>
            <p className="text-[#1D1D1F]">{product.origin_country ? product.origin_country : "—"}</p>
          </div>
          <div>
            <span className="text-xs text-gray-400 uppercase tracking-wider block mb-1">Tip</span>
            <p className="text-[#1D1D1F]">{product.type ? product.type.value : "—"}</p>
          </div>
        </div>
        <div className="flex flex-col gap-y-4">
          <div>
            <span className="text-xs text-gray-400 uppercase tracking-wider block mb-1">Greutate</span>
            <p className="text-[#1D1D1F]">{product.weight ? `${product.weight} g` : "—"}</p>
          </div>
          <div>
            <span className="text-xs text-gray-400 uppercase tracking-wider block mb-1">Dimensiuni</span>
            <p className="text-[#1D1D1F]">
              {product.length && product.width && product.height
                ? `${product.length}L × ${product.width}W × ${product.height}H`
                : "—"}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

const ShippingInfoTab = () => {
  return (
    <div className="text-sm py-6">
      <div className="grid grid-cols-1 gap-y-6">
        <div className="flex items-start gap-x-3">
          <div className="w-9 h-9 rounded-xl bg-orange-50 flex items-center justify-center flex-shrink-0 text-[#F27A1A]">
            <FastDelivery />
          </div>
          <div>
            <span className="font-medium text-[#1D1D1F]">Livrare rapidă</span>
            <p className="text-gray-500 max-w-sm mt-0.5">
              Coletul va ajunge în 1–3 zile lucrătoare la adresa de livrare sau îl puteți ridica din depozitul nostru.
            </p>
          </div>
        </div>
        <div className="flex items-start gap-x-3">
          <div className="w-9 h-9 rounded-xl bg-orange-50 flex items-center justify-center flex-shrink-0 text-[#F27A1A]">
            <Refresh />
          </div>
          <div>
            <span className="font-medium text-[#1D1D1F]">Schimburi simple</span>
            <p className="text-gray-500 max-w-sm mt-0.5">
              Nu ești mulțumit de produs? Te ajutăm să îl înlocuiești cu unul potrivit.
            </p>
          </div>
        </div>
        <div className="flex items-start gap-x-3">
          <div className="w-9 h-9 rounded-xl bg-orange-50 flex items-center justify-center flex-shrink-0 text-[#F27A1A]">
            <Back />
          </div>
          <div>
            <span className="font-medium text-[#1D1D1F]">Returnări ușoare</span>
            <p className="text-gray-500 max-w-sm mt-0.5">
              Returnează produsul și îți rambursăm banii. Facem tot posibilul pentru o returnare fără bătăi de cap.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductTabs
