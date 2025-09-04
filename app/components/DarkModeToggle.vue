<template>
  <button
    class="inline-flex items-center gap-2 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition"
    aria-label="Toggle dark mode"
    @click="toggle()"
  >
    <span v-if="isDark" class="flex items-center">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-5 h-5">
        <path d="M21.752 15.002A9.718 9.718 0 0112 21.75c-5.385 0-9.75-4.365-9.75-9.75 0-4.215 2.66-7.792 6.391-9.17a.75.75 0 01.96.93A8.25 8.25 0 0012 20.25c3.54 0 6.531-2.195 7.802-5.292a.75.75 0 011.95.044z" />
      </svg>
      <span class="hidden sm:inline">Dark</span>
    </span>
    <span v-else class="flex items-center">
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
        <path stroke-linecap="round" stroke-linejoin="round" d="M12 3v2m0 14v2m9-9h-2M5 12H3m15.364 6.364l-1.414-1.414M7.05 7.05L5.636 5.636m12.728 0l-1.414 1.414M7.05 16.95l-1.414 1.414" />
      </svg>
      <span class="hidden sm:inline">Light</span>
    </span>
  </button>
</template>

<script setup lang="ts">
const { isDark, toggle } = useTheme()
</script>
