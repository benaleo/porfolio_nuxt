import { navigateTo, useRequestHeaders } from 'nuxt/app'
export default defineNuxtRouteMiddleware(async (to) => {
  // Skip protection for login
  if (to.path === '/console/login') return
  try {
    await $fetch('/api/auth/me', {
      credentials: 'include',
      headers: process.server ? (useRequestHeaders(['cookie']) as any) : undefined,
    })
  } catch (e) {
    return navigateTo('/console/login')
  }
})
