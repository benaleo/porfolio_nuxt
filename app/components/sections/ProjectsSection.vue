<template>
  <section class="py-20">
    <div class="mx-auto max-w-6xl px-4">
      <div class="flex items-center justify-between flex-wrap gap-3">
        <h2 class="text-2xl sm:text-3xl font-bold">Projects</h2>
        <div class="flex items-center gap-2 text-sm">
          <button
            v-for="cat in ['All', ...categories]"
            :key="cat"
            @click="selected = cat"
            class="px-3 py-1 rounded-full border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800"
            :class="{ 'bg-blue-600 text-white border-blue-600': selected === cat }"
          >
            {{ cat }}
          </button>
        </div>
      </div>

      <div class="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <div v-for="p in filtered" :key="p.id" v-motion :initial="{ opacity: 0, y: 20 }" :enter="{ opacity: 1, y: 0, transition: { duration: 400 } }">
          <ProjectCard :project="p" />
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import ProjectCard from '~/components/ProjectCard.vue'
import { projects } from '~/data/projects'

const selected = ref<'All' | string>('All')

const categories = computed(() => Array.from(new Set(projects.map((p) => p.category))))

const filtered = computed(() =>
  selected.value === 'All' ? projects : projects.filter((p) => p.category === selected.value),
)
</script>
