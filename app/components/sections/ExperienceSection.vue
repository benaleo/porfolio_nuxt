<template>
  <section v-if="experiences.length > 0" class="py-20">
    <div class="mx-auto max-w-6xl px-4">
      <h2 class="text-2xl sm:text-3xl text-white font-bold">Experience</h2>
      <ClientOnly>
        <div class="mt-8 space-y-6">
          <div v-for="(x, i) in experiences" :key="i" class="group card-blue-neon" v-motion :initial="{ opacity: 0, y: 20 }" :enter="{ opacity: 1, y: 0 }">
            <div class="flex flex-wrap items-center justify-between gap-2">
              <div class="font-semibold text-white">{{ x.role }} <span class="text-slate-100">@ {{ x.company }}</span></div>
              <div class="text-sm text-slate-200">{{ x.period }}</div>
            </div>
            <div class="mt-2 text-slate-300 group-hover:text-slate-100 transition prose prose-slate" v-html="x.description">
            </div>
          </div>
        </div>
      </ClientOnly>
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

type ExperienceResponse = { items: DbExperience[]; total: number; take: number; skip: number }
const { data: expRaw } = await useAsyncData('experience-list', () => $fetch<ExperienceResponse>('/api/experience'))

const experiences = computed(() =>
  (expRaw.value?.items || []).map((x) => ({
    role: x.position,
    company: x.company,
    description: x.summary || '',
    period: `${x.startYear} - ${x.endYear ?? 'Present'}`,
  })),
)
</script>
