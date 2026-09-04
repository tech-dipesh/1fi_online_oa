"use client"

import { useState } from "react"
import type { ReactElement } from "react"
import type { EmiPlan } from "@/types"

type ProceedButtonProps = {
  variantId: string
  selectedPlan: EmiPlan | null
}

type SelectionResponse = {
  id: string
  tenureMonths: number
  monthlyAmount: number
  cashbackAmount: number
}

type RequestState = "idle" | "loading" | "success" | "error"

export default function ProceedButton({ variantId, selectedPlan }: ProceedButtonProps): ReactElement {
  const [requestState, setRequestState] = useState<RequestState>("idle")
  const [confirmedSelection, setConfirmedSelection] = useState<SelectionResponse | null>(null)

  async function handleProceed(): Promise<void> {
    if (!selectedPlan) {
      return
    }

    setRequestState("loading")

    const response = await fetch("/api/selections", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ variantId, tenureMonths: selectedPlan.tenureMonths })
    })

    if (!response.ok) {
      setRequestState("error")
      return
    }

    const data: SelectionResponse = await response.json()
    setConfirmedSelection(data)
    setRequestState("success")
  }

  if (requestState === "success" && confirmedSelection) {
    return (
      <div className="rounded-xl border-2 border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
        Plan confirmed: ₹{confirmedSelection.monthlyAmount.toLocaleString("en-IN")} x {confirmedSelection.tenureMonths}{" "}
        months. Reference {confirmedSelection.id.slice(0, 8)}.
      </div>
    )
  }

  return (
    <div>
      <button
        type="button"
        onClick={handleProceed}
        disabled={!selectedPlan || requestState === "loading"}
        className="w-full rounded-xl bg-brand px-6 py-3 font-medium text-white transition hover:bg-brand-dark disabled:cursor-not-allowed disabled:opacity-50"
      >
        {requestState === "loading" ? "Processing..." : "Proceed with this plan"}
      </button>
      {requestState === "error" ? (
        <p className="mt-2 text-sm text-red-600">Something went wrong. Please try again.</p>
      ) : null}
    </div>
  )
}
