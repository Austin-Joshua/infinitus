# Graph Report - Infinitus  (2026-11-17)

## Corpus Check
- cluster-only mode — file stats not available

## Summary
- 280 nodes · 730 edges · 13 communities (9 shown, 4 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 5 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `df407aec`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- site.js
- app/page.jsx
- HomeSections.jsx
- package.json
- Hero.jsx
- build.mjs
- optimize-branding.mjs
- gallery/page.jsx
- MemberCard.jsx
- compilerOptions
- next.config.mjs

## God Nodes (most connected - your core abstractions)
1. `COPY` - 18 edges
2. `next` - 18 edges
3. `Reveal()` - 16 edges
4. `framer-motion` - 16 edges
5. `getEvents()` - 14 edges
6. `SplitText()` - 14 edges
7. `react` - 14 edges
8. `Home()` - 12 edges
9. `EventCard()` - 11 edges
10. `pages()` - 11 edges

## Surprising Connections (you probably didn't know these)
- `PageHeader()` --indirect_call--> `introDelay()`  [INFERRED]
  components/layout/PageHeader.jsx → lib/motion.js
- `Template()` --calls--> `InfinitusLogo()`  [EXTRACTED]
  app/template.jsx → components/brand/InfinitusLogo.jsx
- `GET()` --calls--> `getEvents()`  [EXTRACTED]
  app/api/events/route.js → lib/events.js
- `GET()` --calls--> `getMembers()`  [EXTRACTED]
  app/api/members/route.js → lib/members.js
- `Home()` --calls--> `Hero()`  [EXTRACTED]
  app/page.jsx → components/sections/Hero.jsx

## Import Cycles
- None detected.

## Communities (13 total, 4 thin omitted)

### Community 0 - "site.js"
Cohesion: 0.09
Nodes (32): body, metadata, mono, RootLayout(), serif, viewport, Template(), InfinitusLogo() (+24 more)

### Community 1 - "app/page.jsx"
Cohesion: 0.08
Nodes (30): GET(), revalidate, GET(), revalidate, Home(), revalidate, sitemap(), galleryPhotos() (+22 more)

### Community 2 - "HomeSections.jsx"
Cohesion: 0.14
Nodes (31): EventPage(), generateMetadata(), NeighbourLink(), revalidate, metadata, revalidate, EventsSection(), FeaturedEvent() (+23 more)

### Community 3 - "package.json"
Cohesion: 0.08
Nodes (31): dependencies, framer-motion@^11, next@^15, react@^19, react-dom@^19, @supabase/supabase-js@^2, devDependencies, autoprefixer@^10 (+23 more)

### Community 4 - "Hero.jsx"
Cohesion: 0.17
Nodes (19): AboutPage(), metadata, metadata, NotFound(), AboutUs(), Hero(), inView, Journey() (+11 more)

### Community 5 - "build.mjs"
Cohesion: 0.22
Nodes (23): attr(), axes(), divider(), embed(), esc(), events(), f2(), files (+15 more)

### Community 6 - "optimize-branding.mjs"
Cohesion: 0.12
Nodes (16): alt, contentType, size, APP_DIR, ensureDir(), ensureTransparentWhiteRit(), INFINITUS_VARIANTS, main() (+8 more)

### Community 7 - "gallery/page.jsx"
Cohesion: 0.20
Nodes (14): ContactPage(), metadata, EventsPage(), GalleryPage(), metadata, revalidate, metadata, revalidate (+6 more)

### Community 8 - "MemberCard.jsx"
Cohesion: 0.29
Nodes (12): HomeExplore(), HomeTeam(), Avatar(), CloseIcon(), InstagramIcon(), LinkedinIcon(), MemberCard(), MemberDetailModal() (+4 more)

## Knowledge Gaps
- **4 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `next` connect `HomeSections.jsx` to `site.js`, `app/page.jsx`, `package.json`, `Hero.jsx`, `optimize-branding.mjs`?**
  _High betweenness centrality (0.147) - this node is a cross-community bridge._
- **Should `site.js` be split into smaller, more focused modules?**
  _Cohesion score 0.08888888888888889 - nodes in this community are weakly interconnected._
- **Why does `COPY` connect `HomeSections.jsx` to `site.js`, `Hero.jsx`, `build.mjs`, `gallery/page.jsx`?**
  _High betweenness centrality (0.065) - this node is a cross-community bridge._
- **Should `app/page.jsx` be split into smaller, more focused modules?**
  _Cohesion score 0.0824524312896406 - nodes in this community are weakly interconnected._
- **Why does `sharp` connect `package.json` to `build.mjs`, `optimize-branding.mjs`?**
  _High betweenness centrality (0.064) - this node is a cross-community bridge._
- **Should `HomeSections.jsx` be split into smaller, more focused modules?**
  _Cohesion score 0.13974358974358975 - nodes in this community are weakly interconnected._
- **Should `package.json` be split into smaller, more focused modules?**
  _Cohesion score 0.07862903225806452 - nodes in this community are weakly interconnected._