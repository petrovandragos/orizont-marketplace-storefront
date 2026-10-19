"use client"

import { useActionState, useState, useRef, useEffect } from "react"
import Input from "@modules/common/components/input"
import { LOGIN_VIEW } from "@modules/account/templates/login-template"
import ErrorMessage from "@modules/checkout/components/error-message"
import { SubmitButton } from "@modules/checkout/components/submit-button"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { signup } from "@lib/data/customer"
import { Turnstile } from "@marsidev/react-turnstile"

type Props = {
  setCurrentView: (view: LOGIN_VIEW) => void
}

const Register = ({ setCurrentView }: Props) => {
  const [message, formAction] = useActionState(signup, null)
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null)
  const turnstileRef = useRef<any>(null)

  useEffect(() => {
    if (message) {
      setTurnstileToken(null)
      turnstileRef.current?.reset()
    }
  }, [message])

  return (
    <div
      className="max-w-sm flex flex-col items-center"
      data-testid="register-page"
    >
      <h1 className="text-3xl font-bold text-gray-900 mb-2 text-center">
        Creați un cont
      </h1>
      <p className="text-center text-gray-500 text-sm mb-8 leading-relaxed">
        Înscrieți-vă la <span className="font-semibold text-gray-900">Orizont</span> pentru o experiență de cumpărături simplificată.
      </p>
      <form className="w-full flex flex-col" action={formAction}>
        <div className="flex flex-col w-full gap-y-3">
          <div className="grid grid-cols-2 gap-x-3">
            <Input
              label="Prenume"
              name="first_name"
              required
              autoComplete="given-name"
              data-testid="first-name-input"
            />
            <Input
              label="Nume"
              name="last_name"
              required
              autoComplete="family-name"
              data-testid="last-name-input"
            />
          </div>
          <Input
            label="Adresă E-mail"
            name="email"
            required
            type="email"
            autoComplete="email"
            data-testid="email-input"
          />
          <Input
            label="Telefon"
            name="phone"
            type="tel"
            autoComplete="tel"
            data-testid="phone-input"
          />
          <Input
            label="Parolă"
            name="password"
            required
            type="password"
            autoComplete="new-password"
            data-testid="password-input"
          />
        </div>
        <input type="hidden" name="turnstile_token" value={turnstileToken ?? ""} />
        <div className="flex justify-center mt-5">
          <Turnstile
            ref={turnstileRef}
            siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY!}
            onSuccess={(token) => setTurnstileToken(token)}
            onExpire={() => setTurnstileToken(null)}
            onError={() => setTurnstileToken(null)}
          />
        </div>
        <ErrorMessage error={message} data-testid="register-error" />
        <span className="text-center text-gray-400 text-[11px] mt-6 leading-relaxed">
          Prin crearea unui cont, ești de acord cu{" "}
          <LocalizedClientLink
            href="/politica-de-confidentialitate"
            className="underline hover:text-gray-600"
          >
            Politica de Confidențialitate
          </LocalizedClientLink>{" "}
          și{" "}
          <LocalizedClientLink
            href="/terms-of-use"
            className="underline hover:text-gray-600"
          >
            Termenii de Utilizare
          </LocalizedClientLink>{" "}
          Orizont.
        </span>
        <SubmitButton
          disabled={!turnstileToken}
          className="w-full mt-6 bg-[#F27A1A] hover:bg-[#D4600E] text-white transition-all duration-200 h-12 rounded-2xl font-bold uppercase tracking-widest text-xs shadow-sm shadow-orange-100 disabled:opacity-60 disabled:cursor-not-allowed"
          data-testid="register-button"
        >
          Înregistrare
        </SubmitButton>
      </form>
      <span className="text-center text-gray-500 text-sm font-medium mt-8">
        Ai deja un cont?{" "}
        <button
          onClick={() => setCurrentView(LOGIN_VIEW.SIGN_IN)}
          className="text-[#F27A1A] font-bold underline underline-offset-4 hover:text-[#D4600E] transition-colors"
        >
          Conectați-vă
        </button>
      </span>
    </div>
  )
}

export default Register
