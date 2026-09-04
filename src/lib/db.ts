import { PrismaClient } from "@/generated/prisma/client"
import { PrismaPg } from "@prisma/adapter-pg"
import "dotenv/config"
declare global {
  var prismaClient: PrismaClient | undefined
}

function createClient(): PrismaClient {
  const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL })
  return new PrismaClient({ adapter })
}

const db = globalThis.prismaClient ?? createClient()

if (process.env.NODE_ENV !== "production") {
  globalThis.prismaClient = db
}

export default db
