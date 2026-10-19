"use client"

import { useActionState, useState } from "react"
import Link from "next/link"
import { loginPage } from "@lib/data/customer"

// ── Simple field wrapper ──────────────────────────────────────────────────────

function Field({
  label,
  name,
  type = "text",
  autoComplete,
  required,
  placeholder,
  rightSlot,
}: {
  label: string
  name: string
  type?: string
  autoComplete?: string
  required?: boolean
  placeholder?: string
  rightSlot?: React.ReactNode
}) {
  return (
    <div className="flex flex-col gap-y-1.5">
      <label htmlFor={name} className="text-sm font-medium text-[#424245]">
        {label}
        {required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      <div className="relative">
        <input
          id={name}
          name={name}
          type={type}
          autoComplete={autoComplete}
          required={required}
          placeholder={placeholder}
          className="h-11 w-full px-3 text-sm border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#F27A1A] focus:border-transparent placeholder:text-gray-400 pr-10"
        />
        {rightSlot && (
          <div className="absolute inset-y-0 right-0 flex items-center pr-3">
            {rightSlot}
          </div>
        )}
      </div>
    </div>
  )
}

// ── Password field with show/hide ────────────────────────────────────────────

function PasswordField({
  label,
  name,
  autoComplete,
  required,
  placeholder,
}: {
  label: string
  name: string
  autoComplete?: string
  required?: boolean
  placeholder?: string
}) {
  const [show, setShow] = useState(false)

  return (
    <Field
      label={label}
      name={name}
      type={show ? "text" : "password"}
      autoComplete={autoComplete}
      required={required}
      placeholder={placeholder}
      rightSlot={
        <button
          type="button"
          onClick={() => setShow((s) => !s)}
          className="text-gray-400 hover:text-gray-600 transition-colors"
          tabIndex={-1}
          aria-label={show ? "Ascunde parola" : "Arată parola"}
        >
          {show ? (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
            </svg>
          ) : (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
          )}
        </button>
      }
    />
  )
}

// ── Divider ───────────────────────────────────────────────────────────────────

function Divider({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-x-3 my-2">
      <div className="flex-1 h-px bg-gray-200" />
      <span className="text-xs text-gray-400 font-medium">{label}</span>
      <div className="flex-1 h-px bg-gray-200" />
    </div>
  )
}

// ── Main component ────────────────────────────────────────────────────────────

type LoginCardProps = {
  redirectTo: string
}

export default function LoginCard({ redirectTo }: LoginCardProps) {
  const [error, formAction, isPending] = useActionState(loginPage, null)

  const registerHref = `/cont/inregistrare${redirectTo ? `?redirectTo=${encodeURIComponent(redirectTo)}` : ""}`
  const forgotHref = `/cont/parola-uitata`

  return (
    <div className="w-full bg-white rounded-2xl border border-gray-100 shadow-sm px-8 py-10">
      {/* Header */}
      <div className="mb-8 text-center">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-[#FFF3E6] mb-4">
          <svg className="w-6 h-6 text-[#F27A1A]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-[#1D1D1F]">Conectare</h1>
        <p className="text-sm text-gray-500 mt-1">Bun venit înapoi la Orizont!</p>
      </div>

      {/* Form */}
      <form action={formAction} className="flex flex-col gap-y-4">
        <input type="hidden" name="redirectTo" value={redirectTo} />

        <Field
          label="Email"
          name="email"
          type="email"
          autoComplete="email"
          required
          placeholder="adresa@exemplu.ro"
        />

        <PasswordField
          label="Parolă"
          name="password"
          autoComplete="current-password"
          required
          placeholder="••••••••"
        />

        {/* Error message */}
        {error && (
          <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-2.5">
            {error}
          </p>
        )}

        {/* Forgot password */}
        <div className="text-right -mt-1">
          <Link
            href={forgotHref}
            className="text-sm text-[#F27A1A] hover:text-[#D4600E] transition-colors"
          >
            Ați uitat parola?
          </Link>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={isPending}
          className="w-full h-12 bg-[#F27A1A] hover:bg-[#D4600E] text-white font-semibold rounded-xl transition-colors duration-150 flex items-center justify-center gap-x-2 disabled:opacity-60 disabled:cursor-not-allowed text-sm mt-1"
        >
          {isPending ? (
            <>
              <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
              </svg>
              Se conectează...
            </>
          ) : (
            "Conectați-vă"
          )}
        </button>
      </form>

      {/* Divider */}
      <Divider label="sau" />

      {/* Register link */}
      <div className="text-center">
        <p className="text-sm text-gray-500">
          Nu aveți cont?{" "}
          <Link
            href={registerHref}
            className="font-semibold text-[#F27A1A] hover:text-[#D4600E] transition-colors"
          >
            Creați un cont
          </Link>
        </p>
      </div>
    </div>
  )
}
