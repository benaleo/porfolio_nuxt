import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'

const globalForPrisma = globalThis as unknown as { prisma?: ReturnType<typeof createClient> }

function createClient() {
  return new PrismaClient().$extends(withAccelerate())
}

export const db = globalForPrisma.prisma ?? createClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = db