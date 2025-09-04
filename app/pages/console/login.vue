<template>
  <div class="min-h-dvh grid place-items-center px-4">
    <div class="w-full max-w-sm rounded-xl border border-slate-200 dark:border-slate-800 p-6 bg-white/80 dark:bg-slate-900/80">
      <h1 class="text-xl font-semibold">Admin Login</h1>
      <p class="mt-1 text-sm text-slate-500">Masuk untuk mengelola konten.</p>

      <form class="mt-5 space-y-3" @submit.prevent="onSubmit">
        <div>
          <label class="block text-sm mb-1">Username</label>
          <input v-model="username" type="text" class="w-full rounded border border-slate-300 dark:border-slate-700 bg-transparent px-3 py-2 outline-none focus:ring focus:ring-blue-200" required />
        </div>
        <div>
          <label class="block text-sm mb-1">Password</label>
          <input v-model="password" type="password" class="w-full rounded border border-slate-300 dark:border-slate-700 bg-transparent px-3 py-2 outline-none focus:ring focus:ring-blue-200" required />
        </div>
        <button :disabled="loading" class="w-full rounded bg-blue-600 text-white px-3 py-2 hover:bg-blue-700 disabled:opacity-60">
          {{ loading ? 'Signing in…' : 'Sign in' }}
        </button>
        <p v-if="error" class="text-sm text-red-600">{{ error }}</p>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import guest from '../../../middleware/guest'
definePageMeta({ middleware: [guest] })

const username = ref('')
const password = ref('')
const error = ref('')
const loading = ref(false)

const onSubmit = async () => {
  error.value = ''
  loading.value = true
  try {
    await $fetch('/api/auth/login', {
      method: 'POST',
      body: { username: username.value, password: password.value },
      credentials: 'include',
    })
    await navigateTo('/console/dashboard')
  } catch (e: any) {
    error.value = e?.data?.message || 'Login failed'
  } finally {
    loading.value = false
  }
}
</script>
