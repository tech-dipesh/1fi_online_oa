import type { EmiRule } from "@/generated/prisma/client"
import type { EmiPlan } from "@/types"

function roundToNearestRupee(value: number): number {
  return Math.round(value)
}

function calculateMonthlyAmount(principal: number, annualRate: number, tenureMonths: number): number {
  if (annualRate === 0) {
    return roundToNearestRupee(principal / tenureMonths)
  }

  const monthlyRate = annualRate / 12 / 100
  const growthFactor = Math.pow(1 + monthlyRate, tenureMonths)
  const emi = (principal * monthlyRate * growthFactor) / (growthFactor - 1)

  return roundToNearestRupee(emi)
}

export function selectApplicableRules(rules: EmiRule[], price: number, productId: string): EmiRule[] {
  const matchingRules = rules.filter((rule) => price >= rule.minPrice && price <= rule.maxPrice)
  const bestRuleByTenure = new Map<number, EmiRule>()

  for (const rule of matchingRules) {
    const existingRule = bestRuleByTenure.get(rule.tenureMonths)
    const isProductSpecific = rule.productId === productId

    if (!existingRule) {
      bestRuleByTenure.set(rule.tenureMonths, rule)
      continue
    }

    const existingIsProductSpecific = existingRule.productId === productId
    if (isProductSpecific && !existingIsProductSpecific) {
      bestRuleByTenure.set(rule.tenureMonths, rule)
    }
  }

  return Array.from(bestRuleByTenure.values()).sort((a, b) => a.tenureMonths - b.tenureMonths)
}

export function buildEmiPlans(rules: EmiRule[], price: number, productId: string): EmiPlan[] {
  const applicableRules = selectApplicableRules(rules, price, productId)

  return applicableRules.map((rule) => {
    const monthlyAmount = calculateMonthlyAmount(price, rule.interestRate, rule.tenureMonths)
    const cashbackAmount = roundToNearestRupee((price * rule.cashbackPercent) / 100)
    const totalPayable = monthlyAmount * rule.tenureMonths

    return {
      tenureMonths: rule.tenureMonths,
      interestRate: rule.interestRate,
      monthlyAmount,
      cashbackAmount,
      cashbackPercent: rule.cashbackPercent,
      totalPayable
    }
  })
}
