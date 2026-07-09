<!-- Parent: ../AGENTS.md -->

# app/components/

Vue SFCs, auto-imported by Nuxt (no manual `import` needed).

## Key Files

| File | Description |
|------|-------------|
| `Counter.vue` | Animated numeric counter, used by `sections/CountersSection.vue` |
| `DarkModeToggle.vue` | Toggles `data-mode` via `useTheme` composable |
| `GalaxyBackground.vue` | Decorative canvas/CSS background for the public homepage |
| `LockScreen.vue` | Full-screen gate driven by `APP_LOCK` env var |
| `ProjectCard.vue` | Project summary card, used on homepage and `pages/projects/[id].vue` |

## Subdirectories

| Directory | Purpose |
|-----------|---------|
| `sections/` | Homepage sections (Intro, Biography, Projects, Blog, Experience, Education, Counters, Contact) assembled by `pages/index.vue` |

## For AI Agents

- Feature-scoped subfolders referenced in the root AGENTS.md (`blog/`, `console/`, `projects/`, `auth/`) may not all exist yet — check before assuming a component location; place new feature components alongside siblings of the same feature.
- New homepage content = new `sections/*.vue` + `v-motion` entrance animation to match existing sections, then import in `pages/index.vue`.
