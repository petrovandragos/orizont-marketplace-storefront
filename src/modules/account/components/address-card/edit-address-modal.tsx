"use client"

import React, { useEffect, useState, useActionState } from "react"
import { PencilSquare as Edit, Trash } from "@medusajs/icons"
import { Button, Heading, Text, clx } from "@medusajs/ui"

import useToggleState from "@lib/hooks/use-toggle-state"
import CountrySelect from "@modules/checkout/components/country-select"
import Input from "@modules/common/components/input"
import Modal from "@modules/common/components/modal"
import Spinner from "@modules/common/icons/spinner"
import { SubmitButton } from "@modules/checkout/components/submit-button"
import { HttpTypes } from "@medusajs/types"
import {
  deleteCustomerAddress,
  updateCustomerAddress,
} from "@lib/data/customer"

type EditAddressProps = {
  region: HttpTypes.StoreRegion
  address: HttpTypes.StoreCustomerAddress
  isActive?: boolean
}

const EditAddress: React.FC<EditAddressProps> = ({
  region,
  address,
  isActive = false,
}) => {
  const [removing, setRemoving] = useState(false)
  const [successState, setSuccessState] = useState(false)
  const { state, open, close: closeModal } = useToggleState(false)

  const [formState, formAction] = useActionState(updateCustomerAddress, {
    success: false,
    error: null,
    addressId: address.id,
  })

  const close = () => {
    setSuccessState(false)
    closeModal()
  }

  useEffect(() => {
    if (successState) {
      close()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [successState])

  useEffect(() => {
    if (formState.success) {
      setSuccessState(true)
    }
  }, [formState])

  const removeAddress = async () => {
    setRemoving(true)
    await deleteCustomerAddress(address.id)
    setRemoving(false)
  }

  return (
    <>
      <div
        className={clx(
          "border border-gray-100 rounded-3xl p-8 min-h-[220px] h-full w-full flex flex-col justify-between transition-all duration-300 hover:shadow-xl hover:shadow-gray-100/50 bg-white group",
          {
            "border-gray-900 ring-1 ring-gray-900": isActive,
          }
        )}
        data-testid="address-container"
      >
        <div className="flex flex-col gap-y-2">
          <div className="flex items-center justify-between mb-2">
            <Heading
              className="text-left text-lg font-bold text-gray-900 tracking-tight"
              data-testid="address-name"
            >
              {address.first_name} {address.last_name}
            </Heading>
            {isActive && (
              <span className="text-[10px] font-black uppercase tracking-widest text-white bg-black px-2 py-1 rounded">
                Default
              </span>
            )}
          </div>
          {address.company && (
            <Text
              className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-1"
              data-testid="address-company"
            >
              {address.company}
            </Text>
          )}
          <Text className="flex flex-col text-left text-sm text-gray-600 font-medium leading-relaxed">
            <span data-testid="address-address">
              {address.address_1}
              {address.address_2 && <span>, {address.address_2}</span>}
            </span>
            <span data-testid="address-postal-city">
              {address.postal_code}, {address.city}
            </span>
            <span data-testid="address-province-country">
              {address.province && `${address.province}, `}
              {address.country_code?.toUpperCase()}
            </span>
          </Text>
        </div>
        <div className="flex items-center gap-x-6 mt-8 pt-6 border-t border-gray-50">
          <button
            className="text-[10px] font-bold text-gray-900 flex items-center gap-x-2 hover:text-black transition-colors uppercase tracking-widest"
            onClick={open}
            data-testid="address-edit-button"
          >
            <Edit className="h-4 w-4" />
            Editați
          </button>
          <button
            className="text-[10px] font-bold text-gray-400 flex items-center gap-x-2 hover:text-red-600 transition-colors uppercase tracking-widest"
            onClick={removeAddress}
            data-testid="address-delete-button"
          >
            {removing ? <Spinner className="h-4 w-4" /> : <Trash className="h-4 w-4" />}
            Ștergeți
          </button>
        </div>
      </div>

      <Modal isOpen={state} close={close} data-testid="edit-address-modal">
        <Modal.Title>
          <Heading className="mb-2 text-2xl font-bold uppercase tracking-tighter">Editați adresa</Heading>
        </Modal.Title>
        <form action={formAction}>
          <input type="hidden" name="addressId" value={address.id} />
          <Modal.Body>
            <div className="grid grid-cols-1 gap-y-4">
              <div className="grid grid-cols-2 gap-x-4">
                <Input
                  label="Prenume"
                  name="first_name"
                  required
                  autoComplete="given-name"
                  defaultValue={address.first_name || undefined}
                  data-testid="first-name-input"
                />
                <Input
                  label="Nume"
                  name="last_name"
                  required
                  autoComplete="family-name"
                  defaultValue={address.last_name || undefined}
                  data-testid="last-name-input"
                />
              </div>
              <Input
                label="Companie"
                name="company"
                autoComplete="organization"
                defaultValue={address.company || undefined}
                data-testid="company-input"
              />
              <Input
                label="Adresă"
                name="address_1"
                required
                autoComplete="address-line1"
                defaultValue={address.address_1 || undefined}
                data-testid="address-1-input"
              />
              <Input
                label="Apartament, căsuță poștală, etc."
                name="address_2"
                autoComplete="address-line2"
                defaultValue={address.address_2 || undefined}
                data-testid="address-2-input"
              />
              <div className="grid grid-cols-[144px_1fr] gap-x-4">
                <Input
                  label="Cod poștal"
                  name="postal_code"
                  required
                  autoComplete="postal-code"
                  defaultValue={address.postal_code || undefined}
                  data-testid="postal-code-input"
                />
                <Input
                  label="Oraș"
                  name="city"
                  required
                  autoComplete="locality"
                  defaultValue={address.city || undefined}
                  data-testid="city-input"
                />
              </div>
              <Input
                label="Județ / Stat"
                name="province"
                autoComplete="address-level1"
                defaultValue={address.province || undefined}
                data-testid="state-input"
              />
              {/* Note: Country selection is handled by CountrySelect, usually has its own localization or uses data from Medusa */}
              <CountrySelect
                name="country_code"
                region={region}
                required
                autoComplete="country"
                defaultValue={address.country_code || undefined}
                data-testid="country-select"
              />
              <Input
                label="Telefon"
                name="phone"
                autoComplete="phone"
                defaultValue={address.phone || undefined}
                data-testid="phone-input"
              />
            </div>
            {formState.error && (
              <div className="text-rose-500 text-small-regular py-2">
                {formState.error}
              </div>
            )}
          </Modal.Body>
          <Modal.Footer>
            <div className="flex gap-4 mt-8">
              <Button
                type="reset"
                variant="secondary"
                onClick={close}
                className="h-12 flex-1 rounded-xl font-bold uppercase tracking-widest text-[10px] border-gray-200"
                data-testid="cancel-button"
              >
                Anulați
              </Button>
              <SubmitButton data-testid="save-button" className="h-12 flex-1 rounded-xl bg-black text-white hover:bg-gray-800 font-bold uppercase tracking-widest text-[10px]">
                Salvați
              </SubmitButton>
            </div>
          </Modal.Footer>
        </form>
      </Modal>
    </>
  )
}

export default EditAddress
