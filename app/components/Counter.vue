<template>
  <div ref="el" class="text-center select-none">
    <div class="text-4xl sm:text-5xl font-extrabold text-blue-600 dark:text-blue-400">{{ displayValue }}</div>
    <div class="mt-1 text-sm text-slate-500 dark:text-slate-400"><slot /></div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{ to: number; duration?: number; prefix?: string; suffix?: string; decimals?: number }>()
const el = ref<HTMLElement | null>(null)
const displayValue = ref('0')
const started = ref(false)

const format = (val: number) => {
  const fixed = props.decimals != null ? val.toFixed(props.decimals) : Math.round(val).toString()
  return `${props.prefix || ''}${fixed}${props.suffix || ''}`
}

const animate = () => {
  const start = performance.now()
  const from = 0
  const dur = props.duration ?? 1200
  const step = (now: number) => {
    const p = Math.min(1, (now - start) / dur)
    const eased = 1 - Math.pow(1 - p, 3)
    displayValue.value = format(from + (props.to - from) * eased)
    if (p < 1) requestAnimationFrame(step)
  }
  requestAnimationFrame(step)
}

onMounted(() => {
  const obs = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting && !started.value) {
          started.value = true
          animate()
          obs.disconnect()
        }
      })
    },
    { threshold: 0.2 },
  )
  if (el.value) obs.observe(el.value)
})
</script>
