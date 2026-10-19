import Image from "next/image"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

export default function CheckoutLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-[#F5F5F7] flex flex-col">
      {/* Checkout header */}
      <header className="bg-white/80 backdrop-blur-xl border-b border-black/[0.08]">
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
          {/* Back to cart */}
          <LocalizedClientLink
            href="/cart"
            className="flex items-center gap-x-1.5 text-sm text-gray-500 hover:text-[#1D1D1F] transition-colors"
            data-testid="back-to-cart-link"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span className="hidden sm:inline">Înapoi la coș</span>
            <span className="sm:hidden">Coș</span>
          </LocalizedClientLink>

          {/* Logo */}
          <LocalizedClientLink href="/" className="flex items-center gap-x-2">
            <Image
              src="/logo.png"
              alt="Orizont Logo"
              width={211}
              height={55}
              className="h-7 w-auto object-contain"
              unoptimized
            />
            <span className="hidden sm:inline text-xs font-medium text-gray-400 uppercase tracking-widest mt-0.5">
              Checkout
            </span>
          </LocalizedClientLink>

          {/* Spacer */}
          <div className="w-24" />
        </div>
      </header>

      {/* Page content */}
      <main className="flex-1" data-testid="checkout-container">
        {children}
      </main>
    </div>
  )
}
