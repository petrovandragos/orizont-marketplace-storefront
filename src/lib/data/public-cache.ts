/**
 * Shared cache for public catalog data (products, categories, regions, banners).
 *
 * Do not read cookies here. `cookies()` opts the whole route into dynamic
 * rendering and would put `Cache-Control: private, no-store` on every HTML
 * document. These tags are global on purpose: the payload is the anonymous
 * storefront, never a customer, cart, or customer-group price.
 */
export const CATALOG_REVALIDATE_SECONDS = 120

export function catalogCache(tags: string[]) {
  return {
    revalidate: CATALOG_REVALIDATE_SECONDS,
    tags,
  }
}
