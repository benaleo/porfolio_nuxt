import { db } from '../../utils/prisma'
import { requireAuth } from '../../utils/auth'

function slugify(s: string) {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
}

export default defineEventHandler(async (event) => {
  await requireAuth(event)
  const body = await readBody<{ title: string; slug?: string; content: string; publishedAt?: string | null; thumbnail?: string | null }>(event)
  if (!body?.title || !body?.content) throw createError({ statusCode: 400, message: 'title and content are required' })
  const slug = body.slug && body.slug.length ? body.slug : slugify(body.title)
  try {
    const post = await db.blogPost.create({
      data: {
        title: body.title,
        slug,
        content: body.content,
        thumbnail: body.thumbnail || null,
        publishedAt: body.publishedAt ? new Date(body.publishedAt) : null,
      },
    })
    return post
  } catch (e: any) {
    if (e?.code === 'P2021') throw createError({ statusCode: 503, message: 'Database is not initialized yet. Please run: bun run db:push' })
    throw e
  }
})
