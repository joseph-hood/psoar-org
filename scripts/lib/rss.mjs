/**
 * Turns the Substack RSS feed into a short list of posts for the home page.
 */
import { XMLParser } from 'fast-xml-parser';

/**
 * @typedef {object} NewsletterPost
 * @property {string} title
 * @property {string} url
 * @property {string} date      ISO timestamp.
 * @property {string} summary   Plain text, one or two sentences.
 * @property {string} image     Cover image address on Substack's image server, or ''.
 */

/**
 * @param {string} xml
 * @param {number} [limit]
 * @returns {NewsletterPost[]} Newest first.
 */
export function parseRss(xml, limit = 6) {
  const parser = new XMLParser({ ignoreAttributes: false, attributeNamePrefix: '' });
  const channel = parser.parse(xml)?.rss?.channel;
  if (!channel) throw new Error('Not an RSS feed (no <rss><channel>).');

  const items = [channel.item ?? []].flat();
  return items
    .map((item) => ({
      title: decode(text(item.title)).trim(),
      url: text(item.link),
      date: new Date(text(item.pubDate)).toISOString(),
      summary: summarize(text(item.description) || text(item['content:encoded'])),
      image: [item.enclosure ?? []].flat().find((e) => /^image\//.test(e.type ?? ''))?.url ?? '',
    }))
    .filter((post) => post.title && /^https:\/\//.test(post.url))
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, limit);
}

/**
 * Substack's archive API (/api/v1/archive), used when the RSS feed is refused.
 * @param {string} json
 * @param {number} [limit]
 * @returns {NewsletterPost[]}
 */
export function parseArchive(json, limit = 6) {
  const items = JSON.parse(json);
  if (!Array.isArray(items)) throw new Error('Not a Substack archive (expected a list).');
  return items
    .map((item) => ({
      title: String(item.title ?? '').trim(),
      url: String(item.canonical_url ?? ''),
      date: new Date(item.post_date).toISOString(),
      summary: summarize(String(item.description || item.subtitle || '')),
      image: String(item.cover_image ?? ''),
    }))
    .filter((post) => post.title && /^https:\/\//.test(post.url))
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, limit);
}

function text(value) {
  if (value == null) return '';
  if (typeof value === 'object') return String(value['#text'] ?? '');
  return String(value);
}

function decode(html) {
  return html
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&#39;|&rsquo;|&lsquo;/g, '’')
    .replace(/&quot;|&ldquo;|&rdquo;/g, '"')
    .replace(/&[a-z0-9#]+;/gi, '');
}

function summarize(html) {
  const plain = decode(html.replace(/<[^>]+>/g, ' '))
    .replace(/\s+/g, ' ')
    .trim();
  return plain.length > 220 ? `${plain.slice(0, 217).replace(/\s+\S*$/, '')}…` : plain;
}
