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

## Environment

Expected environment variables depending on the target environment:

- `PAYLOAD_SECRET`
- `DATABASE_URL` or `DATABASE_URI`
- `BLOB_READ_WRITE_TOKEN`
- email-related variables used by the form handlers

`.env*` files are intentionally kept out of version control.

## Summary

`The Grid` is more than a marketing website. It is a modern web foundation that demonstrates the ability to build a high-end, high-performance, multi-locale editorial platform that a business team can operate autonomously.
