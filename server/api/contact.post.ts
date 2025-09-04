export default defineEventHandler(async (event) => {
  const body = await readBody<{ name: string; email: string; message: string }>(event)
  if (!body?.name || !body?.email || !body?.message) {
    throw createError({ statusCode: 400, message: 'Name, email, and message are required.' })
  }

  // Save to DB
  const { db } = await import('../utils/prisma')
  try {
    await db.requestContact.create({ data: { name: body.name, email: body.email, message: body.message } })
  } catch (e: any) {
    // Log and continue to avoid blocking client; surface as 500 if needed
    console.error('Failed to save contact request:', e)
    const details = e?.message || e?.code || ''
    throw createError({ statusCode: 500, message: 'Failed to save contact request.' + (details ? ' ' + String(details) : '') })
  }

  // Optionally forward to Formspree if configured
  const cfg = useRuntimeConfig()
  const endpoint = (cfg.contact?.formspreeEndpoint as string) || ''
  if (endpoint) {
    try {
      const payload = { name: body.name, email: body.email, message: body.message }
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(payload),
      })
      if (!res.ok) {
        const txt = await res.text()
        console.warn('Formspree forward failed:', txt.slice(0, 200))
      }
    } catch (e) {
      console.warn('Formspree forward error:', e)
    }
  }

  return { ok: true }
})
