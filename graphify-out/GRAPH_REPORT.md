# Graph Report - Infinitus  (2026-11-17)

## Corpus Check
- 79 files · ~38,977 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 5 file(s) not represented in the graph (top: (none) 3, .example 1, .css 1)

## Summary
- 364 nodes · 889 edges · 17 communities (13 shown, 4 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 5 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `011e0a3a`
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
- steps
- compilerOptions
- next.config.mjs
- team/page.jsx
- eslint.config.mjs
- updates

## God Nodes (most connected - your core abstractions)
1. `next` - 18 edges
2. `COPY` - 18 edges
3. `Reveal()` - 17 edges
4. `framer-motion` - 15 edges
5. `getEvents()` - 14 edges
6. `SplitText()` - 14 edges
7. `react` - 14 edges
8. `Home()` - 13 edges
9. `EventPage()` - 12 edges
10. `SITE` - 12 edges

## Surprising Connections (you probably didn't know these)
- `PageHeader()` --indirect_call--> `introDelay()`  [INFERRED]
  components/layout/PageHeader.jsx → lib/motion.js
- `RootLayout()` --calls--> `JsonLd()`  [EXTRACTED]
  app/layout.jsx → components/seo/JsonLd.jsx
- `EventsPage()` --calls--> `getEvents()`  [EXTRACTED]
  app/events/page.jsx → lib/events.js
- `GalleryPage()` --calls--> `getEvents()`  [EXTRACTED]
  app/gallery/page.jsx → lib/events.js
- `Home()` --calls--> `getEvents()`  [EXTRACTED]
  app/page.jsx → lib/events.js

## Import Cycles
- None detected.

## Communities (17 total, 4 thin omitted)

### Community 0 - "site.js"
Cohesion: 0.08
Nodes (35): body, metadata, mono, organizationJsonLd, RootLayout(), serif, viewport, websiteJsonLd (+27 more)

### Community 1 - "events.js"
Cohesion: 0.09
Nodes (25): GET(), revalidate, GET(), revalidate, sitemap(), GALLERY, MEMBERS, getDbEvents() (+17 more)

### Community 2 - "HomeSections.jsx"
Cohesion: 0.12
Nodes (39): EventPage(), generateMetadata(), NeighbourLink(), revalidate, Home(), metadata, revalidate, EventsSection() (+31 more)

### Community 3 - "package.json"
Cohesion: 0.08
Nodes (32): dependencies, framer-motion@^11, next@^15, react@^19, react-dom@^19, @supabase/supabase-js@^2, devDependencies, autoprefixer@^10 (+24 more)

### Community 4 - "Hero.jsx"
Cohesion: 0.16
Nodes (20): AboutPage(), metadata, Error(), metadata, NotFound(), AboutUs(), Hero(), inView (+12 more)

### Community 5 - "build.mjs"
Cohesion: 0.20
Nodes (24): LEADERSHIP_ROLES, attr(), axes(), divider(), embed(), esc(), events(), f2() (+16 more)

### Community 6 - "optimize-branding.mjs"
Cohesion: 0.08
Nodes (22): alt, contentType, size, EVENTS, isDryRun, main(), seedEvents(), seedMembers() (+14 more)

### Community 7 - "site.js"
Cohesion: 0.14
Nodes (22): ContactPage(), metadata, EventsPage(), metadata, revalidate, GalleryPage(), metadata, revalidate (+14 more)

### Community 8 - "steps"
Cohesion: 0.10
Nodes (19): NEXT_PUBLIC_SITE_URL, jobs, verify, name, on, pull_request, push, branches (+11 more)

### Community 10 - "next.config.mjs"
Cohesion: 0.40
Nodes (3): cspHeader, nextConfig, securityHeaders

### Community 13 - "team/page.jsx"
Cohesion: 0.38
Nodes (9): MembersGrid(), Avatar(), CloseIcon(), InstagramIcon(), LinkedinIcon(), MemberCard(), MemberDetailModal(), TeamBrowser() (+1 more)

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

- **Why does `next` connect `Hero.jsx` to `site.js`, `events.js`, `HomeSections.jsx`, `package.json`, `optimize-branding.mjs`, `site.js`?**
  _High betweenness centrality (0.124) - this node is a cross-community bridge._
- **Should `site.js` be split into smaller, more focused modules?**
  _Cohesion score 0.07755102040816327 - nodes in this community are weakly interconnected._
- **Why does `sharp` connect `package.json` to `build.mjs`, `optimize-branding.mjs`?**
  _High betweenness centrality (0.042) - this node is a cross-community bridge._
- **Should `events.js` be split into smaller, more focused modules?**
  _Cohesion score 0.0858843537414966 - nodes in this community are weakly interconnected._
- **Why does `framer-motion` connect `Hero.jsx` to `site.js`, `HomeSections.jsx`, `package.json`, `site.js`, `team/page.jsx`?**
  _High betweenness centrality (0.037) - this node is a cross-community bridge._
- **Should `HomeSections.jsx` be split into smaller, more focused modules?**
  _Cohesion score 0.11843137254901961 - nodes in this community are weakly interconnected._
- **Should `package.json` be split into smaller, more focused modules?**
  _Cohesion score 0.07575757575757576 - nodes in this community are weakly interconnected._