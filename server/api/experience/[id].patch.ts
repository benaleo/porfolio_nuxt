import { db } from '../../utils/prisma'
import { requireAuth } from '../../utils/auth'

export default defineEventHandler(async (event) => {
  await requireAuth(event)
  const id = Number(getRouterParam(event, 'id'))
  if (!id) throw createError({ statusCode: 400, message: 'invalid id' })
  const body = await readBody<{ startYear?: number; endYear?: number | null; position?: string; company?: string; summary?: string | null }>(event)
  try {
    const exp = await db.experience.update({ where: { id }, data: { ...body } })
    return exp
  } catch (e: any) {
    if (e?.code === 'P2021') throw createError({ statusCode: 503, message: 'Database is not initialized yet. Please run: bun run db:push' })
    throw e
  }
})
