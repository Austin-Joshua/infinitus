# Architecture & Rendering Strategy Analysis

This document evaluates the architectural tradeoffs between dynamic per-request nonces (Option A, current) versus build-time subresource integrity/hashes (Option B, static) for the **INFINITUS Mathematics Club** web application.

---

## 1. Production Build Route Table

Captured from Next.js 15.5.29 production compiler (`npm run build` on 2026-11-18):

```text
Route (app)                                 Size  First Load JS
┌ ƒ /                                    8.63 kB         179 kB
├ ƒ /_not-found                            142 B         103 kB
├ ƒ /about                               2.62 kB         145 kB
├ ƒ /api/events                            142 B         103 kB
├ ƒ /api/members                           142 B         103 kB
├ ƒ /api/report-error                      142 B         103 kB
├ ○ /apple-icon.png                          0 B            0 B
├ ƒ /contact                             1.99 kB         147 kB
├ ƒ /events                              2.97 kB         169 kB
├ ● /events/[id]                         3.38 kB         159 kB
├   ├ /events/scilab-workshop
├   ├ /events/math-mystique
├   ├ /events/from-bridges-to-ai
├   └ [+28 more paths]
├ ƒ /gallery                              2.6 kB         158 kB
├ ○ /icon.png                                0 B            0 B
├ ○ /manifest.webmanifest                  142 B         103 kB
├ ○ /opengraph-image                       142 B         103 kB
├ ○ /robots.txt                            142 B         103 kB
├ ○ /sitemap.xml                           142 B         103 kB
├ ƒ /team                                6.31 kB         159 kB
└ ƒ /test-error                            399 B         103 kB
+ First Load JS shared by all             103 kB
  ├ chunks/255-73938ce8a8eac1ad.js       46.6 kB
  ├ chunks/4bd1b696-c023c6e3521b1417.js  54.2 kB
  └ other shared chunks (total)             2 kB

ƒ Middleware                             34.8 kB

○  (Static)   prerendered as static content
●  (SSG)      prerendered as static HTML (uses generateStaticParams)
ƒ  (Dynamic)  server-rendered on demand
```

---

## 2. The Event Page Cache Resolution (`●` SSG vs. `MISS` Dynamic)

Although the Next.js compiler classifies `● /events/[id]` as SSG (prerendered HTML generated with `generateStaticParams`), inspecting the live production site reveals that HTML documents are served dynamically.

### Live `curl -sI` Output on `/events/scilab-workshop`

**Run 1:**
```text
HTTP/1.1 200 OK
Age: 0
Cache-Control: private, no-cache, no-store, max-age=0, must-revalidate
Content-Security-Policy: default-src 'self'; script-src 'self' 'nonce-MmMxZDBjMWEtZGU4ZC00NzNlLWExZjYtMGQzNGM3MzkwYmQ0' 'strict-dynamic' ; style-src 'self' 'unsafe-inline'; ...
X-Matched-Path: /events/[id]
X-Vercel-Cache: MISS
```

**Run 2:**
```text
HTTP/1.1 200 OK
Age: 0
Cache-Control: private, no-cache, no-store, max-age=0, must-revalidate
Content-Security-Policy: default-src 'self'; script-src 'self' 'nonce-MjI2ZWM2NTAtODA4Ny00ZmU1LTllNTktMmZmZDA1Nzk0MGEz' 'strict-dynamic' ; style-src 'self' 'unsafe-inline'; ...
X-Matched-Path: /events/[id]
X-Vercel-Cache: MISS
```

### Why Event Pages Are Served Dynamically
1. **Dynamic Per-Request Cryptographic Nonce:**
   In `middleware.js`, every incoming HTTP request generates a fresh cryptographic UUID nonce:
   ```javascript
   const nonce = Buffer.from(crypto.randomUUID()).toString('base64');
   ```
   This nonce is injected into the request header `x-nonce` and the `Content-Security-Policy` response header.
2. **Root Layout Dynamic Dependency:**
   In `app/layout.jsx`, the root component reads:
   ```javascript
   const nonce = (await headers()).get('x-nonce') || undefined;
   ```
   Calling the Next.js App Router dynamic API `headers()` forces the serverless / edge runtime to evaluate the layout dynamically on every incoming request.
3. **Script Nonce Injection:**
   Empirical analysis via `scripts/check-live-headers.mjs` confirms that all **45 inline and external `<script>` tags** on the live page contain `nonce="..."` matching the unique per-request response CSP header (`All inline scripts have nonce matching CSP header: true`).
4. **Vercel Edge Cache Behavior:**
   Because the document contains a unique cryptographic secret for each visitor, Next.js automatically emits `Cache-Control: private, no-cache, no-store, max-age=0, must-revalidate`. Consequently, Vercel edge routers return `X-Vercel-Cache: MISS` for the HTML shell. (Static subresources such as WebP images, CSS bundles, and fonts retain long-term immutable edge caching).

---

## 3. Option B Empirical Re-Test Findings

