"use client"

import { useState, useEffect, useCallback } from "react"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

export type BannerSlide = {
  id: string
  title: string
  subtitle: string | null
  button_text: string | null
  button_link: string | null
  image: string
}

type Props = {
  slides: BannerSlide[]
}

const HeroCarousel = ({ slides }: Props) => {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isPaused, setIsPaused] = useState(false)

  const total = slides.length

  const nextSlide = useCallback(() => {
    if (total > 1) setCurrentSlide((prev) => (prev + 1) % total)
  }, [total])

  const prevSlide = () => {
    if (total > 1) setCurrentSlide((prev) => (prev - 1 + total) % total)
  }

  useEffect(() => {
    if (isPaused || total <= 1) return
    const interval = setInterval(nextSlide, 6000)
    return () => clearInterval(interval)
  }, [nextSlide, isPaused, total])

  if (slides.length === 0) return null

  return (
    <section className="content-container mt-16 md:mt-20" aria-label="Oferte">
      <div
        className="relative overflow-hidden rounded-[26px] bg-[#F5F5F7] group aspect-[16/9] md:aspect-[21/10]"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        <div
          className="absolute inset-0 transition-transform duration-700 ease-in-out flex"
          style={{ transform: `translateX(-${currentSlide * 100}%)` }}
        >
          {slides.map((slide) => (
            <LocalizedClientLink
              key={slide.id}
              href={slide.button_link || "/store"}
              className="relative min-w-full h-full block overflow-hidden"
              aria-label={slide.title}
            >
              <div className="w-full h-full bg-center bg-no-repeat bg-cover" style={{ backgroundImage: `url(${slide.image})` }} />
            </LocalizedClientLink>
          ))}
        </div>

        {total > 1 && (
          <>
            <button onClick={prevSlide} aria-label="Oferta anterioară"
              className="absolute left-4 top-1/2 -translate-y-1/2 z-30 w-10 h-10 flex items-center justify-center rounded-full bg-white/70 backdrop-blur-md text-[#1D1D1F] opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity hover:bg-white">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
            </button>
            <button onClick={nextSlide} aria-label="Oferta următoare"
              className="absolute right-4 top-1/2 -translate-y-1/2 z-30 w-10 h-10 flex items-center justify-center rounded-full bg-white/70 backdrop-blur-md text-[#1D1D1F] opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity hover:bg-white">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
            </button>
            <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-30 flex items-center gap-x-2 px-2.5 py-1.5 rounded-full bg-black/20 backdrop-blur-md">
              {slides.map((_, idx) => (
                <button key={idx} onClick={() => setCurrentSlide(idx)} aria-label={`Oferta ${idx + 1}`}
                  className={`h-1.5 transition-all duration-300 rounded-full ${currentSlide === idx ? "w-6 bg-white" : "w-1.5 bg-white/60 hover:bg-white/80"}`} />
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  )
}

export default HeroCarousel
