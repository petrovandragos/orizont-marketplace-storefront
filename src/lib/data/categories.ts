import { cache } from "react"
import { sdk } from "@lib/config"
import { HttpTypes } from "@medusajs/types"
import { catalogCache } from "./public-cache"

async function fetchCategories(query?: Record<string, any>) {
  const limit = query?.limit || 200

  return sdk.client
    .fetch<{ product_categories: HttpTypes.StoreProductCategory[] }>(
      "/store/product-categories",
      {
        query: {
          // Fără *products: meniul și secțiunile de categorii folosesc doar
          // numele, handle-ul și subcategoriile. Cu *products, fiecare pagină
          // ajungea la ~14 MB pentru că toate produsele erau incluse în HTML.
          fields:
            "*category_children, *parent_category, *parent_category.parent_category",
          limit,
          ...query,
        },
        next: catalogCache(["categories"]),
      }
    )
    .then(({ product_categories }) => product_categories)
}

const fetchCategoriesCached = cache(async (key: string) => {
  const query = key ? (JSON.parse(key) as Record<string, any>) : undefined
  return fetchCategories(query)
})

export const listCategories = async (query?: Record<string, any>) => {
  return fetchCategoriesCached(query ? JSON.stringify(query) : "")
}

const fetchCategoryByHandle = cache(async (handle: string) => {
  return sdk.client
    .fetch<HttpTypes.StoreProductCategoryListResponse>(
      `/store/product-categories`,
      {
        query: {
          // Produsele categoriei se încarcă separat în template (listProducts).
          fields: "*category_children",
          handle,
        },
        next: catalogCache(["categories"]),
      }
    )
    .then(({ product_categories }) => product_categories[0])
})

export const getCategoryByHandle = async (categoryHandle: string[]) => {
  return fetchCategoryByHandle(`${categoryHandle.join("/")}`)
}
