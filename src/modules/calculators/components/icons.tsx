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
