import { readMultipartFormData, sendError } from 'h3'
import { promises as fsp } from 'node:fs'
import { join, extname } from 'node:path'

export default defineEventHandler(async (event) => {
  const form = await readMultipartFormData(event)
  if (!form) throw createError({ statusCode: 400, message: 'multipart/form-data required' })
  const file = form.find((p) => p.type && p.name === 'file')
  if (!file || !file.filename || !file.data) throw createError({ statusCode: 400, message: 'file field required' })

  const uploadsDir = join(process.cwd(), 'public', 'uploads')
  await fsp.mkdir(uploadsDir, { recursive: true })
  const ts = Date.now()
  const safeName = file.filename.replace(/[^a-z0-9_.-]/gi, '_')
  const ext = extname(safeName) || ''
  const name = `${ts}_${Math.random().toString(36).slice(2, 8)}${ext}`
  const outPath = join(uploadsDir, name)
  await fsp.writeFile(outPath, file.data)

  const publicPath = `/uploads/${name}`
  return { url: publicPath }
})
