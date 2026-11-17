# INFINITUS — Architecture & Codebase Map

> **Specification & Codebase Architecture Baseline**  
> Generated: November 2026  
> Scope: Phase 0 Codebase Mapping & Dependency Analysis

---

## 1. System Overview

**INFINITUS** is the official website for the Mathematics Club of Rajalakshmi Institute of Technology (RIT), Chennai.
- **Framework:** Next.js 15 (App Router, React 19)
- **Styling:** Tailwind CSS with custom thematic extensions (Paper/Ink palettes, graph-paper motifs, STIX Two Text serif, JetBrains Mono)
- **Animation:** Framer Motion (page transitions, scroll reveals, SVG curve drawing)
- **Data Persistence:** Dual-mode architecture — fully functional offline with bundled static records (`lib/data.js`), optionally supplemented by a PostgreSQL database via Supabase (`@supabase/supabase-js`).

---

## 2. Route Map & Component Topology

All application routes are defined under `app/`. The application operates with Next.js App Router server components at the root of every page, delegating interactive UI to client component islands.

```
app/
├── layout.jsx               # Root layout: ThemeProvider, Nav, Footer, STIX/Inter fonts
├── template.jsx             # Universal route transition template (Curtain animation)
├── page.jsx                 # / (Landing page: Hero, Featured Event, Team & Gallery preview)
├── not-found.jsx            # /404 custom not-found page
├── opengraph-image.jsx      # /opengraph-image dynamic OG image generator (1200x630)
├── robots.js                # /robots.txt dynamic crawler directives
├── sitemap.js               # /sitemap.xml dynamic sitemap generator
├── about/
│   └── page.jsx             # /about (AboutUs, Journey timeline, metrics)
├── events/
│   ├── page.jsx             # /events (Featured upcoming event, EventsBrowser archive)
│   └── [id]/
│       └── page.jsx         # /events/[id] (Dynamic SSG event detail with neighbouring links)
├── team/
│   └── page.jsx             # /team (MembersGrid, TeamBrowser, MemberDetailModal)
├── gallery/
│   └── page.jsx             # /gallery (GallerySection, GalleryGrid, Lightbox)
├── contact/
│   └── page.jsx             # /contact (ContactSection, campus coordinates, social links)
└── api/
    ├── events/
    │   └── route.js         # GET /api/events (JSON events feed)
    └── members/
        └── route.js         # GET /api/members (JSON active members feed)
```

---

## 3. Data Flow Architecture & Supabase Merge Rules

Data retrieval is abstracted through the `lib/` directory.

```
                    ┌───────────────────────────┐
                    │  lib/data.js (Static)    │
                    │  - EVENTS (15)           │
                    │  - MEMBERS (29)          │
                    │  - GALLERY (15)          │
                    └─────────────┬─────────────┘
                                  │
    ┌─────────────────────────────┼─────────────────────────────┐
    │                             │                             │
    ▼                             ▼                             ▼
┌──────────────────┐    ┌──────────────────┐    ┌───────────────────────────┐
│  lib/events.js   │    │  lib/members.js  │    │  GallerySection.jsx       │
│  (getEvents,     │    │  (getMembers)    │    │  (galleryPhotos)          │
│   getEvent)      │    │                  │    │                           │
└────────┬─────────┘    └────────┬─────────┘    └─────────────┬─────────────┘
         │                       │                            │
         │  ┌────────────────────┴────────────────┐           │
         │  │ lib/roleResponsibilities.js         │           │
         │  │ (getRoleDetails keyed by name)      │           │
         │  └─────────────────────────────────────┘           │
         │                                                    │
         ▼                                                    ▼
┌───────────────────────────────────────────────────────────────────────────┐
│ Server Components: app/page.jsx, app/events/page.jsx, app/team/page.jsx,  │
│ app/gallery/page.jsx, app/events/[id]/page.jsx, app/api/*                 │
└─────────────────────────────────────┬─────────────────────────────────────┘
                                      │ (Props serialization)
                                      ▼
┌───────────────────────────────────────────────────────────────────────────┐
│ Interactive Client Islands: EventsBrowser, TeamBrowser, GalleryGrid       │
└───────────────────────────────────────────────────────────────────────────┘
```

### Divergent Supabase Merge Rules per Data Type

The codebase exhibits three distinct merge behaviors across data entities when `SUPABASE_URL` and `SUPABASE_ANON_KEY` / `SUPABASE_SERVICE_ROLE_KEY` are provided:

