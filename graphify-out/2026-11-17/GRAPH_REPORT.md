# Graph Report - Infinitus  (2026-11-17)

## Corpus Check
- 78 files · ~38,588 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 4 file(s) not represented in the graph (top: (none) 2, .example 1, .css 1)

## Summary
- 344 nodes · 873 edges · 17 communities (13 shown, 4 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 5 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `20bb3ca3`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- site.js
- events.js
- HomeSections.jsx
- package.json
- Hero.jsx
- build.mjs
- optimize-branding.mjs
- site.js
- HomeSections.jsx
- compilerOptions
- next.config.mjs
- team/page.jsx
- eslint.config.mjs
- updates

## God Nodes (most connected - your core abstractions)
1. `COPY` - 18 edges
2. `next` - 18 edges
3. `Reveal()` - 17 edges
4. `framer-motion` - 15 edges
5. `SplitText()` - 14 edges
6. `getEvents()` - 14 edges
7. `react` - 14 edges
8. `Home()` - 13 edges
9. `EventPage()` - 12 edges
10. `SITE` - 12 edges

## Surprising Connections (you probably didn't know these)
- `AboutPage()` --calls--> `AboutUs()`  [EXTRACTED]
  app/about/page.jsx → components/sections/AboutUs.jsx
- `ContactPage()` --calls--> `PageHeader()`  [EXTRACTED]
  app/contact/page.jsx → components/layout/PageHeader.jsx
- `Error()` --calls--> `Lemniscate()`  [EXTRACTED]
  app/error.jsx → components/ui/Lemniscate.jsx
- `generateMetadata()` --calls--> `getEvent()`  [EXTRACTED]
  app/events/[id]/page.jsx → lib/events.js
- `EventPage()` --calls--> `GalleryGrid()`  [EXTRACTED]
  app/events/[id]/page.jsx → components/ui/GalleryGrid.jsx

## Import Cycles
- None detected.

## Communities (17 total, 4 thin omitted)

### Community 0 - "site.js"
Cohesion: 0.09
Nodes (30): body, metadata, mono, organizationJsonLd, RootLayout(), serif, viewport, websiteJsonLd (+22 more)

### Community 1 - "events.js"
Cohesion: 0.07
Nodes (30): GET(), revalidate, GET(), revalidate, EVENTS, MEMBERS, getDbEvents(), getEvent() (+22 more)

### Community 2 - "HomeSections.jsx"
Cohesion: 0.17
Nodes (24): EventPage(), generateMetadata(), NeighbourLink(), revalidate, EventsPage(), metadata, revalidate, EventsSection() (+16 more)

### Community 3 - "package.json"
Cohesion: 0.08
Nodes (32): dependencies, framer-motion@^11, next@^15, react@^19, react-dom@^19, @supabase/supabase-js@^2, devDependencies, autoprefixer@^10 (+24 more)

### Community 4 - "Hero.jsx"
Cohesion: 0.21
Nodes (16): Error(), metadata, NotFound(), PageHeader(), Hero(), inView, Counter(), Lemniscate() (+8 more)

### Community 5 - "build.mjs"
Cohesion: 0.20
Nodes (24): LEADERSHIP_ROLES, attr(), axes(), divider(), embed(), esc(), events(), f2() (+16 more)

### Community 6 - "optimize-branding.mjs"
Cohesion: 0.11
Nodes (17): alt, contentType, size, COLLEGE_NAME, APP_DIR, ensureDir(), ensureTransparentWhiteRit(), INFINITUS_VARIANTS (+9 more)

### Community 7 - "site.js"
Cohesion: 0.12
Nodes (19): ContactPage(), metadata, GalleryPage(), metadata, revalidate, sitemap(), ContactRow(), ContactSection() (+11 more)

### Community 8 - "HomeSections.jsx"
Cohesion: 0.17
Nodes (24): AboutPage(), metadata, Home(), metadata, revalidate, AboutUs(), CtaBand(), EXPLORE_METADATA (+16 more)

### Community 10 - "next.config.mjs"
Cohesion: 0.40
Nodes (3): cspHeader, nextConfig, securityHeaders

### Community 13 - "team/page.jsx"
Cohesion: 0.26
Nodes (12): metadata, revalidate, TeamPage(), MembersGrid(), Avatar(), CloseIcon(), InstagramIcon(), LinkedinIcon() (+4 more)

### Community 14 - "eslint.config.mjs"
Cohesion: 0.25
Nodes (4): compat, __dirname, eslintConfig, __filename

### Community 16 - "updates"
Cohesion: 0.18
Nodes (10): prefix, interval, updates, commit-message, directory, labels, open-pull-requests-limit, package-ecosystem (+2 more)

## Knowledge Gaps
- **4 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `next` connect `site.js` to `events.js`, `HomeSections.jsx`, `package.json`, `Hero.jsx`, `optimize-branding.mjs`, `site.js`, `HomeSections.jsx`?**
  _High betweenness centrality (0.139) - this node is a cross-community bridge._
- **Should `site.js` be split into smaller, more focused modules?**
  _Cohesion score 0.09487179487179487 - nodes in this community are weakly interconnected._
- **Why does `sharp` connect `package.json` to `build.mjs`, `optimize-branding.mjs`?**
  _High betweenness centrality (0.047) - this node is a cross-community bridge._
- **Should `events.js` be split into smaller, more focused modules?**
  _Cohesion score 0.07272727272727272 - nodes in this community are weakly interconnected._
- **Why does `framer-motion` connect `Hero.jsx` to `site.js`, `HomeSections.jsx`, `package.json`, `site.js`, `HomeSections.jsx`, `team/page.jsx`?**
  _High betweenness centrality (0.041) - this node is a cross-community bridge._
- **Should `package.json` be split into smaller, more focused modules?**
  _Cohesion score 0.07575757575757576 - nodes in this community are weakly interconnected._
- **Should `optimize-branding.mjs` be split into smaller, more focused modules?**
  _Cohesion score 0.11255411255411256 - nodes in this community are weakly interconnected._