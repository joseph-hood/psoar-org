# Publishing the site (GitHub Pages)

## What happens when you merge

GitHub does everything itself. The steps are in [`.github/workflows/pages.yml`](../.github/workflows/pages.yml):

1. **Install** the tools the project uses (`npm ci`).
2. **Test** the calendar and newsletter readers (`npm test`).
3. **Check** the code for mistakes (`npm run check`).
4. **Download** the latest events from Google Calendar and posts from Substack, then **build** the site into a
   folder of plain web files called `dist/` (`npm run build`).
5. **Check for broken links** in `dist/` (`tools/check-site.py`).
6. **Publish** `dist/` to GitHub Pages, at https://psoar.org.

On a pull request, steps 1–5 run and nothing is published. On a merge into `main`, all six run. If any step fails,
nothing is published and the live site stays as it was.

## Daily updates (events and newsletter)

The same workflow also runs **every morning at about 5 am Arkansas time**, so events added in Google Calendar and new
Substack posts appear on the site by morning without anyone editing it.

- **Need an event on the site right now?** Open **Actions → Deploy site to GitHub Pages → Run workflow**. It's live
  in about two minutes.
- **If Google Calendar is down** during a run, that run stops before publishing (you'll see a red ✗ in Actions).
  The live site keeps yesterday's events; the next run fixes itself.
- **If Substack can't be reached**, the site still publishes; the home page shows a "Read the newsletter" button
  in place of the latest posts until the next run that reaches it.
- **GitHub pauses scheduled runs after 60 days with no commits** to the repository. If events stop updating, open
  **Actions → Deploy site to GitHub Pages**; if there's a banner saying the schedule was disabled, click **Enable
  workflow**. Any merged pull request also resets the 60 days.
- Between runs, events that have finished hide themselves in visitors' browsers.

## Rolling back

Open the merged pull request, click **Revert**, and merge the revert PR. GitHub rebuilds and publishes the earlier
version.

## One-time setup (to do at launch)

1. **Calendar must be public:** in Google Calendar, the PSoAR calendar → **Settings and sharing → Access
   permissions for events → Make available to public**, with **See all event details**. (It already is if the old
   site's embedded calendar shows event details to logged-out visitors.)
2. **Turn on Pages:** repository **Settings → Pages → Build and deployment → Source: GitHub Actions**.
3. **Custom domain:** on the same page, enter `psoar.org` and save. Tick **Enforce HTTPS** once GitHub offers it
   (can take up to an hour after DNS changes).
4. **DNS** at Bluehost (**Domains → psoar.org → DNS**). Replace the records that point the website at Bluehost:

   | Type  | Host | Value                                                                      |
   | ----- | ---- | -------------------------------------------------------------------------- |
   | A     | @    | 185.199.108.153, 185.199.109.153, 185.199.110.153, 185.199.111.153 (one record each) |
   | AAAA  | @    | 2606:50c0:8000::153, 2606:50c0:8001::153, 2606:50c0:8002::153, 2606:50c0:8003::153 (one record each) |
   | CNAME | www  | joseph-hood.github.io                                                       |

   Delete any other `A`/`AAAA` records on `@` and any old `www` record first.

   **Don't touch email records.** psoar.org email runs on Google Workspace: keep the `MX` records (Google's, e.g.
   `smtp.google.com` or `aspmx.l.google.com`), the `TXT` record starting `v=spf1`, any `google._domainkey` (DKIM)
   and `_dmarc` records, and any `google-site-verification` TXT record. Screenshot the whole DNS page before
   changing anything.
5. **Turn on search indexing:** set `noindex: false` in `src/config/site.ts` and merge.
6. **Bluehost:** keep the domain registration and DNS there (or move them later). Cancel the hosting plan only after
   the new site has been live for a week and email still works. Download a backup of the WordPress site first.

The site must be served from the top of a domain, because every link starts with `/`. That's why the
`joseph-hood.github.io/psoar-org/` address shows pages without styles.

GitHub's guide: <https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site>
