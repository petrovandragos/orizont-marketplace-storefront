"use server"

import { sdk } from "@lib/config"
import medusaError from "@lib/util/medusa-error"
import { HttpTypes } from "@medusajs/types"
import { revalidateTag } from "next/cache"
import { redirect } from "next/navigation"
import {
  getAuthHeaders,
  getCacheOptions,
  getCacheTag,
  getCartId,
  removeAuthToken,
  removeCartId,
  setAuthToken,
} from "./cookies"

async function verifyTurnstile(token: string): Promise<boolean> {
  const secret = process.env.TURNSTILE_SECRET_KEY
  if (!secret) return true // skip in dev if key not configured
  const res = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ secret, response: token }),
  })
  const data = await res.json()
  return data.success === true
}

export const retrieveCustomer =
  async (): Promise<HttpTypes.StoreCustomer | null> => {
    const authHeaders = await getAuthHeaders()

    if (!authHeaders) return null

    const headers = {
      ...authHeaders,
    }

    const next = {
      ...(await getCacheOptions("customers")),
    }

    return await sdk.client
      .fetch<{ customer: HttpTypes.StoreCustomer }>(`/store/customers/me`, {
        method: "GET",
        query: {
          fields: "*orders,*addresses",
        },
        headers,
        next,
        cache: "force-cache",
      })
      .then(({ customer }) => customer)
      .catch(() => null)
  }

export const updateCustomer = async (body: HttpTypes.StoreUpdateCustomer) => {
  const headers = {
    ...(await getAuthHeaders()),
  }

  const updateRes = await sdk.store.customer
    .update(body, {}, headers)
    .then(({ customer }) => customer)
    .catch(medusaError)

  const cacheTag = await getCacheTag("customers")
  revalidateTag(cacheTag)

  return updateRes
}

export async function signup(_currentState: unknown, formData: FormData) {
  const turnstileToken = formData.get("turnstile_token") as string
  if (!(await verifyTurnstile(turnstileToken))) {
    return "Verificarea de securitate a eșuat. Vă rugăm să încercați din nou."
  }

  const password = formData.get("password") as string
  const customerForm = {
    email: formData.get("email") as string,
    first_name: formData.get("first_name") as string,
    last_name: formData.get("last_name") as string,
    phone: formData.get("phone") as string,
  }

  try {
    const token = await sdk.auth.register("customer", "emailpass", {
      email: customerForm.email,
      password: password,
    })

    await setAuthToken(token as string)

    const headers = {
      ...(await getAuthHeaders()),
    }

    const { customer: createdCustomer } = await sdk.store.customer.create(
      customerForm,
      {},
      headers
    )

    const loginToken = await sdk.auth.login("customer", "emailpass", {
      email: customerForm.email,
      password,
    })

    await setAuthToken(loginToken as string)

    const customerCacheTag = await getCacheTag("customers")
    revalidateTag(customerCacheTag)

    await transferCart()

    return createdCustomer
  } catch (error: any) {
    return error.toString()
  }
}

export async function login(_currentState: unknown, formData: FormData) {
  const turnstileToken = formData.get("turnstile_token") as string
  if (!(await verifyTurnstile(turnstileToken))) {
    return "Verificarea de securitate a eșuat. Vă rugăm să încercați din nou."
  }

  const email = formData.get("email") as string
  const password = formData.get("password") as string

  try {
    await sdk.auth
      .login("customer", "emailpass", { email, password })
      .then(async (token) => {
        await setAuthToken(token as string)
        const customerCacheTag = await getCacheTag("customers")
        revalidateTag(customerCacheTag)
      })
  } catch (error: any) {
    return error.toString()
  }

  try {
    await transferCart()
  } catch (error: any) {
    return error.toString()
  }
}

export async function signout(countryCode: string) {
  await sdk.auth.logout()

  await removeAuthToken()

  const customerCacheTag = await getCacheTag("customers")
  revalidateTag(customerCacheTag)

  await removeCartId()

  const cartCacheTag = await getCacheTag("carts")
  revalidateTag(cartCacheTag)

  redirect(`/cont/conectare`)
}

// ── Romanian error translation ────────────────────────────────────────────────

function roAuthError(raw: string): string {
  const e = raw.toLowerCase()
  if (
    e.includes("invalid") ||
    e.includes("incorrect") ||
    e.includes("401") ||
    e.includes("unauthorized") ||
    e.includes("wrong") ||
    e.includes("credential")
  ) {
    return "Email sau parolă incorectă. Verifică datele și încearcă din nou."
  }
  if (
    e.includes("exist") ||
    e.includes("already") ||
    e.includes("duplicate") ||
    e.includes("409")
  ) {
    return "Există deja un cont cu această adresă de email."
  }
  if (e.includes("not found") || e.includes("404")) {
    return "Nu există un cont cu această adresă de email."
  }
  if (e.includes("password") && (e.includes("short") || e.includes("weak"))) {
    return "Parola este prea scurtă. Folosește cel puțin 8 caractere."
  }
  return "A apărut o eroare. Încearcă din nou."
}

/**
 * Login server action for the standalone /cont/conectare page.
 * On success redirects to `redirectTo` or `/[countryCode]/cont`.
 * On failure returns a Romanian error string.
 */
/**
 * Logout for the /cont section. Redirects to /cont/conectare instead of /account.
 */
export async function signoutCont(countryCode: string) {
  await sdk.auth.logout()
  await removeAuthToken()
  const customerCacheTag = await getCacheTag("customers")
  revalidateTag(customerCacheTag)
  await removeCartId()
  const cartCacheTag = await getCacheTag("carts")
  revalidateTag(cartCacheTag)
  redirect(`/cont/conectare`)
}

/**
 * Update customer profile (useActionState-compatible).
 */
