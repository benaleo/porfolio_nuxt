<template>
  <ClientOnly>
  <div class="mx-auto max-w-3xl px-4 py-16">
    <NuxtLink to="/" class="text-sm text-blue-600">← Back to Home</NuxtLink>
    <div v-if="pending" class="mt-4 space-y-4">
      <Skeleton class="h-10 w-3/4" />
      <Skeleton class="h-4 w-24" />
      <Skeleton class="aspect-[16/9] w-full rounded-xl" />
      <Skeleton class="h-4 w-full" />
      <Skeleton class="h-4 w-11/12" />
      <Skeleton class="h-4 w-5/6" />
    </div>
    <div v-else-if="project" class="mt-4">
      <div class="flex items-center gap-3 flex-wrap">
        <h1 class="text-3xl font-bold text-slate-100">{{ project?.title }}</h1>
        <span
          v-if="project?.highlight"
          class="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-gradient-to-r from-amber-400 to-orange-500 text-xs font-semibold text-slate-900 shadow-lg shadow-orange-500/30"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="size-3">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.957a1 1 0 00.95.69h4.162c.969 0 1.371 1.24.588 1.81l-3.37 2.448a1 1 0 00-.364 1.118l1.287 3.957c.3.921-.755 1.688-1.54 1.118l-3.37-2.448a1 1 0 00-1.175 0l-3.37 2.448c-.784.57-1.838-.197-1.539-1.118l1.287-3.957a1 1 0 00-.364-1.118L2.05 9.384c-.783-.57-.38-1.81.588-1.81h4.162a1 1 0 00.95-.69l1.286-3.957z"/>
          </svg>
          Highlight
        </span>
      </div>
      <div class="mt-2 text-sm text-slate-200" v-if="project?.category">{{ project?.category }}</div>
      <div class="mt-6 aspect-[16/9] bg-slate-200 dark:bg-slate-800 rounded-xl overflow-hidden">
        <img v-if="project?.image" :src="project?.image" :alt="project?.title" class="w-full h-full object-cover" />
      </div>
      <p class="mt-4 text-slate-100 whitespace-pre-line prose prose-slate" v-html="project?.description"></p>
      <div v-if="project?.tags?.length" class="mt-4 flex flex-wrap gap-2">
        <span v-for="t in project?.tags" :key="t" class="text-xs px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">#{{ t }}</span>
      </div>
    </div>
  </div>
  </ClientOnly>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router'
import { showError } from '#app'
import { useLogTrafic } from '~/composables/useLogTrafic'

type Project = {
  id: number
  title: string
  description: string
  category: 'Backend' | 'Frontend' | 'Fullstack' | 'Other' | string
  image?: string | null
  tags?: string[]
  highlight?: boolean
}

const route = useRoute()
const id = route.params.id as string

const { data: project, error, pending } = useAsyncData(`project-${id}`, () => $fetch<Project>(`/api/projects/${id}`), { server: false, lazy: true, getCachedData: () => undefined })

watch(error, (e) => {
  if (e) {
    const statusCode = (e as any)?.statusCode || 404
    showError({ statusCode, statusMessage: 'Project not found' })
  }
})

// Log traffic on client mount
useLogTrafic()
</script>
