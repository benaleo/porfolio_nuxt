<template>
  <div
    class="fog-transition"
    :class="{ 'fog-active': active, 'fog-in': phase === 'in' }"
    :aria-hidden="!active"
  >
    <span class="fog-layer fog-layer-1" />
    <span class="fog-layer fog-layer-2" />
    <span class="fog-layer fog-layer-3" />
    <span class="fog-layer fog-layer-4" />
  </div>
</template>

<script setup lang="ts">
/**
 * Full-screen fog/mist transition overlay for hub <-> section navigation.
 *
 * `play(midpoint)` fades the fog IN (~450ms), awaits `midpoint()` (the instant
 * goTo jump) at full opacity, then fades it OUT (~550ms). While active the
 * wrapper captures pointer events so clicks can't fire mid-transition.
 * Concurrent plays are guarded. Reduced motion skips the animation entirely.
 */
const FADE_IN_MS = 450
const FADE_OUT_MS = 550

const active = ref(false)
const phase = ref<'idle' | 'in' | 'out'>('idle')
let playing = false

const prefersReducedMotion = () =>
  import.meta.client &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

const wait = (ms: number) => new Promise<void>((r) => setTimeout(r, ms))

const play = async (midpoint: () => void | Promise<void>) => {
  if (playing) return
  playing = true
  try {
    if (prefersReducedMotion()) {
      await midpoint()
      return
    }
    // Fade in.
    active.value = true
    await nextTick()
    phase.value = 'in'
    await wait(FADE_IN_MS)
    // Midpoint jump at peak opacity.
    await midpoint()
    await nextTick()
    // Fade out.
    phase.value = 'out'
    await wait(FADE_OUT_MS)
  } finally {
    active.value = false
    phase.value = 'idle'
    playing = false
  }
}

defineExpose({ play })
</script>

<style scoped>
.fog-transition {
  position: fixed;
  inset: 0;
  z-index: 60; /* above slides/nav (z-50), below the rocket cursor */
  pointer-events: none;
  opacity: 0;
  transition: opacity 550ms ease-out;
}
.fog-transition.fog-active {
  pointer-events: auto;
}
.fog-transition.fog-in {
  opacity: 1;
  transition: opacity 450ms ease-in;
}

.fog-layer {
  position: absolute;
  border-radius: 50%;
  filter: blur(60px);
  opacity: 0.9;
  will-change: transform;
}
.fog-layer-1 {
  left: -15%;
  top: -20%;
  width: 70%;
  height: 80%;
  background: radial-gradient(circle, rgba(51, 65, 85, 0.9), rgba(51, 65, 85, 0) 70%);
}
.fog-layer-2 {
  right: -20%;
  top: 10%;
  width: 75%;
  height: 85%;
  background: radial-gradient(circle, rgba(30, 41, 59, 0.92), rgba(30, 41, 59, 0) 70%);
}
.fog-layer-3 {
  left: 10%;
  bottom: -25%;
  width: 80%;
  height: 80%;
  background: radial-gradient(circle, rgba(49, 46, 129, 0.55), rgba(49, 46, 129, 0) 70%);
}
.fog-layer-4 {
  left: 25%;
  top: 20%;
  width: 60%;
  height: 60%;
  background: radial-gradient(circle, rgba(71, 85, 105, 0.75), rgba(71, 85, 105, 0) 70%);
}

/* Drift the layers while the fog is showing for a living-mist feel. */
.fog-transition.fog-in .fog-layer-1 { animation: drift-1 1s ease-out both; }
.fog-transition.fog-in .fog-layer-2 { animation: drift-2 1s ease-out both; }
.fog-transition.fog-in .fog-layer-3 { animation: drift-3 1s ease-out both; }
.fog-transition.fog-in .fog-layer-4 { animation: drift-4 1s ease-out both; }

@keyframes drift-1 {
  from { transform: translate(-6%, 4%) scale(0.9); }
  to { transform: translate(3%, -2%) scale(1.1); }
}
@keyframes drift-2 {
  from { transform: translate(6%, -4%) scale(0.92); }
  to { transform: translate(-4%, 2%) scale(1.12); }
}
@keyframes drift-3 {
  from { transform: translate(-4%, 6%) scale(0.95); }
  to { transform: translate(2%, -3%) scale(1.15); }
}
@keyframes drift-4 {
  from { transform: translate(3%, 3%) scale(0.88); }
  to { transform: translate(-2%, -2%) scale(1.08); }
}

@media (prefers-reduced-motion: reduce) {
  .fog-transition { transition: none; }
  .fog-layer { animation: none !important; }
}
</style>
