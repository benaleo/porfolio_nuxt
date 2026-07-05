<template>
  <section v-if="pending || experiences.length > 0" class="py-20">
    <div class="mx-auto max-w-6xl px-4">
      <h2 class="text-2xl sm:text-3xl text-white font-bold">Experience</h2>
      <ClientOnly>
        <div v-if="pending" class="mt-8 space-y-6">
          <div v-for="i in 2" :key="i" class="card-blue-neon space-y-3">
            <div class="flex justify-between gap-3">
              <Skeleton class="h-5 w-1/2" />
              <Skeleton class="h-4 w-24" />
            </div>
            <Skeleton class="h-3 w-full" />
            <Skeleton class="h-3 w-5/6" />
          </div>
        </div>
        <div v-else class="mt-8 space-y-6">
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
const { data: expRaw, pending } = useAsyncData('experience-list', () => $fetch<ExperienceResponse>('/api/experience'), { server: false, lazy: true, getCachedData: () => undefined })

const { setVisible } = useNavVisibility()
watch(pending, (isPending) => { if (!isPending) setVisible('experience', experiences.value.length > 0) })

const experiences = computed(() =>
  (expRaw.value?.items || []).map((x) => ({
    role: x.position,
    company: x.company,
    description: x.summary || '',
    period: `${x.startYear} - ${x.endYear ?? 'Present'}`,
  })),
)
</script>
