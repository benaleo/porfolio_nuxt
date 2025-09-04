import { db } from '../../utils/prisma'

export default defineEventHandler(async () => {
  try {
    const list = await db.project.findMany({ orderBy: { createdAt: 'desc' } })
    return list
  } catch (e: any) {
    if (e?.code === 'P2021') return []
    throw e
  }
})
