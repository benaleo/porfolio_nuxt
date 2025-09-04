<template>
  <section class="py-20">
    <div class="mx-auto max-w-5xl px-4">
      <h2 class="text-2xl sm:text-3xl font-bold">Experience</h2>
      <div class="mt-8 space-y-6">
        <div v-for="(x, i) in experiences" :key="i" class="rounded-xl border border-slate-200 dark:border-slate-800 p-4 bg-white/80 dark:bg-slate-900/80" v-motion :initial="{ opacity: 0, y: 20 }" :enter="{ opacity: 1, y: 0 }">
          <div class="flex flex-wrap items-center justify-between gap-2">
            <div class="font-semibold">{{ x.role }} <span class="text-slate-500">@ {{ x.company }}</span></div>
            <div class="text-sm text-slate-500">{{ x.period }}</div>
          </div>
          <p class="mt-2 text-slate-600 dark:text-slate-300">{{ x.description }}</p>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
type DbExperience = {
  id: number
  startYear: number
  endYear?: number | null
  position: string
  company: string
  summary?: string | null
}

const { data: expRaw } = await useAsyncData('experience-list', () => $fetch<DbExperience[]>('/api/experience'))

const experiences = computed(() =>
  (expRaw.value || []).map((x) => ({
    role: x.position,
    company: x.company,
    description: x.summary || '',
    period: `${x.startYear} - ${x.endYear ?? 'Present'}`,
  })),
)
</script>
