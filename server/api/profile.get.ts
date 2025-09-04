import { db } from '../utils/prisma'

export default defineEventHandler(async () => {
  try {
    const profile = await db.profile.findUnique({ where: { id: 1 } })
    return profile || null
  } catch (e: any) {
    // Handle missing table during first-time setup (Prisma P2021)
    if (e?.code === 'P2021') return null
    throw e
  }
})
