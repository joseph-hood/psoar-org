/**
 * Site-wide settings. Change things here instead of hunting through pages.
 * The calendar and newsletter addresses live in ./feeds.json, because the
 * script that downloads them (scripts/fetch-feeds.mjs) reads them too.
 */
import feeds from './feeds.json';

export const SITE = {
  name: 'Psychedelic Society of Arkansas',
  shortName: 'PSoAR',
  url: 'https://psoar.org',
  email: 'info@psoar.org',
  description:
    'The Psychedelic Society of Arkansas promotes education, risk reduction, and community outreach in the area of psychedelics and plant medicine.',

  /**
   * SEARCH ENGINE SWITCH.
   * While true, every page tells search engines not to index it. Turn it off
   * (false) once the site is live on psoar.org. The 404 page is always noindex.
   */
  noindex: true,

  /** Shown in the footer and on the About page. */
  ein: '41-2369082',

  newsletterUrl: feeds.newsletter.url,
  storeUrl: 'https://psoar.printful.me/',
  /** Google Form behind "Start a chapter". */
  chapterFormUrl:
    'https://docs.google.com/forms/d/e/1FAIpQLScemIA_-GfUiQsveHOEkuQrMo2z5zwJoCe9MkzVZCilftikfA/viewform',
  facebookUrl: 'https://www.facebook.com/psoark',

  calendar: feeds.calendar,

  /**
   * CONTACT FORM → Google Form (responses land in the form's linked Google Sheet).
   * Leave `action` empty and the form shows "email us instead" and sends nothing.
   * README.md → "Contact form" explains how to fill these in.
   */
  contactForm: {
    action: '', // https://docs.google.com/forms/d/e/<FORM_ID>/formResponse
    fields: {
      name: '', // entry.NNNNNN
      email: '', // entry.NNNNNN, or "emailAddress" if the form collects emails itself
      subject: '', // entry.NNNNNN
      message: '', // entry.NNNNNN
    },
  },
} as const;

const calendarId = SITE.calendar.id;

/** Links for following the calendar in people's own calendar apps. */
export const CALENDAR_LINKS = {
  /** Opens Google Calendar with an "Add this calendar" prompt. */
  google: `https://calendar.google.com/calendar/u/0?cid=${btoa(calendarId).replace(/=+$/, '')}`,
  /** Apple Calendar, Outlook and others subscribe with this. */
  ical: `webcal://calendar.google.com/calendar/ical/${encodeURIComponent(calendarId)}/public/basic.ics`,
  /** Google's own web view of the calendar, as a fallback. */
  web: `https://calendar.google.com/calendar/embed?src=${encodeURIComponent(calendarId)}&ctz=${encodeURIComponent(SITE.calendar.timeZone)}&mode=AGENDA`,
};
