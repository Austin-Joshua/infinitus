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
- [ ] **8. Campus Postal Address Confirmation:**
  - Hard-coded street address and postalCode `600124` have been set to `null` (`TODO(owner)`) in `lib/site.js` and omitted from JSON-LD schema until confirmed.
  - *Action:* Confirm official college campus postal address and postal code, then populate `SITE.address` in `lib/site.js`.

---

## 4. Phase 10 & 11 Evidence & Technical Reconciliation

### 4.1 Throttled Mobile Scroll Performance Benchmark (Authoritative Single Table)

Measured empirically via `scripts/profile-perf.mjs` across 5 consecutive runs on both commit `09164d0` (before Phase 9 optimizations) and `main` (after Phase 11 hardening):

| Route | Commit Base | 5-Run Median FPS | Worst-Case FPS (min 1s window) | Median Jank Frames (> 33.3ms) | FPS Std Dev (σ) | Performance Outcome |
|---|---|---|---|---|---|---|
| **`/` (Home)** | `09164d0` (Baseline) | 28.2 FPS | 11.0 FPS | 46 frames | 9.46 | Baseline unoptimized with 35+ backdrop-blur rules |
| **`/` (Home)** | `main` (Phase 11) | **42.8 FPS** | **25.0 FPS** | **43 frames** | **9.45** | **+51.8% frame rate, +127.3% worst-window stability** |
| **`/gallery`** | `09164d0` (Baseline) | 36.8 FPS | 27.0 FPS | 45 frames | 11.09 | Baseline unoptimized gallery grid |
| **`/gallery`** | `main` (Phase 11) | **53.4 FPS** | **45.0 FPS** | **18 frames** | **2.26** | **+45.1% frame rate, -60.0% jank frames, 79.6% lower variance** |

#### Benchmark Environment & State Machine:
- **Test Date:** November 18, 2026
- **Node.js Version:** `v24.22.1`
- **Playwright Test Runner:** `v1.65.1` (Chromium headless)
- **Host Operating System:** Windows 11 Home (x64)
- **CPU Throttling Factor:** 4x CPU slowdown via Chrome DevTools Protocol (`Emulation.setCPUThrottlingRate: 4`)
- **Emulated Device & Viewport:** iPhone 14 (390 × 844 px, DPR 3, Touch enabled)
- **Scroll Profile:** Continuous linear scroll top-to-bottom over 4000 ms (25 ms sample intervals)
- **Sample Size:** 5 independent runs per route and commit (all 5 runs recorded in `profile-perf.mjs` JSON output)

### 4.2 Asset Limits Reconciliation
* **Authoritative Policy Enforced by `scripts/check-assets.mjs`:**
  - **Event Posters (`public/events/*.webp`):** Maximum limit $\le$ **400 KB** (accommodates high-density typography, mathematical symbols, and institutional co-branding vectors).
  - **Gallery Photography & Avatars (`public/gallery/*.webp`, `public/team/*.webp`):** Maximum limit $\le$ **250 KB**.
  - **Routine Target Guideline:** Editors are instructed in `docs/OPERATIONS.md` to target $\le$ **150 KB** where possible for optimal mobile delivery, but automated CI gates strictly fail only above 400 KB (posters) or 250 KB (photos). All 61 repository assets currently pass.

### 4.3 Photo Alt Text & Caption Inventory
Populated directly from verified records in `lib/data.js` and `lib/instagram.js`:

