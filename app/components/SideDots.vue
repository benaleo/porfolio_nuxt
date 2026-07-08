<template>
  <div class="fixed right-6 top-1/2 -translate-y-1/2 z-50 hidden md:flex flex-col gap-3">
    <button
      v-for="(id, i) in slideIds"
      :key="id"
      type="button"
      class="rounded-full transition-all duration-300"
      :aria-label="`Go to ${labelFor(id)} section`"
      :style="{
        width: '8px',
        height: '8px',
        background: activeIdx === i ? '#38bdf8' : 'rgba(255,255,255,0.2)',
        transform: activeIdx === i ? 'scale(1.3)' : 'scale(1)',
      }"
      @click="goTo(i)"
    />
  </div>
</template>

<script setup lang="ts">
const { activeIdx, slideIds, goTo } = useSlideScroll()

const LABELS: Record<string, string> = {
  hub: 'Galaxy',
  intro: 'Home',
  projects: 'Projects',
  education: 'Study',
  experience: 'Experience',
  counters: 'Impact',
  blog: 'Blog',
  contact: 'Contact',
}

const labelFor = (id: string) => LABELS[id] ?? id
</script>
