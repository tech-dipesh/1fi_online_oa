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
