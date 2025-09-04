<template>
  <div class="mx-auto max-w-6xl px-4 py-10">
    <div class="flex items-center justify-between flex-wrap gap-3">
      <h1 class="text-2xl sm:text-3xl font-bold">Log Trafic</h1>
      <input
        v-model="q"
        type="text"
        placeholder="Search browser/os/country/ip/url..."
        class="w-full sm:w-96 rounded-lg border border-slate-300 dark:border-slate-700 bg-white/80 dark:bg-slate-900/80 px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>

    <div class="mt-6 overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800">
      <table class="min-w-full text-sm">
        <thead class="bg-slate-50 dark:bg-slate-800/50 text-slate-600 dark:text-slate-300">
          <tr>
            <th class="text-left px-4 py-3">#</th>
            <th class="text-left px-4 py-3">Time</th>
            <th class="text-left px-4 py-3">Browser</th>
            <th class="text-left px-4 py-3">OS</th>
            <th class="text-left px-4 py-3">Country</th>
            <th class="text-left px-4 py-3">IP</th>
            <th class="text-left px-4 py-3">URL</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(row, i) in paged" :key="row.id" class="border-t border-slate-200 dark:border-slate-800">
            <td class="px-4 py-3">{{ skip + i + 1 }}</td>
            <td class="px-4 py-3">{{ format(row.createdAt) }}</td>
            <td class="px-4 py-3">{{ row.browser }}</td>
            <td class="px-4 py-3">{{ row.os }}</td>
            <td class="px-4 py-3">{{ row.country || '-' }}</td>
            <td class="px-4 py-3">{{ row.ip || '-' }}</td>
            <td class="px-4 py-3 break-all"><a :href="row.url" target="_blank" rel="noopener" class="text-blue-600 hover:underline">{{ row.url }}</a></td>
          </tr>
          <tr v-if="!paged.length">
            <td class="px-4 py-8 text-center text-slate-500" colspan="7">No data</td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="mt-4 flex items-center justify-between gap-3 flex-wrap">
      <div class="text-sm text-slate-500">Total: {{ total }}</div>
      <div class="flex items-center gap-3">
        <label class="text-sm text-slate-600 dark:text-slate-300 flex items-center gap-2">
          Tampilkan
          <select v-model.number="pageSize" class="px-2 py-1 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900">
            <option :value="10">10</option>
            <option :value="25">25</option>
            <option :value="50">50</option>
            <option :value="100">100</option>
          </select>
          data per halaman
        </label>
        <div class="flex items-center gap-2">
          <button @click="prev" :disabled="page === 1" class="px-3 py-1 rounded border border-slate-300 dark:border-slate-700 disabled:opacity-50">Prev</button>
          <span class="text-sm">Page {{ page }} / {{ totalPages }}</span>
          <button @click="next" :disabled="page === totalPages" class="px-3 py-1 rounded border border-slate-300 dark:border-slate-700 disabled:opacity-50">Next</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
type LogTrafic = {
  id: number
  browser: string
  os: string
  country?: string | null
  ip?: string | null
  url: string
  createdAt: string | Date
}

type LogTraficApi = {
  items: LogTrafic[]
  total: number
  take: number
  skip: number
}

const q = ref('')
const page = ref(1)
const pageSize = ref(10)

const { data, refresh, error } = await useAsyncData(
  () => `log-trafic-${page.value}-${pageSize.value}`,
  () => $fetch<LogTraficApi>('/api/log-trafic', { params: { take: pageSize.value, skip: (page.value - 1) * pageSize.value } }),
  { watch: [page, pageSize] }
)

const items = computed(() => data.value?.items || [])
const total = computed(() => data.value?.total || 0)
const skip = computed(() => data.value?.skip || 0)

const filtered = computed(() => {
  const list = items.value || []
  if (!q.value) return list
  const s = q.value.toLowerCase()
  return list.filter(r =>
    (r.browser || '').toLowerCase().includes(s) ||
    (r.os || '').toLowerCase().includes(s) ||
    (r.country || '').toLowerCase().includes(s) ||
    (r.ip || '').toLowerCase().includes(s) ||
    (r.url || '').toLowerCase().includes(s)
  )
})

const totalPages = computed(() => Math.max(1, Math.ceil(total.value / pageSize.value)))
const paged = computed(() => filtered.value)

watch(q, () => { page.value = 1 })
watch(pageSize, () => { page.value = 1 })

const prev = () => { if (page.value > 1) page.value-- }
const next = () => { if (page.value < totalPages.value) page.value++ }

const format = (d: string | Date) => new Date(d).toLocaleString()

definePageMeta({
  layout: 'console'
})
</script>
