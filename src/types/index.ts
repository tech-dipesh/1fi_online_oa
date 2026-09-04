export type EmiPlan = {
  tenureMonths: number
  interestRate: number
  monthlyAmount: number
  cashbackAmount: number
  cashbackPercent: number
  totalPayable: number
}

export type VariantWithPlans = {
  id: string
  label: string
  storage: string | null
  color: string | null
  mrp: number
  price: number
  imageUrl: string
  emiPlans: EmiPlan[]
}

export type ProductWithVariants = {
  id: string
  slug: string
  name: string
  brand: string
  description: string
  variants: VariantWithPlans[]
}

export type ProductSummary = {
  id: string
  slug: string
  name: string
  brand: string
  startingPrice: number
  imageUrl: string
}
