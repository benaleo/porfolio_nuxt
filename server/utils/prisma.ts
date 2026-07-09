import { PrismaClient } from '@prisma/client'

// Vercel runs on Node serverless, so we connect to Postgres (Neon) directly.
// Use the pooled connection string for DATABASE_URL (serverless-safe) and the
// direct one for DIRECT_DATABASE_URL (migrations). A global singleton avoids
// exhausting connections across hot-reloads in dev.
const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient }

export const db = globalForPrisma.prisma ?? new PrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = db
