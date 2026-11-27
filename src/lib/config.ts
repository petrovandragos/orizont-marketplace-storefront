import Medusa from "@medusajs/js-sdk"

// Defaults to standard port for Medusa server
let MEDUSA_BACKEND_URL = "http://localhost:9000"

if (process.env.MEDUSA_BACKEND_URL) {
  MEDUSA_BACKEND_URL = process.env.MEDUSA_BACKEND_URL
}

export const sdk = new Medusa({
  baseUrl: MEDUSA_BACKEND_URL,
  debug: process.env.NODE_ENV === "development",
  publishableKey: process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY,
})

/**
 * Do not wrap `sdk.client.fetch` to inject `x-medusa-locale` from the locale
 * cookie. That read `cookies()` on every catalog request and forced every
 * HTML document to `Cache-Control: private, no-store`.
 *
 * The storefront is Romanian-only. Cart creation still sends `locale` in the
 * body when a shopper has chosen one.
 */
