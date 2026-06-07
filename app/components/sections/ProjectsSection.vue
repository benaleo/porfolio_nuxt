<template>
  <section class="py-20 text-slate-100">
    <div class="mx-auto max-w-6xl px-4">
      <div class="flex items-center justify-between flex-wrap gap-3">
        <h2 class="text-2xl sm:text-3xl font-bold">Projects</h2>
        <div class="flex items-center gap-2 text-sm">
          <button
            v-for="cat in ['All', ...categories]"
            :key="cat"
            @click="selected = cat; resetVisible()"
            class="px-3 py-1 rounded-full border border-slate-700 hover:bg-slate-100 text-white hover:text-slate-700 transition"
            :class="{ 'bg-blue-600 text-white border-blue-600': selected === cat }"
          >
            {{ cat }}
          </button>
        </div>
      </div>

      <ClientOnly>
        <div v-if="pending" class="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <div v-for="i in 3" :key="i" class="rounded-xl overflow-hidden border border-slate-700">
            <Skeleton class="aspect-[16/9] w-full rounded-none" />
            <div class="p-4 space-y-3">
              <Skeleton class="h-4 w-3/4" />
              <Skeleton class="h-3 w-full" />
              <Skeleton class="h-3 w-5/6" />
            </div>
          </div>
        </div>
        <div v-else class="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <div class="rounded-xl card-blue-neon" :style="{ padding: '0' }" v-for="p in displayed" :key="p.id" v-motion :initial="{ opacity: 0, y: 20 }" :enter="{ opacity: 1, y: 0, transition: { duration: 400 } }">
            <ProjectCard :project="p" />
          </div>
        </div>

        <!-- Load more: mobile threshold 3, desktop 6 -->
        <div class="mt-6 flex justify-center">
          <button
            v-if="filtered.length > visibleCount"
            class="btn btn-primary cursor-pointer hover:border-2 hover:rounded-2xl hover:border-white px-6 py-2"
            @click="onLoadMore"
          >
            Load More
          </button>
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
  highlight?: boolean
}

const selected = ref<'All' | string>('All')

type ProjectsResponse = { items: Project[]; total: number; take: number; skip: number }
const { data: projects, pending } = useAsyncData('projects-list', () =>
  $fetch<ProjectsResponse>('/api/projects'),
  { server: false, lazy: true, getCachedData: () => undefined },
)

const { setVisible } = useNavVisibility()
watch(pending, (isPending) => { if (!isPending) setVisible('projects', (projects.value?.items || []).length > 0) })

const categories = computed(() =>
  Array.from(new Set((projects.value?.items || []).map((p) => p.category)))
)

const filtered = computed(() => {
  const list = projects.value?.items || []
  const scoped = selected.value === 'All' ? [...list] : list.filter((p) => p.category === selected.value)
  return scoped.sort((a, b) => Number(b.highlight ?? false) - Number(a.highlight ?? false))
})

// Responsive Load More logic
const isDesktop = ref(typeof window !== 'undefined' ? window.matchMedia('(min-width: 1024px)').matches : false)
const visibleCount = ref(0)

function baseChunk() {
  return isDesktop.value ? 3 : 3
}

function resetVisible() {
  const base = baseChunk()
  visibleCount.value = Math.min(base, filtered.value.length)
}

const displayed = computed(() => {
  return filtered.value.slice(0, visibleCount.value)
})

function onLoadMore() {
  // If already showing at least 6 items, go to the full projects page
  if (visibleCount.value >= 6 && filtered.value.length > visibleCount.value) {
    navigateTo('/projects')
    return
  }
  const inc = baseChunk()
  visibleCount.value = Math.min(filtered.value.length, visibleCount.value + inc)
}

onMounted(() => {
  const mq = window.matchMedia('(min-width: 1024px)')
  const apply = () => {
    isDesktop.value = mq.matches
    const base = baseChunk()
    visibleCount.value = Math.min(base, filtered.value.length)
  }
  apply()
  mq.addEventListener?.('change', apply)
  // Fallback for older browsers
  // @ts-ignore
  mq.addListener && mq.addListener(apply)
})

// Initialize visibleCount once data arrives from the lazy fetch
watch(
  () => filtered.value.length,
  (len) => {
    if (visibleCount.value === 0 && len > 0) {
      visibleCount.value = Math.min(baseChunk(), len)
    }
  },
)

onBeforeUnmount(() => {
  const mq = window.matchMedia('(min-width: 1024px)')
  const apply = () => {}
  mq.removeEventListener?.('change', apply)
  // @ts-ignore
  mq.removeListener && mq.removeListener(apply)
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