export async function updateProfilePage(
  _currentState: { success: boolean; error: string | null },
  formData: FormData
): Promise<{ success: boolean; error: string | null }> {
  try {
    const update: HttpTypes.StoreUpdateCustomer = {}
    const firstName = (formData.get("first_name") as string)?.trim()
    const lastName = (formData.get("last_name") as string)?.trim()
    const phone = (formData.get("phone") as string)?.trim()
    if (firstName) update.first_name = firstName
    if (lastName) update.last_name = lastName
    if (phone) update.phone = phone
    await updateCustomer(update)
    return { success: true, error: null }
  } catch (e: any) {
    return { success: false, error: e?.message ?? "Eroare la actualizarea datelor." }
  }
}

export async function loginPage(
  _currentState: string | null,
  formData: FormData
): Promise<string | null> {
  const email = formData.get("email") as string
  const password = formData.get("password") as string
  const redirectTo = (formData.get("redirectTo") as string) || ""

  try {
    const token = await sdk.auth.login("customer", "emailpass", { email, password })
    await setAuthToken(token as string)
    const customerCacheTag = await getCacheTag("customers")
    revalidateTag(customerCacheTag)
  } catch (error: any) {
    return roAuthError(error.toString())
  }

  await transferCart().catch(() => {})

  redirect(redirectTo || `/cont`)
}

/**
 * Signup server action for the standalone /cont/inregistrare page.
 * On success redirects to `redirectTo` or `/[countryCode]/cont`.
 * On failure returns a Romanian error string.
 */
export async function signupPage(
  _currentState: string | null,
  formData: FormData
): Promise<string | null> {
  const password = formData.get("password") as string
  const redirectTo = (formData.get("redirectTo") as string) || ""

  const customerForm = {
    email: formData.get("email") as string,
    first_name: formData.get("first_name") as string,
    last_name: formData.get("last_name") as string,
    phone: (formData.get("phone") as string) || "",
  }

  try {
    const token = await sdk.auth.register("customer", "emailpass", {
      email: customerForm.email,
      password,
    })
    await setAuthToken(token as string)

    const headers = { ...(await getAuthHeaders()) }
    await sdk.store.customer.create(customerForm, {}, headers)

    const loginToken = await sdk.auth.login("customer", "emailpass", {
      email: customerForm.email,
      password,
    })
    await setAuthToken(loginToken as string)

    const customerCacheTag = await getCacheTag("customers")
    revalidateTag(customerCacheTag)
  } catch (error: any) {
    return roAuthError(error.toString())
  }

  await transferCart().catch(() => {})

  redirect(redirectTo || `/cont`)
}

export async function transferCart() {
  const cartId = await getCartId()

  if (!cartId) {
    return
  }

  const headers = await getAuthHeaders()

  await sdk.store.cart.transferCart(cartId, {}, headers)

  const cartCacheTag = await getCacheTag("carts")
  revalidateTag(cartCacheTag)
}

export const addCustomerAddress = async (
  currentState: Record<string, unknown>,
  formData: FormData
): Promise<any> => {
  const isDefaultBilling = (currentState.isDefaultBilling as boolean) || false
  const isDefaultShipping = (currentState.isDefaultShipping as boolean) || false

  const address = {
    first_name: formData.get("first_name") as string,
    last_name: formData.get("last_name") as string,
    company: formData.get("company") as string,
    address_1: formData.get("address_1") as string,
    address_2: formData.get("address_2") as string,
    city: formData.get("city") as string,
    postal_code: formData.get("postal_code") as string,
    province: formData.get("province") as string,
    country_code: formData.get("country_code") as string,
    phone: formData.get("phone") as string,
    is_default_billing: isDefaultBilling,
    is_default_shipping: isDefaultShipping,
  }

  const headers = {
    ...(await getAuthHeaders()),
  }

  return sdk.store.customer
    .createAddress(address, {}, headers)
    .then(async ({ customer }) => {
      const customerCacheTag = await getCacheTag("customers")
      revalidateTag(customerCacheTag)
      return { success: true, error: null }
    })
    .catch((err) => {
      return { success: false, error: err.toString() }
    })
}

export const deleteCustomerAddress = async (
  addressId: string
): Promise<void> => {
  const headers = {
    ...(await getAuthHeaders()),
  }

  await sdk.store.customer
    .deleteAddress(addressId, headers)
    .then(async () => {
      const customerCacheTag = await getCacheTag("customers")
      revalidateTag(customerCacheTag)
      return { success: true, error: null }
    })
    .catch((err) => {
      return { success: false, error: err.toString() }
    })
}

export const updateCustomerAddress = async (
  currentState: Record<string, unknown>,
  formData: FormData
): Promise<any> => {
  const addressId =
    (currentState.addressId as string) || (formData.get("addressId") as string)

  if (!addressId) {
    return { success: false, error: "Address ID is required" }
  }

  const address = {
    first_name: formData.get("first_name") as string,
    last_name: formData.get("last_name") as string,
    company: formData.get("company") as string,
    address_1: formData.get("address_1") as string,
    address_2: formData.get("address_2") as string,
    city: formData.get("city") as string,
    postal_code: formData.get("postal_code") as string,
    province: formData.get("province") as string,
    country_code: formData.get("country_code") as string,
  } as HttpTypes.StoreUpdateCustomerAddress

  const phone = formData.get("phone") as string

  if (phone) {
    address.phone = phone
  }

  const headers = {
    ...(await getAuthHeaders()),
  }

  return sdk.store.customer
    .updateAddress(addressId, address, {}, headers)
    .then(async () => {
      const customerCacheTag = await getCacheTag("customers")
      revalidateTag(customerCacheTag)
      return { success: true, error: null }
    })
    .catch((err) => {
      return { success: false, error: err.toString() }
    })
}
