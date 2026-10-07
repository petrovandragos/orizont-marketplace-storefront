"use client"

import Script from "next/script"
import { useEffect, useState } from "react"
import { CONSENT_KEY, GA_ID, OPEN_SETTINGS_EVENT, track } from "@lib/util/analytics"

type Consent = "granted" | "denied" | null

function readConsent(): Consent {
  try {
    const v = window.localStorage.getItem(CONSENT_KEY)
    return v === "granted" || v === "denied" ? v : null
  } catch {
    return null
  }
}

function saveConsent(v: "granted" | "denied") {
  try {
    window.localStorage.setItem(CONSENT_KEY, v)
  } catch {}
}

/**
 * Bannerul de cookie-uri + încărcarea Google Analytics.
 * GA se încarcă doar după „Accept”. La „Refuz” nu se încarcă nimic.
 */
export default function AnalyticsConsent() {
  const [consent, setConsent] = useState<Consent>(null)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    setConsent(readConsent())
    setReady(true)

    const reopen = () => setConsent(null)
    window.addEventListener(OPEN_SETTINGS_EVENT, reopen)
    return () => window.removeEventListener(OPEN_SETTINGS_EVENT, reopen)
  }, [])

  // Clicuri pe telefon și WhatsApp, oriunde pe site
  useEffect(() => {
    if (consent !== "granted") return
    const onClick = (e: MouseEvent) => {
      const a = (e.target as HTMLElement | null)?.closest?.("a")
      const href = a?.getAttribute("href") || ""
      if (href.startsWith("tel:")) {
        track("contact_telefon", { link_url: href, page_path: window.location.pathname })
      } else if (href.includes("wa.me/")) {
        track("contact_whatsapp", { page_path: window.location.pathname })
      }
    }
    document.addEventListener("click", onClick)
    return () => document.removeEventListener("click", onClick)
  }, [consent])

  if (!GA_ID || !ready) return null

  const choose = (v: "granted" | "denied") => {
    saveConsent(v)
    setConsent(v)
    // Dacă refuză după ce a acceptat, oprim trimiterea datelor până la reîncărcare
    if (v === "denied" && typeof (window as any).gtag === "function") {
      ;(window as any).gtag("consent", "update", { analytics_storage: "denied" })
    }
  }

  return (
    <>
      {consent === "granted" && (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
            strategy="afterInteractive"
          />
          <Script id="ga-init" strategy="afterInteractive">
            {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('consent', 'default', { ad_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied', analytics_storage: 'granted' });
gtag('js', new Date());
gtag('config', '${GA_ID}', { anonymize_ip: true });`}
          </Script>
        </>
      )}

      {consent === null && (
        <div
          role="dialog"
          aria-label="Cookie-uri"
          className="fixed inset-x-3 z-50 bottom-[calc(84px+env(safe-area-inset-bottom))] md:bottom-5 md:left-5 md:right-auto md:max-w-md bg-white border border-gray-200 rounded-2xl shadow-[0_12px_40px_rgba(0,0,0,0.18)] p-4 md:p-5"
        >
          <p className="text-[15px] font-semibold text-[#1A1A1A]">Cookie-uri pentru statistici</p>
          <p className="text-sm text-gray-600 mt-1.5 leading-relaxed">
            Folosim Google Analytics ca să vedem ce pagini și produse sunt căutate și să îmbunătățim
            site-ul. Nu folosim cookie-uri de publicitate.{" "}
            <a href="/politica-de-confidentialitate" className="text-[#F27A1A] underline underline-offset-2">
              Detalii
            </a>
          </p>
          <div className="grid grid-cols-2 gap-2 mt-3.5">
            <button
              type="button"
              onClick={() => choose("denied")}
              className="h-10 rounded-lg border-2 border-gray-200 text-sm font-semibold text-gray-700 hover:border-gray-300"
            >
              Refuz
            </button>
            <button
              type="button"
              onClick={() => choose("granted")}
              className="h-10 rounded-lg bg-[#F27A1A] hover:bg-[#D4600E] text-sm font-semibold text-white"
            >
              Accept
            </button>
          </div>
        </div>
      )}
    </>
  )
}
