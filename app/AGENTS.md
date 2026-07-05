<!-- Parent: ../AGENTS.md -->

# app/

Nuxt 4 source directory (`srcDir: app/`). Public site + CMS live here as one Vue app; `middleware/admin.ts` gates `/console/**`.

## Subdirectories

| Directory | Purpose |
|-----------|---------|
| `components/` | Shared + feature components (see `components/AGENTS.md`) |
| `pages/` | File-based routes: `index.vue`, `blog/`, `projects/[id].vue`, `console/` (see `pages/console/AGENTS.md`) |
| `layouts/` | `default.vue` (public) and `console.vue` (CMS, applies `admin` middleware) |
| `composables/` | `useTheme` (dark/light via `data-mode`), `useLogTrafic` (visit logging beacon) |
| `data/` | Static fallback content (`blog.ts`, `projects.ts`, `education.ts`, `experience.ts`) — used when DB has no rows yet |
| `types/` | Shared TS types (`profile.types.ts`) |
| `plugins/` | `motion.client.ts` — client-only `@vueuse/motion` registration |

## For AI Agents

- `app.vue` forces `data-mode="light"` at root; theme toggling happens client-side via `useTheme`.
- Sections under `components/sections/` are assembled in `pages/index.vue` — new homepage content is a new section component + wire-in there, not a page.
- `data/*.ts` mirrors the Prisma models' shape; keep both in sync if you change a model used as a fallback.
