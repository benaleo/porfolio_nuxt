<!-- Parent: ../AGENTS.md -->

# app/pages/console/

CMS pages. All inherit `layouts/console.vue`, which applies the `admin` middleware — do not add `middleware: ['admin']` per page.

## Key Files

| File | Description |
|------|-------------|
| `login.vue` | Public (uses `guest` middleware to bounce logged-in users away) |
| `dashboard.vue` | Landing page after login; stats overview |
| `blog.vue`, `projects.vue` | Full CRUD UI with Quill rich-text editor + R2 image upload — canonical reference for new resource pages |
| `education.vue`, `experience.vue` | Simpler CRUD (no rich text/upload) |
| `profile.vue` | Singleton resource (`Profile` model, id=1); includes avatar upload/replace |
| `request-contact.vue` | Read-only list of `RequestContact` submissions |
| `log-trafic.vue` | Read-only traffic log viewer (`LogTrafic` model) |

## For AI Agents

- New CMS page for a new resource: copy `blog.vue` or `projects.vue` (if it needs an image) or `education.vue` (if plain CRUD), then point `$fetch` calls at the matching `server/api/<resource>/` routes.
- Every write (`$fetch` POST/PATCH/DELETE) needs `credentials: 'include'` for the auth cookie to be sent.
- Replacing an uploaded image: delete the old R2 object first — see `server/api/profile.patch.ts`.
