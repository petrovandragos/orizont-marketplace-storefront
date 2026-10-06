import { Metadata } from "next"
import Link from "next/link"
import { retrieveCustomer } from "@lib/data/customer"
import { listOrders } from "@lib/data/orders"
import { notFound } from "next/navigation"
import { getOrderStatusDisplay, formatRon, formatDate } from "@modules/account/components/cont-shared/utils"

export const metadata: Metadata = {
  title: "Contul meu",
}

type Props = {
  params: Promise<{ countryCode: string }>
}

export default async function ContDashboardPage({ params }: Props) {
  const { countryCode } = await params
  const customer = await retrieveCustomer().catch(() => null)
  const orders = await listOrders(10, 0).catch(() => null) ?? []

  if (!customer) notFound()

  const recentOrders = orders.slice(0, 3)
  const lastOrder = orders[0]

  return (
    <div className="flex flex-col gap-y-8">
      {/* Welcome */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
        <h1 className="text-xl font-bold text-[#1A1A1A]">
          Bună, {customer.first_name || customer.email?.split("@")[0]}!
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Bun venit în contul tău Orizont.
        </p>
      </div>

      {/* Quick stats */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 flex flex-col gap-y-1">
          <span className="text-xs font-medium text-gray-400 uppercase tracking-wide">
            Comenzi totale
          </span>
          <span className="text-3xl font-bold text-[#1A1A1A]">
            {orders.length}
          </span>
        </div>

        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 flex flex-col gap-y-1">
          <span className="text-xs font-medium text-gray-400 uppercase tracking-wide">
            Ultima comandă
          </span>
          <span className="text-sm font-semibold text-[#1A1A1A]">
            {lastOrder ? formatDate(lastOrder.created_at) : "—"}
          </span>
        </div>

        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 flex flex-col gap-y-1">
          <span className="text-xs font-medium text-gray-400 uppercase tracking-wide">
            Adrese salvate
          </span>
          <span className="text-3xl font-bold text-[#1A1A1A]">
            {customer.addresses?.length ?? 0}
          </span>
        </div>
      </div>

      {/* Recent orders */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
        <div className="flex items-center justify-between p-5 border-b border-gray-100">
          <h2 className="text-base font-bold text-[#1A1A1A]">Comenzi recente</h2>
          <Link
            href={`/cont/comenzi`}
            className="text-sm text-[#F27A1A] hover:text-[#D4600E] font-medium transition-colors"
          >
            Vezi toate →
          </Link>
        </div>

        {recentOrders.length === 0 ? (
          <div className="p-8 text-center">
            <svg className="w-10 h-10 text-gray-200 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            <p className="text-sm text-gray-400">Nu ai plasate comenzi încă.</p>
            <Link
              href={`/store`}
              className="inline-block mt-3 text-sm font-medium text-[#F27A1A] hover:text-[#D4600E]"
            >
              Descoperă produsele →
            </Link>
          </div>
        ) : (
          <ul className="divide-y divide-gray-100">
            {recentOrders.map((order) => {
              const { label, className } = getOrderStatusDisplay(order)
              return (
                <li key={order.id}>
                  <Link
                    href={`/cont/comenzi/${order.id}`}
                    className="flex items-center justify-between px-5 py-4 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex flex-col gap-y-0.5">
                      <span className="text-sm font-semibold text-[#1A1A1A]">
                        Comanda #{order.display_id}
                      </span>
                      <span className="text-xs text-gray-400">
                        {formatDate(order.created_at)} ·{" "}
                        {order.items?.length ?? 0}{" "}
                        {(order.items?.length ?? 0) === 1 ? "produs" : "produse"}
                      </span>
                    </div>
                    <div className="flex items-center gap-x-3">
                      <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full ${className}`}>
                        {label}
                      </span>
                      <span className="text-sm font-bold text-[#1A1A1A]">
                        {formatRon(order.total)}
                      </span>
                      <svg className="w-4 h-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </Link>
                </li>
              )
            })}
          </ul>
        )}
      </div>
    </div>
  )
}
