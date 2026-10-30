# AI Hypocrisy Highlighter

Report cards for companies that sell AI agents, graded on whether an agent can use their own website. Launch artifact for agent-landing.

## Stack

- Next.js 16 (App Router), React 19, Tailwind 4, TypeScript
- Scans from the published `agent-landing` CLI (devDependency), no LLM calls
- Deployment: Vercel

## Commands

```
pnpm dev         # dev server
pnpm build       # production build (all report cards prerender)
pnpm test        # vitest
pnpm lint
pnpm typecheck
pnpm scan [slug...]  # rescan roster entries into src/data/scans.json
```

## Structure

```
src/data/roster.json   # who gets graded (slug, name, url, category)
src/data/scans.json    # scan output, committed, the source of every grade
src/lib/grade.ts       # letter bands, teacher comments, blocked-scan handling
src/app/c/[slug]       # report card pages
src/app/api/card/[slug]  # OG/share images ("class" = class summary)
scripts/scan.ts        # runs agent-landing scan --json per site
```

## Key context

- Roster rule: companies Andy has an open application or live process with stay off. Rejections are fair game. Check andy/pipeline-tracker.md before adding anyone.
- Every claim must be true tool output. A 403 or bot challenge means "locked out", never "missing" (see `locked` in grade.ts).
- `andy-rosic` is in scans.json as the self-grade and is excluded from the ranked class.
- jasper.ai is blocked by Andy's local DNS filter, so it was dropped from the roster.
- Andy creates public repos himself (`gh repo create --public` is blocked in auto mode).
- Site prose follows the andy-writing rules: no em-dashes, Oxford comma, no "not X, but Y".
