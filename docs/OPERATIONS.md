# INFINITUS Web Portal — Operations Manual

This document provides operational guidelines, deployment procedures, monitoring configurations, and maintenance routines for the INFINITUS Mathematics Club website.

---

## 1. System Architecture & Hosting

- **Platform:** Vercel (Edge Network + Serverless Node.js Runtimes)
- **Framework:** Next.js 15 (App Router with Streaming SSR and Partial Prerendering)
- **UI & Motion:** React 19, Tailwind CSS, Framer Motion
- **Data Architecture:** Zero-dependency bundled static fallback (`lib/data.js`) with transparent Supabase database hydration (`lib/events.js`, `lib/members.js`).
- **Production URL:** `https://infinitus-seven.vercel.app`

---

## 2. Environment Variables Configuration

| Variable | Scope | Requirement | Purpose |
|---|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | Client / Server | Recommended | Absolute canonical base URL (defaults to `https://infinitus-seven.vercel.app`). |
| `SUPABASE_URL` | Server | Optional | Supabase project REST API endpoint. |
| `SUPABASE_ANON_KEY` | Server | Optional | Public anonymous client key (read-only queries). |
| `SUPABASE_SERVICE_ROLE_KEY` | Local CLI | Maintenance only | Used strictly for offline seeding (`npm run db:seed`). Never commit or deploy. |
| `UPSTASH_REDIS_REST_URL` | Server | Optional | Distributed rate limiting across serverless instances. |
| `UPSTASH_REDIS_REST_TOKEN` | Server | Optional | Authentication token for Upstash Redis. |

> [!NOTE]
> If Supabase or Upstash credentials are not supplied, the site operates flawlessly using built-in bundled data and in-memory sliding-window rate limiters.

---

## 3. Monitoring & Telemetry

### 3.1 Vercel Web Analytics
- **Package:** `@vercel/analytics`
- **Component:** `<Analytics />` embedded in `app/layout.jsx`.
- **Metrics Collected:** Page views, unique visitors, top referrers, device distributions, and geographic traffic without invasive third-party tracking cookies.
- **Dashboard:** Available in the Vercel project console under the **Analytics** tab.

### 3.2 Vercel Speed Insights (Real-User Web Vitals)
- **Package:** `@vercel/speed-insights`
- **Component:** `<SpeedInsights />` embedded in `app/layout.jsx`.
- **Metrics Collected:** Core Web Vitals (Largest Contentful Paint `LCP`, Interaction to Next Paint `INP`, Cumulative Layout Shift `CLS`, and Time to First Byte `TTFB`).
- **Dashboard:** Available in the Vercel project console under the **Speed Insights** tab.

### 3.3 Error Boundaries & Production Error Telemetry
- **Telemetry Ingestion Endpoint:** `POST /api/report-error` (rate limited to 10 requests per minute per IP, with strict parameter validation).
- **Client Instrumentation:** Both `app/error.jsx` (route-level boundary) and `app/global-error.jsx` (root-level boundary) automatically dispatch an asynchronous non-blocking report via `navigator.sendBeacon` (falling back to `fetch` with `keepalive: true`).
- **Telemetry Schema:**
  - `digest`: Unique Next.js cryptographic error digest hash.
  - `route`: The application URL pathname where the error occurred.
  - `kind`: Boundary level (`'route'` or `'global'`).
  - `t`: Epoch timestamp in milliseconds.
  > [!NOTE]
  > No personal information, user agent strings, IP addresses, cookies, or stack traces are transmitted or logged.
- **Where to View Error Reports:**
  1. Open the **Vercel Project Dashboard** -> **Logs** tab.
  2. In the search filter, enter: `[client-error]`.
  3. You will see formatted JSON log lines matching incoming client errors:
     ```json
     [client-error] {"digest":"3721839482","route":"/events/scilab-workshop","kind":"route","t":1773998400000}
     ```
  4. The logged `digest` can be directly matched against server-side SSR execution error logs to inspect the corresponding server trace.
- **Owner Note (Future Enhancement):** Sentry's free tier (up to 5,000 errors/month) is the recommended next step if full client-side stack traces and source-mapped breadcrumbs are desired in the future.

---

## 4. Continuous Integration & Quality Gates

The repository enforces mandatory automated checks on every push and pull request (`.github/workflows/ci.yml`):

1. **Linting:** `npm run lint` (ESLint 9)
2. **Unit Tests:** `npm test` (Node.js test runner)
3. **Security Audit:** `npm audit --omit=dev --audit-level=high` (with non-blocking notification)
4. **Asset Integrity:** `npm run check:assets` (verifies all WebP posters, team portraits, dimensions, and file sizes)
5. **Production Build:** `npm run build` (Next.js production compiler)
6. **Link Checker:** `npm run check:links` (crawls all generated static HTML files and verifies zero broken internal/external references)
7. **End-to-End Suite:** `npm run test:e2e` (Playwright automated cross-viewport regression tests)

---

## 5. Routine Maintenance Procedures

### 5.1 Publishing a New Event
1. Convert the official event poster to WebP format with `4:5` aspect ratio (maximum dimensions `1080x1350`, file size under `150 KB`).
2. Save the image in `public/events/<event-id>.webp`.
3. If using Supabase, insert the event row using the schema in `scripts/db/schema.sql`.
4. If updating bundled offline data, append the event record to `EVENTS` in `lib/data.js`.
5. Run asset checks: `npm run check:assets && npm run check:links`.

### 5.2 Updating Core Committee Roster
1. Convert member portrait to square WebP (maximum dimensions `600x600`, file size under `80 KB`).
2. Save in `public/team/<member-id>.webp`.
3. Update `MEMBERS` array in `lib/data.js` (or insert in Supabase `members` table).
4. Verify responsibilities in `lib/roleResponsibilities.js`.

### 5.3 Upgrading Dependencies
Core dependencies (`next`, `react`, `react-dom`) are pinned to exact versions:
```bash
npm install --save-exact next@<version> react@<version> react-dom@<version>
npm run lint && npm test && npm run build && npm run test:e2e
```
Dependabot is configured (`.github/dependabot.yml`) to generate weekly grouped pull requests for minor and patch updates.

---

## 6. Custom Domain Migration Checklist

When transitioning from `infinitus-seven.vercel.app` to an official college subdomain (e.g. `infinitus.ritchennai.edu.in`):

1. **DNS Mapping:**
   - Configure CNAME record pointing `infinitus.ritchennai.edu.in` to `cname.vercel-dns.com`.
2. **Environment Variable:**
   - Update `NEXT_PUBLIC_SITE_URL` in Vercel project settings to `https://infinitus.ritchennai.edu.in`.
3. **Strict-Transport-Security (HSTS):**
   - In `next.config.mjs`, re-enable `includeSubDomains; preload`:
     ```js
     value: 'max-age=63072000; includeSubDomains; preload'
     ```
4. **Google Search Console & SEO:**
   - Add new domain property in Google Search Console.
   - Verify ownership via DNS TXT record or the existing `public/google81c09b924edbe299.html` file.
   - Resubmit sitemap at `https://infinitus.ritchennai.edu.in/sitemap.xml`.
