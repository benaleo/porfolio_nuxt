import { db } from '../../utils/prisma'

export default defineEventHandler(async (event) => {
  const id = Number(getRouterParam(event, 'id'))
  if (!id) throw createError({ statusCode: 400, message: 'invalid id' })
  try {
    const proj = await db.project.findUnique({ where: { id } })
    if (!proj) throw createError({ statusCode: 404, message: 'Not found' })
    return proj
  } catch (e: any) {
    if (e?.code === 'P2021') throw createError({ statusCode: 404, message: 'Not found' })
    throw e
  }
})
