# Graph Report - Infinitus  (2026-11-17)

## Corpus Check
- 74 files · ~37,224 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 4 file(s) not represented in the graph (top: (none) 2, .example 1, .css 1)

## Summary
- 326 nodes · 848 edges · 16 communities (11 shown, 5 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 5 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `e0626c0d`
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
- `GET()` --calls--> `getEvents()`  [EXTRACTED]
  app/api/events/route.js → lib/events.js
- `GET()` --calls--> `getMembers()`  [EXTRACTED]
  app/api/members/route.js → lib/members.js
- `ContactPage()` --calls--> `PageHeader()`  [EXTRACTED]
  app/contact/page.jsx → components/layout/PageHeader.jsx
- `Error()` --calls--> `Lemniscate()`  [EXTRACTED]
  app/error.jsx → components/ui/Lemniscate.jsx

## Import Cycles
- None detected.

## Communities (16 total, 5 thin omitted)

### Community 0 - "site.js"
Cohesion: 0.09
Nodes (30): body, metadata, mono, organizationJsonLd, RootLayout(), serif, viewport, websiteJsonLd (+22 more)

### Community 1 - "events.js"
Cohesion: 0.10
Nodes (22): GET(), revalidate, GET(), revalidate, sitemap(), MEMBERS, getDbEvents(), getEvents() (+14 more)

### Community 2 - "HomeSections.jsx"
Cohesion: 0.24
Nodes (17): EventsPage(), metadata, revalidate, EventsSection(), FeaturedEvent(), NextEventBanner(), EventCard(), EventPoster() (+9 more)

### Community 3 - "package.json"
Cohesion: 0.06
Nodes (38): EVENTS, dependencies, framer-motion@^11, next@^15, react@^19, react-dom@^19, @supabase/supabase-js@^2, devDependencies (+30 more)

### Community 4 - "Hero.jsx"
Cohesion: 0.20
Nodes (17): Error(), metadata, NotFound(), PageHeader(), Hero(), inView, Counter(), Lemniscate() (+9 more)

### Community 5 - "build.mjs"
Cohesion: 0.22
Nodes (23): attr(), axes(), divider(), embed(), esc(), events(), f2(), files (+15 more)

### Community 6 - "optimize-branding.mjs"
Cohesion: 0.12
Nodes (16): alt, contentType, size, APP_DIR, ensureDir(), ensureTransparentWhiteRit(), INFINITUS_VARIANTS, main() (+8 more)

### Community 7 - "site.js"
Cohesion: 0.10
Nodes (27): ContactPage(), metadata, EventPage(), generateMetadata(), NeighbourLink(), revalidate, GalleryPage(), metadata (+19 more)

### Community 8 - "HomeSections.jsx"
Cohesion: 0.17
Nodes (24): AboutPage(), metadata, Home(), metadata, revalidate, AboutUs(), CtaBand(), EXPLORE_METADATA (+16 more)

### Community 13 - "team/page.jsx"
Cohesion: 0.26
Nodes (12): metadata, revalidate, TeamPage(), MembersGrid(), Avatar(), CloseIcon(), InstagramIcon(), LinkedinIcon() (+4 more)

### Community 14 - "eslint.config.mjs"
Cohesion: 0.25
Nodes (4): compat, __dirname, eslintConfig, __filename

## Knowledge Gaps
- **5 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `next` connect `Hero.jsx` to `site.js`, `events.js`, `HomeSections.jsx`, `package.json`, `optimize-branding.mjs`, `site.js`, `HomeSections.jsx`?**
  _High betweenness centrality (0.140) - this node is a cross-community bridge._
- **Should `site.js` be split into smaller, more focused modules?**
  _Cohesion score 0.09230769230769231 - nodes in this community are weakly interconnected._
- **Why does `sharp` connect `package.json` to `build.mjs`, `optimize-branding.mjs`?**
  _High betweenness centrality (0.052) - this node is a cross-community bridge._
- **Should `events.js` be split into smaller, more focused modules?**
  _Cohesion score 0.09634551495016612 - nodes in this community are weakly interconnected._
- **Why does `framer-motion` connect `Hero.jsx` to `site.js`, `HomeSections.jsx`, `package.json`, `site.js`, `HomeSections.jsx`, `team/page.jsx`?**
  _High betweenness centrality (0.046) - this node is a cross-community bridge._
- **Should `package.json` be split into smaller, more focused modules?**
  _Cohesion score 0.059233449477351915 - nodes in this community are weakly interconnected._
- **Should `optimize-branding.mjs` be split into smaller, more focused modules?**
  _Cohesion score 0.11904761904761904 - nodes in this community are weakly interconnected._