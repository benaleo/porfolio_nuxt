export const useNavVisibility = () => {
  const visible = useState<Record<string, boolean>>('nav-section-visibility', () => ({
    projects: true,
    education: true,
    experience: true,
    counters: true,
    blog: true,
    contact: true,
  }))

  const setVisible = (section: string, isVisible: boolean) => {
    visible.value[section] = isVisible
  }

  return { visible, setVisible }
}
