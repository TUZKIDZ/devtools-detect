import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'

type GlobalWithPrisma = typeof globalThis & { prisma?: PrismaClient }
const g = globalThis as GlobalWithPrisma

function createClient() {
  const connectionString = process.env.DATABASE_URL
  if (!connectionString) throw new Error('DATABASE_URL is not set')
  const adapter = new PrismaPg({ connectionString })
  return new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
  })
}

export const db: PrismaClient = g.prisma ?? createClient()
if (process.env.NODE_ENV !== 'production') g.prisma = db

export * from '@prisma/client'
