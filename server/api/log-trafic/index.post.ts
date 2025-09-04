export default defineEventHandler(async (event) => {
  const body = await readBody<{
    browser?: string
    os?: string
    country?: string | null
    ip?: string | null
    url?: string
  }>(event)

  const { db } = await import('../../utils/prisma')

  try {
    const headers = (event as any).node?.req?.headers || {}
    const rawXff = headers['x-forwarded-for'] as string | undefined
    const cfIp = (headers['cf-connecting-ip'] as string | undefined) || null
    const ip = body.ip || (rawXff ? rawXff.split(',')[0].trim() : null) || cfIp
    const country = body.country || (headers['cf-ipcountry'] as string | undefined) || null

    const browser = body.browser || 'Unknown'
    const os = body.os || 'Unknown'
    const url = body.url || getRequestURL(event).href

    await db.logTrafic.create({
      data: {
        browser,
        os,
        country: country || null,
        ip: ip || null,
        url,
      },
    })

    return { ok: true }
  } catch (e: any) {
    console.error('Failed to log trafic:', e)
    const details = e?.message || e?.code || ''
    throw createError({ statusCode: 500, message: 'Failed to log trafic.' + (details ? ' ' + String(details) : '') })
  }
})
