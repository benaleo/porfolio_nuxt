<template>
  <div class="h-full">
    <NuxtLink :to="{ name: 'projects-id', params: { id: project.id } }" class="group relative block h-full">
    <span
      v-if="project.highlight"
      class="absolute top-3 left-3 z-10 inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-gradient-to-r from-amber-400 to-orange-500 text-xs font-semibold text-slate-900 shadow-lg shadow-orange-500/30"
    >
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="size-3">
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.957a1 1 0 00.95.69h4.162c.969 0 1.371 1.24.588 1.81l-3.37 2.448a1 1 0 00-.364 1.118l1.287 3.957c.3.921-.755 1.688-1.54 1.118l-3.37-2.448a1 1 0 00-1.175 0l-3.37 2.448c-.784.57-1.838-.197-1.539-1.118l1.287-3.957a1 1 0 00-.364-1.118L2.05 9.384c-.783-.57-.38-1.81.588-1.81h4.162a1 1 0 00.95-.69l1.286-3.957z"/>
      </svg>
      Highlight
    </span>
    <div class="aspect-[16/9] bg-slate-800 overflow-hidden">
      <img v-if="project.image" :src="project.image" :alt="project.title" class="w-full h-full object-cover group-hover:scale-[1.03] transition" />
      <div v-else class="w-full h-full grid place-items-center text-slate-400">No Image</div>
    </div>
    <div class="p-4 flex flex-col justify-between gap-3 h-48">
      <div>
        <div class="flex items-center justify-between gap-3">
        <h3 class="font-semibold text-slate-100">{{ project.title }}</h3>
        <span v-if="project.category" class="text-xs px-2 py-0.5 rounded-full bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-300">{{ project.category }}</span>
      </div>
      <p class="mt-2 text-sm text-slate-200" v-html="truncated"></p>
      </div>
      <div v-if="project.tags?.length" class="mt-3 flex flex-wrap gap-2">
        <span v-for="t in project.tags" :key="t" class="text-xs px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">#{{ t }}</span>
      </div>
    </div>
  </NuxtLink>
  </div>
</template>

<script setup lang="ts">
export interface Project {
  id: number
  title: string
  description: string
  image?: string | null
  category?: 'Backend' | 'Frontend' | 'Fullstack' | 'Other' | string
  tags?: string[]
  highlight?: boolean
}

const props = defineProps<{ project: Project }>()
const truncated = computed(() =>
  props.project.description.length > 100 ? props.project.description.slice(0, 100) + '…' : props.project.description,
)
</script>
