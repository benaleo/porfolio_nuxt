<template>
  <section class="py-20" id="counters">
    <div class="mx-auto max-w-6xl px-4">
      <h2 class="text-2xl sm:text-3xl text-white font-bold text-center">Impact</h2>
      <div class="mt-10 grid grid-cols-2 sm:grid-cols-3 gap-6">
        <div class="flex-center">
          <Counter :to="yearsVal" suffix="+" class="counter-item">
            Years of Experience
          </Counter>
        </div>
        <div class="flex-center">
          <Counter :to="projectsVal" suffix="+" class="counter-item">
            Completed Projects
          </Counter>
        </div>
        <div class="flex-center">
          <Counter :to="ossVal" suffix="+" class="counter-item">
            OSS Contributions
          </Counter>
        </div>
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
