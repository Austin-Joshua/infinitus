# Graph Report - Infinitus  (2026-11-17)

## Corpus Check
- 62 files · ~32,735 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 3 file(s) not represented in the graph (top: .example 1, (none) 1, .css 1)

## Summary
- 281 nodes · 732 edges · 13 communities (9 shown, 4 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 5 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `25a2ff0a`
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
- HomeSections.jsx
- compilerOptions
- next.config.mjs

## God Nodes (most connected - your core abstractions)
1. `COPY` - 18 edges
2. `next` - 17 edges
3. `Reveal()` - 16 edges
4. `framer-motion` - 15 edges
5. `SplitText()` - 14 edges
6. `getEvents()` - 14 edges
7. `react` - 13 edges
8. `Home()` - 12 edges
9. `PageHeader()` - 11 edges
10. `HomeEvents()` - 11 edges

## Surprising Connections (you probably didn't know these)
- `GET()` --calls--> `getEvents()`  [EXTRACTED]
  app/api/events/route.js → lib/events.js
- `PageHeader()` --indirect_call--> `introDelay()`  [INFERRED]
  components/layout/PageHeader.jsx → lib/motion.js
- `AboutPage()` --calls--> `AboutUs()`  [EXTRACTED]
  app/about/page.jsx → components/sections/AboutUs.jsx
- `GET()` --calls--> `getMembers()`  [EXTRACTED]
  app/api/members/route.js → lib/members.js
- `generateMetadata()` --calls--> `getEvent()`  [EXTRACTED]
  app/events/[id]/page.jsx → lib/events.js

## Import Cycles
- None detected.

## Communities (13 total, 4 thin omitted)

### Community 0 - "site.js"
Cohesion: 0.09
Nodes (31): GET(), revalidate, body, metadata, mono, RootLayout(), serif, viewport (+23 more)

### Community 1 - "app/page.jsx"
Cohesion: 0.10
Nodes (22): GET(), revalidate, galleryPhotos(), GallerySection(), GalleryGrid(), EVENTS, GALLERY, MEMBERS (+14 more)

### Community 2 - "HomeSections.jsx"
Cohesion: 0.24
Nodes (18): EventPage(), generateMetadata(), NeighbourLink(), revalidate, EventsSection(), FeaturedEvent(), NextEventBanner(), EventCard() (+10 more)

### Community 3 - "package.json"
Cohesion: 0.08
Nodes (31): dependencies, framer-motion@^11, next@^15, react@^19, react-dom@^19, @supabase/supabase-js@^2, devDependencies, autoprefixer@^10 (+23 more)

### Community 4 - "Hero.jsx"
Cohesion: 0.21
Nodes (15): metadata, NotFound(), Hero(), inView, Counter(), Lemniscate(), PATH, container() (+7 more)

### Community 5 - "build.mjs"
Cohesion: 0.20
Nodes (24): LEADERSHIP_ROLES, attr(), axes(), divider(), embed(), esc(), events(), f2() (+16 more)

### Community 6 - "optimize-branding.mjs"
Cohesion: 0.12
Nodes (16): alt, contentType, size, APP_DIR, ensureDir(), ensureTransparentWhiteRit(), INFINITUS_VARIANTS, main() (+8 more)

### Community 7 - "gallery/page.jsx"
Cohesion: 0.13
Nodes (23): ContactPage(), metadata, EventsPage(), metadata, revalidate, GalleryPage(), metadata, revalidate (+15 more)

### Community 8 - "HomeSections.jsx"
Cohesion: 0.15
Nodes (29): AboutPage(), metadata, Home(), revalidate, AboutUs(), CtaBand(), EXPLORE_METADATA, HOME_TEAM_ROLES (+21 more)

## Knowledge Gaps
- **4 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `next` connect `site.js` to `app/page.jsx`, `HomeSections.jsx`, `package.json`, `Hero.jsx`, `optimize-branding.mjs`, `HomeSections.jsx`?**
  _High betweenness centrality (0.141) - this node is a cross-community bridge._
- **Should `site.js` be split into smaller, more focused modules?**
  _Cohesion score 0.09024390243902439 - nodes in this community are weakly interconnected._
- **Why does `sharp` connect `package.json` to `build.mjs`, `optimize-branding.mjs`?**
  _High betweenness centrality (0.064) - this node is a cross-community bridge._
- **Should `app/page.jsx` be split into smaller, more focused modules?**
  _Cohesion score 0.09803921568627451 - nodes in this community are weakly interconnected._
- **Why does `COPY` connect `gallery/page.jsx` to `site.js`, `HomeSections.jsx`, `Hero.jsx`, `build.mjs`, `HomeSections.jsx`?**
  _High betweenness centrality (0.062) - this node is a cross-community bridge._
- **Should `package.json` be split into smaller, more focused modules?**
  _Cohesion score 0.07862903225806452 - nodes in this community are weakly interconnected._
- **Should `optimize-branding.mjs` be split into smaller, more focused modules?**
  _Cohesion score 0.11904761904761904 - nodes in this community are weakly interconnected._