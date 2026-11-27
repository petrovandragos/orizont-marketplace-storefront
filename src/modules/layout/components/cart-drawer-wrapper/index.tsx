"use client"

import { CartDrawerProvider } from "@modules/cart/context/cart-drawer-context"
import AddToCartDrawer from "@modules/cart/components/add-to-cart-drawer"
import { StorefrontSessionProvider } from "@modules/layout/components/storefront-session"

export default function CartDrawerWrapper({ children }: { children: React.ReactNode }) {
  return (
    <CartDrawerProvider>
      <StorefrontSessionProvider>{children}</StorefrontSessionProvider>
      <AddToCartDrawer />
    </CartDrawerProvider>
  )
}
