import type { ReactElement } from "react"
import Link from "next/link"
import Image from "next/image"
import { listProducts } from "@/lib/products"

export default async function HomePage(): Promise<ReactElement> {
  const products = await listProducts()

  return (
    <div>
      <h1 className="text-2xl font-semibold text-neutral-900">Smartphones on EMI</h1>
      <p className="mt-2 text-neutral-600">Pick a phone, then choose an EMI plan backed by mutual funds.</p>
      <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {products.map((product) => (
          <Link
            key={product.id}
            href={`/products/${product.slug}`}
            className="group overflow-hidden rounded-2xl border border-neutral-200 bg-white transition hover:border-brand hover:shadow-lg"
          >
            <div className="relative h-56 w-full bg-neutral-100">
              <Image
                src={product.imageUrl}
                alt={product.name}
                fill
                className="object-cover"
                sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
              />
            </div>
            <div className="p-5">
              <p className="text-sm text-neutral-500">{product.brand}</p>
              <h2 className="mt-1 text-lg font-medium text-neutral-900 group-hover:text-brand">{product.name}</h2>
              <p className="mt-2 text-sm text-neutral-600">
                From <span className="font-semibold text-neutral-900">₹{product.startingPrice.toLocaleString("en-IN")}</span>
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
