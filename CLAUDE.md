# Psychedelic Society of Arkansas website — notes for Claude

Source for https://psoar.org: an Astro site, hosted on GitHub Pages, replacing the old WordPress site on Bluehost.
Developers maintain the structure; non-developers update content (resource links, reading list). Explain in plain
language, avoid jargon, and confirm before anything hard to undo. README.md is the maintainers' guide (where things
live, common edits, TODOs); keep it accurate when you change how things work.

## How the site works

- Astro project: pages in `src/pages/`, editable content in `src/data/`, settings in `src/config/site.ts` and
  `src/config/feeds.json`, styles in `src/styles/global.css`. Node 24 (`.nvmrc`; Astro needs ≥ 22.23).
- **Events and newsletter are live feeds, not content files.** `scripts/fetch-feeds.mjs` downloads the public
  Google Calendar (.ics) and the Substack RSS feed into `src/data/feeds/*.json` (gitignored) before every `dev` and
  `build`. Parsers are in `scripts/lib/` with tests in `scripts/feeds.test.mjs` (`npm test`). Never commit feed
  JSON or hand-edit events; they're managed in Google Calendar.
- `.github/workflows/pages.yml` runs tests, `npm run check`, `npm run build`, `tools/check-site.py` on every PR, and
  on push to `main`, daily at 10:23 UTC, and on manual "Run workflow" also publishes `dist/`. Publishing runs set
  `FEEDS_STRICT=1`, so a feed outage fails the run and the live site stays as it was.
- Pages filter out past events at build time, and a small script hides events that end between builds.
- Old WordPress addresses forward via `redirects` in `astro.config.mjs` (list in `src/data/old-urls.json`).
- Switch in `src/config/site.ts`: `noindex` (true until launch). Don't change it unless asked.
- Brand (from the WordPress Elementor kit): salmon `#F19677`, pink `#EF8994`, mauve `#C485A2`, violet `#9183A4`,
  sky `#6195BD`, blue `#3C8FB9`, night `#131D13`, forest `#253925`, mist `#F3F2F3`; added tokens for text contrast
  (e.g. `--link`, `--salmon-ink`). Fonts: Lato (headings), Rubik (body), self-hosted via npm.
- Served from the domain root, so links start with `/`. Don't set `base` in `astro.config.mjs`.
- This environment may block psoar.org, calendar.google.com and substack.com; if feeds fail locally the build keeps
  the last copy or an empty list (that's expected; CI has network).

## Checking changes

`npm test`, `npm run check`, `npm run build`, then `python3 tools/check-site.py`. Look at pages with `npm run dev`
at desktop and phone width, and check for console errors.

**Live preview for the maintainer.** When a session changes anything that affects the built site, publish a preview
as an Artifact before opening the PR:

1. `npm run build`, then `python3 tools/build-preview.py <scratchpad>/preview` (prints the supporting files; it
   renames `_astro/` to `astro/` in the copy because the Artifact host rejects `_` paths).
2. Publish `<scratchpad>/preview/index.html` with the Artifact tool, `root` set to `<scratchpad>/preview` and every
   printed path in `files`.
3. After each further change in the same session, rebuild and republish the same file path so the link stays the
   same. Put the preview link in your reply.

If the feeds can't be downloaded in the session, say so in the reply; any sample data used for a preview must be
clearly labeled as sample and never committed.

## Workflow

- Never push directly to `main`. Branch → commit → push → PR with a short plain-language summary. Merging the PR
  publishes the site.
- One small PR per request.
- Don't commit secrets, API keys, or private contact details. The repo is public. No secrets are needed: the
  calendar and Substack feeds are public.

## Content guidelines

PSoAR focuses on education, risk reduction, and community. Site copy must not offer, sell, or facilitate access to
controlled substances, and must not be presented as medical or legal advice. Keep crisis and peer-support info
(988, Fireside Project) accurate. Don't invent claims about research, events, people, or services; facts about
partner organizations come from them or their official sites. Mission, vision and purpose (`src/data/about.ts`) need
the board's OK to change.
