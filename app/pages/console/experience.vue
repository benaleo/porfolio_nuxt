<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-semibold">Experience</h1>
        <p class="text-sm text-slate-500">Create and manage your work experiences</p>
      </div>
      <button @click="startCreate" class="rounded bg-blue-600 text-white px-4 py-2 hover:bg-blue-700">New Experience</button>
    </div>

    <div class="grid gap-6 lg:grid-cols-[1fr_420px]">
      <!-- List -->
      <div class="rounded-xl border border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 overflow-x-auto">
        <table class="min-w-full text-sm">
          <thead>
            <tr class="text-left border-b border-slate-200/70 dark:border-slate-800">
              <th class="px-4 py-2">Period</th>
              <th class="px-4 py-2">Position</th>
              <th class="px-4 py-2">Company</th>
              <th class="px-4 py-2">Created</th>
              <th class="px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="e in paginated" :key="e.id" class="border-b border-slate-200/70 dark:border-slate-800">
              <td class="px-4 py-2 font-medium">{{ e.startYear }} - {{ e.endYear || 'Present' }}</td>
              <td class="px-4 py-2">{{ e.position }}</td>
              <td class="px-4 py-2 text-slate-500">{{ e.company }}</td>
              <td class="px-4 py-2 text-slate-500">{{ format(e.createdAt) }}</td>
              <td class="px-4 py-2">
                <div class="flex items-center gap-2">
                  <button class="px-2 py-1 rounded border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800" @click="startEdit(e)">Edit</button>
                  <button class="px-2 py-1 rounded border border-red-300 text-red-700 hover:bg-red-50" @click="onDelete(e)">Delete</button>
                </div>
              </td>
            </tr>
            <tr v-if="(experience || []).length === 0">
              <td colspan="5" class="px-4 py-6 text-center text-slate-500">No experience records yet</td>
            </tr>
          </tbody>
        </table>
        <!-- Pagination -->
        <div class="flex items-center justify-between px-4 py-3">
          <div class="text-sm text-slate-600">Page {{ page }} of {{ totalPages }}</div>
          <div class="flex items-center gap-2">
            <button class="px-3 py-1 rounded border border-slate-300 dark:border-slate-700 disabled:opacity-50" :disabled="page === 1" @click="prevPage">Prev</button>
            <select v-model.number="pageSize" class="px-2 py-1 rounded border border-slate-300 dark:border-slate-700">
              <option :value="5">5</option>
              <option :value="10">10</option>
              <option :value="20">20</option>
            </select>
            <button class="px-3 py-1 rounded border border-slate-300 dark:border-slate-700 disabled:opacity-50" :disabled="page === totalPages" @click="nextPage">Next</button>
          </div>
        </div>
      </div>

      <!-- Editor -->
      <form v-if="editing" class="rounded-xl border border-slate-200 dark:border-slate-800 p-4 bg-white/80 dark:bg-slate-900/80 space-y-3" @submit.prevent="onSave">
        <div class="text-sm font-medium">{{ form.id ? 'Edit Experience' : 'New Experience' }}</div>
        <div class="grid sm:grid-cols-2 gap-3">
          <div>
            <label class="block text-sm mb-1">Start Year</label>
            <input v-model.number="form.startYear" type="number" class="w-full rounded border border-slate-300 dark:border-slate-700 bg-transparent px-3 py-2 outline-none" required />
          </div>
          <div>
            <label class="block text-sm mb-1">End Year (optional)</label>
            <input v-model.number="form.endYear" type="number" class="w-full rounded border border-slate-300 dark:border-slate-700 bg-transparent px-3 py-2 outline-none" />
          </div>
        </div>
        <div>
          <label class="block text-sm mb-1">Position</label>
          <input v-model="form.position" type="text" class="w-full rounded border border-slate-300 dark:border-slate-700 bg-transparent px-3 py-2 outline-none" required />
        </div>
        <div>
          <label class="block text-sm mb-1">Company</label>
          <input v-model="form.company" type="text" class="w-full rounded border border-slate-300 dark:border-slate-700 bg-transparent px-3 py-2 outline-none" required />
        </div>
        <div>
          <label class="block text-sm mb-1">Summary (optional)</label>
          <textarea v-model="form.summary" rows="5" class="w-full rounded border border-slate-300 dark:border-slate-700 bg-transparent px-3 py-2 outline-none"></textarea>
        </div>
        <div class="flex items-center gap-2 pt-2">
          <button :disabled="saving" class="rounded bg-blue-600 text-white px-4 py-2 hover:bg-blue-700 disabled:opacity-60">{{ saving ? 'Saving…' : 'Save' }}</button>
          <button type="button" class="rounded border border-slate-300 dark:border-slate-700 px-4 py-2 hover:bg-slate-100 dark:hover:bg-slate-800" @click="cancelEdit">Cancel</button>
          <span v-if="error" class="text-sm text-red-600">{{ error }}</span>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import admin from '../../../middleware/admin'

definePageMeta({ layout: 'console', middleware: [admin] })

type Experience = {
  id: number
  startYear: number
  endYear?: number | null
  position: string
  company: string
  summary?: string | null
  createdAt: string
}

const { data: experience, refresh } = await useAsyncData('experience-list', () => $fetch<Experience[]>('/api/experience'))

const page = ref(1)
const pageSize = ref(10)
const totalPages = computed(() => {
  const total = (experience.value || []).length
  return Math.max(1, Math.ceil(total / pageSize.value))
})
const paginated = computed(() => {
  const list = experience.value || []
  const start = (page.value - 1) * pageSize.value
  return list.slice(start, start + pageSize.value)
})
watch([experience, pageSize], () => { page.value = 1 })
const prevPage = () => { if (page.value > 1) page.value-- }
const nextPage = () => { if (page.value < totalPages.value) page.value++ }

const editing = ref(false)
const saving = ref(false)
const error = ref('')

const form = reactive<{ id?: number; startYear: number; endYear?: number | null; position: string; company: string; summary?: string | null }>(
  { startYear: new Date().getFullYear(), endYear: null, position: '', company: '', summary: '' },
)

const startCreate = () => {
  editing.value = true
  Object.assign(form, { id: undefined, startYear: new Date().getFullYear(), endYear: null, position: '', company: '', summary: '' })
}

const startEdit = (e: Experience) => {
  editing.value = true
  Object.assign(form, { id: e.id, startYear: e.startYear, endYear: e.endYear || null, position: e.position, company: e.company, summary: e.summary || '' })
}

const cancelEdit = () => { editing.value = false }

const onSave = async () => {
  error.value = ''
  saving.value = true
  try {
    if (!form.id) {
      await $fetch('/api/experience', { method: 'POST', credentials: 'include', body: form })
    } else {
      await $fetch(`/api/experience/${form.id}`, { method: 'PATCH', credentials: 'include', body: form })
    }
    await refresh()
    editing.value = false
  } catch (e: any) {
    error.value = e?.data?.message || 'Failed to save'
  } finally {
    saving.value = false
  }
}

const onDelete = async (e: Experience) => {
  if (!confirm(`Delete ${e.position} at ${e.company}?`)) return
  try {
    await $fetch(`/api/experience/${e.id}`, { method: 'DELETE', credentials: 'include' })
    await refresh()
  } catch (err: any) {
    error.value = err?.data?.message || 'Failed to delete'
  }
}

const format = (s?: string | null) => (s ? new Date(s).toLocaleDateString() : '')
</script>
