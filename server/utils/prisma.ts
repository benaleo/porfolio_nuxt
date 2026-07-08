import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'

const globalForPrisma = globalThis as unknown as { prisma?: any }

// The edge client only accepts Accelerate URLs (prisma:// or prisma+postgres://).
// In local dev with a direct postgresql:// URL, use the standard Node client
// instead. The `import.meta.dev` guard is statically false in production
// builds, so the standard client (and its wasm loader, which breaks the
// Cloudflare Workers bundle) is dead-code-eliminated there.
async function createClient() {
  const url = process.env.DATABASE_URL ?? ''
  if (import.meta.dev && !url.startsWith('prisma')) {
    const { PrismaClient: NodeClient } = await import('@prisma/client')
    return new NodeClient() as unknown as ReturnType<typeof createEdgeClient>
  }
  return createEdgeClient()
}

function createEdgeClient() {
  return new PrismaClient().$extends(withAccelerate())
}

export const db = globalForPrisma.prisma ?? (await createClient())

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = db
