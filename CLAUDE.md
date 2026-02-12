# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Internal tool for Yoto's ecomm team to manage the "Top Picks" carousel on the Discover tab. Replaces manual database updates with a simple UI for adding, removing, and reordering carousel items.

## Tech Stack

- **Next.js** (App Router) — frontend + API routes
- **No auth** — internal-only tool
- **Database** — TBD (data layer abstracted for easy swap)

## Commands

- `npm run dev` — start dev server
- `npm run build` — production build
- `npm run lint` — lint

## Architecture

- `src/app/` — Next.js App Router pages and API routes
- `src/lib/` — data layer and shared utilities
