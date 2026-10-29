// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import oldUrls from './src/data/old-urls.json' with { type: 'json' };

// https://astro.build/config
export default defineConfig({
  // The public address of the finished site. Astro uses it for canonical links
  // and the sitemap. The site is served from the top of this domain by GitHub Pages.
  site: 'https://psoar.org',

  // Addresses from the old WordPress site, forwarded to their new home so
  // existing links and search results keep working. Each becomes a tiny page
  // that sends the visitor on.
  redirects: oldUrls,

  // Writes sitemap-index.xml listing every page (public/robots.txt points to it).
  integrations: [sitemap({ filter: (page) => !page.endsWith('/404/') && !(new URL(page).pathname.replace(/\/$/, '') in oldUrls) })],
});
