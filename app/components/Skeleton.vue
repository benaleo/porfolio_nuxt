<template>
  <div :class="['animate-pulse rounded bg-slate-200/40 dark:bg-slate-700/40', $attrs.class]" />
</template>

<script setup lang="ts">
defineOptions({ inheritAttrs: false })
</script>
