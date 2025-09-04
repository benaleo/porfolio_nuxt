import { db } from '../../../utils/prisma'

export default defineEventHandler(async (event) => {
  const slug = getRouterParam(event, 'slug')
  if (!slug) throw createError({ statusCode: 400, message: 'invalid slug' })
  try {
    const post = await db.blogPost.findUnique({ where: { slug } })
    if (!post) throw createError({ statusCode: 404, message: 'Not found' })
    return post
  } catch (e: any) {
    if (e?.code === 'P2021') throw createError({ statusCode: 404, message: 'Not found' })
    throw e
  }
})
