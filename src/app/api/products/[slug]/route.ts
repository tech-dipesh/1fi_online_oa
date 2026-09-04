import { getProductBySlug } from "@/lib/products"

type RouteContext = {
  params: Promise<{ slug: string }>
}

export async function GET(request: Request, context: RouteContext): Promise<Response> {
  const { slug } = await context.params
  const product = await getProductBySlug(slug)

  if (!product) {
    return Response.json({ error: "Product not found" }, { status: 404 })
  }

  return Response.json(product)
}
