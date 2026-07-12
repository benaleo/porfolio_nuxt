<template>
  <div class="galaxy-hub relative h-full w-full flex items-center justify-center overflow-hidden select-none">
    <!-- Orbit stage: sun + orbit rings + planets share this centered coordinate space -->
    <div class="orbit-stage absolute inset-0 flex items-center justify-center">
      <!-- Soft nebula-band orbit paths (behind planets). 28px oversize keeps
           the planets' circular path running through the middle of the band. -->
      <div
        v-for="(orbit, i) in orbits"
        :key="`ring-${i}`"
        class="orbit-ring"
        :style="{
          width: `calc(${orbit.radius} * 2 + 28px)`,
          height: `calc(${orbit.radius} * 2 + 28px)`,
        }"
        aria-hidden="true"
      />

      <!-- Planets -->
      <div
        v-for="planet in activePlanets"
        :key="planet.id"
        class="planet-orbit"
        :style="{
          animationDuration: planet.duration,
          animationDelay: planet.delay,
        }"
      >
        <div
          class="planet-arm"
          :style="{ transform: `translateX(${planet.radius})` }"
        >
          <button
            type="button"
            class="planet-spin group"
            :style="{ animationDuration: planet.duration, animationDelay: planet.delay }"
            :aria-label="`Go to ${planet.label} section`"
            @click="onSelect(planet.id)"
          >
            <span
              class="planet-body"
              :style="{
                background: `radial-gradient(circle at 32% 28%, ${planet.light} 0%, ${planet.color} 42%, ${planet.dark} 100%)`,
                boxShadow: `0 0 18px 2px ${planet.glow}, 0 0 44px 8px ${planet.glowSoft}`,
              }"
            >
              <span
                class="planet-atmosphere"
                :style="{ background: `radial-gradient(circle, transparent 55%, ${planet.glow} 72%, transparent 82%)` }"
                aria-hidden="true"
              />
              <span
                class="planet-icon"
                :style="{ filter: `drop-shadow(0 0 4px ${planet.glow})` }"
                v-html="planet.icon"
              />
            </span>
            <span class="planet-label">{{ planet.label }}</span>
          </button>
        </div>
      </div>

      <!-- Central sun (profile avatar) -->
      <div class="sun-wrap absolute flex flex-col items-center">
        <button
          type="button"
          class="sun group"
          aria-label="View profile"
          @click="onSelect('intro')"
        >
          <span class="sun-ring" aria-hidden="true" />
          <span class="sun-ring sun-ring-2" aria-hidden="true" />
          <span class="sun-core">
            <img
              v-if="avatar"
              :src="avatar"
              :alt="name || 'avatar'"
              class="sun-avatar"
            />
            <span v-else class="sun-avatar sun-avatar-fallback" aria-hidden="true" />
          </span>
        </button>
        <div class="sun-meta">
          <p class="sun-name">{{ name }}</p>
          <p class="sun-tagline">{{ tagline }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
/**
 * Orbital galaxy hub — a solar-system menu. The profile avatar is the central
 * "sun"; each visible site section is a "planet" revolving CLOCKWISE around it.
 *
 * Clockwise + upright labels are achieved with a two-layer counter-rotation:
 *   .planet-orbit   spins 0 -> 360deg (positive = clockwise)  [the arm]
 *   .planet-spin    spins 360 -> 0deg (equal & opposite)      [the content]
 * so the arm carries the planet around the circle while the content stays
 * visually upright (sphere shading + label never tumble).
 *
 * Radii use vmin (+ clamp) so all orbits stay on screen down to mobile.
 * prefers-reduced-motion pauses every animation, leaving planets at their
 * static staggered offsets.
 */
const props = defineProps<{
  avatar?: string | null
  name?: string | null
  tagline?: string | null
}>()

const emit = defineEmits<{ (e: 'select', id: string): void }>()

const { visible } = useNavVisibility()

// Icons are inline white SVG strings (rendered via v-html into .planet-icon).
const ICONS = {
  chat: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>',
  code: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>',
  briefcase: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>',
  document: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="8" y1="13" x2="16" y2="13"/><line x1="8" y1="17" x2="16" y2="17"/></svg>',
  star: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>',
  cap: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 10L12 5 2 10l10 5 10-5z"/><path d="M6 12v5c0 1 2.7 2.5 6 2.5s6-1.5 6-2.5v-5"/></svg>',
} as const

interface PlanetConfig {
  id: string
  label: string
  color: string
  light: string
  dark: string
  glow: string
  glowSoft: string
  icon: string
  radius: string
  duration: string
  delay: string
  /** Visibility key in useNavVisibility, or null when always shown. */
  visKey: string | null
}

// Radii clamp for mobile; three orbital shells, staggered start angles via
// negative animation-delay (fraction of the orbit's own duration), slow durations.
// Each radius is additionally capped against half the viewport width (minus
// planet size + margin) so outer orbits never clip on narrow screens; the
// shrinking margins (64/52/40px) preserve R1 < R2 < R3 ordering there.
const R1 = 'min(clamp(120px, 30vmin, 260px), calc(50vw - 64px))'
const R2 = 'min(clamp(160px, 38vmin, 330px), calc(50vw - 52px))'
const R3 = 'min(clamp(200px, 46vmin, 400px), calc(50vw - 40px))'

const PLANETS: PlanetConfig[] = [
  {
    id: 'contact', label: 'Contact', color: '#34d399', light: '#a7f3d0', dark: '#065f46',
    glow: 'rgba(52,211,153,0.55)', glowSoft: 'rgba(52,211,153,0.22)', icon: ICONS.chat,
    radius: R1, duration: '68s', delay: '0s', visKey: null,
  },
  {
    id: 'projects', label: 'Projects', color: '#a78bfa', light: '#ddd6fe', dark: '#4c1d95',
    glow: 'rgba(167,139,250,0.55)', glowSoft: 'rgba(167,139,250,0.22)', icon: ICONS.code,
    radius: R2, duration: '92s', delay: '-22s', visKey: 'projects',
  },
  {
    id: 'experience', label: 'Experience', color: '#38bdf8', light: '#bae6fd', dark: '#075985',
    glow: 'rgba(56,189,248,0.55)', glowSoft: 'rgba(56,189,248,0.22)', icon: ICONS.briefcase,
    radius: R3, duration: '108s', delay: '-40s', visKey: 'experience',
  },
  {
    id: 'blog', label: 'Blog', color: '#fb923c', light: '#fed7aa', dark: '#9a3412',
    glow: 'rgba(251,146,60,0.55)', glowSoft: 'rgba(251,146,60,0.22)', icon: ICONS.document,
    radius: R1, duration: '68s', delay: '-34s', visKey: 'blog',
  },
  {
    id: 'counters', label: 'Impact', color: '#f87171', light: '#fecaca', dark: '#991b1b',
    glow: 'rgba(248,113,113,0.55)', glowSoft: 'rgba(248,113,113,0.22)', icon: ICONS.star,
    radius: R2, duration: '92s', delay: '-60s', visKey: 'counters',
  },
  {
    id: 'education', label: 'Study', color: '#fbbf24', light: '#fde68a', dark: '#92400e',
    glow: 'rgba(251,191,36,0.55)', glowSoft: 'rgba(251,191,36,0.22)', icon: ICONS.cap,
    radius: R3, duration: '108s', delay: '-78s', visKey: 'education',
  },
]

// All planets share ONE angular speed with evenly distributed start angles:
// different per-shell periods drift into conjunctions where planets overlap
// and cover each other's click targets, so the per-planet duration/delay in
// PLANETS is overridden here.
const ORBIT_PERIOD_S = 96

const activePlanets = computed(() => {
  const shown = PLANETS.filter((p) => p.visKey === null || visible.value[p.visKey])
  return shown.map((p, i) => ({
    ...p,
    duration: `${ORBIT_PERIOD_S}s`,
    delay: `${-(i / shown.length) * ORBIT_PERIOD_S}s`,
  }))
})

/** Distinct orbit radii present in the active set — one ring drawn per shell. */
const orbits = computed(() => {
  const seen = new Set<string>()
  const list: { radius: string }[] = []
  for (const p of activePlanets.value) {
    if (!seen.has(p.radius)) {
      seen.add(p.radius)
      list.push({ radius: p.radius })
    }
  }
  return list
})

const onSelect = (id: string) => emit('select', id)
</script>

<style scoped>
.orbit-stage {
  /* keep animations off the compositor's critical path but crisp */
  transform: translateZ(0);
}

/* ── Orbit path rings ─────────────────────────────────────────────────────── */
/* Nebula-style bands hugging the planets' circular paths: a conic color sweep
   masked into a soft feathered annulus (the planets' path runs through its
   middle, 14px from the edge), blurred like interstellar dust, slightly
   transparent, spinning clockwise with the same period as the planets. */
.orbit-ring {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  border-radius: 50%;
  pointer-events: none;
  background: conic-gradient(
    from 0deg,
    rgba(52, 211, 153, 0.85),
    rgba(56, 189, 248, 0.85),
    rgba(167, 139, 250, 0.85),
    rgba(251, 146, 60, 0.85),
    rgba(248, 113, 113, 0.85),
    rgba(251, 191, 36, 0.85),
    rgba(52, 211, 153, 0.85)
  );
  -webkit-mask: radial-gradient(
    farthest-side,
    transparent calc(100% - 32px),
    rgba(0, 0, 0, 0.55) calc(100% - 22px),
    #000 calc(100% - 14px),
    rgba(0, 0, 0, 0.55) calc(100% - 6px),
    transparent 100%
  );
  mask: radial-gradient(
    farthest-side,
    transparent calc(100% - 32px),
    rgba(0, 0, 0, 0.55) calc(100% - 22px),
    #000 calc(100% - 14px),
    rgba(0, 0, 0, 0.55) calc(100% - 6px),
    transparent 100%
  );
  filter: blur(6px);
  opacity: 0.3;
  /* same 96s clockwise period as the planets so the color sweep follows them */
  animation: ring-spin 96s linear infinite;
}

@keyframes ring-spin {
  from { transform: translate(-50%, -50%) rotate(0deg); }
  to   { transform: translate(-50%, -50%) rotate(360deg); }
}

/* ── Planet orbit (the arm) ───────────────────────────────────────────────── */
.planet-orbit {
  position: absolute;
  left: 50%;
  top: 50%;
  width: 0;
  height: 0;
  transform-origin: center;
  animation: orbit-cw linear infinite;
}
.planet-arm {
  position: absolute;
  left: 0;
  top: 0;
  /* translateX(radius) offset technique: pushes the planet out along the arm */
}
.planet-spin {
  position: absolute;
  left: 0;
  top: 0;
  transform: translate(-50%, -50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  background: transparent;
  border: 0;
  cursor: pointer;
  /* counter-rotate to keep the content upright */
  animation: orbit-ccw linear infinite;
}

/* ── Planet body ──────────────────────────────────────────────────────────── */
.planet-body {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: clamp(48px, 9vmin, 76px);
  height: clamp(48px, 9vmin, 76px);
  border-radius: 50%;
  transition: transform 260ms ease, box-shadow 260ms ease, filter 260ms ease;
}
.planet-spin:hover .planet-body {
  transform: scale(1.12);
  filter: brightness(1.15);
}
.planet-atmosphere {
  position: absolute;
  inset: -30%;
  border-radius: 50%;
  filter: blur(4px);
  opacity: 0.85;
  pointer-events: none;
}
.planet-icon {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  width: 46%;
  height: 46%;
}
.planet-icon :deep(svg) {
  width: 100%;
  height: 100%;
}
.planet-label {
  font-size: 0.7rem;
  line-height: 1;
  letter-spacing: 0.02em;
  color: rgba(226, 232, 240, 0.92);
  text-shadow: 0 1px 4px rgba(0, 0, 0, 0.6);
  white-space: nowrap;
  transition: color 200ms ease;
}
.planet-spin:hover .planet-label {
  color: #fff;
}

/* ── Central sun ──────────────────────────────────────────────────────────── */
.sun-wrap {
  z-index: 2;
}
.sun {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: clamp(96px, 20vmin, 168px);
  height: clamp(96px, 20vmin, 168px);
  background: transparent;
  border: 0;
  cursor: pointer;
}
.sun-ring {
  position: absolute;
  inset: -22%;
  border-radius: 50%;
  background: radial-gradient(
    circle,
    rgba(245, 158, 11, 0.0) 46%,
    rgba(245, 158, 11, 0.55) 58%,
    rgba(249, 115, 22, 0.35) 70%,
    rgba(249, 115, 22, 0) 82%
  );
  filter: blur(2px);
  animation: sun-pulse 4.5s ease-in-out infinite;
}
.sun-ring-2 {
  inset: -40%;
  background: radial-gradient(
    circle,
    rgba(249, 115, 22, 0) 52%,
    rgba(245, 158, 11, 0.28) 64%,
    rgba(249, 115, 22, 0) 78%
  );
  filter: blur(8px);
  animation: sun-pulse 6s ease-in-out infinite reverse;
}
.sun-core {
  position: relative;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  padding: 3px;
  background: linear-gradient(140deg, #fbbf24, #f97316 55%, #f59e0b);
  box-shadow:
    0 0 24px 6px rgba(245, 158, 11, 0.5),
    0 0 60px 16px rgba(249, 115, 22, 0.28);
  transition: box-shadow 300ms ease, transform 300ms ease;
}
.sun:hover .sun-core {
  transform: scale(1.05);
  box-shadow:
    0 0 30px 8px rgba(245, 158, 11, 0.65),
    0 0 80px 22px rgba(249, 115, 22, 0.4);
}
.sun-avatar {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
  display: block;
}
.sun-avatar-fallback {
  background: radial-gradient(circle at 35% 30%, #fde68a, #b45309);
}
.sun-meta {
  margin-top: 0.9rem;
  text-align: center;
}
.sun-name {
  font-weight: 700;
  font-size: clamp(0.95rem, 2.4vmin, 1.25rem);
  color: #f1f5f9;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.7);
}
.sun-tagline {
  margin-top: 0.15rem;
  font-size: clamp(0.65rem, 1.6vmin, 0.8rem);
  color: rgba(203, 213, 225, 0.85);
  text-shadow: 0 1px 6px rgba(0, 0, 0, 0.6);
  max-width: 22rem;
}

/* ── Keyframes ────────────────────────────────────────────────────────────── */
@keyframes orbit-cw {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
@keyframes orbit-ccw {
  from { transform: translate(-50%, -50%) rotate(360deg); }
  to { transform: translate(-50%, -50%) rotate(0deg); }
}
@keyframes sun-pulse {
  0%, 100% { opacity: 0.7; transform: scale(1); }
  50% { opacity: 1; transform: scale(1.06); }
}

@media (prefers-reduced-motion: reduce) {
  .planet-orbit,
  .planet-spin,
  .orbit-ring,
  .sun-ring,
  .sun-ring-2 {
    animation: none !important;
  }
}
</style>