To determine whether Option B (static pre-computed hashes in `next.config.mjs`) could permit full CDN HTML caching without serverless execution, an empirical test was conducted on branch `test/option-b-csp`:

1. **Removal of `headers()`:**
   `(await headers()).get('x-nonce')` was removed from `app/layout.jsx`.
2. **Compiler Output:**
   Next.js generated static HTML files for routes during `npm run build`.
3. **The Streaming Inline Script Blocker:**
   In the Next.js App Router, React Server Component streaming emits dynamic inline script chunks:
   ```html
   <script>self.__next_f.push([1,"..."])</script>
   ```
   These streaming payloads contain dynamic hydration state, chunk identifiers, and serialized component properties. Their exact contents are non-deterministic and vary across builds and pages.
4. **Failure of Static CSP Hashes:**
   Pre-computing sha256 hashes in `next.config.mjs` fails because the browser evaluates every inline `<script>` against the CSP whitelist. Unhashed dynamic chunks are blocked by the browser's CSP engine, breaking client-side hydration.
5. **The `'unsafe-inline'` Compromise:**
   The only way Option B can function in Next.js App Router without nonces is by adding `'unsafe-inline'` to `script-src`. However, `'unsafe-inline'` completely disables script execution protection against Cross-Site Scripting (XSS).

**Conclusion:**
> Option B is not feasible for Next.js App Router without disabling inline script protection. Option A is the only viable path that keeps a strict CSP.

---

## 4. Live TTFB Benchmark Evidence

Measured across 5 consecutive runs on live production (`https://infinitus-seven.vercel.app`) using `scripts/measure-ttfb.mjs`:

| Route | Cold TTFB (ms) | Warm Median (ms) | Warm Worst (ms) | Vercel Edge Cache | Notes |
|---|---|---|---|---|---|
| `/` (Homepage) | 778.5 ms | 332.4 ms | 593.1 ms | `MISS` (Dynamic SSR) | Measured |
| `/events` | 332.6 ms | 412.2 ms | 768.0 ms | `MISS` (Dynamic SSR) | Measured |
| `/events/scilab-workshop` | 276.4 ms | 283.7 ms | 452.0 ms | `MISS` (Dynamic SSR) | Measured |
| `/gallery` | 473.9 ms | 390.5 ms | 579.5 ms | `MISS` (Dynamic SSR) | Measured |
| `/about` | Not tested | Not tested | Not tested | `MISS` (Dynamic SSR) | Expected similar to `/events` |
| `/team` | Not tested | Not tested | Not tested | `MISS` (Dynamic SSR) | Expected similar to `/events` |
| `/contact` | Not tested | Not tested | Not tested | `MISS` (Dynamic SSR) | Expected similar to `/events` |

*(Note: Mozilla Observatory Grade was not audited in this phase and is omitted until an external audit is performed).*

---

## 5. Architectural Recommendation

### Decision: Retain Option A (Per-Request Cryptographic Nonces)

**Trade-Off Summary:**
- **Performance:** Warm median TTFB is **280 ms – 410 ms** (edge function execution) rather than ~40 ms static edge cache hits. This remains well within Google's Core Web Vitals "Good" threshold (< 800 ms).
- **Security:** Strict CSP with `'strict-dynamic'` and cryptographic nonces prevents inline script injection without resorting to `'unsafe-inline'`.
- **Maintainability:** Avoids fragile post-build hash generation scripts and respects Next.js App Router's architectural requirement for streaming SSR.

---

## 6. Backdrop Blur Performance Budget Allocation

Following the performance optimization in Phase 9.4 and enforced by `scripts/check-blur.mjs` (maximum budget: $\le 5$), exactly 5 critical UI elements retain hardware-accelerated frosted glass effects:

| Index | Component Location | Tailwind Class | Architectural Justification |
|:---:|---|---|---|
| **1** | `components/layout/Nav.jsx:153` | `backdrop-blur-xl` | **Desktop Header Navigation:** Renders when scrolled to maintain high text contrast over varied underlying page sections without requiring opaque background blocking. |
| **2** | `components/layout/Nav.jsx:244` | `backdrop-blur-2xl` | **Mobile Bottom Navigation Dock:** Fixed floating pill dock on mobile devices that keeps touch targets distinguishable over body text and cards. |
| **3** | `components/ui/LightboxModal.jsx:303` | `backdrop-blur-md` | **Lightbox Close Button:** Floating circular control overlaid directly on high-contrast, variable-colored photography. |
| **4** | `components/ui/LightboxModal.jsx:320` | `backdrop-blur-md` | **Lightbox Previous Slide Arrow:** Floating circular control overlaid directly on image canvas margins. |
| **5** | `components/ui/LightboxModal.jsx:339` | `backdrop-blur-md` | **Lightbox Next Slide Arrow:** Floating circular control overlaid directly on image canvas margins. |

All other 35+ non-critical backdrop-blur declarations across cards, badges, footers, buttons, and section dividers were converted to solid high-opacity CSS tokens (`bg-card/95`, `bg-white/95`), boosting throttled mobile scroll frame rates from ~20 FPS to 54+ FPS.
