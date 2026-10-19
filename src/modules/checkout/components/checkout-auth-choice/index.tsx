import LocalizedClientLink from "@modules/common/components/localized-client-link"
import CheckoutProgress from "@modules/checkout/components/checkout-progress"

export default function CheckoutAuthChoice() {
  return (
    <div className="max-w-screen-lg mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-10">
        <CheckoutProgress step="delivery" />
      </div>

      <div className="max-w-md mx-auto bg-white rounded-[22px] border border-[#D2D2D7]/70 p-8 flex flex-col gap-y-6">
        <div className="text-center">
          <h1 className="text-xl font-bold text-[#1D1D1F]">Finalizare comandă</h1>
          <p className="text-sm text-gray-500 mt-2">
            Intrați în cont pentru a salva comanda în istoric sau continuați fără cont.
          </p>
        </div>

        <LocalizedClientLink href={`/cont/conectare?redirectTo=${encodeURIComponent("/checkout?step=delivery")}`}>
          <button className="w-full h-12 bg-[#F27A1A] hover:bg-[#D4600E] text-white font-semibold rounded-xl transition-colors duration-150">
            Intrați în cont
          </button>
        </LocalizedClientLink>

        <div className="flex items-center gap-x-3">
          <div className="flex-1 border-t border-gray-200" />
          <span className="text-xs text-gray-400 uppercase tracking-wide">sau</span>
          <div className="flex-1 border-t border-gray-200" />
        </div>

        <LocalizedClientLink href="/checkout?step=delivery&guest=1">
          <button className="w-full h-12 border-2 border-gray-200 hover:border-[#F27A1A] text-[#1D1D1F] hover:text-[#F27A1A] font-semibold rounded-xl transition-colors duration-150">
            Continuați fără cont
          </button>
        </LocalizedClientLink>
      </div>
    </div>
  )
}
