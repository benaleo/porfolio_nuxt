/**
 * Paged-slide orchestration for the landing page.
 *
 * The public home page renders a full-viewport `#scroll-root` container. Each
 * direct-child `<section id="...">` is one full-screen slide (exactly `h-dvh`).
 * The root itself is `overflow-hidden` so the page never free-scrolls; movement
 * between slides is PAGED — driven by the Prev/Next buttons, wheel, keyboard,
 * and touch — via a programmatic `root.scrollTo`. Content taller than the
 * viewport lives inside a `.slide-inner` element that scrolls internally.
 *
 * `goTo`/`next`/`prev` set the active index explicitly (deterministic) and
 * scroll the root to the target section's `offsetTop`. The shared
 * `slide-active-idx` state stays in sync so the galaxy scene can read it for
 * camera drift.
 *
 * The slide list is DYNAMIC: sections load their data late and
 * Education/Experience render nothing when empty, so a ResizeObserver + explicit
 * re-measure keeps the id list (dots/nav) and the active index accurate.
 */

/** Id of the scroll container the landing page renders. */
export const SCROLL_ROOT_ID = 'scroll-root'

/** How long (ms) paging is locked after a wheel/touch page, to swallow momentum. */
const PAGE_LOCK_MS = 750
/** Minimum vertical swipe distance (px) to count as a touch page. */
const TOUCH_THRESHOLD = 60

