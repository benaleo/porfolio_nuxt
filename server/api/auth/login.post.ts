import { setSession } from '../../utils/auth'

export default defineEventHandler(async (event) => {
  const body = await readBody<{ username: string; password: string }>(event)
  if (!body?.username || !body?.password) {
    throw createError({ statusCode: 400, message: 'Username and password required' })
  }
  const cfg = useRuntimeConfig()
  const adminUser = (cfg as any).auth?.adminUsername || process.env.ADMIN_USERNAME
  const adminPass = (cfg as any).auth?.adminPassword || process.env.ADMIN_PASSWORD
  if (body.username !== adminUser || body.password !== adminPass) {
    throw createError({ statusCode: 401, message: 'Invalid credentials' })
  }
  await setSession(event, { sub: 'admin', username: adminUser })
  return { ok: true }
})
