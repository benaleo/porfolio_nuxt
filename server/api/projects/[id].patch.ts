import { db } from '../../utils/prisma'
import { requireAuth } from '../../utils/auth'
import { deleteR2ObjectByKey, keyFromPublicUrl } from '../../utils/r2'

export default defineEventHandler(async (event) => {
  await requireAuth(event)
  const id = Number(getRouterParam(event, 'id'))
  if (!id) throw createError({ statusCode: 400, message: 'invalid id' })
  const body = await readBody<{ title?: string; description?: string; category?: 'Backend' | 'Frontend' | 'Fullstack' | 'Other'; image?: string | null; tags?: string[] }>(event)
  try {
    const existing = await db.project.findUnique({ where: { id } })
    if (!existing) throw createError({ statusCode: 404, message: 'Not found' })

    const proj = await db.project.update({
      where: { id },
      data: { ...body } as any,
    })

    // If image changed or cleared, delete old object in R2
    if (Object.prototype.hasOwnProperty.call(body, 'image')) {
      const oldUrl = existing.image || null
      const newUrl = body.image ?? null
      if (oldUrl && oldUrl !== newUrl) {
        const key = keyFromPublicUrl(oldUrl)
        if (key) {
          try {
            await deleteR2ObjectByKey(key)
          } catch (err) {
            // Swallow delete errors to not break update
            // You may add logging here if you have a logger
          }
        }
      }
    }
    return proj
  } catch (e: any) {
    if (e?.code === 'P2021') throw createError({ statusCode: 503, message: 'Database is not initialized yet. Please run: bun run db:push' })
    throw e
  }
})
