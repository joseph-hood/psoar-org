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
 *  - with FEEDS_STRICT=1 (set by the publishing workflow) it stops with an error,
 *    so a Google or Substack outage never publishes a site with no events. The
 *    live site simply stays as it was until the next run.
 */
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { parseIcs } from './lib/ics.mjs';
import { parseRss } from './lib/rss.mjs';

const site = JSON.parse(await readFile(new URL('../src/config/feeds.json', import.meta.url), 'utf8'));
const outDir = new URL('../src/data/feeds/', import.meta.url);
const strict = process.env.FEEDS_STRICT === '1';

await mkdir(outDir, { recursive: true });

const now = new Date();
const until = new Date(now);
until.setMonth(until.getMonth() + site.calendar.monthsAhead);

const results = await Promise.allSettled([
  update('events.json', `https://calendar.google.com/calendar/ical/${encodeURIComponent(site.calendar.id)}/public/basic.ics`, (text) =>
    parseIcs(text, { from: now, until, limit: site.calendar.maxEvents }),
  ),
  update('newsletter.json', `${site.newsletter.url.replace(/\/$/, '')}/feed`, (text) =>
    parseRss(text, site.newsletter.maxPosts),
  ),
]);

const failed = results.filter((r) => r.status === 'rejected');
if (failed.length && strict) process.exit(1);

async function update(file, url, parse) {
  const target = new URL(file, outDir);
  try {
    const response = await fetch(url, { headers: { 'user-agent': 'psoar.org site build' } });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const items = parse(await response.text());
    await writeFile(target, `${JSON.stringify({ fetched: new Date().toISOString(), source: url, items }, null, 2)}\n`);
    console.log(`feeds: ${file} ← ${items.length} item(s) from ${url}`);
  } catch (error) {
    const message = `feeds: couldn't update ${file} from ${url} (${error.message ?? error})`;
    if (strict) {
      console.error(`::error::${message}`);
      throw error;
    }
    const kept = await readFile(target, 'utf8').then(
      () => true,
      () => false,
    );
    if (!kept) await writeFile(target, `${JSON.stringify({ fetched: null, source: url, items: [] }, null, 2)}\n`);
    console.warn(`::warning::${message}; ${kept ? 'keeping the last copy' : 'using an empty list'}.`);
  }
}
