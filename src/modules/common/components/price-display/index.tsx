/**
 * PriceDisplay
 * Renders a Romanian-formatted price, optionally with a unit and a struck-through
 * compare-at (original) price for sale items.
 *
 * Examples:
 *   <PriceDisplay amount={45.9} unit="bucată" />
 *   → "45,90 lei / bucată"
 *
 *   <PriceDisplay amount={38.5} compareAtPrice={45.9} unit="m²" />
 *   → "38,50 lei / m²"  (with "45,90 lei" struck through in gray)
 */

type PriceDisplayProps = {
  /** Current selling price. Pass 0 for free items. */
  amount: number
  /** ISO currency code. Only "RON" is rendered as "lei". Default: "RON" */
  currency?: string
  /** Pricing unit shown after a slash: "bucată", "m²", "kg", "sac", "l", "ml", etc. */
  unit?: string | null
  /** Original / compare-at price. When provided, shown struck-through next to current price. */
  compareAtPrice?: number | null
  /** Extra classes for the outer wrapper */
  className?: string
  /** Size variant — "sm" is for product cards, "lg" is for the PDP */
  size?: "sm" | "lg"
}

function formatAmount(amount: number): string {
  return new Intl.NumberFormat("ro-RO", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount)
}

function currencyLabel(currency: string): string {
  // Extend this map when/if multi-currency is added
  return currency.toUpperCase() === "RON" ? "lei" : currency.toUpperCase()
}

const PriceDisplay = ({
  amount,
  currency = "RON",
  unit,
  compareAtPrice,
  className = "",
  size = "sm",
}: PriceDisplayProps) => {
  const label = currencyLabel(currency)
  const isSale =
    compareAtPrice != null &&
    compareAtPrice > 0 &&
    compareAtPrice > amount

  // Build the unit suffix: " / bucată", " / m²", or "" when omitted
  const unitSuffix = unit ? ` / ${unit}` : ""

  const isLg = size === "lg"

  if (amount === 0) {
    return (
      <span className={`inline-flex items-baseline gap-x-1 ${className}`}>
        <span
          className={`font-bold text-[#2E7D32] ${isLg ? "text-2xl" : "text-base"}`}
        >
          Gratuit
        </span>
        {unit && (
          <span className={`text-gray-400 ${isLg ? "text-sm" : "text-xs"}`}>
            {unitSuffix}
          </span>
        )}
      </span>
    )
  }

  return (
    <span className={`inline-flex flex-wrap items-baseline gap-x-2 ${className}`}>
      {/* Current price */}
      <span
        className={`font-bold ${
          isSale ? "text-[#F27A1A]" : "text-[#1D1D1F]"
        } ${isLg ? "text-2xl" : "text-base"}`}
        data-testid="price"
      >
        {formatAmount(amount)} {label}
        {unitSuffix}
      </span>

      {/* Compare-at (original) price */}
      {isSale && (
        <span
          className={`line-through text-gray-400 font-normal ${
            isLg ? "text-base" : "text-sm"
          }`}
          data-testid="original-price"
          aria-label={`Preț original: ${formatAmount(compareAtPrice!)} ${label}`}
        >
          {formatAmount(compareAtPrice!)} {label}
        </span>
      )}
    </span>
  )
}

export default PriceDisplay
