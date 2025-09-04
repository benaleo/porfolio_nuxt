export default defineEventHandler(async (event) => {
  const { db } = await import('../../utils/prisma')

  const query = getQuery(event)
  const period = String(query.period || 'today')
  const take = Math.min(parseInt(String(query.take || '5')), 50) || 5

  const now = new Date()
  let start: Date
  if (period === 'month') {
    start = new Date(now.getFullYear(), now.getMonth(), 1)
  } else {
    // default to today
    start = new Date(now)
    start.setHours(0, 0, 0, 0)
  }

  const results = await db.logTrafic.groupBy({
    by: ['url'],
    where: { createdAt: { gte: start } },
    _count: { url: true },
    orderBy: { _count: { url: 'desc' } },
    take,
  })

  type Grouped = { url: string; _count: { url: number } }
  return (results as Grouped[]).map((r: Grouped) => ({ url: r.url, count: r._count.url }))
})
