# Application Routes & Redirects

This document maintains the complete catalog of all public pages, API endpoints, static metadata routes, and application redirects for the INFINITUS Mathematics Club website.

---

## 1. Canonical Host & Environment Configuration

- **Canonical URL:** Defined by the `NEXT_PUBLIC_SITE_URL` environment variable (defaults to `https://infinitus-seven.vercel.app` in `lib/site.js`).
- **WWW Domain Policy:** The redirect for `www.infinitus-seven.vercel.app` has been removed from `next.config.mjs` because `*.vercel.app` domains are hosted directly on Vercel without a customer-controlled `www` CNAME. For custom production domains (e.g. `infinitus.ritchennai.edu.in`), apex/subdomain redirects are managed at the DNS/Vercel project level.

---

## 2. Public Pages

| Path | Purpose | Rendering | Dynamic Params |
| :--- | :--- | :--- | :--- |
| `/` | Landing page (Hero, Lemniscate, Highlights, Latest Events, Committee, Moments) | Server-rendered (with per-request CSP nonce) | None |
| `/about` | Club mission, history, operational pillars, and 2023–2026 timeline | Server-rendered (with per-request CSP nonce) | None |
| `/events` | All events archive with category filter (All, Upcoming, Conducted) | Server-rendered (with per-request CSP nonce) | None |
| `/events/[id]` | Event detail page with poster, venue, date, schedule, registration form | Static SSG (31 paths) + Dynamic Fallback | `id` (e.g. `scilab-workshop`, `shinka-2026`) |
| `/team` | Core Committee 2026–27 member profiles, department badges, role descriptions | Server-rendered (with per-request CSP nonce) | None |
| `/gallery` | Photo highlights archive with keyboard-navigable fullscreen lightbox modal | Server-rendered (with per-request CSP nonce) | None |
| `/contact` | Official query form, club email, Instagram handle, college postal address | Server-rendered (with per-request CSP nonce) | None |

---

## 3. API Endpoints

All endpoints under `/api/*` are guarded by edge middleware:
- **Methods allowed:** `GET`, `HEAD`, `OPTIONS` (All other methods return JSON 405 Method Not Allowed).
- **Robots policy:** `X-Robots-Tag: noindex, nofollow`.
- **Security:** Strict sliding-window rate limiting (Upstash Redis across instances, or in-memory fallback).

| Endpoint | Method | Response | Cache-Control |
| :--- | :--- | :--- | :--- |
| `/api/events` | `GET` | JSON array of normalized event objects. Optional query: `?type=upcoming` or `?type=conducted`. | `public, s-maxage=60, stale-while-revalidate=120` |
| `/api/members` | `GET` | JSON array of active committee member objects with role details. | `public, s-maxage=60, stale-while-revalidate=120` |

---

## 4. Metadata & SEO Infrastructure

| Path | Format | Generator |
| :--- | :--- | :--- |
| `/sitemap.xml` | XML | [app/sitemap.js](file:///c:/Users/austi/OneDrive/Desktop/Infinitus%20Website/Infinitus/app/sitemap.js) (Auto-indexes static pages and all 31 individual event routes) |
| `/robots.txt` | Text | [app/robots.js](file:///c:/Users/austi/OneDrive/Desktop/Infinitus%20Website/Infinitus/app/robots.js) (Allows all public routes, disallows `/api/*`, links sitemap) |
| `/manifest.webmanifest` | JSON | [app/manifest.js](file:///c:/Users/austi/OneDrive/Desktop/Infinitus%20Website/Infinitus/app/manifest.js) (PWA web app manifest with 32, 192, 512, and maskable icons) |
| `/opengraph-image` | PNG | [app/opengraph-image.jsx](file:///c:/Users/austi/OneDrive/Desktop/Infinitus%20Website/Infinitus/app/opengraph-image.jsx) (Dynamic 1200×630 OpenGraph card with `CORP: cross-origin`) |
| `/icon.png` | PNG | [app/icon.png](file:///c:/Users/austi/OneDrive/Desktop/Infinitus%20Website/Infinitus/app/icon.png) (32×32 favicon) |
| `/favicon.ico` | ICO | [app/favicon.ico](file:///c:/Users/austi/OneDrive/Desktop/Infinitus%20Website/Infinitus/app/favicon.ico) (Multi-resolution 16/32/48 ICO) |
| `/apple-icon.png` | PNG | [app/apple-icon.png](file:///c:/Users/austi/OneDrive/Desktop/Infinitus%20Website/Infinitus/app/apple-icon.png) (180×180 iOS touch icon) |

---

## 5. Configured Redirects (`next.config.mjs`)

All redirects are configured as **temporary (HTTP 307)** using `permanent: false` so that URLs can be updated without client or proxy cache pollution.

| Source Route | HTTP Status | Destination Target | Purpose & Owner Action |
| :--- | :--- | :--- | :--- |
| `/join` | `307` | `/contact` | Club recruitment. **TODO(owner):** Confirm dedicated recruitment form URL. Until confirmed, temporarily points to `/contact`. |
| `/feedback` | `307` | `https://forms.gle/wMbC1SEdAXYYbFvn9` | Club feedback and queries Google Form. |
| `/instagram` | `307` | `https://www.instagram.com/infinitus_club.rit/` | Friendly vanity link for Instagram story links & QR codes. |
| `/ig` | `307` | `https://www.instagram.com/infinitus_club.rit/` | Ultra-short redirect for character-constrained social bios. |
