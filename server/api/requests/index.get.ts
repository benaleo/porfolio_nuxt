export default defineEventHandler(async (event) => {
  const { db } = await import('../../utils/prisma')
  const query = getQuery(event)
  const take = Math.min(parseInt(String(query.take || '100')), 500) || 100
  const skip = parseInt(String(query.skip || '0')) || 0

  const [items, total] = await Promise.all([
    db.requestContact.findMany({
      orderBy: { createdAt: 'desc' },
      take,
      skip,
    }),
    db.requestContact.count(),
  ])

  return { items, total, take, skip }
});
