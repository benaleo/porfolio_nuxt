export function useTheme() {
  const isDark = useState<boolean>('isDark', () => false)

  const apply = (_val: boolean) => {
    // Dark mode disabled: ensure 'dark' class is removed
    if (typeof document === 'undefined') return
    document.documentElement.classList.remove('dark')
  }

  const detect = () => {
    // Always light mode
    return false
  }

  onMounted(() => {
    isDark.value = false
    apply(false)
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('theme', 'light')
    }
  })

  const toggle = () => {
    // No-op: dark mode disabled
    isDark.value = false
    apply(false)
  }

  return { isDark, toggle }
}
