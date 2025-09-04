import { db } from '../../utils/prisma'
import { requireAuth } from '../../utils/auth'

export default defineEventHandler(async (event) => {
  await requireAuth(event)
  const id = Number(getRouterParam(event, 'id'))
  if (!id) throw createError({ statusCode: 400, message: 'invalid id' })
  const body = await readBody<{ title?: string; slug?: string; content?: string; publishedAt?: string | null; thumbnail?: string | null }>(event)
  const patch: any = { ...body }
  if (body.publishedAt !== undefined) patch.publishedAt = body.publishedAt ? new Date(body.publishedAt) : null
  try {
    const post = await db.blogPost.update({ where: { id }, data: patch })
    return post
  } catch (e: any) {
    if (e?.code === 'P2021') throw createError({ statusCode: 503, message: 'Database is not initialized yet. Please run: bun run db:push' })
    throw e
  }
})
