import type { Metadata } from "next"
import type { ReactElement, ReactNode } from "react"
import Link from "next/link"
import "./globals.css"

export const metadata: Metadata = {
  title: "EMI Plans",
  description: "Shop smartphones with EMI plans backed by mutual funds"
}

export default function RootLayout({ children }: { children: ReactNode }): ReactElement {
  return (
    <html lang="en">
      <body className="min-h-screen text-neutral-900">
        <header className="border-b border-neutral-200 bg-white">
          <div className="mx-auto flex max-w-6xl items-center px-6 py-4">
            <Link href="/" className="text-lg font-semibold text-brand">
              EMI Plans
            </Link>
          </div>
        </header>
        <main className="mx-auto max-w-6xl px-6 py-10">{children}</main>
      </body>
    </html>
  )
}
