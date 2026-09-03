"use client"

import type { ReactElement } from "react"
import type { VariantWithPlans } from "@/types"

type VariantPickerProps = {
  variants: VariantWithPlans[]
  selectedVariantId: string
  onSelect: (variantId: string) => void
}

export default function VariantPicker({ variants, selectedVariantId, onSelect }: VariantPickerProps): ReactElement {
  return (
    <div className="flex flex-wrap gap-2">
      {variants.map((variant) => {
        const isSelected = variant.id === selectedVariantId
        return (
          <button
            key={variant.id}
            type="button"
            onClick={() => onSelect(variant.id)}
            className={
              isSelected
                ? "rounded-lg border-2 border-brand bg-brand/5 px-4 py-2 text-sm font-medium text-brand-dark"
                : "rounded-lg border-2 border-neutral-200 px-4 py-2 text-sm font-medium text-neutral-700 hover:border-neutral-300"
            }
          >
            {variant.label}
          </button>
        )
      })}
    </div>
  )
}
