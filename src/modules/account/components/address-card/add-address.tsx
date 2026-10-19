"use client"

import { Plus } from "@medusajs/icons"
import { Button, Heading } from "@medusajs/ui"
import { useEffect, useState, useActionState } from "react"

import useToggleState from "@lib/hooks/use-toggle-state"
import CountrySelect from "@modules/checkout/components/country-select"
import Input from "@modules/common/components/input"
import Modal from "@modules/common/components/modal"
import { SubmitButton } from "@modules/checkout/components/submit-button"
import { HttpTypes } from "@medusajs/types"
import { addCustomerAddress } from "@lib/data/customer"

const AddAddress = ({
  region,
  addresses,
}: {
  region: HttpTypes.StoreRegion
  addresses: HttpTypes.StoreCustomerAddress[]
}) => {
  const [successState, setSuccessState] = useState(false)
  const { state, open, close: closeModal } = useToggleState(false)

  const [formState, formAction] = useActionState(addCustomerAddress, {
    isDefaultShipping: addresses.length === 0,
    success: false,
    error: null,
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

  return (
    <>
      <button
        className="border border-ui-border-base rounded-[2rem] p-8 min-h-[224px] h-full w-full flex flex-col justify-between items-center bg-gray-50/50 hover:bg-white hover:border-gray-900 transition-all duration-300 group border-dashed hover:shadow-2xl hover:shadow-gray-200/50"
        onClick={open}
        data-testid="add-address-button"
      >
        <div className="flex flex-col items-center gap-y-4 py-8">
          <div className="w-12 h-12 rounded-2xl bg-white shadow-sm flex items-center justify-center border border-gray-100 group-hover:bg-black group-hover:text-white transition-all duration-300">
            <Plus className="w-6 h-6" />
          </div>
          <span className="text-sm font-bold uppercase tracking-widest text-gray-400 group-hover:text-black transition-colors">Adresă nouă</span>
        </div>
      </button>

      <Modal isOpen={state} close={close} data-testid="add-address-modal">
        <Modal.Title>
          <Heading className="mb-2 text-2xl font-bold uppercase tracking-tighter">Adăugați adresa</Heading>
        </Modal.Title>
        <form action={formAction}>
          <Modal.Body>
            <div className="flex flex-col gap-y-4">
              <div className="grid grid-cols-2 gap-x-4">
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
                label="Companie"
                name="company"
                autoComplete="organization"
                data-testid="company-input"
              />
              <Input
                label="Adresă"
                name="address_1"
                required
                autoComplete="address-line1"
                data-testid="address-1-input"
              />
              <Input
                label="Apartament, căsuță poștală, etc."
                name="address_2"
                autoComplete="address-line2"
                data-testid="address-2-input"
              />
              <div className="grid grid-cols-[144px_1fr] gap-x-4">
                <Input
                  label="Cod poștal"
                  name="postal_code"
                  required
                  autoComplete="postal-code"
                  data-testid="postal-code-input"
                />
                <Input
                  label="Oraș"
                  name="city"
                  required
                  autoComplete="locality"
                  data-testid="city-input"
                />
              </div>
              <Input
                label="Județ / Stat"
                name="province"
                autoComplete="address-level1"
                data-testid="state-input"
              />
              <CountrySelect
                region={region}
                name="country_code"
                required
                autoComplete="country"
                data-testid="country-select"
              />
              <Input
                label="Telefon"
                name="phone"
                autoComplete="phone"
                data-testid="phone-input"
              />
            </div>
            {formState.error && (
              <div
                className="text-rose-500 text-small-regular py-2"
                data-testid="address-error"
              >
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

export default AddAddress
