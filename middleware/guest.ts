import { navigateTo, useRequestHeaders } from "nuxt/app"

export default defineNuxtRouteMiddleware(async (to) => {
  // Only applies to login
  if (to.path !== '/console/login') return
  try {
    await $fetch('/api/auth/me', {
      credentials: 'include',
      headers: process.server ? (useRequestHeaders(['cookie']) as any) : undefined,
    })
    // already logged in
    return navigateTo('/console/dashboard')
  } catch (e) {
    // not logged in, continue
  }
})
