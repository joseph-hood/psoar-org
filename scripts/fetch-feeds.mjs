/**
 * Downloads the Google Calendar and the Substack feed and saves them as JSON in
 * src/data/feeds/, where the pages read them. Runs automatically before
 * `npm run dev` and `npm run build`, and on GitHub every morning (see
 * .github/workflows/pages.yml), so the site never needs editing to show new events.
 *
 *   npm run feeds
 *
 * If a feed can't be downloaded:
 *  - normally it keeps the copy from last time (or an empty list) and prints a
 *    warning, so you can still work on the site offline;
 *  - with FEEDS_STRICT=1 (set by the publishing workflow) a calendar failure
 *    stops with an error, so a Google outage never publishes a site with no
 *    events; the live site simply stays as it was until the next run. The
 *    newsletter is never required: without it the home page shows a
 *    "Read the newsletter" button instead of the latest posts.
 */
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { parseIcs } from './lib/ics.mjs';
import { parseArchive, parseRss } from './lib/rss.mjs';

const site = JSON.parse(await readFile(new URL('../src/config/feeds.json', import.meta.url), 'utf8'));
const outDir = new URL('../src/data/feeds/', import.meta.url);
const strict = process.env.FEEDS_STRICT === '1';

await mkdir(outDir, { recursive: true });

const now = new Date();
const until = new Date(now);
until.setMonth(until.getMonth() + site.calendar.monthsAhead);

const substack = site.newsletter.url.replace(/\/$/, '');
const [calendar] = await Promise.allSettled([
  update(
    'events.json',
    [`https://calendar.google.com/calendar/ical/${encodeURIComponent(site.calendar.id)}/public/basic.ics`],
    (text) => parseIcs(text, { from: now, until, limit: site.calendar.maxEvents }),
    { required: true },
  ),
  // Substack sometimes refuses its RSS feed to cloud servers; its archive API is the fallback.
  update('newsletter.json', [`${substack}/feed`, `${substack}/api/v1/archive?sort=new&limit=${site.newsletter.maxPosts}`], (text, url) =>
    url.includes('/api/') ? parseArchive(text, site.newsletter.maxPosts) : parseRss(text, site.newsletter.maxPosts),
  ),
]);

if (calendar.status === 'rejected' && strict) process.exit(1);

/** Tries each address in turn and saves the first that downloads and parses. */
async function update(file, urls, parse, { required = false } = {}) {
  const target = new URL(file, outDir);
  const errors = [];
  for (const url of urls) {
    try {
      const response = await fetch(url, {
        headers: {
          // A browser-like request; some hosts refuse obvious scripts.
          'user-agent': 'Mozilla/5.0 (compatible; psoar.org site build; +https://psoar.org)',
          accept: 'text/calendar, application/rss+xml, application/xml, application/json;q=0.9, */*;q=0.8',
        },
      });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const items = parse(await response.text(), url);
      await writeFile(target, `${JSON.stringify({ fetched: new Date().toISOString(), source: url, items }, null, 2)}\n`);
      console.log(`feeds: ${file} ← ${items.length} item(s) from ${url}`);
      return;
    } catch (error) {
      errors.push(`${url} (${error.message ?? error})`);
    }
  }

  const message = `feeds: couldn't update ${file} from ${errors.join('; ')}`;
  if (strict && required) {
    console.error(`::error::${message}`);
    throw new Error(message);
  }
  const kept = await readFile(target, 'utf8').then(
    () => true,
    () => false,
  );
  if (!kept) await writeFile(target, `${JSON.stringify({ fetched: null, source: urls[0], items: [] }, null, 2)}\n`);
  console.warn(`::warning::${message}; ${kept ? 'keeping the last copy' : 'using an empty list'}.`);
}
