"use client"

import { useRef, useState, useCallback } from "react"
import { HttpTypes } from "@medusajs/types"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

const ACCOUNT_LINKS = [
  {
    label: "Profilul meu",
    href: "/cont/informatii",
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75}
          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
      </svg>
    ),
  },
  {
    label: "Comenzile mele",
    href: "/cont/comenzi",
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75}
          d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
      </svg>
    ),
  },
  {
    label: "Adresele mele",
    href: "/cont/adrese",
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75}
          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75}
          d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
  },
]

type Props = {
  customer: HttpTypes.StoreCustomer | null
}

export default function NavAccountDropdown({ customer }: Props) {
  const [open, setOpen] = useState(false)
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const handleEnter = useCallback(() => {
    if (closeTimer.current) clearTimeout(closeTimer.current)
    setOpen(true)
  }, [])

  const handleLeave = useCallback(() => {
    closeTimer.current = setTimeout(() => setOpen(false), 120)
  }, [])

  const initials = customer
    ? `${customer.first_name?.[0] ?? ""}${customer.last_name?.[0] ?? ""}`.toUpperCase() || "?"
    : null

  return (
    <div
      className="relative hidden md:flex items-center"
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
    >
      {/* Trigger */}
      <LocalizedClientLink
        href="/cont"
        aria-label="Contul meu"
        data-testid="nav-account-link"
        className={`flex items-center gap-x-1.5 transition-colors duration-150 ${
          open ? "text-[#1D1D1F]" : "text-[#424245] hover:text-[#1D1D1F]"
        }`}
      >
        {initials ? (
          <span className="w-7 h-7 rounded-full bg-[#F27A1A] text-white text-xs font-bold flex items-center justify-center leading-none">
            {initials}
          </span>
        ) : (
          <svg className="w-[22px] h-[22px]" fill="none" stroke="currentColor" strokeWidth={1.6} viewBox="0 0 24 24" aria-hidden="true">
            <circle cx="12" cy="8" r="4" /><path d="M4 21c1.5-4 4.5-6 8-6s6.5 2 8 6" />
          </svg>
        )}
      </LocalizedClientLink>

      {/* Dropdown panel */}
      <div
        className={`absolute top-full right-0 mt-3 w-64 transition-all duration-200 origin-top-right ${
          open
            ? "opacity-100 scale-100 translate-y-0 pointer-events-auto"
            : "opacity-0 scale-95 -translate-y-1 pointer-events-none"
        }`}
        style={{ filter: "drop-shadow(0 8px 32px rgba(0,0,0,0.12))" }}
      >
        {/* Arrow */}
        <div className="absolute -top-1.5 right-4 w-3 h-3 bg-white border-l border-t border-gray-100 rotate-45 z-10" />

        <div className="relative bg-white rounded-2xl border border-gray-100 overflow-hidden">
          {/* Header */}
          <div className="px-4 py-4 border-b border-gray-100">
            <div className="flex items-center gap-x-3">
              <div className="w-10 h-10 rounded-full bg-[#F27A1A] flex items-center justify-center flex-shrink-0">
                {initials ? (
                  <span className="text-white text-sm font-bold">{initials}</span>
                ) : (
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                )}
              </div>
              <div className="flex-1 min-w-0">
                {customer ? (
                  <>
                    <p className="text-sm font-bold text-[#1D1D1F] truncate">
                      {customer.first_name} {customer.last_name}
                    </p>
                    <p className="text-xs text-gray-400 truncate">{customer.email}</p>
                  </>
                ) : (
                  <>
                    <p className="text-sm font-bold text-[#1D1D1F]">Bun venit!</p>
                    <p className="text-xs text-gray-500">Autentificați-vă pentru a vedea comenzile</p>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Links — only shown when logged in */}
          {customer && (
            <ul className="py-2">
              {ACCOUNT_LINKS.map((link) => (
                <li key={link.href}>
                  <LocalizedClientLink
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className="flex items-center gap-x-3 px-4 py-2.5 text-sm text-[#424245] hover:bg-gray-50 hover:text-[#F27A1A] transition-colors group"
                  >
                    <span className="text-gray-400 group-hover:text-[#F27A1A] transition-colors flex-shrink-0">
                      {link.icon}
                    </span>
                    <span className="flex-1">{link.label}</span>
                    <svg className="w-3.5 h-3.5 text-gray-300 group-hover:text-[#F27A1A] opacity-0 group-hover:opacity-100 transition-all -translate-x-1 group-hover:translate-x-0 duration-150" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </LocalizedClientLink>
                </li>
              ))}
            </ul>
          )}

          {/* Footer CTA */}
          <div className="px-4 pb-4 pt-2 border-t border-gray-100">
            {customer ? (
              <LocalizedClientLink
                href="/cont"
                onClick={() => setOpen(false)}
                className="btn-pill-sm w-full"
              >
                Contul meu
              </LocalizedClientLink>
            ) : (
              <LocalizedClientLink
                href="/cont"
                onClick={() => setOpen(false)}
                className="btn-pill-sm w-full"
              >
                Autentificare
              </LocalizedClientLink>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
