<template>
  <div class="min-h-dvh flex flex-col overflow-x-hidden relative">
    <RocketCursor />
    <GalaxyScene />

    <header class="fixed w-full top-0 z-40">
      <nav class="mx-auto max-w-6xl px-4 py-3 flex items-center">
        <button type="button" class="font-semibold tracking-tight text-slate-100 drop-shadow" @click="goTo('hub')">Beno</button>
      </nav>
    </header>

    <main class="flex-1">
      <slot />
    </main>
  </div>
</template>

<script setup lang="ts">
const { goTo } = useSlideScroll()
</script>
