import { db } from '../../utils/prisma'
import { requireAuth } from '../../utils/auth'

export default defineEventHandler(async (event) => {
  await requireAuth(event)
  const body = await readBody<{ title: string; description: string; category: 'Backend' | 'Frontend' | 'Fullstack' | 'Other'; image?: string | null; tags?: string[] }>(event)
  if (!body?.title || !body?.description || !body?.category) throw createError({ statusCode: 400, message: 'Missing fields' })
  try {
    const proj = await db.project.create({
      data: {
        title: body.title,
        description: body.description,
        category: body.category as any,
        image: body.image || null,
        tags: body.tags || [],
      },
    })
    return proj
  } catch (e: any) {
    if (e?.code === 'P2021') throw createError({ statusCode: 503, message: 'Database is not initialized yet. Please run: bun run db:push' })
    throw e
  }
})
