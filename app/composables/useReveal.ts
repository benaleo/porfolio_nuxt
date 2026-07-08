import { ref, watch, onBeforeUnmount } from 'vue'
import type { Ref } from 'vue'
import { SCROLL_ROOT_ID } from '~/composables/useSlideScroll'

/**
 * Replay-on-enter reveal. Attach `el` to a slide and bind entrance animations
 * to `active`: it flips true while the element is sufficiently in view and false
 * once it leaves, so animations REPLAY every time the slide scrolls back in
 * (unlike v-motion's `:visibleOnce`).
 *
 * The IntersectionObserver watches within the `#scroll-root` scroll container.
 * The target may mount after this composable is created (slides render behind a
 * `v-if`), so the observer (re)attaches whenever `el` becomes available.
 */
export const useReveal = (threshold = 0.35): { el: Ref<HTMLElement | null>; active: Ref<boolean> } => {
  const el = ref<HTMLElement | null>(null)
  const active = ref(false)
  let obs: IntersectionObserver | null = null

  const disconnect = () => {
    obs?.disconnect()
    obs = null
  }

  watch(
    el,
    (target) => {
      disconnect()
      if (!import.meta.client || !target) return
      obs = new IntersectionObserver(
        (entries) => {
          const entry = entries[0]
          if (!entry) return
          active.value = entry.isIntersecting && entry.intersectionRatio >= threshold
        },
        {
          root: document.getElementById(SCROLL_ROOT_ID),
          threshold: [0, threshold, 0.6, 1],
        },
      )
      obs.observe(target)
    },
    { immediate: true, flush: 'post' },
  )

  onBeforeUnmount(disconnect)

  return { el, active }
}
