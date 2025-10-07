import { readMultipartFormData, sendError } from 'h3'
import { extname } from 'node:path'
import { uploadBufferToR2, r2PublicUrl } from '../utils/r2'

export default defineEventHandler(async (event) => {
  const form = await readMultipartFormData(event)
  if (!form) throw createError({ statusCode: 400, message: 'multipart/form-data required' })
  const file = form.find((p) => p.type && p.name === 'file')
  if (!file || !file.filename || !file.data) throw createError({ statusCode: 400, message: 'file field required' })

  const ts = Date.now()
  const safeName = file.filename.replace(/[^a-z0-9_.-]/gi, '_')
  const ext = extname(safeName) || ''
  const key = `portfolio/${ts}_${Math.random().toString(36).slice(2, 8)}${ext}`
  const contentType = file.type || undefined
  const buffer = Buffer.from(file.data)

  try {
    const url = await uploadBufferToR2({ key, buffer, contentType })
    return { url }
  } catch (e: any) {
    throw createError({ statusCode: 500, message: e?.message || 'Failed to upload to storage' })
  }
})
