# The Grid

Premium corporate website built with `Next.js 16`, `React 19`, `Payload CMS 3`, and `next-intl`, with a custom back office designed to manage content, translations, media, and visual direction.

Production: `https://the-grid.vercel.app`  
Repository backup: `https://github.com/monsiaz/the-grid`

## What This Project Showcases

This repository highlights a full product-oriented approach at the intersection of design, performance, and editorial tooling:

- modern frontend architecture with `Next.js App Router`
- a custom headless CMS and admin experience powered by `Payload`
- multi-locale internationalization
- image, CDN, caching, and rendering optimization
- fast iteration in production through `Vercel`
- an admin experience designed for non-technical teams

## Technical Expertise Highlighted

This project is a strong showcase of the following capabilities:

- building premium web experiences that are fast and conversion-oriented
- delivering pixel-perfect integrations from mockups and client feedback
- structuring content so it can be managed from a back office
- technical SEO and performance-focused rendering architecture
- optimizing Core Web Vitals, assets, caching, and delivery
- setting up publishing, translation, and revalidation workflows
- creating editorial tools that reduce dependence on developers

## Stack

- `Next.js 16`
- `React 19`
- `TypeScript`
- `Payload CMS 3`
- `next-intl`
- `Postgres` in production / `SQLite` locally
- `Vercel Blob` for the media library
- `Resend` for email forms
- `Framer Motion` for animations
- `Sass` plus custom global styling

## Key Features

- multi-section marketing pages: home, about, services, drivers, news, and contact
- custom back office with The Grid branding, French labels, and tailored navigation
- editable globals and collections from the admin panel
- dynamic news tags and content blocks
- media library connected to `Vercel Blob`
- contact and newsletter forms with email handling
- translation workflow across multiple locales
- on-demand revalidation so admin updates appear quickly in production
- rich visual components: sliders, flip cards, hero sections, and dynamic content

## Vercel and Performance Focus

The project was designed for smooth deployment and iteration on `Vercel`:

- frontend and CMS deployed within the same Next.js application
- database connection tuning to avoid build-time saturation
- on-demand revalidation after CMS saves
- images served in `AVIF` and `WebP`
- long-lived caching for static assets
- `Vercel Blob` support for media uploads

## Recent Vercel Delivery History

A snapshot of recent iterations pushed before deployment:

- `bde99b8` - full backup of the current project state
- `e0c466f` - adjusted the services image framing on mobile
- `2f718f3` - refined scale and focal point for the services image
- `d7d2cb3` - added The Grid admin design, grouped navigation, and French editor labels
- `46a16bd` - simplified and cleaned up the mobile footer
- `c175fa3` - added a collapsible translations summary in the back office
- `4cb0565` - streamlined the mobile footer and locale switcher
- `6a4310f` - finalized Guillaume's Blob-based image crop
- `9fa5660` - simplified the locale switcher
- `f0367b4` - translated the homepage into Chinese in the database
- `be57203` - inlined the remaining SVG assets to improve production reliability
- `4c9808f` - added animated mobile contact form interactions

## Run Locally

```bash
pnpm install
pnpm dev
```

Then open `http://localhost:3000`.

## Useful Scripts

```bash
pnpm dev
pnpm build
pnpm start
pnpm lint
pnpm seed
```

## Pre-deploy checklist

Run locally before pushing (or rely on [GitHub Actions](.github/workflows/ci.yml) for `tsc` + `lint` on each PR):

1. **`pnpm exec tsc --noEmit`** — TypeScript must pass.
2. **`pnpm lint`** — ESLint (macOS `._*` sidecar files on external volumes are ignored via `eslint.config.mjs`).
3. **`pnpm build`** — Full Next.js + Payload build; requires the same env vars as production (`DATABASE_URL`, `PAYLOAD_SECRET`, `BLOB_READ_WRITE_TOKEN`, etc.). Use a `.env.local` that mirrors Vercel or pull from your secrets manager.
4. **After deploy (optional smoke test)** — `node scripts/_verify-prod.mjs` captures full-page screenshots of key URLs (needs Chrome at the path in that script; adjust for your machine).

## CI (GitHub Actions)

- **On push/PR to `main`:** installs deps with a frozen lockfile, runs `tsc --noEmit` and `eslint .`.
- **Optional full build:** in the Actions tab, run workflow **CI** manually and enable **run_build** — set repository secrets (`DATABASE_URL`, `PAYLOAD_SECRET`, `BLOB_READ_WRITE_TOKEN`, `NEXT_PUBLIC_SERVER_URL`, etc.) to match Vercel.

## Vercel

- For **`the-grid-sa`**, the Vercel API reports **`buildCommand` and `installCommand` as unset** (`null`). With **Framework Preset: Next.js** and a **`pnpm-lock.yaml`** in the repo, Vercel uses **`pnpm install`** and **`pnpm run build`** automatically — matching this project’s `package.json` `build` script (`generate:importmap` → `ensure-schema` → `next build`). You only need to override those fields if you intentionally diverge from that.
- To require green CI before merging to production: GitHub **Settings → Branches → Branch protection** on `main` → enable **Require status checks to pass** and select the **quality** job from [`.github/workflows/ci.yml`](.github/workflows/ci.yml) (after the first successful run so the check appears in the list).

## Environment

Expected environment variables depending on the target environment:

- `PAYLOAD_SECRET`
- `DATABASE_URL` or `DATABASE_URI`
- `BLOB_READ_WRITE_TOKEN`
- email-related variables used by the form handlers

`.env*` files are intentionally kept out of version control.

## Summary

`The Grid` is more than a marketing website. It is a modern web foundation that demonstrates the ability to build a high-end, high-performance, multi-locale editorial platform that a business team can operate autonomously.
