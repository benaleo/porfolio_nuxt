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
      <h1 class="text-3xl font-bold text-slate-100">{{ project?.title }}</h1>
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
