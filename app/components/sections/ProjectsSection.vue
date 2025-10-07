<template>
  <section class="py-20 text-slate-100">
    <div class="mx-auto max-w-6xl px-4">
      <div class="flex items-center justify-between flex-wrap gap-3">
        <h2 class="text-2xl sm:text-3xl font-bold">Projects</h2>
        <div class="flex items-center gap-2 text-sm">
          <button
            v-for="cat in ['All', ...categories]"
            :key="cat"
            @click="selected = cat"
            class="px-3 py-1 rounded-full border border-slate-700 hover:bg-slate-100 text-white hover:text-slate-700 transition"
            :class="{ 'bg-blue-600 text-white border-blue-600': selected === cat }"
          >
            {{ cat }}
          </button>
        </div>
      </div>

      <ClientOnly>
        <div class="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <div class="rounded-xl card-blue-neon" :style="{ padding: '0' }" v-for="p in filtered" :key="p.id" v-motion :initial="{ opacity: 0, y: 20 }" :enter="{ opacity: 1, y: 0, transition: { duration: 400 } }">
            <ProjectCard :project="p" />
          </div>
        </div>
      </ClientOnly>
    </div>
  </section>
</template>

<script setup lang="ts">
import ProjectCard from '~/components/ProjectCard.vue'
type Project = {
  id: number
  title: string
  description: string
  category: 'Backend' | 'Frontend' | 'Fullstack' | 'Other' | string
  image?: string | null
  tags?: string[]
}

const selected = ref<'All' | string>('All')

type ProjectsResponse = { items: Project[]; total: number; take: number; skip: number }
const { data: projects } = await useAsyncData('projects-list', () =>
  $fetch<ProjectsResponse>('/api/projects')
)

const categories = computed(() =>
  Array.from(new Set((projects.value?.items || []).map((p) => p.category)))
)

const filtered = computed(() => {
  const list = projects.value?.items || []
  return selected.value === 'All' ? list : list.filter((p) => p.category === selected.value)
})
</script>

<style scoped>
/* Minimal prose styles for rendered HTML content */
.prose :where(p) {
  margin-top: 0.75rem;
  margin-bottom: 0.75rem;
}
.prose :where(h1) { font-size: 1.5rem; font-weight: 700; margin: 1.25rem 0 0.75rem; }
.prose :where(h2) { font-size: 1.25rem; font-weight: 700; margin: 1rem 0 0.5rem; }
.prose :where(h3) { font-size: 1.125rem; font-weight: 600; margin: 0.75rem 0 0.5rem; }
.prose :where(ul) { list-style: disc; padding-left: 1.25rem; margin: 0.75rem 0; }
.prose :where(ol) { list-style: decimal; padding-left: 1.25rem; margin: 0.75rem 0; }
.prose :where(a) { color: #2563eb; text-decoration: underline; }
.prose :where(img) { border-radius: 0.5rem; max-width: 100%; height: auto; }
.dark .prose :where(a) { color: #93c5fd; }
</style>