1. **Events (`lib/events.js` -> `getEvents`)**:
   - **Precedence Rule:** Bundled events win collisions.
   - **Merge Mechanism:** The system retrieves bundled events, builds a lowercase title set (`new Set(bundled.map(e => e.title.toLowerCase()))`), and queries Supabase. Database events matching any bundled title are discarded; unique database records are appended.
   - **Ordering:** Sorted descending by `eventDate`.
   - **Fallback:** If Supabase query fails or returns empty, returns bundled `staticEvents()`.

2. **Members (`lib/members.js` -> `getMembers`)**:
   - **Precedence Rule:** Supabase takes complete precedence if records are returned.
   - **Merge Mechanism:** If Supabase returns records, the static `MEMBERS` array is completely replaced. The bundled records are only referenced as a fallback dictionary (`STATIC_BY_NAME.get(m.name)`) to fill missing `department` or `year`.
   - **Ordering:** Ordered by database `role_rank` ascending.
   - **Role Attribution:** `withRoleDetails` calls `getRoleDetails(member.name)` to assign `team` and `responsibilities`.

3. **Gallery Photos (`components/sections/GallerySection.jsx` -> `galleryPhotos`)**:
   - **Precedence Rule:** Static first, augmented with event attachments.
   - **Merge Mechanism:** No dedicated database gallery table exists. The static `GALLERY` array (15 items) is loaded, then flattened with any images present in `event.images[]` returned by `getEvents()`.

4. **Metrics (`lib/data.js` -> `METRICS`)**:
   - Static constants only; no database binding.

---

## 4. Client vs. Server Components Breakdown

Next.js 15 App Router executes components on the server by default unless explicitly marked with `'use client'`.

### Server Components
Server components execute during build (SSG) or request time. They have zero impact on the client JavaScript bundle.
- **Pages & Layouts:**
  - `app/layout.jsx` (Root layout)
  - `app/page.jsx` (Home page)
  - `app/about/page.jsx` (About page)
  - `app/events/page.jsx` (Events archive)
  - `app/events/[id]/page.jsx` (Event detail dynamic route)
  - `app/team/page.jsx` (Team roster page)
  - `app/gallery/page.jsx` (Gallery page)
  - `app/contact/page.jsx` (Contact page)
  - `app/not-found.jsx` (404 page)
  - `app/sitemap.js`, `app/robots.js`, `app/opengraph-image.jsx`
- **Structural Presentation Components:**
  - `components/brand/InfinitusLogo.jsx`
  - `components/brand/RitLogo.jsx`
  - `components/layout/Footer.jsx`
  - `components/sections/AboutUs.jsx`
  - `components/sections/ContactSection.jsx`
  - `components/sections/EventsSection.jsx`
  - `components/sections/GallerySection.jsx`
  - `components/sections/MembersGrid.jsx`
  - `components/sections/home/HomeSections.jsx`
  - `components/ui/EventCard.jsx`
  - `components/ui/Marquee.jsx`

### Client Components (`'use client'`)
Client components bundle interactivity, event handlers, and Framer Motion state:
- `app/template.jsx`: Universal curtain transition (remounts on navigation).
- `components/layout/Nav.jsx`: Mobile hamburger drawer, theme toggle, active link tracking, scroll elevation.
- `components/layout/PageHeader.jsx`: Scroll progress indicator via Framer Motion `useScroll`, calls `introDelay`.
- `components/sections/Hero.jsx`: Lemniscate canvas integration, delayed entrance sequence, calls `introDelay`.
- `components/sections/Journey.jsx`: Scroll-driven timeline node tracking.
- `components/ui/Counter.jsx`: Animated numerical counter on scroll into view.
- `components/ui/EventsBrowser.jsx`: Year filter pill tabs, pagination / show-more state.
- `components/ui/GalleryGrid.jsx`: Photo grid, category filtering, fullscreen lightbox modal.
- `components/ui/Lemniscate.jsx`: Bernoulli curve SVG drawing, dot tracer, scroll parallax.
- `components/ui/MemberCard.jsx`: Member card hover states, interactive modal trigger.
- `components/ui/Reveal.jsx`: Intersection observer animation wrapper.
- `components/ui/SplitText.jsx`: Character/word-level staggered entrance, calls `introDelay`.
- `components/ui/TeamBrowser.jsx`: Department/team filter pills, member modal manager.
- `components/ui/ThemeProvider.jsx`: Next-themes wrapper for paper/ink light and dark modes.
- `components/layout/Loader.jsx`: **Dead code** (orphaned theatre curtain loader).

