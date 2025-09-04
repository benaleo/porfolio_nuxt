export default defineEventHandler(async (event) => {
  const { db } = await import('../../utils/prisma')

  const query = getQuery(event)
  const take = Math.min(parseInt(String(query.take || '100')), 500) || 100
  const skip = parseInt(String(query.skip || '0')) || 0

  const items = await db.logTrafic.findMany({
    orderBy: { createdAt: 'desc' },
    take,
    skip,
  })
  return items
})
