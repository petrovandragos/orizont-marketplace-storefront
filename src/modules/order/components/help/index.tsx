import { Heading } from "@medusajs/ui"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import React from "react"

const Help = () => {
  return (
    <div className="mt-12 pt-8 border-t border-gray-100">
      <Heading className="text-sm font-bold uppercase tracking-widest text-gray-400 mb-6">Aveți nevoie de ajutor?</Heading>
      <div className="text-sm font-semibold text-gray-900 my-2">
        <ul className="gap-y-4 flex flex-col">
          <li>
            <LocalizedClientLink href="/contact" className="hover:underline underline-offset-4">Contactați-ne</LocalizedClientLink>
          </li>
          <li>
            <LocalizedClientLink href="/contact" className="hover:underline underline-offset-4">
              Politica de Retur și Schimb
            </LocalizedClientLink>
          </li>
        </ul>
      </div>
    </div>
  )
}

export default Help
