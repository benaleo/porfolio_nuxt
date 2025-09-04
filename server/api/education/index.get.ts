import { db } from '../../utils/prisma'

export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event)
    const take = Math.min(parseInt(String(query.take || '100')), 500) || 100
    const skip = parseInt(String(query.skip || '0')) || 0

    const [items, total] = await Promise.all([
      db.education.findMany({
        orderBy: { year: 'desc' },
        take,
        skip,
      }),
      db.education.count(),
    ])

    return { items, total, take, skip }
  } catch (e: any) {
    if (e?.code === 'P2021') return { items: [], total: 0, take: 0, skip: 0 }
    throw e
  }
})
