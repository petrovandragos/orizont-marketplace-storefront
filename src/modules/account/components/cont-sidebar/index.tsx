"use client"

import { useParams, usePathname } from "next/navigation"
import Link from "next/link"
import { useTransition } from "react"
import { HttpTypes } from "@medusajs/types"
import { signoutCont } from "@lib/data/customer"

// ── Nav item ──────────────────────────────────────────────────────────────────

function NavItem({
  href,
  icon,
  label,
  active,
}: {
  href: string
  icon: React.ReactNode
  label: string
  active: boolean
}) {
  return (
    <Link
      href={href}
      className={`flex items-center gap-x-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
        active
          ? "bg-[#FFF3E6] text-[#F27A1A]"
          : "text-gray-600 hover:bg-gray-100 hover:text-[#1D1D1F]"
      }`}
    >
      <span className={active ? "text-[#F27A1A]" : "text-gray-400"}>{icon}</span>
      {label}
    </Link>
  )
}

// ── Main component ────────────────────────────────────────────────────────────

export default function ContSidebar({
  customer,
}: {
  customer: HttpTypes.StoreCustomer
}) {
  const { countryCode } = useParams() as { countryCode: string }
  const pathname = usePathname()
  const [isPending, startTransition] = useTransition()

  const base = `/cont`
  const is = (path: string) =>
    path === "" ? pathname === base : pathname.startsWith(`${base}/${path}`)

  const handleLogout = () => {
    startTransition(() => signoutCont(countryCode))
  }

  return (
    <aside className="w-full lg:w-56 flex-shrink-0">
      {/* Customer info */}
      <div className="flex items-center gap-x-3 px-3 pb-4 mb-2 border-b border-gray-100">
        <div className="w-10 h-10 rounded-full bg-[#FFF3E6] flex items-center justify-center flex-shrink-0">
          <svg className="w-5 h-5 text-[#F27A1A]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        </div>
        <div className="min-w-0">
          <p className="text-sm font-semibold text-[#1D1D1F] truncate">
            {customer.first_name} {customer.last_name}
          </p>
          <p className="text-xs text-gray-400 truncate">{customer.email}</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex flex-col gap-y-0.5">
        <NavItem
          href={base}
          icon={
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
          }
          label="Contul meu"
          active={is("")}
        />
        <NavItem
          href={`${base}/comenzi`}
          icon={
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
          }
          label="Comenzile mele"
          active={is("comenzi")}
        />
        <NavItem
          href={`${base}/informatii`}
          icon={
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          }
          label="Informații personale"
          active={is("informatii")}
        />
        <NavItem
          href={`${base}/adrese`}
          icon={
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          }
          label="Adresele mele"
          active={is("adrese")}
        />

        {/* Divider */}
        <div className="h-px bg-gray-100 my-1.5" />

        {/* Logout */}
        <button
          type="button"
          onClick={handleLogout}
          disabled={isPending}
          className="flex items-center gap-x-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-500 hover:bg-gray-100 hover:text-red-600 transition-colors disabled:opacity-60 w-full text-left"
        >
          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          {isPending ? "Se deconectează..." : "Deconectare"}
        </button>
      </nav>
    </aside>
  )
}
