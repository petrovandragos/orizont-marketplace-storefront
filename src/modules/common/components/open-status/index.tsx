"use client"

import { useEffect, useState } from "react"

/** „Deschis acum” / „Închis acum”, după ora României și programul depozitului. */
function status() {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Europe/Bucharest", weekday: "short", hour: "2-digit", minute: "2-digit", hourCycle: "h23",
  }).formatToParts(new Date())
  const get = (t: string) => parts.find((p) => p.type === t)?.value ?? ""
  const day = get("weekday")
  const min = Number(get("hour")) * 60 + Number(get("minute"))
  const open = 8 * 60
  const close = day === "Sat" ? 13 * 60 : day === "Sun" ? 0 : 17 * 60
  if (day !== "Sun" && min >= open && min < close) return { on: true, text: `Deschis acum, până la ${close / 60}:00` }
  if (min < open && day !== "Sun") return { on: false, text: "Închis acum. Deschidem azi la 08:00" }
  if (day === "Sat" || day === "Sun") return { on: false, text: "Închis acum. Deschidem luni la 08:00" }
  return { on: false, text: "Închis acum. Deschidem mâine la 08:00" }
}

export default function OpenStatus({ className = "" }: { className?: string }) {
  const [s, setS] = useState<{ on: boolean; text: string } | null>(null)
  useEffect(() => {
    setS(status())
    const t = setInterval(() => setS(status()), 60_000)
    return () => clearInterval(t)
  }, [])
  if (!s) return <span className={className} aria-hidden="true">&nbsp;</span>
  return (
    <span className={`inline-flex items-center gap-2 ${className}`}>
      <span className={`w-2 h-2 rounded-full flex-none ${s.on ? "bg-[#34C759]" : "bg-[#8E9AAF]"}`} aria-hidden="true" />
      {s.text}
    </span>
  )
}
