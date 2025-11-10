<template>
  <section class="py-16 text-slate-100">
    <div class="mx-auto max-w-6xl px-4">
      <header class="flex items-center justify-between flex-wrap gap-3">
        <h1 class="text-3xl sm:text-4xl font-bold">All Projects</h1>
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
      </header>

      <div class="mt-4">
        <input
          v-model="q"
          type="search"
          placeholder="Search projects..."
          class="w-full md:w-80 rounded-lg border border-slate-700 bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
        />
      </div>

      <div class="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <ClientOnly>
          <div
            class="rounded-xl card-blue-neon"
            :style="{ padding: '0' }"
            v-for="p in filtered"
            :key="p.id"
            v-motion
            :initial="{ opacity: 0, y: 20 }"
            :enter="{ opacity: 1, y: 0, transition: { duration: 400 } }"
          >
            <ProjectCard :project="p" />
          </div>
        </ClientOnly>
      </div>

      <div v-if="filtered.length === 0" class="mt-10 text-center text-sm text-slate-400">
        No projects found.
      </div>
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

type ProjectsResponse = { items: Project[]; total: number; take: number; skip: number }

const route = useRoute()
const selected = ref<'All' | string>((route.query.category as string) || 'All')
const q = ref('')

const { data: projects } = await useAsyncData('projects-page', () =>
  $fetch<ProjectsResponse>('/api/projects', { params: { take: 500 } })
)

const categories = computed(() =>
  Array.from(new Set((projects.value?.items || []).map((p) => p.category)))
)

const filtered = computed(() => {
  const search = q.value.trim().toLowerCase()
  const list = (projects.value?.items || []).filter((p) => {
    const inCat = selected.value === 'All' || p.category === selected.value
    if (!search) return inCat
    return (
      inCat && (
        p.title.toLowerCase().includes(search) ||
        p.description.toLowerCase().includes(search) ||
        (p.tags || []).some((t) => t.toLowerCase().includes(search))
      )
    )
  })
  return list
})
</script>
