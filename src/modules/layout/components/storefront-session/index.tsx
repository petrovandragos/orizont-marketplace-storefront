"use client"

import { useCartDrawer } from "@modules/cart/context/cart-drawer-context"
import { HttpTypes } from "@medusajs/types"
import { usePathname } from "next/navigation"
import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react"

export type SessionCustomer = {
  id: string
  email: string
  first_name: string | null
  last_name: string | null
}

type SessionData = {
  customer: SessionCustomer | null
  cart: HttpTypes.StoreCart | null
  shippingOptions: HttpTypes.StoreCartShippingOption[]
}

type SessionState = SessionData & {
  ready: boolean
  itemCount: number
}

const EMPTY_DATA: SessionData = {
  customer: null,
  cart: null,
  shippingOptions: [],
}

const SessionContext = createContext<SessionState>({
  ...EMPTY_DATA,
  ready: false,
  itemCount: 0,
})

function countItems(cart: HttpTypes.StoreCart | null) {
  return cart?.items?.reduce((total, item) => total + item.quantity, 0) ?? 0
}

async function loadSession(): Promise<SessionData> {
  const res = await fetch("/api/storefront/session", { cache: "no-store" })
  if (!res.ok) return EMPTY_DATA
  const data = await res.json()
  return {
    customer: data.customer ?? null,
    cart: data.cart ?? null,
    shippingOptions: data.shippingOptions ?? [],
  }
}

export function StorefrontSessionProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const { cartItemCount } = useCartDrawer()
  const [data, setData] = useState<SessionData>(EMPTY_DATA)
  const [ready, setReady] = useState(false)
  const [overrideCount, setOverrideCount] = useState<number | null>(null)
  const requestId = useRef(0)
  const skipDrawer = useRef(true)

  useEffect(() => {
    const id = ++requestId.current
    setOverrideCount(null)
    loadSession()
      .then((next) => {
        if (id !== requestId.current) return
        setData(next)
        setReady(true)
      })
      .catch(() => {
        if (id !== requestId.current) return
        setData(EMPTY_DATA)
        setReady(true)
      })
  }, [pathname])

  useEffect(() => {
    // The drawer count starts at 0. Only a later change means the cart was updated.
    if (skipDrawer.current) {
      skipDrawer.current = false
      return
    }
    const id = ++requestId.current
    setOverrideCount(cartItemCount)
    loadSession()
      .then((next) => {
        if (id !== requestId.current) return
        setData(next)
        setReady(true)
      })
      .catch(() => {})
  }, [cartItemCount])

  const value = useMemo<SessionState>(
    () => ({
      ...data,
      ready,
      itemCount: overrideCount ?? countItems(data.cart),
    }),
    [data, ready, overrideCount]
  )

  return (
    <SessionContext.Provider value={value}>{children}</SessionContext.Provider>
  )
}

export function useStorefrontSession() {
  return useContext(SessionContext)
}
