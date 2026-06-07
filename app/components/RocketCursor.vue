<template>
  <ClientOnly>
    <Teleport to="body">
      <!-- Trail particles -->
      <div
        v-for="p in particles"
        :key="p.id"
        class="trail-particle"
        :style="{
          transform: `translate(calc(${p.x}px - 50%), calc(${p.y}px - 50%))`,
          opacity: p.opacity,
          width: p.size + 'px',
          height: p.size + 'px',
          background: p.color,
          boxShadow: `0 0 ${p.size * 3}px ${p.color}, 0 0 ${p.size * 6}px ${p.color}55`,
        }"
      />

      <!-- Rocket cursor -->
      <div
        v-show="visible"
        class="rocket-cursor-root"
        :style="{ transform: `translate(${x}px, ${y}px)` }"
      >
        <!-- Outer diffuse glow -->
        <div class="glow-outer" />
        <!-- Inner bright core glow -->
        <div class="glow-inner" />

        <!-- Spinning Nuxt-style arc ring -->
        <svg class="ring" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="32" cy="32" r="27" stroke="rgba(99,102,241,0.15)" stroke-width="3" />
          <circle
            cx="32" cy="32" r="27"
            stroke="url(#ng)"
            stroke-width="3.5"
            stroke-linecap="round"
            stroke-dasharray="54 116"
            class="arc"
          />
          <defs>
            <linearGradient id="ng" x1="0" y1="0" x2="64" y2="64" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stop-color="#00dc82" />
              <stop offset="50%" stop-color="#36e4da" />
              <stop offset="100%" stop-color="#0047e1" />
            </linearGradient>
          </defs>
        </svg>

        <!-- Rocket SVG, tip at center, angled up-right -->
        <svg class="rocket" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M12 2C12 2 7 7 7 13c0 2.21.9 4.21 2.34 5.66L12 21l2.66-2.34A7.96 7.96 0 0 0 17 13c0-6-5-11-5-11z"
            fill="#e2e8f0" stroke="#94a3b8" stroke-width="0.5"
          />
          <ellipse cx="12" cy="12" rx="2.2" ry="2.2" fill="#38bdf8" />
          <path d="M7 13 L4 17 L7.5 15.5Z" fill="#818cf8" />
          <path d="M17 13 L20 17 L16.5 15.5Z" fill="#818cf8" />
          <path d="M10.5 21 Q12 24.5 13.5 21" fill="#f97316" opacity="0.9" />
          <path d="M11 21 Q12 23 13 21" fill="#fbbf24" opacity="0.8" />
        </svg>
      </div>
    </Teleport>
  </ClientOnly>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'

interface Particle {
  id: number
  x: number
  y: number
  opacity: number
  size: number
  color: string
  vx: number
  vy: number
}

const x = ref(-200)
const y = ref(-200)
const visible = ref(false)
const particles = ref<Particle[]>([])

let pid = 0
let lastSpawnX = -200
let lastSpawnY = -200
let rafId = 0

const COLORS = [
  '#00dc82', '#36e4da', '#38bdf8',
  '#818cf8', '#a78bfa', '#fbbf24', '#f97316',
]

function spawnParticles(mx: number, my: number) {
  const count = 3 + Math.floor(Math.random() * 2)
  for (let i = 0; i < count; i++) {
    const spread = 8
    particles.value.push({
      id: pid++,
      x: mx + (Math.random() - 0.5) * spread,
      y: my + (Math.random() - 0.5) * spread,
      opacity: 0.85 + Math.random() * 0.15,
      size: 2.5 + Math.random() * 4.5,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      vx: (Math.random() - 0.5) * 1.2,
      vy: (Math.random() - 0.5) * 1.2,
    })
  }
}

function tick() {
  if (particles.value.length > 0) {
    particles.value = particles.value
      .map(p => ({
        ...p,
        opacity: p.opacity - 0.022,
        x: p.x + p.vx,
        y: p.y + p.vy,
        vx: p.vx * 0.96,
        vy: p.vy * 0.96,
      }))
      .filter(p => p.opacity > 0)
  }
  rafId = requestAnimationFrame(tick)
}

function onMove(e: MouseEvent) {
  x.value = e.clientX
  y.value = e.clientY
  if (!visible.value) visible.value = true

  const dx = e.clientX - lastSpawnX
  const dy = e.clientY - lastSpawnY
  if (dx * dx + dy * dy > 64) { // spawn every ~8px of movement
    spawnParticles(e.clientX, e.clientY)
    lastSpawnX = e.clientX
    lastSpawnY = e.clientY
  }
}

function onLeave() {
  visible.value = false
}

onMounted(() => {
  document.addEventListener('mousemove', onMove)
  document.addEventListener('mouseleave', onLeave)
  rafId = requestAnimationFrame(tick)
})

onBeforeUnmount(() => {
  document.removeEventListener('mousemove', onMove)
  document.removeEventListener('mouseleave', onLeave)
  cancelAnimationFrame(rafId)
})
</script>

<style scoped>
/* hide native cursor globally */
:global(body),
:global(a),
:global(button),
:global([role='button']),
:global(input),
:global(textarea),
:global(select) {
  cursor: none !important;
}

/* ── trail particles ── */
.trail-particle {
  position: fixed;
  top: 0;
  left: 0;
  border-radius: 50%;
  pointer-events: none;
  z-index: 99998;
  will-change: transform, opacity;
}

/* ── rocket cursor wrapper ── */
.rocket-cursor-root {
  position: fixed;
  top: 0;
  left: 0;
  pointer-events: none;
  z-index: 99999;
  /* center the 64px ring on cursor point */
  margin-left: -32px;
  margin-top: -32px;
  width: 64px;
  height: 64px;
  will-change: transform;
}

/* ── outer diffuse glow ── */
.glow-outer {
  position: absolute;
  inset: -56px;
  border-radius: 50%;
  background: radial-gradient(
    circle,
    rgba(0, 220, 130, 0.28)  0%,
    rgba(54, 228, 218, 0.18) 30%,
    rgba(56, 189, 248, 0.10) 55%,
    transparent 75%
  );
  animation: pulse-outer 2s ease-in-out infinite;
}

@keyframes pulse-outer {
  0%, 100% { opacity: 0.6; transform: scale(1); }
  50%       { opacity: 1;   transform: scale(1.22); }
}

/* ── inner bright core ── */
.glow-inner {
  position: absolute;
  inset: -20px;
  border-radius: 50%;
  background: radial-gradient(
    circle,
    rgba(0, 220, 130, 0.55)  0%,
    rgba(56, 189, 248, 0.30) 40%,
    transparent 70%
  );
  animation: pulse-inner 1.6s ease-in-out infinite;
  animation-delay: -0.4s;
}

@keyframes pulse-inner {
  0%, 100% { opacity: 0.75; transform: scale(1); }
  50%       { opacity: 1;    transform: scale(1.12); }
}

/* ── spinning arc ring ── */
.ring {
  position: absolute;
  inset: 0;
  width: 64px;
  height: 64px;
  animation: spin 1.2s linear infinite;
  filter: drop-shadow(0 0 4px rgba(0, 220, 130, 0.6));
}

.arc {
  transform-origin: 32px 32px;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* ── rocket icon ── */
.rocket {
  position: absolute;
  width: 24px;
  height: 24px;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%) rotate(45deg);
  filter:
    drop-shadow(0 0 5px rgba(56, 189, 248, 0.9))
    drop-shadow(0 0 12px rgba(99, 102, 241, 0.6));
}
</style>
