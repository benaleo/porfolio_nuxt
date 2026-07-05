<!-- Parent: ../AGENTS.md -->

# server/api/

H3 file-based routes. Filename encodes method: `index.get.ts`, `index.post.ts`, `[id].get.ts`, `[id].patch.ts`, `[id].delete.ts`.

## Subdirectories

| Directory | Auth | Model |
|-----------|------|-------|
| `auth/` | `login.post.ts` public; `logout.post.ts`/`me.get.ts` need session | — (issues/clears `auth_token` cookie) |
| `blog/` | `requireAuth` on write, public read | `BlogPost` (`by-slug/` subfolder serves public detail by slug) |
| `projects/` | `requireAuth` on write, public read | `Project` |
| `education/`, `experience/` | `requireAuth` on write, public read | `Education`, `Experience` |
| `log-trafic/` | `index.post.ts` public (client beacon); `index.get.ts`/`top.get.ts` need auth | `LogTrafic` |
| `requests/` | `requireAuth` | `RequestContact` |

## Key Files (root of `api/`)

| File | Description |
|------|-------------|
| `contact.post.ts` | Public — creates a `RequestContact` row |
| `profile.get.ts` / `profile.patch.ts` | Singleton `Profile` (id=1); patch handles avatar replace via R2 |
| `stats.get.ts` | Aggregate counts for the CMS dashboard |
| `upload.post.ts` | Generic R2 upload endpoint used by CMS forms |

## For AI Agents

- New resource: add the Prisma model, run `db:generate`, then create a subfolder here mirroring `education/`'s CRUD shape (or `blog/`'s if it needs image upload + rich text).
- Call `await requireAuth(event)` as the first line of any handler that mutates data; skip it only for the deliberately-public endpoints listed above.
