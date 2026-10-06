import type { MetadataRoute } from "next"
import { getBaseURL } from "@lib/util/env"

export default function robots(): MetadataRoute.Robots {
  const baseUrl = getBaseURL()

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        // Pagini personale sau fără conținut util pentru Google
        disallow: ["/api/", "/checkout", "/cart", "/cont", "/order", "/cautare"],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  }
}
