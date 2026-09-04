"use client"

import { useState } from "react"
import type { ReactElement } from "react"
import Image from "next/image"
import type { ProductWithVariants } from "@/types"
import VariantPicker from "@/components/variant-picker"
import EmiPlanList from "@/components/emi-plan-list"
import ProceedButton from "@/components/proceed-button"

type ProductViewProps = {
  product: ProductWithVariants
}

export default function ProductView({ product }: ProductViewProps): ReactElement {
  const firstVariant = product.variants[0]
  const [selectedVariantId, setSelectedVariantId] = useState<string>(firstVariant ? firstVariant.id : "")
  const [selectedTenure, setSelectedTenure] = useState<number | null>(
    firstVariant && firstVariant.emiPlans[0] ? firstVariant.emiPlans[0].tenureMonths : null
  )

  const selectedVariant = product.variants.find((variant) => variant.id === selectedVariantId) ?? firstVariant

  if (!selectedVariant) {
    return <p className="text-neutral-600">This product has no variants yet.</p>
  }

  const selectedPlan = selectedVariant.emiPlans.find((plan) => plan.tenureMonths === selectedTenure) ?? null

  function handleVariantSelect(variantId: string): void {
    setSelectedVariantId(variantId)
    const variant = product.variants.find((candidate) => candidate.id === variantId)
    const firstPlan = variant ? variant.emiPlans[0] : undefined
    setSelectedTenure(firstPlan ? firstPlan.tenureMonths : null)
  }

  return (
    <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
      <div className="relative h-96 w-full overflow-hidden rounded-2xl bg-neutral-100">
        <Image src={selectedVariant.imageUrl} alt={product.name} fill className="object-cover" sizes="(min-width: 1024px) 50vw, 100vw" />
      </div>

      <div>
        <p className="text-sm font-medium uppercase tracking-wide text-neutral-500">{product.brand}</p>
        <h1 className="mt-1 text-2xl font-semibold text-neutral-900">{product.name}</h1>
        <p className="mt-1 text-neutral-600">{selectedVariant.label}</p>

        <div className="mt-4 flex items-baseline gap-3">
          <span className="text-2xl font-bold text-neutral-900">₹{selectedVariant.price.toLocaleString("en-IN")}</span>
          {selectedVariant.mrp > selectedVariant.price ? (
            <span className="text-neutral-400 line-through">₹{selectedVariant.mrp.toLocaleString("en-IN")}</span>
          ) : null}
        </div>

        <div className="mt-6">
          <p className="mb-2 text-sm font-medium text-neutral-700">Variant</p>
          <VariantPicker variants={product.variants} selectedVariantId={selectedVariant.id} onSelect={handleVariantSelect} />
        </div>

        <div className="mt-8">
          <p className="mb-2 text-sm font-medium text-neutral-700">EMI plans backed by mutual funds</p>
          <EmiPlanList plans={selectedVariant.emiPlans} selectedTenure={selectedTenure} onSelectAction={setSelectedTenure} />
        </div>

        <div className="mt-8">
          <ProceedButton variantId={selectedVariant.id} selectedPlan={selectedPlan} />
        </div>
      </div>
    </div>
  )
}
