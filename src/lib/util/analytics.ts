/**
 * Statistici Google Analytics, pornite doar după acordul vizitatorului.
 * ID-ul vine din variabila NEXT_PUBLIC_GA_ID (ex. G-XXXXXXX), setată în Coolify.
 * Fără variabilă, nu se încarcă nimic și nu apare nici bannerul.
 */
export const GA_ID = process.env.NEXT_PUBLIC_GA_ID || ""

export const CONSENT_KEY = "orizont_consent"
export const OPEN_SETTINGS_EVENT = "orizont:cookie-settings"

type Params = Record<string, string | number | boolean | undefined>

/** Trimite un eveniment la Google Analytics, dacă e pornit. */
export function track(event: string, params: Params = {}) {
  if (typeof window === "undefined") return
  const gtag = (window as any).gtag
  if (typeof gtag === "function") {
    gtag("event", event, params)
  }
}
