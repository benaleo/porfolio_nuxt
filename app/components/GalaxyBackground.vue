<template>
  <div class="galaxy">
    <div
      v-for="(s, i) in stars"
      :key="i"
      class="star"
      :class="s.size"
      :style="s.style"
    />
  </div>
</template>

<script setup lang="ts">
type Star = { size: string; style: Record<string, string> }
const stars = ref<Star[]>([])

const rand = (min: number, max: number) => Math.random() * (max - min) + min

onMounted(() => {
  const arr: Star[] = []
  const count = 140
  for (let i = 0; i < count; i++) {
    const sizeClass = ['star--sm', 'star--md', 'star--lg'][Math.floor(Math.random() * 3)]
    const duration = rand(2.5, 6).toFixed(2) + 's'
    const delay = rand(0, 6).toFixed(2) + 's'
    arr.push({
      size: sizeClass,
      style: {
        top: rand(0, 100).toFixed(2) + '%',
        left: rand(0, 100).toFixed(2) + '%',
        animationDuration: duration,
        animationDelay: delay,
      },
    })
  }
  stars.value = arr
})
</script>
