"use server"

export type Locale = {
  code: string
  name: string
}

/**
 * The Medusa backend for this store does not expose `/store/locales`
 * (the storefront is Romanian-only). Calling it from the nav 404s on every
 * document and, via `getCacheOptions()`, reads cookies — which forces
 * `Cache-Control: private, no-store` on public pages.
 *
 * The language switcher already hides itself when this returns null.
 * Restore a cached fetch (no cookies) if the endpoint is added later.
 */
export const listLocales = async (): Promise<Locale[] | null> => {
  return null
}
