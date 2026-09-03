import db from "@/lib/db"
import { buildEmiPlans } from "@/lib/emi"
import type { ProductSummary, ProductWithVariants } from "@/types"

export async function listProducts(): Promise<ProductSummary[]> {
  const products = await db.product.findMany({
    include: { variants: true },
    orderBy: { createdAt: "asc" }
  })

  const summaries: ProductSummary[] = []

  for (const product of products) {
    const [firstVariant, ...restVariants] = product.variants
    if (!firstVariant) {
      continue
    }

    const cheapestVariant = restVariants.reduce(
      (lowest, variant) => (variant.price < lowest.price ? variant : lowest),
      firstVariant
    )

    summaries.push({
      id: product.id,
      slug: product.slug,
      name: product.name,
      brand: product.brand,
      startingPrice: cheapestVariant.price,
      imageUrl: cheapestVariant.imageUrl
    })
  }

  return summaries
}

export async function getProductBySlug(slug: string): Promise<ProductWithVariants | null> {
  const product = await db.product.findUnique({
    where: { slug },
    include: { variants: true }
  })

  if (!product) {
    return null
  }

  const rules = await db.emiRule.findMany({
    where: {
      OR: [{ productId: null }, { productId: product.id }]
    }
  })

  const variantsWithPlans = product.variants.map((variant) => ({
    id: variant.id,
    label: variant.label,
    storage: variant.storage,
    color: variant.color,
    mrp: variant.mrp,
    price: variant.price,
    imageUrl: variant.imageUrl,
    emiPlans: buildEmiPlans(rules, variant.price, product.id)
  }))

  return {
    id: product.id,
    slug: product.slug,
    name: product.name,
    brand: product.brand,
    description: product.description,
    variants: variantsWithPlans
  }
}
