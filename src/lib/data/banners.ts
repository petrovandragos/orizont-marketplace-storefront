"use server"

import { catalogCache } from "./public-cache"

export type BannerSlide = {
  id: string
  title: string
  subtitle: string | null
  button_text: string | null
  button_link: string | null
  image: string
}

export async function listBanners(): Promise<BannerSlide[]> {
  const backendUrl = process.env.MEDUSA_BACKEND_URL ?? "https://admin.orizont-srl.ro"
  const publishableKey = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY ?? ""

  try {
    const res = await fetch(`${backendUrl}/store/banners`, {
      headers: {
        "x-publishable-api-key": publishableKey,
      },
      next: catalogCache(["banners"]),
    })

    if (!res.ok) return []

    const data = await res.json()
    return data.banners ?? []
  } catch {
    return []
  }
}
