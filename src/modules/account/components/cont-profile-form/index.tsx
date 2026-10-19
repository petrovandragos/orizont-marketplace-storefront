"use client"

import { useActionState } from "react"
import { HttpTypes } from "@medusajs/types"
import { updateProfilePage } from "@lib/data/customer"

type Props = {
  customer: HttpTypes.StoreCustomer
}

export default function ContProfileForm({ customer }: Props) {
  const [state, formAction, isPending] = useActionState(updateProfilePage, {
    success: false,
    error: null,
  })

  return (
    <form action={formAction} className="flex flex-col gap-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="flex flex-col gap-y-1.5">
          <label htmlFor="first_name" className="text-sm font-medium text-gray-700">
            Prenume
          </label>
          <input
            id="first_name"
            name="first_name"
            type="text"
            defaultValue={customer.first_name ?? ""}
            placeholder="Prenume"
            className="h-11 w-full rounded-lg border border-gray-200 px-3.5 text-sm text-[#1D1D1F] placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#F27A1A] focus:border-transparent transition"
          />
        </div>
        <div className="flex flex-col gap-y-1.5">
          <label htmlFor="last_name" className="text-sm font-medium text-gray-700">
            Nume
          </label>
          <input
            id="last_name"
            name="last_name"
            type="text"
            defaultValue={customer.last_name ?? ""}
            placeholder="Nume"
            className="h-11 w-full rounded-lg border border-gray-200 px-3.5 text-sm text-[#1D1D1F] placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#F27A1A] focus:border-transparent transition"
          />
        </div>
      </div>

      <div className="flex flex-col gap-y-1.5">
        <label className="text-sm font-medium text-gray-700">Email</label>
        <input
          type="email"
          value={customer.email}
          disabled
          className="h-11 w-full rounded-lg border border-gray-100 bg-gray-50 px-3.5 text-sm text-gray-400 cursor-not-allowed"
        />
        <p className="text-xs text-gray-400">Adresa de email nu poate fi modificată.</p>
      </div>

      <div className="flex flex-col gap-y-1.5">
        <label htmlFor="phone" className="text-sm font-medium text-gray-700">
          Telefon
        </label>
        <input
          id="phone"
          name="phone"
          type="tel"
          defaultValue={customer.phone ?? ""}
          placeholder="07xxxxxxxx"
          className="h-11 w-full rounded-lg border border-gray-200 px-3.5 text-sm text-[#1D1D1F] placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#F27A1A] focus:border-transparent transition"
        />
      </div>

      {state.error && (
        <p className="text-sm text-red-500 bg-red-50 px-4 py-2.5 rounded-lg">
          {state.error}
        </p>
      )}

      {state.success && (
        <p className="text-sm text-green-600 bg-green-50 px-4 py-2.5 rounded-lg">
          Datele au fost actualizate cu succes.
        </p>
      )}

      <div>
        <button
          type="submit"
          disabled={isPending}
          className="px-6 py-2.5 bg-[#F27A1A] text-white text-sm font-semibold rounded-lg hover:bg-[#D4600E] transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {isPending ? "Se salvează..." : "Salvați modificările"}
        </button>
      </div>
    </form>
  )
}
