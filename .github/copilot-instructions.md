# Copilot instructions for crm-manager

This file guides Copilot sessions for this repository. Keep changes minimal and update when scripts or architecture change.

## 1) Build, test, and lint commands
- Dev server: npm run dev
- Build: npm run build
- Start (production): npm run start
- Lint: npm run lint

Database / Prisma:
- Generate client: npm run db:generate  (runs `prisma generate`)
- Run migrations (local/dev): npm run db:migrate  (runs `prisma migrate dev`)
- Open Prisma Studio: npm run db:studio
- Seed database: npm run db:seed  (runs `tsx prisma/seed.ts` if present)

Tests:
- No test framework or test scripts are configured in package.json. When tests are added, include a `test` script in package.json and run a single test file with: npm test -- <file-or-pattern>

## 2) High-level architecture (short)
- Monorepo-style single Next.js app using the App Router (app/). Frontend and API coexist in the same project.
- Server-side DB access uses Prisma with SQLite by default (prisma/schema.prisma or docs/06-prisma-schema.prisma).
- lib/prisma.ts exports a singleton cached on globalThis in development to avoid multiple PrismaClient instances.
- UI: Tailwind CSS + shadcn/ui components. Global styles are in app/globals.css. Components are under components/ (ui primitives and domain components).
- API routes live under app/api/* and use Next.js route handlers (fetch/route handlers and server components where appropriate).
- Exports: API endpoints for Excel/PDF exist under app/api/export/*.

## 3) Key conventions specific to this repo
- Prisma client: always import the exported `prisma` from lib/prisma.ts. Do NOT create new PrismaClient() instances in request handlers.
- Environment: use DATABASE_URL=file:./dev.db for local SQLite (docs/05-project-setup.md). Keep .env.local out of commits.
- Seeding: db:seed expects tsx + prisma/seed.ts. Ensure tsx is available in devDependencies before using.
- App Router patterns: use page.tsx inside route folders; new items use new/page.tsx and single-resource pages use [id]/page.tsx.
- Validation: Zod is the repo validation standard. Search for lib/schemas.ts or inline Zod schemas next to API routes.
- Tailwind: content includes app/, components/, and pages/; neon theme customizations are present in docs and globals.css.
- Exports & utilities: look under lib/ for utilities (lib/utils.ts) and for the Prisma client (lib/prisma.ts).

## 4) Helpful files and docs to read first
- package.json — scripts and dependencies
- docs/05-project-setup.md — quick start and env examples
- docs/01-architecture-tech-stack.md — architecture and stack overview
- docs/06-prisma-schema.prisma — canonical Prisma schema
- lib/prisma.ts — Prisma client pattern and caching

## 5) AI assistant / configuration files
- No assistant-specific files (CLAUDE.md, .cursorrules, AGENTS.md, etc.) were detected. If adding assistant rules, place them at the repo root or under .github for discoverability.

## 6) Notes for Copilot sessions
- Read docs/*.md and lib/prisma.ts before making DB migrations or client code changes.
- After schema changes run: npm run db:generate && npm run db:migrate to validate locally.
- When adding tests, add a `test` script and document how to run a single test file (npm test -- <file-or-pattern>).
- Avoid adding multiple PrismaClient instances — use the shared exported client.


---

(End of instructions)
