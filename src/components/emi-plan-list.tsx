"use client"

import type { ReactElement } from "react"
import type { EmiPlan } from "@/types"

type EmiPlanListProps = {
  plans: EmiPlan[]
  selectedTenure: number | null
  onSelectAction: (tenureMonths: number) => void
}

export default function EmiPlanList({ plans, selectedTenure, onSelectAction }: EmiPlanListProps): ReactElement {
  return (
    <div className="flex flex-col gap-3">
      {plans.map((plan) => {
        const isSelected = plan.tenureMonths === selectedTenure
        return (
          <button
            key={plan.tenureMonths}
            type="button"
            onClick={() => onSelect(plan.tenureMonths)}
            className={
              isSelected
                ? "flex items-center justify-between rounded-xl border-2 border-brand bg-brand/5 px-4 py-3 text-left"
                : "flex items-center justify-between rounded-xl border-2 border-neutral-200 px-4 py-3 text-left hover:border-neutral-300"
            }
          >
            <div>
              <p className="font-semibold text-neutral-900">
                ₹{plan.monthlyAmount.toLocaleString("en-IN")}{" "}
                <span className="font-normal text-neutral-500">x {plan.tenureMonths} months</span>
              </p>
              {plan.cashbackAmount > 0 ? (
                <p className="mt-1 text-sm text-emerald-600">
                  Additional cashback of ₹{plan.cashbackAmount.toLocaleString("en-IN")}
                </p>
              ) : null}
            </div>
            <span className="text-sm font-medium text-neutral-600">
              {plan.interestRate === 0 ? "0% interest" : `${plan.interestRate}% interest`}
            </span>
          </button>
        )
      })}
    </div>
  )
}
