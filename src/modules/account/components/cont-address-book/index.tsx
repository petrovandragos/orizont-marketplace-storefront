"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { HttpTypes } from "@medusajs/types"
import {
  addCustomerAddress,
  deleteCustomerAddress,
  updateCustomerAddress,
} from "@lib/data/customer"

// ── Romanian counties ─────────────────────────────────────────────────────────

const JUDETE = [
  "Alba", "Arad", "Argeș", "Bacău", "Bihor", "Bistrița-Năsăud", "Botoșani",
  "Brașov", "Brăila", "Buzău", "Caraș-Severin", "Călărași", "Cluj",
  "Constanța", "Covasna", "Dâmbovița", "Dolj", "Galați", "Giurgiu", "Gorj",
  "Harghita", "Hunedoara", "Ialomița", "Iași", "Ilfov", "Maramureș",
  "Mehedinți", "Mureș", "Neamț", "Olt", "Prahova", "Satu Mare", "Sălaj",
  "Sibiu", "Suceava", "Teleorman", "Timiș", "Tulcea", "Vaslui", "Vâlcea",
  "Vrancea", "București",
]

// ── Address form ──────────────────────────────────────────────────────────────

type AddressFormData = {
  first_name: string
  last_name: string
  company: string
  address_1: string
  address_2: string
  city: string
  postal_code: string
  province: string
  phone: string
}

const EMPTY_FORM: AddressFormData = {
  first_name: "",
  last_name: "",
  company: "",
  address_1: "",
  address_2: "",
  city: "",
  postal_code: "",
  province: "",
  phone: "",
}

function addressToForm(address: HttpTypes.StoreCustomerAddress): AddressFormData {
  return {
    first_name: address.first_name ?? "",
    last_name: address.last_name ?? "",
    company: address.company ?? "",
    address_1: address.address_1 ?? "",
    address_2: address.address_2 ?? "",
    city: address.city ?? "",
    postal_code: address.postal_code ?? "",
    province: address.province ?? "",
    phone: address.phone ?? "",
  }
}

function Field({
  label,
  name,
  value,
  onChange,
  required,
  placeholder,
  type = "text",
}: {
  label: string
  name: string
  value: string
  onChange: (v: string) => void
  required?: boolean
  placeholder?: string
  type?: string
}) {
  return (
    <div className="flex flex-col gap-y-1.5">
      <label className="text-sm font-medium text-gray-700">
        {label}
        {required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      <input
        name={name}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        required={required}
        className="h-11 w-full rounded-lg border border-gray-200 px-3.5 text-sm text-[#1D1D1F] placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#F27A1A] focus:border-transparent transition"
      />
    </div>
  )
}

function AddressForm({
  initial = EMPTY_FORM,
  editingId,
  onClose,
}: {
  initial?: AddressFormData
  editingId?: string
  onClose: () => void
}) {
  const router = useRouter()
  const [form, setForm] = useState<AddressFormData>(initial)
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  const set = (key: keyof AddressFormData) => (v: string) =>
    setForm((prev) => ({ ...prev, [key]: v }))

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    formData.set("country_code", "ro")

    startTransition(async () => {
      const currentState: Record<string, unknown> = editingId
        ? { addressId: editingId }
        : {}

      const action = editingId ? updateCustomerAddress : addCustomerAddress
      const result = await action(currentState, formData)

      if (result?.success) {
        onClose()
        router.refresh()
      } else {
        setError(result?.error ?? "Eroare la salvarea adresei.")
      }
    })
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label="Prenume" name="first_name" value={form.first_name} onChange={set("first_name")} required placeholder="Prenume" />
        <Field label="Nume" name="last_name" value={form.last_name} onChange={set("last_name")} required placeholder="Nume" />
      </div>

      <Field label="Companie (opțional)" name="company" value={form.company} onChange={set("company")} placeholder="Numele companiei" />
      <Field label="Adresă" name="address_1" value={form.address_1} onChange={set("address_1")} required placeholder="Stradă, număr" />
      <Field label="Adresă (linia 2)" name="address_2" value={form.address_2} onChange={set("address_2")} placeholder="Bloc, scară, ap. (opțional)" />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label="Oraș" name="city" value={form.city} onChange={set("city")} required placeholder="Oraș" />
        <Field label="Cod poștal" name="postal_code" value={form.postal_code} onChange={set("postal_code")} required placeholder="xxxxxx" />
      </div>

      <div className="flex flex-col gap-y-1.5">
        <label className="text-sm font-medium text-gray-700">
          Județ <span className="text-red-500">*</span>
        </label>
        <select
          name="province"
          value={form.province}
          onChange={(e) => set("province")(e.target.value)}
          required
          className="h-11 w-full rounded-lg border border-gray-200 px-3.5 text-sm text-[#1D1D1F] focus:outline-none focus:ring-2 focus:ring-[#F27A1A] focus:border-transparent transition bg-white"
        >
          <option value="">Selectează județ</option>
          {JUDETE.map((j) => (
            <option key={j} value={j}>{j}</option>
          ))}
        </select>
      </div>

      <Field label="Telefon" name="phone" value={form.phone} onChange={set("phone")} type="tel" placeholder="07xxxxxxxx" />

      {error && (
        <p className="text-sm text-red-500 bg-red-50 px-4 py-2.5 rounded-lg">{error}</p>
      )}

      <div className="flex gap-x-3">
        <button
          type="submit"
          disabled={isPending}
          className="px-5 py-2.5 bg-[#F27A1A] text-white text-sm font-semibold rounded-lg hover:bg-[#D4600E] transition-colors disabled:opacity-60"
        >
          {isPending ? "Se salvează..." : editingId ? "Actualizați adresa" : "Adăugați adresa"}
        </button>
        <button
          type="button"
          onClick={onClose}
          className="px-5 py-2.5 text-sm font-medium text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
        >
          Anulați
        </button>
      </div>
    </form>
  )
}