export const useSlideScroll = () => {
  /** Active slide index — shared with the galaxy scene for camera drift. */
  const activeIdx = useState<number>('slide-active-idx', () => 0)
  /** Section ids in DOM order — drives the side dots / nav. */
  const slideIds = useState<string[]>('slide-ids', () => [])

  /** True while another slide exists after the active one. */
  const canNext = computed(() => activeIdx.value < slideIds.value.length - 1)
  /** True while another slide exists before the active one. */
  const canPrev = computed(() => activeIdx.value > 0)

  /** Direct `<section id>` children of the scroll root, in document order. */
  const getSections = (): HTMLElement[] => {
    if (!import.meta.client) return []
    const root = document.getElementById(SCROLL_ROOT_ID)
    if (!root) return []
    return Array.from(root.querySelectorAll<HTMLElement>(':scope > section[id]'))
  }

  /** Refresh the id list (for dots/nav) and clamp the active index. */
  const measure = () => {
    if (!import.meta.client) return
    const sections = getSections()
    const ids = sections.map((s) => s.id)
    // Only assign when changed to avoid needless reactivity churn.
    if (ids.length !== slideIds.value.length || ids.some((id, i) => id !== slideIds.value[i])) {
      slideIds.value = ids
    }
    if (ids.length > 0) {
      activeIdx.value = Math.min(activeIdx.value, ids.length - 1)
    }
  }

  /**
   * Scroll to a slide by index or id, setting the active index explicitly.
   * When the scroll root is not on the page (e.g. `goTo` fired from the blog
   * route's nav) fall back to a hash nav back to the home page.
   */
  const goTo = (target: number | string, smooth = true) => {
    if (!import.meta.client) return
    const root = document.getElementById(SCROLL_ROOT_ID)
    const sections = getSections()

    let idx: number
    let id: string | undefined
    if (typeof target === 'number') {
      idx = target
      id = sections[target]?.id
    } else {
      id = target
      idx = sections.findIndex((s) => s.id === target)
    }

    const section = sections[idx]
    if (root && section) {
      activeIdx.value = idx
      root.scrollTo({ top: section.offsetTop, behavior: smooth ? 'smooth' : 'auto' })
      return
    }
    // Scroll root absent (called from another route) — deep-link home.
    if (id) navigateTo('/#' + id)
  }

  /** Page to the next slide (clamped at the end, no wrap). */
  const next = () => {
    if (canNext.value) goTo(activeIdx.value + 1)
  }
  /** Page to the previous slide (clamped at the start, no wrap). */
  const prev = () => {
    if (canPrev.value) goTo(activeIdx.value - 1)
  }

  // ── Input handling ────────────────────────────────────────────────────────
  // Listeners are registered once per init() call and torn down by destroy().
  let ro: ResizeObserver | null = null
  let attachedRoot: HTMLElement | null = null
  /** Timestamp until which wheel/touch paging is ignored (momentum lock). */
  let pageLockUntil = 0
  let touchStartY = 0

  /** Walk up from `node` to the scroll root, testing each `.slide-inner`. */
  const innerCanScroll = (node: EventTarget | null, dir: 1 | -1): boolean => {
    let el = node instanceof HTMLElement ? node : null
    const root = document.getElementById(SCROLL_ROOT_ID)
    while (el && el !== root) {
      if (el.classList.contains('slide-inner')) {
        if (dir > 0) {
          // Scrolling down: room left below?
          if (el.scrollTop + el.clientHeight < el.scrollHeight - 1) return true
        } else {
          // Scrolling up: room left above?
          if (el.scrollTop > 0) return true
        }
      }
      el = el.parentElement
    }
    return false
  }

  const onResize = () => {
    measure()
    // Section offsetTop shifts with viewport height — re-anchor instantly.
    if (!import.meta.client) return
    const root = document.getElementById(SCROLL_ROOT_ID)
    const section = getSections()[activeIdx.value]
    if (root && section) root.scrollTo({ top: section.offsetTop, behavior: 'auto' })
  }

  const onWheel = (event: WheelEvent) => {
    const dir: 1 | -1 = event.deltaY > 0 ? 1 : -1
    // Let a still-scrollable inner area consume the wheel naturally.
    if (innerCanScroll(event.target, dir)) return
    event.preventDefault()
    const now = Date.now()
    if (now < pageLockUntil) return
    if (Math.abs(event.deltaY) < 1) return
    pageLockUntil = now + PAGE_LOCK_MS
    if (dir > 0) next()
    else prev()
  }

  const isEditableTarget = (t: EventTarget | null): boolean => {
    const el = t instanceof HTMLElement ? t : null
    if (!el) return false
    const tag = el.tagName
    return (
      tag === 'INPUT' ||
      tag === 'TEXTAREA' ||
      tag === 'SELECT' ||
      el.isContentEditable
    )
  }

  const onKeydown = (event: KeyboardEvent) => {
    if (isEditableTarget(event.target)) return
    const key = event.key
    if (key === 'ArrowDown' || key === 'PageDown' || key === ' ' || key === 'Spacebar') {
      event.preventDefault()
      next()
    } else if (key === 'ArrowUp' || key === 'PageUp') {
      event.preventDefault()
      prev()
    }
  }

  const onTouchStart = (event: TouchEvent) => {
    touchStartY = event.touches[0]?.clientY ?? 0
  }

  const onTouchEnd = (event: TouchEvent) => {
    const endY = event.changedTouches[0]?.clientY ?? 0
    const deltaY = touchStartY - endY // positive = swipe up = go next
    if (Math.abs(deltaY) < TOUCH_THRESHOLD) return
    const dir: 1 | -1 = deltaY > 0 ? 1 : -1
    // Respect an inner scrollable area under the swipe start point.
    if (innerCanScroll(event.target, dir)) return
    const now = Date.now()
    if (now < pageLockUntil) return
    pageLockUntil = now + PAGE_LOCK_MS
    if (dir > 0) next()
    else prev()
  }

  /**
   * Attach paging + measurement listeners to the live scroll root. Called by the
   * page once slides have mounted; re-measures as slides appear asynchronously.
   * Returns a `destroy()` for teardown.
   */
  const init = () => {
    if (!import.meta.client) return () => {}
    destroy()
    const root = document.getElementById(SCROLL_ROOT_ID)
    if (!root) return () => {}
    attachedRoot = root
    root.addEventListener('wheel', onWheel, { passive: false })
    root.addEventListener('touchstart', onTouchStart, { passive: true })
    root.addEventListener('touchend', onTouchEnd, { passive: true })
    window.addEventListener('resize', onResize)
    window.addEventListener('keydown', onKeydown)
    ro = new ResizeObserver(() => measure())
    ro.observe(root)
    measure()
    return destroy
  }

  const destroy = () => {
    if (!import.meta.client) return
    if (attachedRoot) {
      attachedRoot.removeEventListener('wheel', onWheel)
      attachedRoot.removeEventListener('touchstart', onTouchStart)
      attachedRoot.removeEventListener('touchend', onTouchEnd)
      attachedRoot = null
    }
    window.removeEventListener('resize', onResize)
    window.removeEventListener('keydown', onKeydown)
    if (ro) {
      ro.disconnect()
      ro = null
    }
  }

  return { activeIdx, slideIds, canNext, canPrev, measure, goTo, next, prev, init, destroy }
}
