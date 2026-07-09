<!-- Parent: ../AGENTS.md -->

# server/

Nuxt H3 server (Nitro). File-based API routes plus shared server-only utilities.

## Subdirectories

| Directory | Purpose |
|-----------|---------|
| `api/` | Resource route handlers (see `api/AGENTS.md`) |
| `utils/` | `auth.ts`, `prisma.ts`, `r2.ts` — the only places JWT, DB client, and R2 client are constructed (see `utils/AGENTS.md`) |

## For AI Agents

- Never instantiate `PrismaClient`, a JWT signer, or an S3 client outside `utils/` — always import the shared instance.
- `runtimeConfig` (server-only secrets) is read via `useRuntimeConfig()`, never `process.env`, so behavior stays consistent across environments.
