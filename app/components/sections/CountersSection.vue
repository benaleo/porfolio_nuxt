<template>
  <section class="py-20" id="counters">
    <div class="mx-auto max-w-6xl px-4">
      <h2 class="text-2xl sm:text-3xl text-white font-bold text-center">Impact</h2>
      <div class="mt-10 grid grid-cols-2 sm:grid-cols-3 gap-6">
        <Counter :to="yearsVal" suffix="+">
          Years of Experience
        </Counter>
        <Counter :to="projectsVal" suffix="+">
          Completed Projects
        </Counter>
        <Counter :to="ossVal" suffix="+">
          OSS Contributions
        </Counter>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import Counter from '~/components/Counter.vue'
const props = defineProps<{ years?: number; projects?: number; oss?: number }>()
const yearsVal = computed(() => props.years ?? 0)
const projectsVal = computed(() => props.projects ?? 0)
const ossVal = computed(() => props.oss ?? 0)
</script>
