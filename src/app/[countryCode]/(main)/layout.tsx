import { Metadata } from "next"

import { getBaseURL } from "@lib/util/env"
import CartDrawerWrapper from "@modules/layout/components/cart-drawer-wrapper"
import StorefrontPersonalization from "@modules/layout/components/storefront-personalization"
import MobileContactBar from "@modules/layout/components/mobile-contact-bar"
import Footer from "@modules/layout/templates/footer"
import Nav from "@modules/layout/templates/nav"

export const metadata: Metadata = {
  metadataBase: new URL(getBaseURL()),
}

// Public pages under this layout are ISR. Account, cart, and checkout opt back
// into dynamic rendering because they read the customer or cart cookies.
export const revalidate = 120

export function generateStaticParams() {
  return [{ countryCode: "ro" }]
}

export default function PageLayout(props: { children: React.ReactNode }) {
  return (
    <CartDrawerWrapper>
      <div className="flex flex-col min-h-screen bg-white">
        <Nav />

        <StorefrontPersonalization />

        <div className="flex-1">
          {props.children}
        </div>

        <Footer />
        <MobileContactBar />
      </div>
    </CartDrawerWrapper>
  )
}
