import { Metadata } from "next"
import Link from "next/link"
import { retrieveCustomer } from "@lib/data/customer"
import { listOrders } from "@lib/data/orders"
import { notFound } from "next/navigation"
import { getOrderStatusDisplay, formatRon, formatDate } from "@modules/account/components/cont-shared/utils"

export const metadata: Metadata = {
  title: "Comenzile mele",
}

type Props = {
  params: Promise<{ countryCode: string }>
}

export default async function ComenziPage({ params }: Props) {
  const { countryCode } = await params
  const customer = await retrieveCustomer().catch(() => null)
  const orders = await listOrders(50, 0).catch(() => null) ?? []

  if (!customer) notFound()

  return (
    <div className="flex flex-col gap-y-6">
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
        <h1 className="text-xl font-bold text-[#1A1A1A]">Comenzile mele</h1>
        <p className="text-sm text-gray-500 mt-1">
          {orders.length === 0
            ? "Nu ai plasate comenzi încă."
            : `${orders.length} ${orders.length === 1 ? "comandă" : "comenzi"} în total`}
        </p>
      </div>

      {orders.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-12 text-center">
          <svg className="w-12 h-12 text-gray-200 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
              d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
          </svg>
          <p className="text-gray-400 mb-4">Nu ai plasat nicio comandă încă.</p>
          <Link
            href={`/store`}
            className="inline-block px-5 py-2.5 bg-[#F27A1A] text-white text-sm font-semibold rounded-lg hover:bg-[#D4600E] transition-colors"
          >
            Descoperă produsele
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
          <ul className="divide-y divide-gray-100">
            {orders.map((order) => {
              const { label, className } = getOrderStatusDisplay(order)
              return (
                <li key={order.id}>
                  <Link
                    href={`/cont/comenzi/${order.id}`}
                    className="flex items-center justify-between px-5 py-4 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex flex-col gap-y-1">
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
        </div>
      )}
    </div>
  )
}
