"use client"

import { useActionState, useState } from "react"
import Link from "next/link"
import { signupPage } from "@lib/data/customer"

// ── Field component ───────────────────────────────────────────────────────────

function Field({
  label,
  name,
  type = "text",
  autoComplete,
  required,
  placeholder,
  pattern,
  title,
  rightSlot,
}: {
  label: string
  name: string
  type?: string
  autoComplete?: string
  required?: boolean
  placeholder?: string
  pattern?: string
  title?: string
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
          pattern={pattern}
          title={title}
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
  value,
  onChange,
}: {
  label: string
  name: string
  autoComplete?: string
  required?: boolean
  placeholder?: string
  value?: string
  onChange?: (v: string) => void
}) {
  const [show, setShow] = useState(false)

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
          type={show ? "text" : "password"}
          autoComplete={autoComplete}
          required={required}
          placeholder={placeholder ?? "••••••••"}
          value={value}
          onChange={onChange ? (e) => onChange(e.target.value) : undefined}
          className="h-11 w-full px-3 pr-10 text-sm border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#F27A1A] focus:border-transparent placeholder:text-gray-400"
        />
        <button
          type="button"
          onClick={() => setShow((s) => !s)}
          className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600 transition-colors"
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
      </div>
    </div>
  )
}

// ── Main component ────────────────────────────────────────────────────────────

type RegisterCardProps = {
  redirectTo: string
}

export default function RegisterCard({ redirectTo }: RegisterCardProps) {
  const [serverError, formAction, isPending] = useActionState(signupPage, null)

  // Client-side password match validation
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [clientError, setClientError] = useState<string | null>(null)

  const passwordMismatch =
    confirmPassword.length > 0 && password !== confirmPassword

  // Wraps the server action with client-side validation
  const wrappedAction = (formData: FormData) => {
    if (password !== confirmPassword) {
      setClientError("Parolele nu se potrivesc. Verificați și încercați din nou.")
      return
    }
    setClientError(null)
    formAction(formData)
  }

  const displayError = clientError ?? serverError
  const loginHref = `/cont/conectare${redirectTo ? `?redirectTo=${encodeURIComponent(redirectTo)}` : ""}`

  return (
    <div className="w-full bg-white rounded-2xl border border-gray-100 shadow-sm px-8 py-10">
      {/* Header */}
      <div className="mb-8 text-center">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-[#FFF3E6] mb-4">
          <svg className="w-6 h-6 text-[#F27A1A]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-[#1D1D1F]">Creați un cont</h1>
        <p className="text-sm text-gray-500 mt-1">Înregistrați-vă pentru o experiență completă</p>
      </div>

      {/* Form */}
      <form action={wrappedAction} className="flex flex-col gap-y-4">
        <input type="hidden" name="redirectTo" value={redirectTo} />

        {/* Name row */}
        <div className="grid grid-cols-2 gap-x-3">
          <Field
            label="Prenume"
            name="first_name"
            autoComplete="given-name"
            required
            placeholder="Ion"
          />
          <Field
            label="Nume"
            name="last_name"
            autoComplete="family-name"
            required
            placeholder="Popescu"
          />
        </div>

        <Field
          label="Email"
          name="email"
          type="email"
          autoComplete="email"
          required
          placeholder="adresa@exemplu.ro"
        />

        <Field
          label="Telefon"
          name="phone"
          type="tel"
          autoComplete="tel"
          placeholder="07XX XXX XXX"
          pattern="^(\+?40|0)[0-9]{9}$"
          title="Număr de telefon românesc valid (ex: 0740123456)"
        />

        <PasswordField
          label="Parolă"
          name="password"
          autoComplete="new-password"
          required
          value={password}
          onChange={setPassword}
        />

        <div>
          <PasswordField
            label="Confirmă parola"
            name="confirm_password"
            autoComplete="new-password"
            required
            value={confirmPassword}
            onChange={setConfirmPassword}
          />
          {passwordMismatch && (
            <p className="text-xs text-red-500 mt-1.5">Parolele nu se potrivesc.</p>
          )}
        </div>

        {/* Error message */}
        {displayError && (
          <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-2.5">
            {displayError}
          </p>
        )}

        {/* Terms */}
        <p className="text-xs text-gray-400 leading-relaxed">
          Prin înregistrare ești de acord cu{" "}
          <Link href={`/termeni-si-conditii`} className="text-[#F27A1A] hover:underline">
            Termenii și Condițiile
          </Link>{" "}
          și{" "}
          <Link href={`/politica-de-confidentialitate`} className="text-[#F27A1A] hover:underline">
            Politica de Confidențialitate
          </Link>{" "}
          Orizont.
        </p>

        {/* Submit */}
        <button
          type="submit"
          disabled={isPending || passwordMismatch}
          className="w-full h-12 bg-[#F27A1A] hover:bg-[#D4600E] text-white font-semibold rounded-xl transition-colors duration-150 flex items-center justify-center gap-x-2 disabled:opacity-60 disabled:cursor-not-allowed text-sm"
        >
          {isPending ? (
            <>
              <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
              </svg>
              Se creează contul...
            </>
          ) : (
            "Înregistrează-te"
          )}
        </button>
      </form>

      {/* Login link */}
      <div className="text-center mt-6">
        <p className="text-sm text-gray-500">
          Ai deja un cont?{" "}
          <Link
            href={loginHref}
            className="font-semibold text-[#F27A1A] hover:text-[#D4600E] transition-colors"
          >
            Conectați-vă
          </Link>
        </p>
      </div>
    </div>
  )
}
