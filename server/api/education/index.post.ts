import { db } from '../../utils/prisma'
import { requireAuth } from '../../utils/auth'

export default defineEventHandler(async (event) => {
  await requireAuth(event)
  const body = await readBody<{ year: string; institution: string; major: string; summary?: string | null }>(event)
  if (!body?.year || !body?.institution || !body?.major) throw createError({ statusCode: 400, message: 'Missing fields' })
  try {
    const edu = await db.education.create({ data: { ...body } })
    return edu
  } catch (e: any) {
    if (e?.code === 'P2021') throw createError({ statusCode: 503, message: 'Database is not initialized yet. Please run: bun run db:push' })
    throw e
  }
})
