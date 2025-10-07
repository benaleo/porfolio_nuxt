<template>
  <div class="min-h-dvh flex flex-col overflow-hidden">
    <ClientOnly>
      <GalaxyBackground />
    </ClientOnly>

    <header class="sticky top-0 z-40 backdrop-blur supports-[backdrop-filter]:bg-slate-900/60 bg-slate-900/80 border-b border-slate-800">
      <nav class="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between">
        <a href="#intro" class="font-semibold tracking-tight text-slate-100">Beno</a>
        <div class="hidden md:flex items-center gap-6 text-sm text-slate-100">
          <a :href="`${siteUrl}#projects`" class="hover:text-blue-600">Projects</a>
          <a :href="`${siteUrl}#education`" class="hover:text-blue-600">Study</a>
          <a :href="`${siteUrl}#experience`" class="hover:text-blue-600">Experience</a>
          <a :href="`${siteUrl}#counters`" class="hover:text-blue-600">Counters</a>
          <a :href="`${siteUrl}#blog`" class="hover:text-blue-600">Blog</a>
          <a :href="`${siteUrl}#contact`" class="hover:text-blue-600">Contact</a>
        </div>
        <div class="md:hidden flex items-center gap-2"></div>
      </nav>
    </header>

    <main class="flex-1">
      <slot />
    </main>

    <footer class="border-t border-slate-200/60 bg-white/80">
      <div class="mx-auto max-w-6xl px-4 py-2 text-sm text-slate-500 flex items-center justify-center">
        <p>© {{ new Date().getFullYear() }} Beno. All rights reserved.</p>
        <!-- <div class="hidden sm:flex items-center gap-4">
          <a :href="social.github" target="_blank" rel="noopener" class="hover:text-slate-700">GitHub</a>
          <a :href="social.linkedin" target="_blank" rel="noopener" class="hover:text-slate-700">LinkedIn</a>
          <a :href="social.email" class="hover:text-slate-700">Email</a>
        </div> -->
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">

const config = useRuntimeConfig()
const siteUrl = config.public.siteUrl

</script>
