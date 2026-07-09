<template>
  <ClientOnly>
    <Teleport to="body">
      <!-- Rocket cursor -->
      <div
        v-show="visible"
        class="rocket-cursor-root"
        :style="{ transform: `translate(${x}px, ${y}px)` }"
      >
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
// Cursor position/visibility is owned by useCursor() — one global listener.
const { x, y, visible } = useCursor()
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

/* ── rocket cursor wrapper ── */
.rocket-cursor-root {
  position: fixed;
  top: 0;
  left: 0;
  pointer-events: none;
  z-index: 99999;
  /* center the 24px rocket on cursor point */
  margin-left: -12px;
  margin-top: -12px;
  width: 24px;
  height: 24px;
  will-change: transform;
}

/* ── rocket icon ── */
.rocket {
  width: 24px;
  height: 24px;
  transform: rotate(45deg);
  filter: drop-shadow(0 0 4px rgba(56, 189, 248, 0.7));
}
</style>
