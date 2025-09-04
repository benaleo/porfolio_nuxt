<template>
  <section v-if="education.length > 0" class="py-20">
    <div class="mx-auto max-w-5xl px-4">
      <h2 class="text-2xl sm:text-3xl font-bold">Study</h2>
      <div class="mt-8 relative">
        <div class="absolute left-4 top-0 bottom-0 w-px bg-slate-200 dark:bg-slate-800" />
        <ClientOnly>
          <div class="space-y-8">
            <div v-for="(e, i) in education" :key="i" class="relative pl-10" v-motion :initial="{ opacity: 0, x: -20 }" :enter="{ opacity: 1, x: 0 }">
              <div class="absolute left-3 top-1 size-3 rounded-full bg-blue-600 shadow-[0_0_0_3px] shadow-blue-600/20" />
              <div class="text-sm text-slate-500">{{ e.year }}</div>
              <div class="font-semibold">{{ e.university }}</div>
              <div class="text-slate-600 dark:text-slate-300">{{ e.major }}</div>
            </div>
          </div>
        </ClientOnly>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
type DbEducation = { id: number; year: string; institution: string; major: string; summary?: string | null }
type EducationResponse = { items: DbEducation[]; total: number; take: number; skip: number }
const { data: eduRaw } = await useAsyncData('education-list', () => $fetch<EducationResponse>('/api/education'))
// Map DB fields to UI shape expected by the template
const education = computed(() => (eduRaw.value?.items || []).map((e) => ({ year: e.year, university: e.institution, major: e.major })))
</script>
