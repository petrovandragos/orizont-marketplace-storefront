import { QUOTE_STEPS } from "@lib/content/categories"

/** „Cum primiți oferta”: cei trei pași, numerotați pentru că sunt o succesiune. */
export default function HowItWorks() {
  return (
    <section className="content-container mt-24 md:mt-28">
      <h2 className="display-2">Cum primiți oferta.</h2>
      <ol className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10 mt-10 pt-8 border-t border-[#D2D2D7]">
        {QUOTE_STEPS.map((s, i) => (
          <li key={s.title}>
            <span className="flex w-[34px] h-[34px] rounded-full bg-[#1D1D1F] text-white text-[15px] font-semibold items-center justify-center mb-4">{i + 1}</span>
            <h3 className="text-[21px] font-semibold tracking-[-0.02em]">{s.title}</h3>
            <p className="text-base text-[#6E6E73] mt-1.5 max-w-[34ch]">{s.text}</p>
          </li>
        ))}
      </ol>
    </section>
  )
}
