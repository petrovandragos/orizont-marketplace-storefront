"use client"

import { GA_ID, OPEN_SETTINGS_EVENT } from "@lib/util/analytics"

/** Link în subsol care redeschide bannerul de cookie-uri. */
export default function CookieSettingsButton({ className }: { className?: string }) {
  if (!GA_ID) return null

  return (
    <button
      type="button"
      onClick={() => window.dispatchEvent(new Event(OPEN_SETTINGS_EVENT))}
      className={className}
    >
      Setări cookie-uri
    </button>
  )
}