// ── Address card ──────────────────────────────────────────────────────────────

function AddressCard({
  address,
  onEdit,
}: {
  address: HttpTypes.StoreCustomerAddress
  onEdit: () => void
}) {
  const router = useRouter()
  const [isDeleting, startTransition] = useTransition()

  const handleDelete = () => {
    if (!confirm("Sigur doriți să ștergeți această adresă?")) return
    startTransition(async () => {
      await deleteCustomerAddress(address.id)
      router.refresh()
    })
  }

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 flex flex-col gap-y-3">
      <address className="not-italic text-sm text-gray-600 flex flex-col gap-y-0.5 flex-1">
        <span className="font-semibold text-[#1D1D1F]">
          {address.first_name} {address.last_name}
        </span>
        {address.company && <span>{address.company}</span>}
        <span>{address.address_1}</span>
        {address.address_2 && <span>{address.address_2}</span>}
        <span>
          {address.postal_code} {address.city}
          {address.province ? `, ${address.province}` : ""}
        </span>
        {address.phone && <span className="mt-1 text-gray-400">{address.phone}</span>}
      </address>

      <div className="flex gap-x-2 pt-2 border-t border-gray-100">
        <button
          onClick={onEdit}
          className="text-xs font-medium text-[#F27A1A] hover:text-[#D4600E] transition-colors"
        >
          Editați
        </button>
        <span className="text-gray-200">|</span>
        <button
          onClick={handleDelete}
          disabled={isDeleting}
          className="text-xs font-medium text-red-400 hover:text-red-600 transition-colors disabled:opacity-50"
        >
          {isDeleting ? "Se șterge..." : "Ștergeți"}
        </button>
      </div>
    </div>
  )
}

// ── Main component ────────────────────────────────────────────────────────────

export default function ContAddressBook({
  customer,
}: {
  customer: HttpTypes.StoreCustomer
}) {
  const [showAdd, setShowAdd] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)

  const addresses = customer.addresses ?? []
  const editingAddress = addresses.find((a) => a.id === editingId)

  return (
    <div className="flex flex-col gap-y-6">
      {/* Add new */}
      {showAdd ? (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
          <h2 className="text-base font-bold text-[#1D1D1F] mb-5">Adresă nouă</h2>
          <AddressForm onClose={() => setShowAdd(false)} />
        </div>
      ) : (
        <button
          onClick={() => setShowAdd(true)}
          className="flex items-center gap-x-2 px-5 py-3 bg-white rounded-xl border border-dashed border-gray-300 hover:border-[#F27A1A] hover:text-[#F27A1A] text-sm font-medium text-gray-500 transition-colors w-full"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Adăugați o adresă nouă
        </button>
      )}

      {/* Edit form */}
      {editingId && editingAddress && (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
          <h2 className="text-base font-bold text-[#1D1D1F] mb-5">Editați adresa</h2>
          <AddressForm
            initial={addressToForm(editingAddress)}
            editingId={editingId}
            onClose={() => setEditingId(null)}
          />
        </div>
      )}

      {/* Address list */}
      {addresses.length === 0 && !showAdd ? (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-10 text-center">
          <svg className="w-10 h-10 text-gray-200 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
              d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
              d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <p className="text-sm text-gray-400">Nu aveți adrese salvate.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {addresses.map((address) => (
            editingId === address.id ? null : (
              <AddressCard
                key={address.id}
                address={address}
                onEdit={() => {
                  setShowAdd(false)
                  setEditingId(address.id)
                }}
              />
            )
          ))}
        </div>
      )}
    </div>
  )
}
