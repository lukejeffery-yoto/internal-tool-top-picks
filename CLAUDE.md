# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Internal tool for Yoto's ecomm team to manage the "Top Picks" carousel on the Discover tab. Replaces manual database updates with a simple UI for adding, removing, and reordering carousel items. Supports 6 regions (US, CA, UK, AU, EU, FR).

## Tech Stack

- **Next.js** (App Router) — frontend + API routes
- **Neon Postgres** — persistence via `@neondatabase/serverless`
- **@dnd-kit** — drag-and-drop reordering
- **No auth** — internal-only tool
- **Deployed on Vercel** — auto-deploys from `main`

## Commands

- `npm run dev` — start dev server
- `npm run build` — production build
- `npm run lint` — lint

## Architecture

- `src/app/` — Next.js App Router pages and API routes
- `src/app/api/picks/[region]/` — GET/PUT picks per region
- `src/lib/` — data layer, types, DB access, mock product data
- `src/lib/db.ts` — Neon Postgres queries (schema auto-creates)
- `src/lib/mock-products.ts` — scraped product data per region
- `src/context/TopPicksContext.tsx` — shared state for picks + regions
- `src/components/management/` — left panel (region tabs, catalog, sortable picks)
- `src/components/preview/` — right panel (phone mockup with Discover/Expanded views)

## Versioning

Version is displayed in the UI header and sourced from `package.json`. **Bump the version in `package.json` with every push** (patch for fixes, minor for features).
