<template>
  <div
    class="fixed inset-0 z-50 flex items-center justify-center px-4 py-8 bg-black/60 backdrop-blur-xl supports-[backdrop-filter]:bg-black/40"
    @click.self="$emit('close')"
  >
    <div
      class="relative w-full max-w-[min(1000px,90vw)] max-h-[90vh] flex flex-col rounded-2xl border border-white/10 bg-gradient-to-br from-slate-900/95 to-slate-800/95 shadow-2xl shadow-blue-500/10 overflow-hidden"
    >
      <div
        class="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-blue-400/60 to-transparent"
      />

      <div class="flex items-center justify-between px-6 py-4 border-b border-white/5">
        <h2 class="text-lg font-semibold text-white tracking-tight">Biography</h2>
        <button
          @click="$emit('close')"
          aria-label="Close"
          class="size-8 grid place-items-center rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="size-5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <div class="flex-1 overflow-y-auto px-6 py-6">
        <div
          class="prose prose-invert prose-sm sm:prose-base max-w-none text-slate-200 leading-relaxed"
          v-html="bio"
        />
      </div>

      <div class="flex justify-end px-6 py-4 border-t border-white/5 bg-slate-900/40">
        <button
          @click="$emit('close')"
          class="inline-flex items-center gap-2 rounded-lg bg-white/5 hover:bg-white/10 text-white px-4 py-2 text-sm font-medium border border-white/10 transition"
        >
          Close
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  bio: string
  showBiography: boolean
}>()

defineEmits<{ (e: 'close'): void }>()
</script>
