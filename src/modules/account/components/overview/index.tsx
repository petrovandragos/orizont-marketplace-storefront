import { Container } from "@medusajs/ui"
import { SquaresPlus } from "@medusajs/icons"

import ChevronDown from "@modules/common/icons/chevron-down"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { convertToLocale } from "@lib/util/money"
import { HttpTypes } from "@medusajs/types"

type OverviewProps = {
  customer: HttpTypes.StoreCustomer | null
  orders: HttpTypes.StoreOrder[] | null
}

const Overview = ({ customer, orders }: OverviewProps) => {
  return (
    <div data-testid="overview-page-wrapper" className="flex flex-col gap-y-12">
      <div className="flex flex-col gap-y-2 pb-12 border-b border-gray-100">
        <h1 className="text-4xl font-bold tracking-tighter text-gray-900" data-testid="welcome-message">
          Salut, {customer?.first_name}
        </h1>
        <p className="text-gray-500 font-medium text-lg">
          Bine ați revenit în contul Orizont.
        </p>
      </div>

      <div className="flex flex-col gap-y-12">
        <div className="flex items-center justify-between group pt-12">
          <div className="flex flex-col gap-y-1">
            <h2 className="text-2xl font-bold tracking-tighter text-gray-900">Istoric Comenzi</h2>
            <p className="text-xs font-semibold uppercase tracking-widest text-gray-400">Achizițiile recente</p>
          </div>
          <LocalizedClientLink
            href="/cont/comenzi"
            className="flex items-center gap-x-2 text-xs font-bold text-gray-400 hover:text-black transition-colors uppercase tracking-widest"
            data-testid="orders-link"
          >
            Vedeți toate comenzile
          </LocalizedClientLink>
        </div>
        
        <ul className="flex flex-col gap-y-4" data-testid="orders-wrapper">
          {orders && orders.length > 0 ? (
            orders.slice(0, 5).map((order) => {
              return (
                <li key={order.id} data-testid="order-wrapper">
                  <LocalizedClientLink href={`/cont/comenzi/${order.id}`}>
                    <Container className="bg-white border border-gray-100 hover:border-gray-900 hover:shadow-2xl hover:shadow-gray-200/50 transition-all duration-500 rounded-[2rem] p-8 flex flex-col small:flex-row justify-between items-center gap-6 group">
                      <div className="grid grid-cols-2 small:grid-cols-4 gap-8 flex-1 w-full">
                        <div className="flex flex-col gap-y-1">
                          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 leading-none">Data</span>
                          <span className="text-sm font-black text-gray-900 tracking-tight">
                            {new Date(order.created_at).toLocaleDateString('ro-RO', { month: 'short', day: 'numeric', year: 'numeric' })}
                          </span>
                        </div>
                        <div className="flex flex-col gap-y-1 border-l border-gray-50 pl-8">
                          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 leading-none">Referință</span>
                          <span className="text-sm font-black text-gray-900 tracking-tight" data-testid="order-id">
                            #{order.display_id}
                          </span>
                        </div>
                        <div className="flex flex-col gap-y-1 border-l border-gray-50 pl-8">
                          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 leading-none">Valoare</span>
                          <span className="text-sm font-black text-gray-900 tracking-tight" data-testid="order-amount">
                            {convertToLocale({
                              amount: order.total,
                              currency_code: order.currency_code,
                            })}
                          </span>
                        </div>
                        <div className="flex flex-col gap-y-1 items-end small:items-start border-l border-gray-50 pl-8">
                          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 leading-none">Status</span>
                          <span className="text-[10px] font-bold text-green-600 bg-green-50 px-3 py-1 rounded-full border border-green-100 uppercase tracking-widest">
                            Livrabil
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-gray-50 group-hover:bg-black group-hover:text-white transition-all duration-300">
                        <ChevronDown className="-rotate-90" />
                      </div>
                    </Container>
                  </LocalizedClientLink>
                </li>
              )
            })
          ) : (
            <div className="py-24 flex flex-col items-center justify-center border border-dashed border-gray-200 rounded-[3rem] gap-y-6 bg-gray-50/30">
              <div className="w-20 h-20 bg-white shadow-sm rounded-3xl flex items-center justify-center border border-gray-100">
                <SquaresPlus className="text-gray-300 w-10 h-10" />
              </div>
              <span className="text-gray-400 font-bold tracking-tight text-lg" data-testid="no-orders-message">
                Nu există istoric de tranzacții.
              </span>
            </div>
          )}
        </ul>
      </div>
    </div>
  )
}

const getProfileCompletion = (customer: HttpTypes.StoreCustomer | null) => {
  let count = 0

  if (!customer) {
    return 0
  }

  if (customer.email) {
    count++
  }

  if (customer.first_name && customer.last_name) {
    count++
  }

  if (customer.phone) {
    count++
  }

  const billingAddress = customer.addresses?.find(
    (addr) => addr.is_default_billing
  )

  if (billingAddress) {
    count++
  }

  return (count / 4) * 100
}

export default Overview
