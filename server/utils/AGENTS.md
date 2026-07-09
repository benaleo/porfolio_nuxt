<!-- Parent: ../AGENTS.md -->

# server/utils/

Server-only shared utilities, auto-imported into route handlers by Nitro. Each external service client is constructed exactly once here.

## Key Files

| File | Description |
|------|-------------|
| `auth.ts` | JWT session in httpOnly `auth_token` cookie (`jose`, HS256, 7-day expiry). Exports `setSession`, `clearSession`, `requireAuth` (throws 401), `tryGetAuth` (returns null) |
| `prisma.ts` | Exports `db` — the single Accelerate-extended `PrismaClient` |
| `r2.ts` | Exports `r2` (S3Client against Cloudflare R2) plus `uploadBufferToR2`, `deleteR2ObjectByKey`, `r2PublicUrl`, `keyFromPublicUrl` |

## For AI Agents

- `auth.ts` reads `JWT_SECRET` with a `dev_secret_change_me` fallback — never rely on the fallback in prod-facing changes.
- `r2.ts` reads `process.env` at module scope and deliberately does **not** throw at import time when R2 vars are missing; handlers must surface clear errors instead. `uploadBufferToR2` returns the **public URL** (that is what gets persisted in DB); `keyFromPublicUrl` reverses it for deletes.
- Guard rule from root AGENTS.md applies: never instantiate `PrismaClient`, a JWT signer, or an S3 client anywhere else.
