# DEVLOG

## Working State

**Current Task**: v1 build: ranked class, report cards, share cards, grading page.
**Key Files**: src/lib/grade.ts (grades and comments), scripts/scan.ts (scanner runner), src/data/scans.json (data), src/app/page.tsx (class list), src/app/api/card/[slug]/route.tsx (share images).
**Active Decisions**: Homepage-only scans for consistency. Blocked checks say "locked out" so no false claims. Standalone site so cover links to agent-landing still land on the framework.
**Next Steps**: Andy creates the repo and Vercel project, sets NEXT_PUBLIC_SITE_URL if the domain differs from hypocrisy-highlighter.vercel.app.
**Blockers**: None.
**Gotchas**: Satori needs display:flex on every multi-child div.

## Session Archive

### 2026-10-30 — v1
Roster of 52 agent sellers minus active processes. Scanned with agent-landing 0.1.0. Class average 61, 22 F's. Ada, ServiceNow, Perplexity, and Lovable turn the scanner away with a 403 on the homepage.

## Mistakes & Lessons

- 2026-10-30 — First pass of comments would have said "No llms.txt" for sites that returned 403. Fixed with a locked-out comment and tests.
