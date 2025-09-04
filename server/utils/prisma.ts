import { PrismaClient } from '@prisma/client'

// Ensure a single PrismaClient instance across HMR in dev
let prisma: PrismaClient

declare const globalThis: typeof global & { __prisma?: PrismaClient }

if (!globalThis.__prisma) {
  prisma = new PrismaClient()
  globalThis.__prisma = prisma
} else {
  prisma = globalThis.__prisma
}

export const db = prisma
