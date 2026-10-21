"use client"

import { useSyncExternalStore } from "react"

/**
 * Lista de ofertă: produsele și rezultatele calculatoarelor pe care clientul
 * le strânge pe parcursul vizitei, trimise apoi împreună dintr-o singură
 * cerere de ofertă. Se păstrează doar în browserul vizitatorului.
 */

export type QuoteProduct = {
  handle: string
  title: string
  thumbnail?: string | null
  quantity: number
  unit: string
}

export type QuoteCalcLine = { name: string; amount: string; note?: string; href?: string }

export type QuoteCalc = {
  /** Un singur rezultat pe calculator: o recalculare îl înlocuiește. */
  id: string
  title: string
  summary: string
  lines: QuoteCalcLine[]
  /** Pagina calculatorului, pentru „Modificați calculul”. */
  href?: string
}

export type QuoteList = { products: QuoteProduct[]; calcs: QuoteCalc[] }

const KEY = "orizont-lista-oferta-v1"
const EVENT = "orizont-lista-oferta"
const EMPTY: QuoteList = { products: [], calcs: [] }

let cache: QuoteList | null = null

function read(): QuoteList {
  if (cache) return cache
  try {
    const raw = window.localStorage.getItem(KEY)
    const parsed = raw ? JSON.parse(raw) : null
    cache = {
      products: Array.isArray(parsed?.products) ? parsed.products : [],
      calcs: Array.isArray(parsed?.calcs) ? parsed.calcs : [],
    }
  } catch {
    cache = EMPTY
  }
  return cache
}

function write(next: QuoteList) {
  cache = next
  try {
    window.localStorage.setItem(KEY, JSON.stringify(next))
  } catch {
    /* navigare privată: lista rămâne doar pentru pagina curentă */
  }
  window.dispatchEvent(new Event(EVENT))
}

function subscribe(cb: () => void) {
  const onStorage = (e: StorageEvent) => {
    if (e.key === KEY) {
      cache = null
      cb()
    }
  }
  window.addEventListener(EVENT, cb)
  window.addEventListener("storage", onStorage)
  return () => {
    window.removeEventListener(EVENT, cb)
    window.removeEventListener("storage", onStorage)
  }
}

export function useQuoteList(): QuoteList {
  return useSyncExternalStore(subscribe, read, () => EMPTY)
}

export function quoteCount(list: QuoteList) {
  return list.products.length + list.calcs.length
}

export function addProduct(p: Omit<QuoteProduct, "quantity"> & { quantity?: number }) {
  const list = read()
  const qty = Math.max(1, p.quantity ?? 1)
  const existing = list.products.find((x) => x.handle === p.handle)
  const products = existing
    ? list.products.map((x) => (x.handle === p.handle ? { ...x, quantity: x.quantity + qty } : x))
    : [...list.products, { ...p, quantity: qty }]
  write({ ...list, products })
}

export function setProductQuantity(handle: string, quantity: number) {
  const list = read()
  write({
    ...list,
    products: list.products.map((x) =>
      x.handle === handle ? { ...x, quantity: Math.max(1, Math.min(99999, quantity)) } : x
    ),
  })
}

export function removeProduct(handle: string) {
  const list = read()
  write({ ...list, products: list.products.filter((x) => x.handle !== handle) })
}

export function addCalc(calc: QuoteCalc) {
  const list = read()
  write({ ...list, calcs: [...list.calcs.filter((c) => c.id !== calc.id), calc] })
}

export function removeCalc(id: string) {
  const list = read()
  write({ ...list, calcs: list.calcs.filter((c) => c.id !== id) })
}

export function clearQuoteList() {
  write({ products: [], calcs: [] })
}

/** Textul trimis în cererea de ofertă (apare în admin la „Cereri ofertă”). */
export function quoteListText(list: QuoteList, extra = ""): string {
  const parts: string[] = []
  if (list.products.length) {
    parts.push(
      ["Produse:", ...list.products.map((p) => `- ${p.title}: ${p.quantity} × ${p.unit} (/products/${p.handle})`)].join("\n")
    )
  }
  for (const c of list.calcs) {
    parts.push(
      [
        `${c.title}: ${c.summary}`,
        ...c.lines.map((l) => `- ${l.name}: ${l.amount}${l.note ? ` (${l.note})` : ""}`),
      ].join("\n")
    )
  }
  if (extra.trim()) parts.push((parts.length ? "Alte materiale / observații:\n" : "") + extra.trim())
  return parts.join("\n\n")
}
