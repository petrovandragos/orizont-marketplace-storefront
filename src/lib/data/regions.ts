"use server"

import { cache } from "react"
import { sdk } from "@lib/config"
import medusaError from "@lib/util/medusa-error"
import { HttpTypes } from "@medusajs/types"
import { catalogCache } from "./public-cache"

const REGION_CACHE = {
  next: { revalidate: 3600, tags: ["regions"] },
}

const fetchRegions = cache(async () => {
  return sdk.client
    .fetch<{ regions: HttpTypes.StoreRegion[] }>(`/store/regions`, {
      method: "GET",
      ...REGION_CACHE,
    })
    .then(({ regions }) => regions)
    .catch(medusaError)
})

export const listRegions = async () => {
  return fetchRegions()
}

const fetchRegion = cache(async (id: string) => {
  return sdk.client
    .fetch<{ region: HttpTypes.StoreRegion }>(`/store/regions/${id}`, {
      method: "GET",
      next: catalogCache(["regions", `regions-${id}`]),
    })
    .then(({ region }) => region)
    .catch(medusaError)
})

export const retrieveRegion = async (id: string) => {
  return fetchRegion(id)
}

const regionMap = new Map<string, HttpTypes.StoreRegion>()

export const getRegion = async (countryCode: string) => {
  try {
    if (regionMap.has(countryCode)) {
      return regionMap.get(countryCode)
    }

    const regions = await listRegions()

    if (!regions) {
      return null
    }

    regions.forEach((region) => {
      region.countries?.forEach((c) => {
        regionMap.set(c?.iso_2 ?? "", region)
      })
    })

    const region = countryCode
      ? regionMap.get(countryCode)
      : regionMap.get("us")

    return region
  } catch (e: any) {
    return null
  }
}
