<template>
  <div class="space-y-6">
    <div>
      <h1 class="text-2xl font-semibold">Profile</h1>
      <p class="text-sm text-slate-500">Manage your public profile and impact counters</p>
    </div>

    <div class="grid gap-6 lg:grid-cols-[280px_1fr]">
      <!-- Avatar -->
      <div class="rounded-xl border border-slate-200 dark:border-slate-800 p-4 bg-white/80 dark:bg-slate-900/80">
        <div class="text-sm font-medium">Avatar</div>
        <div class="mt-3">
          <div class="aspect-square w-44 rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-800">
            <img v-if="form.avatar" :src="form.avatar" alt="avatar" class="w-full h-full object-cover" />
            <div v-else class="w-full h-full grid place-items-center text-slate-400">No Image</div>
          </div>
          <div class="mt-3">
            <input type="file" accept="image/*" @change="onPickAvatar" />
            <button v-if="form.avatar" class="mt-2 text-sm text-red-600" @click="removeAvatar">Remove</button>
          </div>
        </div>
      </div>

      <!-- Form -->
      <form class="rounded-xl border border-slate-200 dark:border-slate-800 px-4 pt-4 pb-24 bg-white/80 dark:bg-slate-900/80 space-y-4" @submit.prevent="onSubmit">
        <div class="grid sm:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm mb-1">Name</label>
            <input v-model="form.name" type="text" class="w-full rounded border border-slate-300 dark:border-slate-700 bg-transparent px-3 py-2 outline-none focus:ring focus:ring-blue-200" required />
          </div>
          <div>
            <label class="block text-sm mb-1">Contact Number</label>
            <input v-model="form.contactNumber" type="text" class="w-full rounded border border-slate-300 dark:border-slate-700 bg-transparent px-3 py-2 outline-none focus:ring focus:ring-blue-200" />
          </div>
          <div>
            <label class="block text-sm mb-1">GitHub</label>
            <input v-model="form.github" type="url" placeholder="https://github.com/yourname" class="w-full rounded border border-slate-300 dark:border-slate-700 bg-transparent px-3 py-2 outline-none focus:ring focus:ring-blue-200" />
          </div>
          <div>
            <label class="block text-sm mb-1">LinkedIn</label>
            <input v-model="form.linkedin" type="url" placeholder="https://www.linkedin.com/in/yourname" class="w-full rounded border border-slate-300 dark:border-slate-700 bg-transparent px-3 py-2 outline-none focus:ring focus:ring-blue-200" />
          </div>
          <div class="sm:col-span-2">
            <label class="block text-sm mb-1">Email</label>
            <input v-model="form.email" type="email" class="form-control" />
          </div>
          <div class="sm:col-span-2">
            <label class="block text-sm mb-1">Tagline</label>
            <input v-model="form.tagline" type="text" class="form-control" />
          </div>
          <div class="sm:col-span-2">
            <label class="block text-sm mb-1">Bio</label>
            <textarea v-model="form.bio" rows="4" class="w-full rounded border border-slate-300 dark:border-slate-700 bg-transparent px-3 py-2 outline-none focus:ring focus:ring-blue-200"></textarea>
          </div>
        </div>

        <div class="pt-2">
          <div class="text-sm font-medium">Impact Counters</div>
          <div class="mt-2 grid sm:grid-cols-3 gap-4">
            <div>
              <label class="block text-sm mb-1">Years</label>
              <input v-model.number="form.impactYears" type="number" min="0" class="w-full rounded border border-slate-300 dark:border-slate-700 bg-transparent px-3 py-2 outline-none focus:ring focus:ring-blue-200" />
            </div>
            <div>
              <label class="block text-sm mb-1">Projects</label>
              <input v-model.number="form.impactProjects" type="number" min="0" class="w-full rounded border border-slate-300 dark:border-slate-700 bg-transparent px-3 py-2 outline-none focus:ring focus:ring-blue-200" />
            </div>
            <div>
              <label class="block text-sm mb-1">OSS</label>
              <input v-model.number="form.impactOss" type="number" min="0" class="w-full rounded border border-slate-300 dark:border-slate-700 bg-transparent px-3 py-2 outline-none focus:ring focus:ring-blue-200" />
            </div>
          </div>
        </div>

        <div class="flex items-center gap-3 pt-2">
          <button :disabled="saving" class="rounded bg-blue-600 text-white px-4 py-2 hover:bg-blue-700 disabled:opacity-60">{{ saving ? 'Saving…' : 'Save Changes' }}</button>
          <span v-if="saved" class="text-sm text-green-600">Saved</span>
          <span v-if="error" class="text-sm text-red-600">{{ error }}</span>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import admin from '../../../middleware/admin'

definePageMeta({ layout: 'console', middleware: [admin] })

type Profile = {
  name: string
  avatar: string | null
  bio: string | null
  tagline: string | null
  contactNumber: string | null
  github: string | null
  linkedin: string | null
  email: string | null
  impactYears: number
  impactProjects: number
  impactOss: number
}

const { data: initial } = await useAsyncData('profile', () => $fetch<Profile | null>('/api/profile', { credentials: 'include' }))

const form = reactive<Profile>({
  name: initial.value?.name || '',
  avatar: initial.value?.avatar || null,
  bio: initial.value?.bio || null,
  tagline: initial.value?.tagline || null,
  contactNumber: initial.value?.contactNumber || null,
  github: initial.value?.github || null,
  linkedin: initial.value?.linkedin || null,
  email: initial.value?.email || null,
  impactYears: initial.value?.impactYears || 0,
  impactProjects: initial.value?.impactProjects || 0,
  impactOss: initial.value?.impactOss || 0,
})

const saving = ref(false)
const saved = ref(false)
const error = ref('')

const onPickAvatar = async (e: Event) => {
  const target = e.target as HTMLInputElement
  const file = target.files?.[0]
  if (!file) return
  const fd = new FormData()
  fd.append('file', file)
  try {
    const res = await $fetch<{ url: string }>('/api/upload', { method: 'POST', body: fd })
    form.avatar = res.url
  } catch (err: any) {
    error.value = err?.data?.message || 'Upload failed'
  }
}

const removeAvatar = () => {
  form.avatar = null
}

const onSubmit = async () => {
  error.value = ''
  saving.value = true
  saved.value = false
  try {
    await $fetch('/api/profile', {
      method: 'PATCH',
      body: form,
      credentials: 'include',
    })
    saved.value = true
    setTimeout(() => (saved.value = false), 2000)
  } catch (e: any) {
    error.value = e?.data?.message || 'Failed to save'
  } finally {
    saving.value = false
  }
}
</script>
