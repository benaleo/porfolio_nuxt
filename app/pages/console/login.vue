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
          <div class="relative">
            <input v-model="password" :type="showPassword ? 'text' : 'password'" class="w-full rounded border border-slate-300 dark:border-slate-700 bg-transparent px-3 py-2 pr-10 outline-none focus:ring focus:ring-blue-200" required />
            <button type="button" @click="showPassword = !showPassword" class="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
              <svg v-if="showPassword" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
              </svg>
              <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            </button>
          </div>
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
const showPassword = ref(false)
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
