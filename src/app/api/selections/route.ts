import db from "@/lib/db"
import { buildEmiPlans } from "@/lib/emi"
import { createSelectionSchema } from "@/lib/validation"

export async function POST(request: Request): Promise<Response> {
  const body: unknown = await request.json()
  const parsedBody = createSelectionSchema.safeParse(body)

  if (!parsedBody.success) {
    return Response.json({ error: parsedBody.error.flatten() }, { status: 400 })
  }

  const { variantId, tenureMonths } = parsedBody.data

  const variant = await db.productVariant.findUnique({
    where: { id: variantId }
  })

  if (!variant) {
    return Response.json({ error: "Variant not found" }, { status: 404 })
  }

  const rules = await db.emiRule.findMany({
    where: {
      OR: [{ productId: null }, { productId: variant.productId }]
    }
  })

  const plans = buildEmiPlans(rules, variant.price, variant.productId)
  const matchingPlan = plans.find((plan) => plan.tenureMonths === tenureMonths)

  if (!matchingPlan) {
    return Response.json({ error: "No EMI plan available for that tenure" }, { status: 400 })
  }

  const selection = await db.selection.create({
    data: {
      variantId: variant.id,
      tenureMonths: matchingPlan.tenureMonths,
      interestRate: matchingPlan.interestRate,
      monthlyAmount: matchingPlan.monthlyAmount,
      cashbackAmount: matchingPlan.cashbackAmount,
      totalPayable: matchingPlan.totalPayable
    }
  })

  return Response.json(selection, { status: 201 })
}
