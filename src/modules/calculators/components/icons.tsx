import React from "react"

/** Iconițele celor trei calculatoare (hub și pagina principală). */
export const CALCULATOR_ICONS: Record<string, React.ReactNode> = {
  acoperis: <svg viewBox="0 0 48 40" className="w-12 h-10" aria-hidden="true"><rect x="10" y="22" width="28" height="16" rx="1.5" fill="#FED7AA" /><polygon points="4,24 24,6 44,24 40,24 24,10 8,24" fill="#F27A1A" /></svg>,
  termosistem: <svg viewBox="0 0 48 40" className="w-12 h-10" aria-hidden="true"><rect x="6" y="4" width="14" height="32" fill="#FDBA74" /><rect x="20" y="4" width="13" height="32" fill="#fff" stroke="#F27A1A" /><rect x="33" y="4" width="4" height="32" fill="#F27A1A" /></svg>,
  zidarie: <svg viewBox="0 0 48 40" className="w-12 h-10" aria-hidden="true">{[0, 1, 2].map((r) => [0, 1].map((k) => <rect key={`${r}${k}`} x={(r % 2 ? -8 : 3) + k * 22} y={5 + r * 11} width="20" height="9" rx="1" fill="#FED7AA" stroke="#F27A1A" />))}</svg>,
}

export function CalculatorGlyph({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="4" y="2" width="16" height="20" rx="2" />
      <path d="M8 6h8M8 11h.01M12 11h.01M16 11h.01M8 15h.01M12 15h.01M16 15v3M8 18h4" />
    </svg>
  )
}

/** Desenele liniare din cardurile calculatoarelor (culoarea vine din `currentColor`). */
export const CALCULATOR_ART: Record<string, React.ReactNode> = {
  acoperis: <svg viewBox="0 0 120 80" fill="none" stroke="currentColor" strokeWidth={2} strokeLinejoin="round" aria-hidden="true"><path d="M10 44 60 12l50 32" /><path d="M22 37v33h76V37" /><path d="M36 28v8M48 20v10M60 12v12M72 20v10M84 28v8" opacity=".55" /><path d="M50 70V52h20v18" /></svg>,
  termosistem: <svg viewBox="0 0 120 80" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden="true"><rect x="18" y="10" width="34" height="60" /><rect x="52" y="10" width="26" height="60" /><path d="M78 10v60M84 10v60" /><path d="M24 22h22M24 34h22M24 46h22M24 58h22" opacity=".45" /><circle cx="65" cy="25" r="2.5" /><circle cx="65" cy="55" r="2.5" /></svg>,
  zidarie: <svg viewBox="0 0 120 80" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden="true"><path d="M12 14h96v52H12z" /><path d="M12 27h96M12 40h96M12 53h96" /><path d="M40 14v13M76 14v13M24 27v13M58 27v13M92 27v13M40 40v13M76 40v13M24 53v13M58 53v13M92 53v13" opacity=".7" /></svg>,
}
