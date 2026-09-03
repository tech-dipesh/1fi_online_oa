import { listProducts } from "@/lib/products"

export async function GET(): Promise<Response> {
  const products = await listProducts()
  return Response.json(products)
}