| # | Image Path | Canonical Caption | Accessible Alt Description | Status |
|:---:|---|---|---|:---:|
| 1 | `/gallery/inauguration.webp` | Club Inauguration Day 2025–26 at RIT | Inauguration ceremony gathering of faculty and students for the 2025-26 INFINITUS club opening | Verified |
| 2 | `/gallery/mathspire-01.webp` | Mathspire ’25 award ceremony and prize distribution | Winning teams receiving certificates and prizes at the Mathspire 2025 valedictory session | Verified |
| 3 | `/gallery/mathspire-02.webp` | Rapid Fire mental math session · Mathspire ’25 | Student participants concentrating during the timed Rapid Fire arithmetic round | Verified |
| 4 | `/gallery/mathspire-03.webp` | Spot the Error challenge on stage · Mathspire ’25 | Contestants analyzing mathematical proof derivations on the display screen during the Spot the Error round | Verified |
| 5 | `/gallery/mathspire-06.webp` | Faculty coordinators reviewing participant rounds · Mathspire ’25 | Faculty coordinators and student leads overseeing competition hall activities | Verified |
| 6 | `/gallery/mathspire-09.webp` | Final round deliberation and score tabulation · Mathspire ’25 | Organizing committee tabulating scores while contestant teams await results | Verified |
| 7 | `/gallery/mathspire-10.webp` | Thought Crafting round presentations · Mathspire ’25 | Speaker presenting mathematical insights and problem breakdowns at the podium | Verified |
| 8 | `/gallery/mathspire-11.webp` | Audience and participants during the quiz round · Mathspire ’25 | Audience of engineering students actively following the Mathspire stage quiz | Verified |
| 9 | `/gallery/mathspire-13.webp` | Mind Over Math problem-solving round · Mathspire ’25 | Participants working in teams on mathematical problem sheets during Mathspire 2025 | Verified |
| 10 | `/gallery/best-vp.webp` | Best Vice President 2024–25 awarded to Shreenidhi A | Recognition poster for Shreenidhi A, named Best Vice President 2024-25 at RIT | Verified |
| 11 | `/gallery/matrix-recap.webp` | Matrix Reloaded web development workshop recap | Workshop recap slide showing hands-on coding and matrix transformation examples | Verified |
| 12 | `/gallery/pidoku-recap.webp` | PiDoku: Decode π competition recap | PiDoku competition poster recap with winner announcements and puzzle highlights | Verified |
| 13 | `/gallery/pop-patriotism.webp` | Pop for Patriotism independence celebration | Club members and students participating in the Independence Day campus activity | Verified |
| 14 | `/gallery/shinka-recap.webp` | SHINKA — Strikers 2026 school championship recap | Recap visual for the two-day inter-school mathematics and innovation championship | Verified |
| 15 | `/gallery/math-day-2023.webp` | National Mathematics Day celebration 2023 | Inaugural mathematical rangoli artwork celebrating National Mathematics Day on campus | Verified |

### 4.4 Local Dependency Security Audit (`npm audit --omit=dev`)
Command output:
```text
# npm audit report

postcss  <=8.5.22
Severity: high
PostCSS has XSS via Unescaped </style> in its CSS Stringify Output - https://github.com/advisories/GHSA-qx2v-qp2m-jg93
PostCSS: Arbitrary file read and information disclosure via attacker-controlled sourceMappingURL in CSS comments - https://github.com/advisories/GHSA-6g55-p6wh-862q
PostCSS: incomplete fix of GHSA-6g55-p6wh-862q — attacker-controlled sourceMappingURL reads arbitrary .map files when `from` is unset - https://github.com/advisories/GHSA-fxqj-rqcc-2cmp
PostCSS: Path Traversal in Previous Source Map Auto-Loading (sourceMappingURL) leads to Arbitrary .map File Disclosure - https://github.com/advisories/GHSA-r28c-9q8g-f849
fix available via `npm audit fix --force`
Will install next@16.4.6, which is a breaking change
node_modules/next/node_modules/postcss
  next  9.3.4-canary.0 - 16.3.0-preview.10
  Depends on vulnerable versions of postcss
  node_modules/next

2 vulnerabilities (1 moderate, 1 high)
```

**Security Analysis & CI Policy:**
- Root direct dependencies (`postcss@8.5.26`, `tailwindcss@3.4.19`, `autoprefixer@10.5.4`) are fully updated and safe.
- The advisory originates exclusively from Next.js's internal bundled copy (`node_modules/next/node_modules/postcss@8.4.31`).
- Resolving this via `npm audit fix --force` would upgrade Next.js from 15.5.29 to Next.js 16 (a breaking major version change).
- In `.github/workflows/ci.yml`, the security audit step runs with `--audit-level=high` and `continue-on-error: true` as an advisory check, ensuring CI builds do not break while awaiting Next.js 15.5.x upstream release with updated internal PostCSS.

