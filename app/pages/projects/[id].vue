<template>
  <div class="mx-auto max-w-3xl px-4 py-16">
    <NuxtLink to="/" class="text-sm text-blue-600">← Back to Home</NuxtLink>
    <div v-if="project" class="mt-4">
      <h1 class="text-3xl font-bold">{{ project?.title }}</h1>
      <div class="mt-2 text-sm text-slate-500" v-if="project?.category">{{ project?.category }}</div>
      <div class="mt-6 aspect-[16/9] bg-slate-200 dark:bg-slate-800 rounded-xl overflow-hidden">
        <img v-if="project?.image" :src="project?.image" :alt="project?.title" class="w-full h-full object-cover" />
      </div>
      <p class="mt-6 text-lg text-slate-700 dark:text-slate-200 whitespace-pre-line">{{ project?.description }}</p>
      <div v-if="project?.tags?.length" class="mt-4 flex flex-wrap gap-2">
        <span v-for="t in project?.tags" :key="t" class="text-xs px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">#{{ t }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router'
import { projects, type Project } from '~/data/projects'
import { showError } from '#app'

const route = useRoute()
const id = route.params.id as string
const project = projects.find((p) => p.id === id) as Project | undefined

if (!project) {
  showError({ statusCode: 404, statusMessage: 'Project not found' })
}
</script>
