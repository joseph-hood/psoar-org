/**
 * Latest Substack posts, saved to src/data/feeds/newsletter.json by
 * scripts/fetch-feeds.mjs before every build. Publish on Substack and the post
 * shows up on the home page at the next daily update.
 */
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
