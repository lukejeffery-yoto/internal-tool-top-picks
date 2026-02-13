# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Internal tool for Yoto's ecomm team to manage the "Top Picks" carousel on the Discover tab. Replaces manual database updates with a simple UI for adding, removing, and reordering carousel items. Supports 6 regions (US, CA, UK, AU, EU, FR).

## Tech Stack

- **Next.js** (App Router) — frontend + API routes
- **Neon Postgres** — persistence via `@neondatabase/serverless`
- **@dnd-kit** — drag-and-drop reordering
- **Slack API** — bot notifications and DMs (via native `fetch`, no SDK)
- **No auth** — internal-only tool
- **Deployed on Vercel** — auto-deploys from `main`

## Commands

- `npm run dev` — start dev server
- `npm run build` — production build
- `npm run lint` — lint

## Architecture

### File Structure

- `src/app/` — Next.js App Router pages and API routes
- `src/app/api/picks/[region]/` — GET/PUT picks per region
- `src/app/api/picks/[region]/publish/` — POST to publish current draft as a version
- `src/app/api/picks/[region]/history/` — GET publish history for a region
- `src/app/api/picks/[region]/restore/` — POST to restore a historical version to draft
- `src/app/api/picks/[region]/sync/` — POST to mark latest version as live (synced)
- `src/app/api/notify/` — POST to send Slack notification for all pending (unsynced) regions
- `src/lib/` — data layer, types, DB access, mock product data
- `src/lib/db.ts` — Neon Postgres queries (schema auto-creates via `ensureSchema()`)
- `src/lib/types.ts` — TypeScript interfaces (`PickVersion`, `Product`)
- `src/lib/slack.ts` — Slack API helpers (channel notifications, user lookup, DMs)
- `src/lib/mock-products.ts` — scraped product data per region
- `src/lib/data.ts` — region/product accessors, re-exports `RegionCode`
- `src/lib/format.ts` — `formatRelativeTime()` utility
- `src/lib/export.ts` — `copyIdsToClipboard()` and `downloadIdsJson()` utilities
- `src/context/TopPicksContext.tsx` — shared state for picks, regions, publish, sync
- `src/components/management/` — left panel (region tabs, catalog, sortable picks, publish bar, history)
- `src/components/preview/` — right panel (phone mockup with Discover/Expanded views)

### Database Schema

Two tables in Neon Postgres, auto-created by `ensureSchema()`:

**`top_picks`** — current draft picks per region
- `id` SERIAL PK
- `region_code` TEXT
- `product_id` TEXT
- `position` INTEGER
- `created_at`, `updated_at` TIMESTAMPTZ
- UNIQUE(region_code, product_id)

**`pick_versions`** — published version history
- `id` SERIAL PK
- `region_code` TEXT
- `product_ids` TEXT (JSON array of product IDs)
- `note` TEXT
- `published_by` TEXT (email, e.g. `luke@yotoplay.com`)
- `published_at` TIMESTAMPTZ
- `synced_at` TIMESTAMPTZ (null = pending sync, set = live)

### Publish → Sync → Notify Workflow

1. **Publish**: Country manager publishes picks → creates a `pick_versions` row with `synced_at = NULL`
2. **Notify Backend**: Anyone clicks "Notify Backend" → `POST /api/notify` → sends ONE Slack message to a channel listing ALL regions with pending (unsynced) publishes
3. **BE runs sync script** externally (not part of this tool)
4. **Mark as Live**: BE clicks "Mark as Live" on a region → `POST /api/picks/{region}/sync` → sets `synced_at = NOW()`, fire-and-forget DMs the publisher via Slack
5. UI shows badges: "Pending Sync" (orange) or "Live" (green) next to the Published badge

### State Management

`TopPicksContext` is the single source of truth for the client. Key state:
- `picksByRegion` — current draft picks (Product[]) per region
- `publishedByRegion` — published product IDs per region
- `syncedAtByRegion` — sync timestamp per region (null = pending)
- Auto-saves drafts on every add/remove/reorder via PUT to `/api/picks/{region}`
- On publish: resets `syncedAt` to null for that region
- On mark as live: updates `syncedAt` from API response

## Environment Variables

| Variable | Purpose |
|---|---|
| `DATABASE_URL` | Neon Postgres connection string |
| `SLACK_BOT_TOKEN` | Slack bot `xoxb-...` token (scopes: `chat:write`, `users:read.email`, `im:write`) |
| `SLACK_CHANNEL_ID` | Slack channel ID for backend notifications |
| `RESEND_API_KEY` | Resend API key for email fallback |
| `RESEND_FROM_EMAIL` | From address for emails (defaults to `onboarding@resend.dev`) |
| `NOTIFY_EMAIL` | BE team email for channel-level notifications |

Notification priority: Slack first, email fallback. Both are optional — core functionality works without either.

## Versioning

Version is displayed in the UI header and sourced from `package.json`. **Bump the version in `package.json` with every push** (patch for fixes, minor for features).

## Key Patterns

- All API routes call `ensureSchema()` first — safe to call repeatedly, handles migrations
- DB queries use Neon's tagged template syntax: `` sql`SELECT ...` ``
- `product_ids` stored as JSON text in DB, parsed via `parseProductIds()` helper
- Notifications use Slack → email fallback chain: try Slack first, if it fails or is unconfigured, send via Resend email
- `src/lib/slack.ts` — Slack helpers; all check for `SLACK_BOT_TOKEN` and return `false` if missing
- `src/lib/email.ts` — Resend helpers; all check for `RESEND_API_KEY` and return `false` if missing
- Publisher emails always end in `@yotoplay.com` — the UI enforces this and only stores the prefix
- The sync endpoint constructs the full email by appending `@yotoplay.com` if needed for Slack/email lookup
