import { db } from '../utils/prisma'
import { requireAuth } from '../utils/auth'

export default defineEventHandler(async (event) => {
  await requireAuth(event)
  const body = await readBody<{
    name?: string
    avatar?: string | null
    bio?: string | null
    contactNumber?: string | null
    github?: string | null
    linkedin?: string | null
    email?: string | null
    impactYears?: number
    impactProjects?: number
    impactOss?: number
  }>(event)

  const data: any = { ...body }
  try {
    const updated = await db.profile.upsert({
      where: { id: 1 },
      update: data,
      create: { id: 1, name: body.name || 'Your Name', ...data },
    })
    return updated
  } catch (e: any) {
    if (e?.code === 'P2021') throw createError({ statusCode: 503, message: 'Database is not initialized yet. Please run: bun run db:push' })
    throw e
  }
})
