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
        <div class="md:hidden flex items-center gap-2">
          <button
            type="button"
            class="inline-flex items-center justify-center rounded-md p-2 text-slate-100 hover:text-white hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-slate-900"
            aria-label="Open menu"
            :aria-expanded="mobileOpen ? 'true' : 'false'"
            @click="mobileOpen = true"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="size-6">
              <path fill-rule="evenodd" d="M3.75 5.25a.75.75 0 0 1 .75-.75h15a.75.75 0 0 1 0 1.5h-15a.75.75 0 0 1-.75-.75Zm0 6a.75.75 0 0 1 .75-.75h15a.75.75 0 0 1 0 1.5h-15a.75.75 0 0 1-.75-.75Zm0 6a.75.75 0 0 1 .75-.75h15a.75.75 0 0 1 0 1.5h-15a.75.75 0 0 1-.75-.75Z" clip-rule="evenodd" />
            </svg>
          </button>
        </div>
      </nav>
    </header>

    <!-- Mobile Off-Canvas -->
    <transition name="fade" appear>
      <div
        v-if="mobileOpen"
        class="fixed inset-0 z-50"
        aria-modal="true"
        role="dialog"
      >
        <!-- Backdrop -->
        <div
          class="absolute inset-0 bg-slate-950/50 backdrop-blur-sm"
          @click="closeMobile()"
        />
        <!-- Panel -->
        <transition name="slide-in" appear>
          <aside
            v-if="mobileOpen"
            class="absolute right-0 top-0 h-full w-4/5 max-w-sm bg-slate-900 text-slate-100 shadow-xl border-l border-slate-800 flex flex-col"
          >
            <div class="flex items-center justify-between px-4 py-3 border-b border-slate-800 bg-gradient-to-b from-slate-900/80 to-slate-900/30">
              <span class="font-semibold tracking-tight">Menu</span>
              <button
                type="button"
                class="inline-flex items-center justify-center rounded-md p-2 text-slate-100 hover:text-white hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-blue-500"
                aria-label="Close menu"
                @click="closeMobile()"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="size-6">
                  <path fill-rule="evenodd" d="M5.47 5.47a.75.75 0 0 1 1.06 0L12 10.94l5.47-5.47a.75.75 0 1 1 1.06 1.06L13.06 12l5.47 5.47a.75.75 0 1 1-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 0 1-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 0 1 0-1.06Z" clip-rule="evenodd" />
                </svg>
              </button>
            </div>
            <nav class="flex-1 overflow-y-auto px-4 py-6">
              <ul class="space-y-2 text-base">
                <li>
                  <a :href="`${siteUrl}#projects`" class="flex items-center justify-between rounded-lg px-3 py-2 bg-white/5 hover:bg-white/10 transition" @click="closeMobile()">
                    <span>Projects</span>
                    <span class="i-lucide-chevron-right size-4 opacity-70" aria-hidden="true"></span>
                  </a>
                </li>
                <li>
                  <a :href="`${siteUrl}#education`" class="flex items-center justify-between rounded-lg px-3 py-2 bg-white/5 hover:bg-white/10 transition" @click="closeMobile()">
                    <span>Study</span>
                    <span class="i-lucide-chevron-right size-4 opacity-70" aria-hidden="true"></span>
                  </a>
                </li>
                <li>
                  <a :href="`${siteUrl}#experience`" class="flex items-center justify-between rounded-lg px-3 py-2 bg-white/5 hover:bg-white/10 transition" @click="closeMobile()">
                    <span>Experience</span>
                    <span class="i-lucide-chevron-right size-4 opacity-70" aria-hidden="true"></span>
                  </a>
                </li>
                <li>
                  <a :href="`${siteUrl}#counters`" class="flex items-center justify-between rounded-lg px-3 py-2 bg-white/5 hover:bg-white/10 transition" @click="closeMobile()">
                    <span>Counters</span>
                    <span class="i-lucide-chevron-right size-4 opacity-70" aria-hidden="true"></span>
                  </a>
                </li>
                <li>
                  <a :href="`${siteUrl}#blog`" class="flex items-center justify-between rounded-lg px-3 py-2 bg-white/5 hover:bg-white/10 transition" @click="closeMobile()">
                    <span>Blog</span>
                    <span class="i-lucide-chevron-right size-4 opacity-70" aria-hidden="true"></span>
                  </a>
                </li>
                <li>
                  <a :href="`${siteUrl}#contact`" class="flex items-center justify-between rounded-lg px-3 py-2 bg-white/5 hover:bg-white/10 transition" @click="closeMobile()">
                    <span>Contact</span>
                    <span class="i-lucide-chevron-right size-4 opacity-70" aria-hidden="true"></span>
                  </a>
                </li>
              </ul>
            </nav>
            <div class="px-4 pb-6">
              <a href="/cv.pdf" download class="inline-flex items-center justify-center w-full gap-2 rounded-lg bg-blue-600 text-white px-4 py-2 hover:bg-blue-700 transition">
                Download CV
              </a>
            </div>
          </aside>
        </transition>
      </div>
    </transition>

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
import { ref, onMounted, onBeforeUnmount } from 'vue'
const config = useRuntimeConfig()
const siteUrl = config.public.siteUrl

const mobileOpen = ref(false)
function closeMobile() {
  mobileOpen.value = false
}

function onKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape') mobileOpen.value = false
}

onMounted(() => {
  window.addEventListener('keydown', onKeydown)
})
onBeforeUnmount(() => {
  window.removeEventListener('keydown', onKeydown)
})

</script>

<style scoped>
.fade-enter-active, .fade-leave-active {
  transition: opacity 200ms ease;
}
.fade-enter-from, .fade-leave-to { opacity: 0; }

.slide-in-enter-active, .slide-in-leave-active {
  transition: transform 240ms ease;
}
.slide-in-enter-from, .slide-in-leave-to { transform: translateX(100%); }
</style>
