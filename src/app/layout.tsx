import { getBaseURL } from "@lib/util/env"
import { Inter } from "next/font/google"
import { Metadata } from "next"
import "styles/globals.css"
import AnalyticsConsent from "@modules/analytics/components/analytics-consent"

const inter = Inter({
  subsets: ["latin", "latin-ext"],
  display: "swap",
  variable: "--font-inter",
})

export const metadata: Metadata = {
  metadataBase: new URL(getBaseURL()),
  title: {
    default: "Orizont Sighetu Marmației — Depozit materiale de construcții",
    template: "%s | Orizont",
  },
  description:
    "Depozit de materiale de construcții în Sighetu Marmației, Maramureș: ciment, cărămidă Porotherm, izolații, acoperișuri, oțel beton. Livrare la șantier. Tel. 0730 076 606.",
  // Codul de verificare Google Search Console (variabila NEXT_PUBLIC_GSC_VERIFICATION)
  ...(process.env.NEXT_PUBLIC_GSC_VERIFICATION
    ? { verification: { google: process.env.NEXT_PUBLIC_GSC_VERIFICATION } }
    : {}),
}

export default function RootLayout(props: { children: React.ReactNode }) {
  return (
    <html lang="ro" data-mode="light" className={inter.variable}>
      <body className="antialiased">
        {props.children}
        <AnalyticsConsent />
      </body>
    </html>
  )
}
