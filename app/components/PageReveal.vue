<template>
  <ClientOnly>
    <Teleport to="body">
      <Transition name="blast" @after-leave="emit('done')">
        <div v-if="active" class="pr">
          <!-- Expanding nebula rings -->
          <div class="pr-ring pr-r1" />
          <div class="pr-ring pr-r2" />
          <div class="pr-ring pr-r3" />

          <!-- Twinkling stars -->
          <div
            v-for="s in stars"
            :key="s.id"
            class="pr-star"
            :style="s.style"
          />

          <!-- Central rocket -->
          <div class="pr-rocket" :class="{ launch: launching }">
            <svg viewBox="0 0 24 24" width="72" height="72" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M12 2C12 2 7 7 7 13c0 2.21.9 4.21 2.34 5.66L12 21l2.66-2.34A7.96 7.96 0 0 0 17 13c0-6-5-11-5-11z"
                fill="#e2e8f0" stroke="#94a3b8" stroke-width="0.3"
              />
              <ellipse cx="12" cy="12" rx="2.2" ry="2.2" fill="#38bdf8" />
              <path d="M7 13 L4 17 L7.5 15.5Z" fill="#818cf8" />
              <path d="M17 13 L20 17 L16.5 15.5Z" fill="#818cf8" />
              <path d="M10.5 21 Q12 24.5 13.5 21" fill="#f97316" opacity="0.9" />
              <path d="M11 21 Q12 23 13 21" fill="#fbbf24" />
            </svg>
            <div class="pr-flame" />
          </div>

          <!-- Brand identity -->
          <div class="pr-brand" :class="{ show: brandVisible }">
            <span class="pr-name">BENO</span>
            <span class="pr-sub">Fullstack Developer</span>
          </div>
        </div>
      </Transition>
    </Teleport>
  </ClientOnly>
</template>

<script setup lang="ts">
const emit = defineEmits<{ done: [] }>()

const active = ref(true)
const launching = ref(false)
const brandVisible = ref(false)

const stars = ref<Array<{ id: number; style: Record<string, string> }>>([])

onMounted(() => {
  stars.value = Array.from({ length: 75 }, (_, i) => {
    const size = 1 + Math.random() * 2.8
    return {
      id: i,
      style: {
        left: Math.random() * 100 + '%',
        top: Math.random() * 100 + '%',
        width: size + 'px',
        height: size + 'px',
        animationDelay: (Math.random() * 1.6) + 's',
        animationDuration: (0.5 + Math.random() * 1.1) + 's',
        opacity: String(0.2 + Math.random() * 0.8),
      },
    }
  })

  setTimeout(() => { brandVisible.value = true }, 250)
  setTimeout(() => { launching.value = true }, 850)
  setTimeout(() => { active.value = false }, 1550)
})
</script>

<style scoped>
.pr {
  position: fixed;
  inset: 0;
  z-index: 999999;
  display: flex;
  align-items: center;
  justify-content: center;
  background: radial-gradient(ellipse 90% 70% at 50% 38%, #0d1b2a 0%, #020617 52%, #000510 100%);
  overflow: hidden;
}

/* nebula rings */
.pr-ring {
  position: absolute;
  border-radius: 50%;
  border: 1px solid;
  pointer-events: none;
}
.pr-r1 {
  width: 180px; height: 180px;
  border-color: rgba(0, 220, 130, 0.55);
  box-shadow: 0 0 30px rgba(0, 220, 130, 0.18);
  animation: ring 1.9s ease-out forwards;
}
.pr-r2 {
  width: 400px; height: 400px;
  border-color: rgba(56, 189, 248, 0.3);
  box-shadow: 0 0 20px rgba(56, 189, 248, 0.08);
  animation: ring 2.1s ease-out 0.12s forwards;
}
.pr-r3 {
  width: 680px; height: 680px;
  border-color: rgba(99, 102, 241, 0.18);
  animation: ring 2.3s ease-out 0.24s forwards;
}

@keyframes ring {
  from { transform: scale(0.08); opacity: 0; }
  20%  { opacity: 1; }
  to   { transform: scale(1.35); opacity: 0; }
}

/* stars */
.pr-star {
  position: absolute;
  border-radius: 50%;
  background: #fff;
  animation: twinkle var(--dur, 0.9s) ease-in-out infinite alternate;
}
@keyframes twinkle {
  from { opacity: 0.1; transform: scale(0.6); }
  to   { opacity: 1;   transform: scale(1.3); }
}

/* rocket */
.pr-rocket {
  position: relative;
  z-index: 2;
  display: flex;
  flex-direction: column;
  align-items: center;
  animation: glow-pulse 1.1s ease-in-out infinite alternate;
  transition: transform 0.85s cubic-bezier(0.2, 0, 0.3, 1), opacity 0.55s ease;
}
@keyframes glow-pulse {
  from { filter: drop-shadow(0 0 10px rgba(56,189,248,0.55)) drop-shadow(0 0 22px rgba(0,220,130,0.3)); }
  to   { filter: drop-shadow(0 0 22px rgba(56,189,248,1))    drop-shadow(0 0 44px rgba(0,220,130,0.65)); }
}
.pr-rocket.launch {
  transform: translateY(-115vh);
  opacity: 0;
}

.pr-flame {
  width: 12px;
  height: 36px;
  margin-top: -6px;
  background: linear-gradient(to bottom, #fbbf24, #f97316, transparent);
  border-radius: 0 0 50% 50%;
  filter: blur(3px);
  animation: flame 0.07s linear infinite alternate;
}
@keyframes flame {
  from { transform: scaleX(0.75); opacity: 0.85; }
  to   { transform: scaleX(1.35); opacity: 0.65; }
}

/* brand text */
.pr-brand {
  position: absolute;
  bottom: 22%;
  text-align: center;
  opacity: 0;
  transform: translateY(20px);
  transition: opacity 0.75s ease, transform 0.75s ease;
}
.pr-brand.show {
  opacity: 1;
  transform: translateY(0);
}
.pr-name {
  display: block;
  font-size: clamp(2rem, 6vw, 3.2rem);
  font-weight: 800;
  letter-spacing: 0.4em;
  color: #e2e8f0;
  text-shadow:
    0 0 20px rgba(56, 189, 248, 0.6),
    0 0 48px rgba(0, 220, 130, 0.3);
}
.pr-sub {
  display: block;
  font-size: 0.78rem;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: rgba(148, 163, 184, 0.7);
  margin-top: 8px;
}

/* exit: supernova blast */
.blast-leave-active {
  transition: transform 0.6s cubic-bezier(0.4, 0, 1, 1), opacity 0.5s ease-in;
}
.blast-leave-to {
  transform: scale(1.7);
  opacity: 0;
}
</style>
