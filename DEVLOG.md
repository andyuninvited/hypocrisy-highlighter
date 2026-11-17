# DEVLOG

## Working State

**Current Task**: v1 build: ranked class, report cards, share cards, grading page.
**Key Files**: src/lib/grade.ts (grades and comments), scripts/scan.ts (scanner runner), src/data/scans.json (data), src/app/page.tsx (class list), src/app/api/card/[slug]/route.tsx (share images).
**Active Decisions**: Homepage-only scans for consistency. Blocked checks say "locked out" so no false claims. Standalone site so cover links to agent-landing still land on the framework.
**Next Steps**: Andy creates the repo and Vercel project, sets NEXT_PUBLIC_SITE_URL if the domain differs from hypocrisy-highlighter.vercel.app.
**Blockers**: None.
**Gotchas**: Satori needs display:flex on every multi-child div.

## Session Archive

### 2026-11-17 - Paste-a-URL scan box (#7)
LinkedIn traffic won't open a terminal, so the homepage now has a box: paste a URL, get the grade, teacher note, and top 3 fixes. POST /api/scan imports runScan from the published agent-landing package (moved to dependencies, deep import with local .d.ts) and relies on its guardedLookup for SSRF and DNS-rebinding protection. Homepage only, in-memory 5/min per-IP limit (best effort on serverless), nothing stored. CLI stays as the full-report path. Gotcha: port 3917 was taken by another local next-server, which looked like a 500 from our route.

### 2026-10-30 — v1
Roster of 52 agent sellers minus active processes. Scanned with agent-landing 0.1.0. Class average 61, 22 F's. Ada, ServiceNow, Perplexity, and Lovable turn the scanner away with a 403 on the homepage.

## Mistakes & Lessons

- 2026-10-30 — First pass of comments would have said "No llms.txt" for sites that returned 403. Fixed with a locked-out comment and tests.
