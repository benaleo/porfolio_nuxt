export function useTheme() {
  const isDark = useState<boolean>('isDark', () => false)

  const apply = (val: boolean) => {
    if (typeof document === 'undefined') return
    const root = document.documentElement
    root.classList.toggle('dark', val)
  }

  const detect = () => {
    if (typeof window === 'undefined') return false
    const saved = localStorage.getItem('theme')
    if (saved === 'dark') return true
    if (saved === 'light') return false
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
  }

  onMounted(() => {
    const val = detect()
    isDark.value = val
    apply(val)
  })

  const toggle = () => {
    const val = !isDark.value
    isDark.value = val
    apply(val)
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('theme', val ? 'dark' : 'light')
    }
  }

  return { isDark, toggle }
}
