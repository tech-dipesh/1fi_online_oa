import type { ReactElement } from "react"
import { notFound } from "next/navigation"
import { getProductBySlug } from "@/lib/products"
import ProductView from "@/components/product-view"

type ProductPageProps = {
  params: Promise<{ slug: string }>
}

export default async function ProductPage({ params }: ProductPageProps): Promise<ReactElement> {
  const { slug } = await params
  const product = await getProductBySlug(slug)

  if (!product) {
    notFound()
  }

  return <ProductView product={product} />
}
