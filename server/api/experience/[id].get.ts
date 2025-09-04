import { db } from '../../utils/prisma'

export default defineEventHandler(async (event) => {
  const id = Number(getRouterParam(event, 'id'))
  if (!id) throw createError({ statusCode: 400, message: 'invalid id' })
  const exp = await db.experience.findUnique({ where: { id } })
  if (!exp) throw createError({ statusCode: 404, message: 'Not found' })
  return exp
})
