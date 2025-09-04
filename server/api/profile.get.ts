import { db } from '../utils/prisma'

export default defineEventHandler(async () => {
  const cache = useStorage('cache')
  const key = 'app:profile:v1'
  const ttlMs = 5 * 60 * 1000 // 5 minutes

  // Try read from cache
  const cached = await cache.getItem<{ data: any; ts: number }>(key)
  if (cached && (Date.now() - cached.ts) < ttlMs) {
    return cached.data
  }

  try {
    const profile = await db.profile.findUnique({ where: { id: 1 } })
    const data = profile || null
    // Write to cache
    await cache.setItem(key, { data, ts: Date.now() })
    return data
  } catch (e: any) {
    // Handle missing table during first-time setup (Prisma P2021)
    if (e?.code === 'P2021') return null
    throw e
  }
})
