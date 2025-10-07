import { db } from '../../utils/prisma'
import { requireAuth } from '../../utils/auth'
import { readMultipartFormData } from 'h3'
import { extname } from 'node:path'
import { uploadBufferToR2 } from '../../utils/r2'

export default defineEventHandler(async (event) => {
  await requireAuth(event)
  const contentType = getHeader(event, 'content-type') || ''
  let payload: { title: string; description: string; category: 'Backend' | 'Frontend' | 'Fullstack' | 'Other'; image?: string | null; tags?: string[] }

  if (contentType.includes('multipart/form-data')) {
    const form = await readMultipartFormData(event)
    if (!form) throw createError({ statusCode: 400, message: 'multipart/form-data required' })
    const getField = (name: string) => form.find((p) => !p.type && p.name === name)?.data?.toString('utf8') || ''
    const title = getField('title')
    const description = getField('description')
    const category = getField('category') as any
    let tags: string[] | undefined
    const tagsRaw = getField('tags')
    if (tagsRaw) {
      try { tags = JSON.parse(tagsRaw) } catch { tags = tagsRaw.split(',').map((t) => t.trim()).filter(Boolean) }
    }

    let image: string | null | undefined = undefined
    const file = form.find((p) => p.type && (p.name === 'image' || p.name === 'file'))
    if (file && file.filename && file.data) {
      const ts = Date.now()
      const safeName = file.filename.replace(/[^a-z0-9_.-]/gi, '_')
      const ext = extname(safeName) || ''
      const key = `portfolio/project_${ts}_${Math.random().toString(36).slice(2, 8)}${ext}`
      const contentType = file.type || undefined
      const buffer = Buffer.from(file.data)
      image = await uploadBufferToR2({ key, buffer, contentType })
    }

    payload = { title, description, category, image: image ?? null, tags }
  } else {
    const body = await readBody<{ title: string; description: string; category: 'Backend' | 'Frontend' | 'Fullstack' | 'Other'; image?: string | null; tags?: string[] }>(event)
    if (!body?.title || !body?.description || !body?.category) throw createError({ statusCode: 400, message: 'Missing fields' })
    payload = body
  }
  if (!payload?.title || !payload?.description || !payload?.category) throw createError({ statusCode: 400, message: 'Missing fields' })
  try {
    const proj = await db.project.create({
      data: {
        title: payload.title,
        description: payload.description,
        category: payload.category as any,
        image: payload.image || null,
        tags: payload.tags || [],
      },
    })
    return proj
  } catch (e: any) {
    if (e?.code === 'P2021') throw createError({ statusCode: 503, message: 'Database is not initialized yet. Please run: bun run db:push' })
    throw e
  }
})
