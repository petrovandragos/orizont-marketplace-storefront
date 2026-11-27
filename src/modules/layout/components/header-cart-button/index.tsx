"use client"

import { useStorefrontSession } from "@modules/layout/components/storefront-session"
import NavCartDropdown from "@modules/layout/components/nav-cart-dropdown"

const HeaderCartButton = () => {
  const { cart, itemCount } = useStorefrontSession()

  return <NavCartDropdown cart={cart} itemCount={itemCount} />
}

export default HeaderCartButton
