/**
 * The newsletter on the home page, from two sources:
 *  - the latest post's embed code, pasted monthly into src/data/latest-substack.html
 *    (the normal case: see getLatestEmbed below);
 *  - posts downloaded from Substack's feed by scripts/fetch-feeds.mjs, used instead
 *    whenever Substack allows the download (it currently refuses GitHub's servers).
 */
import latestEmbedFile from '../data/latest-substack.html?raw';

export interface NewsletterPost {
  title: string;
  url: string;
  date: string;
  summary: string;
  image: string;
}

interface Feed {
  fetched: string | null;
  items: NewsletterPost[];
}

const files = import.meta.glob<Feed>('../data/feeds/newsletter.json', { eager: true, import: 'default' });
const feed: Feed = Object.values(files)[0] ?? { fetched: null, items: [] };

export function getNewsletterPosts(limit = 3): NewsletterPost[] {
  return feed.items.slice(0, limit);
}

export function postDate(post: NewsletterPost): string {
  return new Intl.DateTimeFormat('en-US', { dateStyle: 'medium', timeZone: 'America/Chicago' }).format(
    new Date(post.date),
  );
}

/**
 * The latest post's Substack embed code, pasted into src/data/latest-substack.html
 * each month. Returns just the embed <div> (comments and Substack's <script> line are
 * dropped; the page loads that script itself), or null when the file has no embed.
 */
export function getLatestEmbed(): { html: string; url: string } | null {
  const html = latestEmbedFile
    .replace(/<!--[\s\S]*?-->/g, '')
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .trim();
  if (!/class="substack-post-embed"/.test(html)) return null;
  const url = html.match(/data-post-link[^>]*href="([^"]+)"/)?.[1] ?? html.match(/href="([^"]+)"/)?.[1] ?? '';
  return { html, url };
}
