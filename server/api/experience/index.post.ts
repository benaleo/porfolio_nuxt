import { db } from '../../utils/prisma'
import { requireAuth } from '../../utils/auth'

export default defineEventHandler(async (event) => {
  await requireAuth(event)
  const body = await readBody<{ startYear: number; endYear?: number | null; position: string; company: string; summary?: string | null }>(event)
  if (!body?.startYear || !body?.position || !body?.company) throw createError({ statusCode: 400, message: 'Missing fields' })
  try {
    const exp = await db.experience.create({ data: { ...body } })
    return exp
  } catch (e: any) {
    if (e?.code === 'P2021') throw createError({ statusCode: 503, message: 'Database is not initialized yet. Please run: bun run db:push' })
    throw e
  }
})
