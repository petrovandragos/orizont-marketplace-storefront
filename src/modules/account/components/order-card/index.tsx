import { Button } from "@medusajs/ui"
import { useMemo } from "react"

import Thumbnail from "@modules/products/components/thumbnail"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { convertToLocale } from "@lib/util/money"
import { HttpTypes } from "@medusajs/types"
import { getOrderStatusDisplay } from "@modules/account/components/cont-shared/utils"

type OrderCardProps = {
  order: HttpTypes.StoreOrder
}

const OrderCard = ({ order }: OrderCardProps) => {
  const { label: statusLabel, className: statusClass } = getOrderStatusDisplay(order)

  const numberOfLines = useMemo(() => {
    return (
      order.items?.reduce((acc, item) => {
        return acc + item.quantity
      }, 0) ?? 0
    )
  }, [order])

  const numberOfProducts = useMemo(() => {
    return order.items?.length ?? 0
  }, [order])

  return (
    <div className="bg-white border border-gray-100 rounded-[2rem] p-8 flex flex-col gap-y-8 hover:shadow-2xl hover:shadow-gray-200/50 transition-all duration-500 group" data-testid="order-card">
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-y-1">
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 leading-none">Referință Comandă</span>
          <h3 className="text-2xl font-bold text-gray-900 tracking-tighter">
            #<span data-testid="order-display-id">{order.display_id}</span>
          </h3>
        </div>
        <div className="flex flex-col items-end gap-y-1">
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 leading-none">Status</span>
          <span className={`text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest ${statusClass}`}>
            {statusLabel}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-x-10 py-6 border-y border-gray-50 text-sm font-semibold text-gray-900">
        <div className="flex flex-col gap-y-1">
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 leading-none">Data Plasării</span>
          <span data-testid="order-created-at" className="tracking-tight font-bold">
            {new Date(order.created_at).toLocaleDateString('ro-RO', { month: 'short', day: 'numeric', year: 'numeric' })}
          </span>
        </div>
        <div className="flex flex-col gap-y-1 border-l border-gray-100 pl-10">
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 leading-none">Valoare Totală</span>
          <span data-testid="order-amount" className="tracking-tight font-bold">
            {convertToLocale({
              amount: order.total,
              currency_code: order.currency_code,
            })}
          </span>
        </div>
        <div className="flex flex-col gap-y-1 border-l border-gray-100 pl-10">
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 leading-none">Volum</span>
          <span className="tracking-tight text-gray-500 font-medium">{`${numberOfLines} ${numberOfLines > 1 ? "Produse" : "Produs"}`}</span>
        </div>
      </div>

      <div className="grid grid-cols-2 small:grid-cols-4 gap-6">
        {order.items?.slice(0, 4).map((i) => {
          return (
            <div
              key={i.id}
              className="flex flex-col gap-y-3 group/item"
              data-testid="order-item"
            >
              <div className="rounded-2xl overflow-hidden border border-gray-100 group-hover/item:border-gray-200 transition-colors shadow-sm">
                <Thumbnail thumbnail={i.thumbnail} images={[]} size="full" />
              </div>
              <div className="flex flex-col gap-y-0.5">
                <span
                  className="text-xs font-bold text-gray-900 truncate tracking-tight"
                  data-testid="item-title"
                >
                  {i.title}
                </span>
                <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest" data-testid="item-quantity">
                  Cantitate: {i.quantity}
                </span>
              </div>
            </div>
          )
        })}
        {numberOfProducts > 4 && (
          <div className="w-full h-full flex flex-col items-center justify-center bg-gray-50 rounded-2xl border border-dashed border-gray-200 text-gray-400">
            <span className="text-lg font-bold tracking-tighter">
              +{numberOfProducts - 4}
            </span>
            <span className="text-[10px] font-bold uppercase tracking-widest">Mai multe</span>
          </div>
        )}
      </div>

      <div className="flex justify-end pt-4 border-t border-gray-50">
        <LocalizedClientLink href={`/cont/comenzi/${order.id}`}>
          <Button 
            data-testid="order-details-link" 
            variant="secondary"
            className="rounded-xl px-10 h-12 font-bold text-[10px] uppercase tracking-[0.2em] border-gray-900 text-gray-900 hover:bg-black hover:text-white hover:border-black transition-all active:scale-95 shadow-sm"
          >
            Vedeți detaliile comenzii
          </Button>
        </LocalizedClientLink>
      </div>
    </div>
  )
}

export default OrderCard
