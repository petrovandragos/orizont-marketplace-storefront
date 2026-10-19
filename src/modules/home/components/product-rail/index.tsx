"use client"

import { useRef } from "react"
import Chevron from "@modules/common/components/open-status/chevron"

/** Rând de produse care se derulează orizontal, cu săgeți pe calculator. */
export default function ProductRail({ title, children }: { title: string; children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null)
  const go = (dir: number) => ref.current?.scrollBy({ left: dir * ref.current.clientWidth * 0.75, behavior: "smooth" })
  return (
    <section className="content-container mt-24 md:mt-28">
      <div className="flex items-end justify-between gap-6 mb-8 md:mb-10">
        <h2 className="display-2">{title}</h2>
        <div className="hidden md:flex gap-2.5">
          <button type="button" onClick={() => go(-1)} aria-label="Produsele anterioare"
            className="w-9 h-9 rounded-full bg-[#F5F5F7] hover:bg-[#E8E8ED] flex items-center justify-center"><Chevron className="w-[18px] h-[18px] rotate-180" /></button>
          <button type="button" onClick={() => go(1)} aria-label="Produsele următoare"
            className="w-9 h-9 rounded-full bg-[#F5F5F7] hover:bg-[#E8E8ED] flex items-center justify-center"><Chevron className="w-[18px] h-[18px]" /></button>
        </div>
      </div>
      <div ref={ref}
        className="grid grid-flow-col auto-cols-[72%] sm:auto-cols-[calc((100%-16px)/2)] md:auto-cols-[calc((100%-32px)/3)] lg:auto-cols-[calc((100%-48px)/4)] gap-4 overflow-x-auto snap-x snap-mandatory no-scrollbar pb-2 [&>*]:snap-start">
        {children}
      </div>
    </section>
  )
}
