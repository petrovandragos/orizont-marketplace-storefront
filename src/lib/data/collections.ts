"use server"

import { cache } from "react"
import { sdk } from "@lib/config"
import { HttpTypes } from "@medusajs/types"
import { catalogCache } from "./public-cache"

export const retrieveCollection = async (id: string) => {
  return sdk.client
    .fetch<{ collection: HttpTypes.StoreCollection }>(
      `/store/collections/${id}`,
      {
        next: catalogCache(["collections", `collections-${id}`]),
      }
    )
    .then(({ collection }) => collection)
}

export const listCollections = async (
  queryParams: Record<string, string> = {}
): Promise<{ collections: HttpTypes.StoreCollection[]; count: number }> => {
  queryParams.limit = queryParams.limit || "100"
  queryParams.offset = queryParams.offset || "0"

  return sdk.client
    .fetch<{ collections: HttpTypes.StoreCollection[]; count: number }>(
      "/store/collections",
      {
        query: queryParams,
        next: catalogCache(["collections"]),
      }
    )
    .then(({ collections }) => ({ collections, count: collections.length }))
}

const fetchCollectionByHandle = cache(async (handle: string) => {
  return sdk.client
    .fetch<HttpTypes.StoreCollectionListResponse>(`/store/collections`, {
      // id/title/handle only. `*products` pulled the whole collection into the
      // homepage just to read the collection id, then products were fetched again.
      query: { handle, fields: "id,title,handle" },
      next: catalogCache(["collections"]),
    })
    .then(({ collections }) => collections[0])
})

export const getCollectionByHandle = async (
  handle: string
): Promise<HttpTypes.StoreCollection> => {
  return fetchCollectionByHandle(handle)
}
