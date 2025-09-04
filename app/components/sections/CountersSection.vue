<template>
  <section class="py-20" id="counters">
    <div class="mx-auto max-w-6xl px-4">
      <h2 class="text-2xl sm:text-3xl font-bold text-center">Impact</h2>
      <div class="mt-10 grid grid-cols-2 sm:grid-cols-3 gap-6">
        <Counter :to="3" suffix="+">
          Years of Experience
        </Counter>
        <Counter :to="20" suffix="+">
          Completed Projects
        </Counter>
        <Counter :to="10" suffix="+">
          OSS Contributions
        </Counter>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import Counter from '~/components/Counter.vue'
</script>
