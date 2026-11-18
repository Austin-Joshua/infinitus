# Architecture & Rendering Strategy Analysis

This document evaluates the architectural tradeoffs between dynamic per-request nonces (Option A, current) versus build-time subresource integrity/hashes (Option B, static) for the **INFINITUS Mathematics Club** web application.

---

## 1. Production Build Route Table

Captured from Next.js 15.5 production compiler (`npm run build`):

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
└ ƒ /test-error                            403 B         103 kB
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

## 2. Live TTFB Benchmark Evidence

Measured across 5 consecutive runs on live production (`https://infinitus-seven.vercel.app`) using `scripts/measure-ttfb.mjs`:

| Route | Cold TTFB (ms) | Warm Median (ms) | Warm Worst (ms) | Vercel Edge Cache |
|---|---|---|---|---|
| `/` (Homepage) | 778.5 ms | 332.4 ms | 593.1 ms | `MISS` (Dynamic SSR) |
| `/events` | 332.6 ms | 412.2 ms | 768.0 ms | `MISS` (Dynamic SSR) |
| `/events/scilab-workshop` | 276.4 ms | 283.7 ms | 452.0 ms | `MISS` (Dynamic SSR) |
| `/gallery` | 473.9 ms | 390.5 ms | 579.5 ms | `MISS` (Dynamic SSR) |

---

## 3. Option A vs. Option B Comparison

| Architectural Dimension | Option A: Per-Request Nonce (Current) | Option B: Build-Time SRI & Hashes (Static) |
|---|---|---|
| **TTFB (Warm Median)** | ~280 ms – 410 ms (serverless edge execution) | ~40 ms – 80 ms (direct Vercel CDN cache hit) |
| **TTFB (Cold Start)** | ~770 ms (serverless cold start on idle lambda) | ~60 ms (served straight from edge cache) |
| **CDN Edge Caching** | Dynamic HTML responses (`Cache-Control: private, no-cache`); images & assets cached. | Full static HTML caching at edge (`s-maxage=31536000, stale-while-revalidate`). |
| **CSP Strictness** | **A+ Strict**: `'nonce-<n>' 'strict-dynamic'`, zero inline scripts without matching nonce, no `unsafe-inline` in scripts. | **Medium-Strict**: Must allow `'unsafe-inline'` fallback or compute sha256 for inline hydration scripts. |
| **Header Size** | Minimal (~420 bytes). Constant size regardless of app scale. | **2,766 bytes (2.70 KB)** for 45 chunks. Grows linearly with chunk count toward the 8 KB CDN limit. |
| **Build Complexity** | **Low**: Standard Next.js middleware generates cryptographic nonces automatically. | **High**: Requires post-build hash extraction, HTML parsing, and injection into static headers. |
| **Dynamic API Compatibility** | Seamless: `/api/report-error` and rate limiters operate inside the same server environment. | Requires hybrid hosting or external functions for `/api/report-error`. |

---

## 4. Recommendation for INFINITUS Club Site

### Decision: Retain Option A (Per-Request Cryptographic Nonces)

**Rationale:**
1. **Security Superiority:** In academic and college institutional environments, strict adherence to OWASP recommendations and Mozilla Observatory Grade A+ CSP (`strict-dynamic` with per-request nonces) provides robust defense against XSS vulnerabilities.
2. **Acceptable Latency Budget:** The measured warm median TTFB of **~283 ms** for event pages and **~332 ms** for the homepage is well within Google's Core Web Vitals "Good" threshold for TTFB (< 800 ms). Users experience instant perceived paint because static assets (CSS, fonts, WebP images) remain aggressively cached at the edge.
3. **Zero Risk of Header Overflow:** Option B produced a 2.70 KB CSP header across 45 chunks. As new event photos and routes are published, the header length scales toward Vercel/Cloudflare's 8 KB HTTP header buffer limit. Option A maintains a fixed 420-byte header.
4. **Active Client Error Telemetry:** Option A allows native serverless execution of `POST /api/report-error` with Upstash rate limiting in the same deployment without complex static export splits.

### Transition Roadmap (If Option B Is Ever Selected in Future)
If instant sub-50ms static CDN delivery is prioritized in a future phase:
1. Remove `(await headers()).get('x-nonce')` from `app/layout.jsx`.
2. Configure `output: 'export'` or remove `middleware.js` matching from static pages.
3. Move telemetry ingestion (`/api/report-error`) to an independent Vercel Serverless Function or external webhook.
4. Set static security headers in `next.config.mjs` with sha256 hashes generated by `scripts/csp-hashes.mjs`.
