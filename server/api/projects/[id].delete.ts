import { db } from '../../utils/prisma'
import { requireAuth } from '../../utils/auth'
import { deleteR2ObjectByKey, keyFromPublicUrl } from '../../utils/r2'

export default defineEventHandler(async (event) => {
  await requireAuth(event)
  const id = Number(getRouterParam(event, 'id'))
  if (!id) throw createError({ statusCode: 400, message: 'invalid id' })
  try {
    const existing = await db.project.findUnique({ where: { id } })
    if (!existing) throw createError({ statusCode: 404, message: 'Not found' })

    // Attempt to delete associated image in R2 (best-effort)
    if (existing.image) {
      const key = keyFromPublicUrl(existing.image)
      if (key) {
        try {
          await deleteR2ObjectByKey(key)
        } catch (err) {
          // ignore delete errors
        }
      }
    }

    await db.project.delete({ where: { id } })
    return { ok: true }
  } catch (e: any) {
    if (e?.code === 'P2021') throw createError({ statusCode: 503, message: 'Database is not initialized yet. Please run: bun run db:push' })
    throw e
  }
})
