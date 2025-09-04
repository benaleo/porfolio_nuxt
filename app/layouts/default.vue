<template>
  <div class="min-h-dvh flex flex-col">
    <ClientOnly>
      <GalaxyBackground />
    </ClientOnly>

    <header class="sticky top-0 z-40 backdrop-blur supports-[backdrop-filter]:bg-white/60 dark:supports-[backdrop-filter]:bg-slate-900/60 bg-white/80 dark:bg-slate-900/80 border-b border-slate-200/60 dark:border-slate-800">
      <nav class="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between">
        <a href="#intro" class="font-semibold tracking-tight text-slate-800 dark:text-slate-100">Beno</a>
        <div class="hidden md:flex items-center gap-6 text-sm">
          <a href="#projects" class="hover:text-blue-600">Projects</a>
          <a href="#education" class="hover:text-blue-600">Study</a>
          <a href="#experience" class="hover:text-blue-600">Experience</a>
          <a href="#counters" class="hover:text-blue-600">Counters</a>
          <a href="#blog" class="hover:text-blue-600">Blog</a>
          <a href="#contact" class="hover:text-blue-600">Contact</a>
          <DarkModeToggle />
        </div>
        <div class="md:hidden flex items-center gap-2">
          <DarkModeToggle />
        </div>
      </nav>
    </header>

    <main class="flex-1">
      <slot />
    </main>

    <footer class="border-t border-slate-200/60 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80">
      <div class="mx-auto max-w-6xl px-4 py-6 text-sm text-slate-500 flex items-center justify-between">
        <p>© {{ new Date().getFullYear() }} Beno. All rights reserved.</p>
        <div class="hidden sm:flex items-center gap-4">
          <a :href="social.github" target="_blank" rel="noopener" class="hover:text-slate-700 dark:hover:text-slate-200">GitHub</a>
          <a :href="social.linkedin" target="_blank" rel="noopener" class="hover:text-slate-700 dark:hover:text-slate-200">LinkedIn</a>
          <a :href="social.email" class="hover:text-slate-700 dark:hover:text-slate-200">Email</a>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
const config = useRuntimeConfig()
const social = config.public.social
</script>
