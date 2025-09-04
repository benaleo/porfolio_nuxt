<template>
  <section class="py-20" id="contact">
    <div class="mx-auto max-w-3xl px-4">
      <h2 class="text-2xl sm:text-3xl font-bold text-center">Contact</h2>

      <form class="mt-8 space-y-4" @submit.prevent="submit">
        <div class="grid sm:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm text-slate-500">Name</label>
            <input v-model="formName" type="text" required class="mt-1 w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white/80 dark:bg-slate-900/80 px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div>
            <label class="block text-sm text-slate-500">Email</label>
            <input v-model="formEmail" type="email" required class="mt-1 w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white/80 dark:bg-slate-900/80 px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
        </div>
        <div>
          <label class="block text-sm text-slate-500">Message</label>
          <textarea v-model="formMessage" rows="4" required class="mt-1 w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white/80 dark:bg-slate-900/80 px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"></textarea>
        </div>
        <div class="flex items-center gap-3">
          <button :disabled="loading" type="submit" class="inline-flex items-center gap-2 rounded-lg bg-blue-600 text-white px-4 py-2 hover:bg-blue-700 disabled:opacity-60">
            <span v-if="loading" class="size-4 border-2 border-white/60 border-t-transparent rounded-full animate-spin" />
            <span>Send</span>
          </button>
          <p v-if="success" class="text-green-600">Thanks! Your message has been sent.</p>
          <p v-if="error" class="text-red-600">{{ error }}</p>
        </div>
      </form>

      <div class="mt-8 flex flex-wrap items-center justify-center gap-4 text-sm text-slate-600 dark:text-slate-300">
        <a :href="phoneHref" class="inline-flex items-center gap-2 hover:text-blue-600">
          <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='currentColor' class='w-4 h-4'><path d='M6.62 10.79a15.534 15.534 0 006.59 6.59l2.2-2.2a1 1 0 011.01-.24c1.12.37 2.33.57 3.58.57a1 1 0 011 1V21a1 1 0 01-1 1C10.07 22 2 13.93 2 3a1 1 0 011-1h3.5a1 1 0 011 1c0 1.25.2 2.46.57 3.58a1 1 0 01-.24 1.01l-2.2 2.2z'/></svg>
          {{ displayPhone }}
        </a>
        <span class="opacity-50">•</span>
        <a :href="waHref" target="_blank" rel="noopener" class="inline-flex items-center gap-2 hover:text-green-600">
          <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='currentColor' class='w-4 h-4'><path d='M20.52 3.48A11.9 11.9 0 0012.04 0C5.46 0 .1 5.35.1 11.94c0 2.1.55 4.15 1.62 5.97L0 24l6.24-1.64a11.9 11.9 0 005.8 1.5h.01c6.58 0 11.94-5.35 11.94-11.94 0-3.19-1.24-6.19-3.47-8.44zM12.04 21.5h-.01a9.6 9.6 0 01-4.9-1.34l-.35-.2-3.7.97.99-3.6-.23-.37a9.5 9.5 0 01-1.46-5.02c0-5.26 4.28-9.54 9.55-9.54 2.55 0 4.95.99 6.76 2.8a9.53 9.53 0 012.8 6.74c0 5.26-4.28 9.53-9.55 9.53zm5.5-7.2c-.3-.15-1.78-.88-2.06-.98-.28-.1-.48-.15-.68.15-.2.28-.78.98-.95 1.18-.18.2-.35.22-.65.08-.3-.15-1.26-.46-2.4-1.47a8.83 8.83 0 01-1.63-2.01c-.17-.3-.02-.46.13-.61.14-.14.3-.35.45-.53.15-.18.2-.3.3-.5.1-.2.05-.38-.03-.53-.08-.15-.68-1.64-.93-2.25-.24-.58-.48-.5-.68-.5-.18-.01-.38-.01-.58-.01-.2 0-.53.08-.8.38-.28.3-1.06 1.03-1.06 2.51s1.09 2.91 1.24 3.11c.15.2 2.14 3.26 5.18 4.57.72.31 1.27.49 1.71.62.72.23 1.38.2 1.9.12.58-.09 1.78-.73 2.03-1.44.25-.71.25-1.32.17-1.44-.08-.12-.28-.2-.58-.35z'/></svg>
          WhatsApp
        </a>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
const props = defineProps<{ email?: string | null; phone?: string | null }>()
const formName = ref('')
const formEmail = ref('')
const formMessage = ref('')
const loading = ref(false)
const success = ref(false)
const error = ref('')

const submit = async () => {
  error.value = ''
  success.value = false
  loading.value = true
  try {
    await $fetch('/api/contact', { method: 'POST', body: { name: formName.value, email: formEmail.value, message: formMessage.value } })
    success.value = true
    formName.value = ''
    formEmail.value = ''
    formMessage.value = ''
  } catch (e: any) {
    error.value = e?.data?.message || 'Failed to send message.'
  } finally {
    loading.value = false
  }
}

const phoneHref = computed(() => props.phone ? `tel:${props.phone}` : '#')
const displayPhone = computed(() => props.phone || 'N/A')
const waHref = computed(() => props.phone ? `https://api.whatsapp.com/send?phone=${props.phone.replace(/\D/g, '')}` : '#')
</script>
