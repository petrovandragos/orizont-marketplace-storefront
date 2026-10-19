"use server"

export type QuoteRequestPayload = {
  product_id: string
  variant_id: string | null
  product_title: string
  quantity: number
  delivery_type: "livrare" | "ridicare"
  full_name: string
  phone: string
  email: string
  address: string | null
  turnstileToken: string
}

async function verifyTurnstile(token: string): Promise<boolean> {
  const secret = process.env.TURNSTILE_SECRET_KEY
  if (!secret) {
    console.error("[CereOferta] TURNSTILE_SECRET_KEY not set")
    return false
  }
  const res = await fetch(
    "https://challenges.cloudflare.com/turnstile/v0/siteverify",
    {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ secret, response: token }),
    }
  )
  const data = await res.json()
  return data.success === true
}

export async function submitQuoteRequest(
  payload: QuoteRequestPayload
): Promise<{ ok: true } | { error: string }> {
  const valid = await verifyTurnstile(payload.turnstileToken)
  if (!valid) {
    return { error: "Verificarea de securitate a eșuat. Vă rugăm să încercați din nou." }
  }

  const backendUrl = process.env.MEDUSA_BACKEND_URL ?? "https://admin.orizont-srl.ro"
  const publishableKey = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY ?? ""

  const { turnstileToken: _, ...data } = payload

  const res = await fetch(`${backendUrl}/store/cerere-oferta`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-publishable-api-key": publishableKey,
    },
    body: JSON.stringify(data),
  })

  if (!res.ok) {
    const body = await res.json().catch(() => ({}))
    console.error("[CereOferta] Backend error:", body)
    return { error: "Solicitarea nu a putut fi trimisă. Vă rugăm să încercați din nou." }
  }

  return { ok: true }
}
