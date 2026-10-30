# AI Hypocrisy Highlighter

These companies sell AI agents. Can an agent use their website?

The Highlighter grades 52 companies that sell agents or agent platforms on how well an agent can read and use their own homepage. Each one gets a report card with a letter grade, a teacher's comment, and the cheapest fixes. The class average is a D.

I graded my own site first. It got an F.

## Grade your own site

The grades come from [agent-landing](https://github.com/andyuninvited/agent-landing), an open-source scanner. Run the same scan on your site:

```
npx agent-landing scan https://yoursite.com
```

## How grading works

The scanner fetches the homepage, robots.txt, llms.txt, the sitemap, and a few well-known paths. It honors robots.txt and identifies itself. Ten subjects are weighted into a score from 0 to 100, and the letter follows school bands (A is 90 and up, F is under 60). Full method on the site's grading page.

Scores are reproducible. If you fixed your site or think a check is wrong, open an issue and it gets a rescan.

## Run it locally

```
pnpm install
pnpm scan            # rescan every company in src/data/roster.json
pnpm scan openai     # rescan one
pnpm dev
```

## License

MIT. Archivo Black is under the SIL Open Font License (assets/fonts/OFL.txt).
