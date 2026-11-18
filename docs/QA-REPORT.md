# INFINITUS — Quality Assurance & Acceptance Report (Phase 8 Audit)

**Date:** November 18, 2026  
**Audited Commit Base:** `2937303`  
**Latest Production HEAD:** `65801bb`  
**Repository:** [https://github.com/Austin-Joshua/infinitus.git](https://github.com/Austin-Joshua/infinitus.git)  
**Live URL:** [https://infinitus-seven.vercel.app](https://infinitus-seven.vercel.app)

---

## 1. Phase 8 Compliance & Audit Matrix

| Section | Description | Status | Evidence / Verification Command | Notes |
| :--- | :--- | :---: | :--- | :--- |
| **8.1** | **LICENSE (Blocker)** | **PASSED** | Commit `f8d3f50`<br>`test -f LICENSE`<br>README badge points to `LICENSE`. | Standard MIT License added with 2026 copyright for INFINITUS Mathematics Club, RIT. Code is MIT; brand assets protected under `NOTICE.md`. |
| **8.2** | **Real Favicon & Logo Weight (Blocker)** | **PASSED** | Commit `d2306c1`<br>`git grep 'base64' -- 'app/*.svg'` returns 0.<br>`ls -lh assets/brand/source/infinitus-logo.png` (217 KB). | Deleted 30 KB base64 SVG `app/icon.svg`. Generated raster icons (32, 192, 512, apple 180, ico). Offline backup taken of 9.8 MB original. |
| **8.3** | **Real Rate Limiting & API Protection** | **PASSED** | Commit `f10dbd9`<br>`node scripts/verify-api.mjs`<br>Unit tests pass (`node --test test/apiHandler.test.mjs`). | Implemented `middleware.js` with `X-Robots-Tag: noindex, nofollow`, method checks (405 JSON), and Upstash Redis rate limiting with in-memory fallback. 70 curls trigger 429. |
| **8.4** | **Stronger CSP (Remove unsafe-eval & unsafe-inline)** | **PASSED** | Commit `8416a04`<br>`node scripts/test-csp-corp.mjs`<br>All 73 scripts match request nonce. | Dynamic cryptographic nonces generated per-request in `middleware.js`. Policy: `script-src 'self' 'nonce-<uuid>' 'strict-dynamic'`. CORP `cross-origin` on OpenGraph cards. |
| **8.5** | **Hostname & Redirects** | **PASSED** | Commit `8e5bc96`<br>`docs/ROUTES.md`<br>`curl -I /join` returns 307 to `/contact`. | Removed foreign domain `www.infinitus-seven.vercel.app`. Centralized canonical host to `SITE.url`. Documented all routes and redirects in `docs/ROUTES.md`. |
| **8.6** | **Tests That Stop Regressions** | **PASSED** | Commit `97c85ae`<br>`npx playwright test` (125/125 passed).<br>`npm run check:assets` (60/60 valid).<br>`npm run check:links` (37 pages, 1399 links, 0 broken). | Added comprehensive Playwright test suite for viewports 320–1920px, light/dark themes, error codes, and lightbox interaction. Integrated into `.github/workflows/ci.yml`. |
| **8.7** | **Repo Hygiene & SEO Honesty** | **PASSED** | Commit `e2dbd67`<br>`git ls-files graphify-out .claude` returns empty.<br>`app/layout.jsx` meta keywords array removed.<br>Description length: 152 characters. | Untracked development artifacts (`graphify-out/`, `.claude/`). Audited event count to 31 and committee to 28. Normalized Aakash's title to Technical Coordinator / Technical Head. |
| **8.8** | **History Purge** | **PASSED** | Commit `e69c98e` (forced)<br>`git log --all -S"samsundar"` returns 0.<br>Largest pack object shrunk from 9.37 MB to 0.35 MB. | Gated approval confirmed by owner. Ran `git-filter-repo --strip-blobs-bigger-than 500K` and text/message typo redactions. Mirror backup saved. Force pushed to origin. |
| **8.9** | **Homepage Stats & Instagram Feed** | **PASSED** | Commit `b420933`<br>`docs/INSTAGRAM.md`<br>Dynamic stats verified from `lib/data.js`. | Ensured no fabricated numbers on homepage. Added full Instagram profile copy, bio text, and link-in-bio instructions in `docs/INSTAGRAM.md`. |
| **8.10** | **Live Site Parity & Accessibility** | **PASSED** | Commit `65801bb`<br>Playwright ARIA Snapshot verified.<br>`curl https://infinitus-seven.vercel.app` parity checked. | Visual duplicate tracks in `KeywordMarquee` and `Lemniscate` wrapped in `aria-hidden="true"`. Single clean accessible text nodes verified for screen readers. |
| **8.11** | **Evidence Doc & Graphify Update** | **PASSED** | `docs/QA-REPORT.md`<br>`graphify update .` completed. | Comprehensive QA verification and owner checklist assembled. |

---

## 2. Test Suite & Verification Results

### Playwright E2E Suite (`npm run test:e2e`)
* **Total Tests:** 125
* **Passed:** 125 (100%)
* **Failed:** 0
* **Coverage:**
  - **Horizontal Overflow:** Tested 8 viewports (320px, 360px, 390px, 768px, 1024px, 1280px, 1440px, 1920px) in both paper (light) and ink (dark) themes across all routes. All `document.documentElement.scrollWidth <= clientWidth`.
  - **Error Safeguards:** Verified custom 404 page, invalid event slug handling, and API 404s with `X-Robots-Tag: noindex`.
  - **Lightbox Modal:** Focus trap, Escape key closing, keyboard arrow navigation, and complete hiding of navigation bars while open.
  - **SEO & Structure:** Exactly 1 `<h1>` per page, unique titles and descriptions, canonical URL tags, valid JSON-LD schemas, and valid `/robots.txt` and `/sitemap.xml`.

### Static Asset & Link Verification
* **Asset Integrity (`npm run check:assets`):**
  - All 60 public assets checked.
  - Strict size constraints verified: Event posters $\le$ 400 KB, all other images $\le$ 250 KB.
  - Verified 0 uppercase characters or whitespace in filenames.
  - All referenced images in `lib/data.js` exist in `public/`.
* **Link Integrity (`npm run check:links`):**
  - Pages crawled: 37
  - Total links analyzed: 1,399
  - Internal broken links: 0
  - Broken hash anchors (`#`): 0

---

## 3. Owner Action Items & Decision Checklist

Below is the consolidated checklist of items requiring explicit owner confirmation or action:

- [ ] **1. Copyright Holder Confirmation:**
  - Current LICENSE text: `Copyright (c) 2026 INFINITUS Mathematics Club, Rajalakshmi Institute of Technology`.
  - Please confirm if this holder name is acceptable for your open-source licensing.
- [ ] **2. Master Vector (SVG) Logo:**
  - The repository currently serves high-resolution raster icons (32, 180, 192, 512 px) because no vector SVG was available in the original design files.
  - *Action:* When the design team exports a pure SVG vector of the INFINITUS logo (paths only, under 8 KB), drop it into `assets/brand/source/` and run `npm run branding:optimize`.
- [ ] **3. Upstash Redis Setup (Production Rate Limiting):**
  - Rate limiting currently operates on an in-memory sliding window (safe and functional per instance, but best-effort across multiple Vercel serverless regions).
  - *Action:* To enable cluster-wide rate limiting across all Vercel edge instances:
    1. Create a free Redis database at [console.upstash.com](https://console.upstash.com/).
    2. Add `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN` to your Vercel Environment Variables.
- [ ] **4. Recruitment Form Confirmation:**
  - `/join` currently redirects temporarily (307) to `/contact`.
  - The queries form is active at `forms.gle/wMbC1SEdAXYYbFvn9`.
  - *Action:* When the 2026–27 recruitment drive begins, update `SOCIAL.recruitmentForm` in `lib/site.js` with the official recruitment Google Form URL.
- [ ] **5. Instagram Bio & Link-in-Bio Update:**
  - *Action:* Update the `@infinitus_club.rit` Instagram profile according to `docs/INSTAGRAM.md`:
    - **Name:** `INFINITUS | Mathematics Club RIT`
    - **Bio:**
      ```text
      Cultivating mathematical curiosity beyond the lecture hall.
      Competitions, workshops, innovation & analytical problem solving.
      Mathematics Club of Rajalakshmi Institute of Technology, Chennai.
      ```
    - **Website Link:** `https://infinitus-seven.vercel.app`
- [ ] **7. Event Photo Descriptions:**
  - Event galleries currently use fallback descriptive captions (e.g., `Event Title — Photo N`).
  - *Action:* When uploading event photograph archives to Supabase or `public/gallery/`, provide authentic scene captions for the following flagship events:
    - `scilab-workshop` (SciLab Hands-on Workshop)
    - `mathspire` (Mathspire '25 State Symposium)
    - `shinka-2026` (SHINKA Strikers 2026 Championship)
    - `matrix-reloaded` (Matrix Reloaded Web Development)
    - `pidoku` (PiDoku Decoding Competition)
    - `pop-patriotism` (Pop for Patriotism)
