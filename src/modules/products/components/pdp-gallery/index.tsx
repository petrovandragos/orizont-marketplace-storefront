"use client"

import Image from "next/image"
import { useState } from "react"
import { HttpTypes } from "@medusajs/types"

type PdpGalleryProps = {
  images: HttpTypes.StoreProductImage[]
  title: string
}

const PdpGallery = ({ images, title }: PdpGalleryProps) => {
  const [activeIdx, setActiveIdx] = useState(0)

  if (!images || images.length === 0) {
    return (
      <div className="aspect-square w-full rounded-[26px] bg-[#F5F5F7] flex flex-col items-center justify-center gap-y-3 text-gray-300">
        <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1}
            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
        <span className="text-sm text-gray-400">Fără imagine</span>
      </div>
    )
  }

  const activeImage = images[activeIdx]

  return (
    <div className="flex flex-col gap-y-3">
      {/* Main image */}
      <div className="relative aspect-square w-full rounded-[26px] bg-[#F5F5F7] overflow-hidden">
        <Image
          src={activeImage.url}
          alt={title}
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-contain object-center p-[6%] mix-blend-multiply"
          quality={85}
          priority
        />
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="flex gap-x-2.5 overflow-x-auto pb-1 no-scrollbar">
          {images.map((img, i) => (
            <button
              key={img.id ?? i}
              onClick={() => setActiveIdx(i)}
              aria-label={`Imagine ${i + 1}`}
              className={`relative flex-shrink-0 w-[72px] h-[72px] rounded-[14px] overflow-hidden bg-[#F5F5F7] border-2 transition-all duration-150 ${
                i === activeIdx
                  ? "border-[#1D1D1F]"
                  : "border-transparent hover:border-[#D2D2D7]"
              }`}
            >
              <Image
                src={img.url}
                alt={`${title} – imagine ${i + 1}`}
                fill
                sizes="64px"
                className="object-contain object-center p-1.5 mix-blend-multiply"
                quality={60}
              />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

export default PdpGallery
