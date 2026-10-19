"use client"

import { HttpTypes } from "@medusajs/types"
import Input from "@modules/common/components/input"
import NativeSelect from "@modules/common/components/native-select"
import React, { useState } from "react"
import CountrySelect from "../country-select"
import { JUDETE_RO, LOCALITATI_RO } from "@lib/data/ro-localities"

const BillingAddress = ({ cart }: { cart: HttpTypes.StoreCart | null }) => {
  const [formData, setFormData] = useState<any>({
    "billing_address.first_name": cart?.billing_address?.first_name || "",
    "billing_address.last_name": cart?.billing_address?.last_name || "",
    "billing_address.address_1": cart?.billing_address?.address_1 || "",
    "billing_address.company": cart?.billing_address?.company || "",
    "billing_address.postal_code": cart?.billing_address?.postal_code || "",
    "billing_address.city": cart?.billing_address?.city || "",
    "billing_address.country_code": cart?.billing_address?.country_code || "",
    "billing_address.province": cart?.billing_address?.province || "",
    "billing_address.phone": cart?.billing_address?.phone || "",
  })

  const selectedJudet = formData["billing_address.province"] || ""
  const localitatiList = selectedJudet ? (LOCALITATI_RO[selectedJudet] ?? []) : []

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target
    if (name === "billing_address.province") {
      setFormData((prev: any) => ({
        ...prev,
        [name]: value,
        "billing_address.city": "",
      }))
    } else {
      setFormData((prev: any) => ({ ...prev, [name]: value }))
    }
  }

  return (
    <>
      <div className="grid grid-cols-2 gap-4">
        <Input
          label="Prenume"
          name="billing_address.first_name"
          autoComplete="given-name"
          value={formData["billing_address.first_name"]}
          onChange={handleChange}
          required
          data-testid="billing-first-name-input"
        />
        <Input
          label="Nume"
          name="billing_address.last_name"
          autoComplete="family-name"
          value={formData["billing_address.last_name"]}
          onChange={handleChange}
          required
          data-testid="billing-last-name-input"
        />
        <Input
          label="Adresă"
          name="billing_address.address_1"
          autoComplete="address-line1"
          value={formData["billing_address.address_1"]}
          onChange={handleChange}
          required
          data-testid="billing-address-input"
        />
        <Input
          label="Companie"
          name="billing_address.company"
          value={formData["billing_address.company"]}
          onChange={handleChange}
          autoComplete="organization"
          data-testid="billing-company-input"
        />
        <CountrySelect
          name="billing_address.country_code"
          autoComplete="country"
          region={cart?.region}
          value={formData["billing_address.country_code"]}
          onChange={handleChange}
          required
          data-testid="billing-country-select"
        />
        <NativeSelect
          name="billing_address.province"
          value={formData["billing_address.province"]}
          onChange={handleChange}
          required
          placeholder="Județ"
          data-testid="billing-province-select"
        >
          {JUDETE_RO.map(({ name }) => (
            <option key={name} value={name}>
              {name}
            </option>
          ))}
        </NativeSelect>
        <NativeSelect
          name="billing_address.city"
          value={formData["billing_address.city"]}
          onChange={handleChange}
          required
          placeholder={selectedJudet ? "Localitate" : "Selectați mai întâi județul"}
          disabled={!selectedJudet}
          data-testid="billing-city-select"
        >
          {localitatiList.map((loc) => (
            <option key={loc} value={loc}>
              {loc}
            </option>
          ))}
        </NativeSelect>
        <Input
          label="Cod poștal"
          name="billing_address.postal_code"
          autoComplete="postal-code"
          value={formData["billing_address.postal_code"]}
          onChange={handleChange}
          required
          data-testid="billing-postal-input"
        />
        <Input
          label="Telefon"
          name="billing_address.phone"
          autoComplete="tel"
          value={formData["billing_address.phone"]}
          onChange={handleChange}
          data-testid="billing-phone-input"
        />
      </div>
    </>
  )
}

export default BillingAddress
