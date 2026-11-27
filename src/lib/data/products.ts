"use server"

import { sdk } from "@lib/config"
import { sortProducts } from "@lib/util/sort-products"
import { HttpTypes } from "@medusajs/types"
import { SortOptions } from "@modules/store/components/refinement-list/sort-products"
import { catalogCache } from "./public-cache"
import { getRegion, retrieveRegion } from "./regions"

export const listProducts = async ({
  pageParam = 1,
  queryParams,
  countryCode,
  regionId,
}: {
  pageParam?: number
  queryParams?: HttpTypes.FindParams & HttpTypes.StoreProductListParams
  countryCode?: string
  regionId?: string
}): Promise<{
  response: { products: HttpTypes.StoreProduct[]; count: number }
  nextPage: number | null
  queryParams?: HttpTypes.FindParams & HttpTypes.StoreProductListParams
}> => {
  if (!countryCode && !regionId) {
    throw new Error("Country code or region ID is required")
  }

  const limit = queryParams?.limit || 12
  const _pageParam = Math.max(pageParam, 1)
  const offset = _pageParam === 1 ? 0 : (_pageParam - 1) * limit

  let region: HttpTypes.StoreRegion | undefined | null

  if (countryCode) {
    region = await getRegion(countryCode)
  } else {
    region = await retrieveRegion(regionId!)
  }

  if (!region) {
    return {
      response: { products: [], count: 0 },
      nextPage: null,
    }
  }

  // Anonymous region prices only. Sending the customer JWT here would either
  // make the response uncacheable or store one shopper's prices in the shared
  // catalog cache. Customer-group price lists, if added later, need their own
  // private path.
  return sdk.client
    .fetch<{ products: HttpTypes.StoreProduct[]; count: number }>(
      `/store/products`,
      {
        method: "GET",
        query: {
          limit,
          offset,
          region_id: region?.id,
          fields:
            "*variants.calculated_price,+variants.inventory_quantity,+metadata,+tags,",
          ...queryParams,
        },
        next: catalogCache(["products"]),
      }
    )
    .then(({ products, count }) => {
      const nextPage = count > offset + limit ? pageParam + 1 : null

      return {
        response: {
          products,
          count,
        },
        nextPage: nextPage,
        queryParams,
      }
    })
}

/**
 * Loads every page of a catalog query. Category and store filters (brand,
 * price, stock, sort) are applied in memory, so they need the working set —
 * but the pages are requested together and then served from the shared
 * catalog cache instead of a sequential `no-store` walk on every HTML request.
 */
export const listAllProducts = async ({
  countryCode,
  queryParams,
  pageSize = 100,
  maxPages = 20,
}: {
  countryCode: string
  queryParams?: HttpTypes.FindParams & HttpTypes.StoreProductListParams
  pageSize?: number
  maxPages?: number
}): Promise<HttpTypes.StoreProduct[]> => {
  const pageQuery = { ...queryParams, limit: pageSize }
  const first = await listProducts({
    pageParam: 1,
    queryParams: pageQuery,
    countryCode,
  })
  const { products, count } = first.response
  const pageCount = Math.min(
    maxPages,
    Math.max(1, Math.ceil(count / pageSize))
  )

  if (pageCount <= 1) {
    return products
  }

  const rest = await Promise.all(
    Array.from({ length: pageCount - 1 }, (_, index) =>
      listProducts({
        pageParam: index + 2,
        queryParams: pageQuery,
        countryCode,
      }).catch(() => ({
        response: { products: [] as HttpTypes.StoreProduct[], count: 0 },
        nextPage: null,
      }))
    )
  )

  return [...products, ...rest.flatMap((page) => page.response.products)]
}

/**
 * This will fetch 100 products to the Next.js cache and sort them based on the sortBy parameter.
 * It will then return the paginated products based on the page and limit parameters.
 */
export const listProductsWithSort = async ({
  page = 0,
  queryParams,
  sortBy = "created_at",
  countryCode,
}: {
  page?: number
  queryParams?: HttpTypes.FindParams & HttpTypes.StoreProductParams
  sortBy?: SortOptions
  countryCode: string
}): Promise<{
  response: { products: HttpTypes.StoreProduct[]; count: number }
  nextPage: number | null
  queryParams?: HttpTypes.FindParams & HttpTypes.StoreProductParams
}> => {
  const limit = queryParams?.limit || 12

  const {
    response: { products, count },
  } = await listProducts({
    pageParam: 0,
    queryParams: {
      ...queryParams,
      limit: 100,
    },
    countryCode,
  })

  const sortedProducts = sortProducts(products, sortBy)

  const pageParam = (page - 1) * limit

  const nextPage = count > pageParam + limit ? pageParam + limit : null

  const paginatedProducts = sortedProducts.slice(pageParam, pageParam + limit)

  return {
    response: {
      products: paginatedProducts,
      count,
    },
    nextPage,
    queryParams,
  }
}
