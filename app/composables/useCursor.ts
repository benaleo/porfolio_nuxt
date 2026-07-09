// Shared cursor state from a single global mousemove listener.
// SSR-safe: no window access at module top level; listener registered
// once on the client (module flag guard) and kept for the app lifetime.

let initialized = false

export function useCursor() {
  const x = useState<number>('cursor-x', () => -200)
  const y = useState<number>('cursor-y', () => -200)
  const nx = useState<number>('cursor-nx', () => 0)
  const ny = useState<number>('cursor-ny', () => 0)
  const visible = useState<boolean>('cursor-visible', () => false)

  if (import.meta.client && !initialized) {
    initialized = true

    const onMove = (e: MouseEvent) => {
      x.value = e.clientX
      y.value = e.clientY
      const w = window.innerWidth || 1
      const h = window.innerHeight || 1
      nx.value = (e.clientX / w) * 2 - 1
      ny.value = (e.clientY / h) * 2 - 1
      if (!visible.value) visible.value = true
    }

    const onLeave = () => {
      visible.value = false
    }

    window.addEventListener('mousemove', onMove, { passive: true })
    document.addEventListener('mouseleave', onLeave)
  }

  return { x, y, nx, ny, visible }
}
