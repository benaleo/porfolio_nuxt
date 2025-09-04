export default defineEventHandler(async (event) => {
  const body = await readBody<{ name: string; email: string; message: string }>(event)
  if (!body?.name || !body?.email || !body?.message) {
    throw createError({ statusCode: 400, message: 'Name, email, and message are required.' })
  }

  const cfg = useRuntimeConfig()
  const endpoint = cfg.contact?.formspreeEndpoint as string
  if (!endpoint) {
    throw createError({ statusCode: 501, message: 'Form endpoint not configured. Set FORMSPREE_ENDPOINT env variable.' })
  }

  const payload = {
    name: body.name,
    email: body.email,
    message: body.message,
  }

  const res = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify(payload),
  })

  if (!res.ok) {
    const txt = await res.text()
    throw createError({ statusCode: 502, message: 'Failed to send message via Formspree: ' + txt.slice(0, 200) })
  }

  return { ok: true }
})
