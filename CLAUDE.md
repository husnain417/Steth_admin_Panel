# CLAUDE.md — Steth_admin_Panel

## What this is, and what it's about to become
Currently a **separate** Next.js 15 (App Router) + React 19 + shadcn/ui project (`v0`-generated originally), its own Vercel deployment, calling the backend via hardcoded absolute URLs (`https://steth-backend.onrender.com/...` appears across most `app/*/page.tsx` files). Per the master plan (Part B.1 / issue #1), this repo's screens are being **migrated into the `Steth_web_frontend` Vite/React app** as an authenticated `/admin/*` section — this is not staying a standalone deployment long-term.

**If the session's task is the migration itself:** work from this repo as the source of UI/logic to port, and the frontend repo's `CLAUDE.md` as the destination conventions. shadcn/ui components (`components/ui/*`) are portable — they're plain Radix + Tailwind, not Next-exclusive — so port the component files directly rather than rewriting them from scratch, but the *pages* (`app/**/page.tsx`, currently Next Server/Client Components) need rewriting as React Router routes/components, not a mechanical file copy.

**If the session's task is something else** (e.g. building a new admin screen from the master plan before the migration happens), build it here for now but keep it self-contained enough to port later — don't deepen the coupling to Next-specific APIs (`next/navigation`, Server Actions, etc.) more than necessary.

## Where we are
Active work plan: `stethset-unified-master-plan.md`. Check `PROGRESS.md` before starting, update it after — specifically note here whether the migration to the frontend repo has started, since that changes where the next session should even be working.

## Run / verify
- `npm run dev` — Next dev server
- `npm run build` — must succeed cleanly
- `npm run lint`
- No test setup exists in this repo.

## Known landmines
- **Almost none of the screens here actually check who's logged in or what role they have.** There's no RBAC enforcement anywhere in this codebase currently — the master plan's Part B.2 (roles: Admin / Warehouse Manager / Marketer) needs to be built essentially from scratch, both here (if a screen is built before migration) and, more importantly, as real server-side route guards once merged into the frontend repo. Don't assume any existing screen's access is already gated just because it looks like an "admin" page — check the corresponding backend route (most are also unguarded, see the backend `CLAUDE.md`).
- **Backend URLs are hardcoded as literal strings** (`https://steth-backend.onrender.com/...`) throughout `app/**/page.tsx`, sometimes with an inconsistent fallback (`process.env.NEXT_PUBLIC_API_URL || 'https://steth-backend.onrender.com/...'` appears in at least one file, but most don't even have that fallback pattern — they're bare literals). When migrating or extending, don't propagate more bare literals; use whatever central API config the frontend repo settles on.
- The `app/api/` folder here is a thin Next.js API layer (an image proxy, hero-image routes) — this is Next-specific server-route code that has no direct equivalent in the Vite frontend. When migrating, this logic likely needs to move to the Express backend instead of being ported as-is, since the destination app is a plain SPA with no server runtime of its own.

## Conventions already in place
- Next.js App Router structure: `app/<section>/page.tsx`, with `app/<section>/[id]/...` for detail/edit views (see `app/orders/[id]/update-status/page.tsx` as the existing pattern for a similar admin action screen).
- shadcn/ui components live in `components/ui/` and are used consistently — match this for any new admin UI rather than writing raw unstyled markup.
- `components/metrics-card.tsx`, `stats-chart.tsx`, `vault-table.tsx`, `navigation.tsx` are existing reusable admin building blocks — check these before building an equivalent from scratch for a new dashboard screen (e.g. the analytics/marketing dashboard in Part B.3/B.5, or the order-tab views in B.1).

## Boundaries
- Don't add new Next-specific server-side features (Server Actions, middleware.ts route protection, etc.) as the "real" fix for the RBAC/auth gaps above — that work belongs in the destination app per the migration plan, not deepened here.
- Don't change the Vercel deployment config for this repo as part of feature work — deployment topology is itself part of what issue #1 is resolving, not something to adjust incrementally.
