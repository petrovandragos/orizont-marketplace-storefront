import { sdk } from "@lib/config"
import { HttpTypes } from "@medusajs/types"

export const listCategories = async (query?: Record<string, any>) => {
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
        next: { revalidate: 60 },
      }
    )
    .then(({ product_categories }) => product_categories)
}

export const getCategoryByHandle = async (categoryHandle: string[]) => {
  const handle = `${categoryHandle.join("/")}`

  return sdk.client
    .fetch<HttpTypes.StoreProductCategoryListResponse>(
      `/store/product-categories`,
      {
        query: {
          // Produsele categoriei se încarcă separat în template (listProducts).
          fields: "*category_children",
          handle,
        },
        next: { revalidate: 60 },
      }
    )
    .then(({ product_categories }) => product_categories[0])
}
