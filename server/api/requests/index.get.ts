export default defineEventHandler(async () => {
  const { db } = await import('../../utils/prisma')
  const items = await db.requestContact.findMany({
    orderBy: { createdAt: 'desc' },
  })
  return items
});
