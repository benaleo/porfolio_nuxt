import { db } from '../../utils/prisma'
import { requireAuth } from '../../utils/auth'

export default defineEventHandler(async (event) => {
  await requireAuth(event)
  const id = Number(getRouterParam(event, 'id'))
  if (!id) throw createError({ statusCode: 400, message: 'invalid id' })
  const body = await readBody<{ title?: string; description?: string; category?: 'Backend' | 'Frontend' | 'Fullstack' | 'Other'; image?: string | null; tags?: string[] }>(event)
  try {
    const proj = await db.project.update({
      where: { id },
      data: { ...body } as any,
    })
    return proj
  } catch (e: any) {
    if (e?.code === 'P2021') throw createError({ statusCode: 503, message: 'Database is not initialized yet. Please run: bun run db:push' })
    throw e
  }
})
