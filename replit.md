# Agunnaya AI Studio

AI-native Web3 platform for code generation, AI chat, and blockchain integration — ported from Vercel/Next.js to Replit pnpm workspace.

## Run & Operate

- `pnpm --filter @workspace/agunnaya-ai run dev` — run the frontend (Vite + React)
- `pnpm --filter @workspace/api-server run dev` — run the API server
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas
- Required secrets: `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- Frontend: React + Vite (artifact: `agunnaya-ai`, path: `/`)
- Routing: wouter
- Auth: Supabase (`@supabase/supabase-js`)
- Styling: Tailwind CSS v4
- API: Express 5 (artifact: `api-server`, path: `/api`)
- DB: PostgreSQL + Drizzle ORM
- Validation: Zod (`zod/v4`), `drizzle-zod`

## Where things live

- `artifacts/agunnaya-ai/src/pages/` — all page components (home, auth/*, dashboard/*)
- `artifacts/agunnaya-ai/src/lib/supabase.ts` — Supabase client factory
- `artifacts/agunnaya-ai/src/App.tsx` — wouter route definitions
- `artifacts/agunnaya-ai/src/index.css` — global styles + theme tokens (Tailwind v4)
- `artifacts/api-server/src/` — Express API server
- `lib/db/src/schema/` — Drizzle schema (source of truth for DB)
- `lib/api-spec/openapi.yaml` — OpenAPI spec (source of truth for API contracts)

## Architecture decisions

- Next.js → Vite + React migration: file-based routing replaced with wouter routes in App.tsx
- `next/link` replaced with wouter `<Link>`, `useRouter` replaced with `useLocation`
- Next.js middleware (Supabase session refresh) is not needed in the Vite SPA — auth guard is done client-side in each protected page
- Auth callback route (`/auth/callback`) handles `exchangeCodeForSession` client-side via `useEffect`
- Supabase client created per-call via `createClient()` factory (not a singleton) to avoid stale session issues

## Product

- Landing page with hero, features, pricing, FAQ, and footer
- Supabase email/password auth: sign up, login, sign-up success, error, and OAuth callback pages
- Dashboard (requires auth) with nav, stats, CTA cards, and getting-started checklist

## User preferences

_Populate as you build — explicit user instructions worth remembering across sessions._

## Gotchas

- Supabase credentials must be set as secrets: `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`
- Do NOT run `pnpm dev` at workspace root — use workflow or `pnpm --filter @workspace/agunnaya-ai run dev`
- The `postcss.config.mjs` from the original Next.js project was intentionally skipped (conflicts with `@tailwindcss/vite` in Tailwind v4)

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
