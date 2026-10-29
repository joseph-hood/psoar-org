# psoar.org

Website for the **Psychedelic Society of Arkansas** (PSoAR). Built with [Astro](https://astro.build) and published
on GitHub Pages. Merging a pull request into `main` publishes the site; see [docs/DEPLOY.md](docs/DEPLOY.md).

## Where things live

| To change…                                  | Edit                                                     |
| ------------------------------------------- | -------------------------------------------------------- |
| **Events**                                  | **Google Calendar.** Not this repository (see below).    |
| **Newsletter posts on the home page**       | **Substack.** Not this repository.                       |
| Resource links, books, videos               | `src/data/resources.ts`                                  |
| Reading list and the 3 featured articles    | `src/data/articles.ts`                                   |
| Mission / vision / purpose                  | `src/data/about.ts`                                      |
| Email, store, chapter form, Facebook, EIN   | `src/config/site.ts`                                     |
| Contact form connection                     | `src/config/site.ts` → `contactForm` (see below)          |
| Calendar or Substack address                | `src/config/feeds.json`                                  |
| Header menu                                 | `src/data/nav.ts`                                        |
| Colors and fonts                            | `src/styles/global.css`                                  |
| Page layouts                                | `src/pages/*.astro`                                      |
| Old WordPress addresses that forward        | `src/data/old-urls.json`                                 |

Each data file starts with a comment explaining how to add an entry. Copy an existing entry and change it.

## Events (Google Calendar)

The Events page and the home page read the **PSoAR Google Calendar** directly. Add, change, or cancel events in
Google Calendar as usual; the site picks them up at its daily update (about 5 am Arkansas time). To update right
away: **Actions → Deploy site to GitHub Pages → Run workflow**.

Tips for good-looking events:

- **Location:** a street address (it becomes a map link) or a meeting link (it shows as "Online").
- **Description:** the first sentence or two appear on the home page. Put the RSVP/ticket link in the description
  (or the event's own link); the first link becomes the **More info / RSVP** button.
- Repeating events, moved or cancelled single dates, and all-day or multi-day events all work.
- Events up to 6 months ahead are shown (`monthsAhead` in `src/config/feeds.json`).

Visitors can subscribe to the whole calendar (Google or Apple/Outlook) or add single events to their own calendar
from the site.

## Newsletter (Substack)

The home page shows the 3 latest posts from https://psoar.substack.com, refreshed daily like events.

## Contact form

The form sends to a Google Form, whose responses go to a linked Google Sheet. To connect it:

1. Create a Google Form with four questions: **Name** (short answer), **Email** (short answer), **Subject** (short
   answer), **Message** (paragraph). In **Responses**, click **Link to Sheets** to create the spreadsheet. Turn on
   email notifications for new responses if you'd like (Responses → ⋮ → Get email notifications).
2. In the form editor: ⋮ menu → **Get pre-filled link**, type anything into each field, click **Get link**, and
   copy it. It looks like
   `https://docs.google.com/forms/d/e/<FORM_ID>/viewform?usp=pp_url&entry.111=a&entry.222=b&entry.333=c&entry.444=d`.
3. In `src/config/site.ts`, set `contactForm.action` to `https://docs.google.com/forms/d/e/<FORM_ID>/formResponse`
   and fill in each field's `entry.NNN` key. If the form collects email through **Settings → Responses → Collect
   email addresses: Responder input** instead of a question, use `emailAddress` as the email key. ("Verified" won't
   work: it needs a Google sign-in.)

Until it's connected, the form is disabled and shows the email address instead.

## Working on the site

You need Node 24 (`nvm use` picks it up from `.nvmrc`).

```bash
npm install
npm run dev          # live preview at http://localhost:4321 (downloads events + newsletter first)
npm test             # tests for the calendar and newsletter readers
npm run check        # type/code check
npm run build        # writes the finished site to dist/
python3 tools/check-site.py   # broken-link check on dist/
```

If you're offline, `npm run dev` keeps the last downloaded events (or shows the "no upcoming events" message).

## TODO before launch

- [ ] **Logo files.** The header, footer and favicon use a stand-in sunset badge drawn in code
      (`src/components/ui/Mark.astro`, `public/favicon.svg`). Replace with the real PSoAR icon and wordmark.
- [ ] **Connect the contact form** (above).
- [ ] **Refresh the reading list.** The articles carried over from the old site date from 2008–2018. Add newer
      ones at the top of `src/data/articles.ts` and mark the best three `featured: true`.
- [ ] **Video titles** on the Resources page (`title` in `src/data/resources.ts`, for screen readers).
- [ ] **Social preview image** (`og:image`) once the logo/banner files are in.
- [ ] **Launch steps** in [docs/DEPLOY.md](docs/DEPLOY.md): public calendar check, Pages, DNS, `noindex: false`.
