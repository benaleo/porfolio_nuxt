<template>
  <div class="h-full">
    <NuxtLink :to="`/projects/${project.id}`" class="group relative block h-full">
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
}

const props = defineProps<{ project: Project }>()
const truncated = computed(() =>
  props.project.description.length > 100 ? props.project.description.slice(0, 100) + '…' : props.project.description,
)
</script>
