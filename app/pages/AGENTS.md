<!-- Parent: ../AGENTS.md -->

# app/pages/

Nuxt file-based routes.

## Key Files

| File | Description |
|------|-------------|
| `index.vue` | Public homepage — assembles `components/sections/*` in order; logs visits via `useLogTrafic` |

## Subdirectories

| Directory | Purpose |
|-----------|---------|
| `blog/` | Public blog: `index.vue` list + `by-slug/[slug].vue` detail (fetches `/api/blog/by-slug/...`) |
| `projects/` | Public project detail: `[id].vue` |
| `console/` | CMS pages behind `admin` middleware (see `console/AGENTS.md`) |

## For AI Agents

- Public pages fall back to static content from `app/data/*.ts` when the API returns nothing — keep that fallback intact when editing fetch logic.
- Public routes use `layouts/default.vue` implicitly; only `console/` pages set the `console` layout.
