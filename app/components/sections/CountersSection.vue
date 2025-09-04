<template>
  <section class="py-20" id="counters">
    <div class="mx-auto max-w-6xl px-4">
      <h2 class="text-2xl sm:text-3xl font-bold text-center">Impact</h2>
      <div class="mt-10 grid grid-cols-2 sm:grid-cols-3 gap-6">
        <Counter :to="years" suffix="+">
          Years of Experience
        </Counter>
        <Counter :to="projects" suffix="+">
          Completed Projects
        </Counter>
        <Counter :to="oss" suffix="+">
          OSS Contributions
        </Counter>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import Counter from '~/components/Counter.vue'
type Profile = { impactYears: number; impactProjects: number; impactOss: number }
const { data: profile } = await useAsyncData('profile', () => $fetch<Profile | null>('/api/profile'))
const years = computed(() => profile.value?.impactYears ?? 0)
const projects = computed(() => profile.value?.impactProjects ?? 0)
const oss = computed(() => profile.value?.impactOss ?? 0)
</script>