---

## 5. Server-Only Module Boundaries

Module boundaries were audited to ensure database credentials and server utilities never leak into client bundles:

1. **`lib/supabaseClient.js`**:
   - Accesses `process.env.SUPABASE_URL`, `process.env.SUPABASE_SERVICE_ROLE_KEY`, and `process.env.SUPABASE_ANON_KEY`.
   - **Boundary Status:** Strictly clean. Only imported by `lib/events.js` and `lib/members.js`.
2. **`lib/events.js` & `lib/members.js`**:
   - **Boundary Status:** Strictly clean. Imported solely by Server Components (`app/page.jsx`, `app/events/page.jsx`, `app/events/[id]/page.jsx`, `app/team/page.jsx`, `app/gallery/page.jsx`, `app/sitemap.js`) and Route Handlers (`app/api/events/route.js`, `app/api/members/route.js`).
   - Client components (`EventsBrowser`, `TeamBrowser`, `GalleryGrid`) receive pre-fetched, serialized arrays via props. No Supabase code is shipped in client JavaScript bundles.

---

## 6. Verification of Known Findings

### Finding 1: `components/layout/Loader.jsx` is Unused
- **Verification:** Confirmed.
- **Details:** `Loader.jsx` defines an old-style curtain loader (`Loader()`). A global AST search across `app/`, `components/`, and `lib/` proves that **no file imports `Loader.jsx`**. Route transitions were migrated to `app/template.jsx`, leaving `Loader.jsx` as dead code.

### Finding 2: `intro-seen` Class is Never Set
- **Verification:** Confirmed.
- **Details:** `lib/motion.js` defines:
  ```javascript
  export function introDelay() {
    if (typeof window === 'undefined') return 0;
    const root = document.documentElement;
    if (root.classList.contains('intro-seen') || matchMedia('(prefers-reduced-motion: reduce)').matches) return 0;
    return Math.max(0, INTRO_END - performance.now() / 1000);
  }
  ```
  Neither `app/template.jsx` nor any other script ever writes `intro-seen` to `document.documentElement.classList`. As a result, `introDelay()` always calculates `Math.max(0, 1.9 - performance.now() / 1000)` on initial page renders and route changes, delaying `Hero.jsx`, `PageHeader.jsx`, and `SplitText.jsx` entrance animations for a phantom curtain.

### Finding 3: Two Sources of Truth with Name-String Joins
- **Verification:** Confirmed.
- **Details:**
  - Members exist in both `lib/data.js` (`MEMBERS`) and Supabase `members` table.
  - Role responsibilities and team assignments are defined in `lib/roleResponsibilities.js` (`ROLE_RESPONSIBILITIES`), keyed strictly by member name strings (`'Austin Joshua M'`, `'Dr A Thilagavathy Vinoth'`).
  - In `lib/members.js`, `withRoleDetails` executes `const details = getRoleDetails(member.name)`. If a database record has any whitespace, casing, or punctuation mismatch (e.g., `'Austin Joshua'` vs `'Austin Joshua M'`), `team` and `responsibilities` silently become `null`.

---

## 7. Additional Discovered Anomalies & Dead Assets

1. **Dead Data File:** `data/event-registrations.json` is an empty JSON object (`{}`) with no consumers anywhere in the codebase.
2. **Registration URL Bug in `mapEvent` (`lib/events.js`)**:
   `const formUrl = e.registration_form_url || e.external_link || null;`
   If an event has an Instagram post in `external_link` but no Google Form in `registration_form_url`, the UI renders a "Register Now" button pointing directly to the Instagram post.
3. **Supabase Key Selection in `lib/supabaseClient.js`**:
   `const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;`
   The client-initialization helper prefers `SUPABASE_SERVICE_ROLE_KEY` over `SUPABASE_ANON_KEY`, completely bypassing Supabase Row Level Security (RLS) if the service-role key is provided.
4. **Unused Public API Endpoint (`app/api/members/route.js`)**:
   Returns the full roster of active student members, departments, and years. No client-side code consumes this endpoint.
5. **No-JS White Screen on Initial Render (`app/template.jsx`)**:
   `<motion.main>` defaults to `initial={{ opacity: 0, y: 16 }}`. If JavaScript is disabled or fails to hydrate, the main content area remains permanently invisible at `opacity: 0`.
