<template>
  <div class="mx-auto max-w-6xl px-4 py-10">
    <div class="flex items-center justify-between flex-wrap gap-3">
      <h1 class="text-2xl sm:text-3xl font-bold">Contact Requests</h1>
      <input
        v-model="q"
        type="text"
        placeholder="Search name/email/message..."
        class="w-full sm:w-80 rounded-lg border border-slate-300 dark:border-slate-700 bg-white/80 dark:bg-slate-900/80 px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>

    <div class="mt-6 overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800">
      <table class="min-w-full text-sm">
        <thead class="bg-slate-50 dark:bg-slate-800/50 text-slate-600 dark:text-slate-300">
          <tr>
            <th class="text-left px-4 py-3">#</th>
            <th class="text-left px-4 py-3">Name</th>
            <th class="text-left px-4 py-3">Email</th>
            <th class="text-left px-4 py-3">Message</th>
            <th class="text-left px-4 py-3">Created At</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(row, i) in filtered" :key="row.id" class="border-t border-slate-200 dark:border-slate-800">
            <td class="px-4 py-3">{{ (page - 1) * pageSize + i + 1 }}</td>
            <td class="px-4 py-3 font-medium">{{ row.name }}</td>
            <td class="px-4 py-3">
              <a :href="`mailto:${row.email}`" class="text-blue-600 hover:underline">{{ row.email }}</a>
            </td>
            <td class="px-4 py-3 whitespace-pre-wrap">{{ row.message }}</td>
            <td class="px-4 py-3">{{ format(row.createdAt) }}</td>
          </tr>
          <tr v-if="!filtered.length">
            <td class="px-4 py-8 text-center text-slate-500" colspan="5">No data</td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="mt-4 flex items-center justify-between">
      <div class="text-sm text-slate-500">Total: {{ total }}</div>
      <div class="flex items-center gap-2">
        <button @click="prev" :disabled="page === 1" class="px-3 py-1 rounded border border-slate-300 dark:border-slate-700 disabled:opacity-50">Prev</button>
        <span class="text-sm">Page {{ page }} / {{ totalPages }}</span>
        <button @click="next" :disabled="page === totalPages" class="px-3 py-1 rounded border border-slate-300 dark:border-slate-700 disabled:opacity-50">Next</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
type RequestContact = {
  id: number;
  name: string;
  email: string;
  message: string;
  createdAt: string;
}

type RequestsApi = { items: RequestContact[]; total: number; take: number; skip: number }

const q = ref('')
const page = ref(1)
const pageSize = ref(10)

const { data, refresh, error } = await useAsyncData(
  () => `console-requests-${page.value}-${pageSize.value}`,
  () => $fetch<RequestsApi>('/api/requests', { params: { take: pageSize.value, skip: (page.value - 1) * pageSize.value } }),
  { watch: [page, pageSize] }
)

const items = computed(() => data.value?.items || [])
const total = computed(() => data.value?.total || 0)

const filtered = computed(() => {
  const list = items.value || []
  if (!q.value) return list
  const s = q.value.toLowerCase()
  return list.filter(r =>
    r.name.toLowerCase().includes(s) ||
    r.email.toLowerCase().includes(s) ||
    r.message.toLowerCase().includes(s)
  )
})

const totalPages = computed(() => Math.max(1, Math.ceil(total.value / pageSize.value)))

watch(q, () => { page.value = 1 })

const prev = () => { if (page.value > 1) page.value-- }
const next = () => { if (page.value < totalPages.value) page.value++ }

const format = (d: string | Date) => new Date(d).toLocaleString()

definePageMeta({
  layout: 'console',
})
</script>
