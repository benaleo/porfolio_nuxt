// Node client with singleton to survive HMR (compatible with es2019, no top-level await)
import { PrismaClient } from '@prisma/client'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const g = globalThis as any
g.__prisma ??= new PrismaClient()
export const db: PrismaClient = g.__prisma
