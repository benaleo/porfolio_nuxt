<template>
  <div>
    <button
      v-show="canPrev"
      type="button"
      aria-label="Previous section"
      class="nav-rocket fixed bottom-4 left-4 z-50"
      @click="prev"
    >
      <span class="flare flare-back" aria-hidden="true" />
      <img src="/page_back.png" alt="" class="rocket-img" draggable="false" />
    </button>

    <button
      v-show="canNext"
      type="button"
      aria-label="Next section"
      class="nav-rocket fixed bottom-4 right-4 z-50"
      @click="next"
    >
      <span class="flare flare-next" aria-hidden="true" />
      <img src="/page_next.png" alt="" class="rocket-img" draggable="false" />
    </button>
  </div>
</template>

<script setup lang="ts">
const { canPrev, canNext, prev, next } = useSlideScroll()
</script>

<style scoped>
.nav-rocket {
  border: 0;
  padding: 0;
  background: transparent;
  line-height: 0;
}

.rocket-img {
  width: 110px;
  height: auto;
  pointer-events: none;
  user-select: none;
  filter: drop-shadow(0 0 10px rgba(255, 90, 40, 0.25));
  transition: filter 0.25s ease;
}

@media (min-width: 768px) {
  .rocket-img {
    width: 150px;
  }
}

/* hover: slight shake + brighter exhaust */
.nav-rocket:hover .rocket-img {
  animation: rocket-shake 0.45s ease-in-out infinite;
  filter: brightness(1.18) drop-shadow(0 0 16px rgba(255, 110, 40, 0.65))
    drop-shadow(0 0 34px rgba(255, 60, 20, 0.35));
}

@keyframes rocket-shake {
  0%, 100% { transform: translate(0, 0) rotate(0deg); }
  20%      { transform: translate(-1.5px, 1px) rotate(-1.2deg); }
  40%      { transform: translate(2px, -1px) rotate(1.1deg); }
  60%      { transform: translate(-2px, -1.5px) rotate(-0.8deg); }
  80%      { transform: translate(1.5px, 1.5px) rotate(1.3deg); }
}

/* exhaust flare — positioned at the flame end of each rocket */
.flare {
  position: absolute;
  top: 50%;
  width: 84px;
  height: 84px;
  transform: translateY(-50%);
  border-radius: 50%;
  background: radial-gradient(
    circle,
    rgba(255, 214, 130, 0.95) 0%,
    rgba(255, 120, 40, 0.6) 35%,
    rgba(255, 40, 20, 0.3) 60%,
    transparent 78%
  );
  filter: blur(8px);
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.25s ease;
}

/* back rocket points left → flame exits on the RIGHT of the image */
.flare-back { right: -18px; }
/* next rocket points right → flame exits on the LEFT of the image */
.flare-next { left: -18px; }

.nav-rocket:hover .flare {
  opacity: 1;
  animation: flare-pulse 0.7s ease-in-out infinite alternate;
}

@keyframes flare-pulse {
  from { transform: translateY(-50%) scale(0.85); }
  to   { transform: translateY(-50%) scale(1.25); }
}

@media (prefers-reduced-motion: reduce) {
  .nav-rocket:hover .rocket-img,
  .nav-rocket:hover .flare {
    animation: none;
  }
}
</style>
