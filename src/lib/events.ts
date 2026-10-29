/**
 * Calendar events for the pages. The list itself comes from Google Calendar via
 * scripts/fetch-feeds.mjs, which saves it to src/data/feeds/events.json before
 * every build. Nothing here needs editing to add an event: add it in Google
 * Calendar and it appears on the site at the next daily update.
 */
import { SITE } from '../config/site';

export interface CalendarEvent {
  id: string;
  uid: string;
  title: string;
  /** ISO timestamp, or YYYY-MM-DD for all-day events. */
  start: string;
  /** ISO timestamp, or YYYY-MM-DD (the day after the last day) for all-day events. */
  end: string;
  allDay: boolean;
  location: string;
  description: string;
  url: string;
}

interface Feed {
  fetched: string | null;
  items: CalendarEvent[];
}

const TZ = SITE.calendar.timeZone;

// The file only exists after `npm run feeds`; import.meta.glob lets `astro check` pass without it.
const files = import.meta.glob<Feed>('../data/feeds/events.json', { eager: true, import: 'default' });
const feed: Feed = Object.values(files)[0] ?? { fetched: null, items: [] };

/** Upcoming events, soonest first. Events that end before the build are already left out. */
export function getEvents(): CalendarEvent[] {
  const now = Date.now();
  return feed.items.filter((e) => endsAt(e) > now);
}

export const eventsFetched = feed.fetched;

/** When the event is over, as a timestamp (ms). The pages use this to hide past events. */
export function endsAt(event: CalendarEvent): number {
  return event.allDay ? zonedMidnight(event.end) : Date.parse(event.end);
}

/** A date-only string (YYYY-MM-DD) as midnight in the calendar's time zone. */
function zonedMidnight(date: string): number {
  const guess = Date.parse(`${date}T00:00:00Z`);
  return guess - offsetAt(guess);
}

/** How far the calendar's time zone is ahead of UTC at a moment (ms; negative in Arkansas). */
function offsetAt(at: number): number {
  const parts = Object.fromEntries(
    new Intl.DateTimeFormat('en-US', {
      timeZone: TZ,
      hourCycle: 'h23',
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric',
    })
      .formatToParts(at)
      .map((p) => [p.type, Number(p.value)]),
  );
  return Date.UTC(parts.year, parts.month - 1, parts.day, parts.hour, parts.minute, parts.second) - at;
}

const fmt = (options: Intl.DateTimeFormatOptions) => new Intl.DateTimeFormat('en-US', { timeZone: TZ, ...options });
const utcFmt = (options: Intl.DateTimeFormatOptions) => new Intl.DateTimeFormat('en-US', { timeZone: 'UTC', ...options });

/** All-day dates are calendar dates, so format them in UTC to avoid shifting a day. */
function dateParts(value: string, allDay: boolean) {
  const date = allDay ? new Date(`${value}T00:00:00Z`) : new Date(value);
  const f = allDay ? utcFmt : fmt;
  return {
    date,
    weekday: f({ weekday: 'short' }).format(date),
    weekdayLong: f({ weekday: 'long' }).format(date),
    month: f({ month: 'short' }).format(date),
    monthLong: f({ month: 'long', year: 'numeric' }).format(date),
    day: f({ day: 'numeric' }).format(date),
    full: f({ weekday: 'long', month: 'long', day: 'numeric' }).format(date),
    short: f({ month: 'short', day: 'numeric' }).format(date),
  };
}

export function startParts(event: CalendarEvent) {
  return dateParts(event.start, event.allDay);
}

/** "Month Year" heading this event is listed under. */
export function monthKey(event: CalendarEvent): string {
  return startParts(event).monthLong;
}

/** e.g. "6:30 – 8:00 PM", "Saturday, Nov 21 – Sunday, Nov 22", or "All day". */
export function whenText(event: CalendarEvent): string {
  if (event.allDay) {
    const lastDay = new Date(Date.parse(`${event.end}T00:00:00Z`) - 86_400_000).toISOString().slice(0, 10);
    if (lastDay <= event.start) return 'All day';
    const a = dateParts(event.start, true);
    const b = dateParts(lastDay, true);
    return `${a.weekday}, ${a.short} – ${b.weekday}, ${b.short}`;
  }
  const start = new Date(event.start);
  const end = new Date(event.end);
  const time = fmt({ hour: 'numeric', minute: '2-digit' });
  const sameDay = fmt({ dateStyle: 'short' }).format(start) === fmt({ dateStyle: 'short' }).format(end);
  if (!sameDay) {
    const withDay = fmt({ weekday: 'short', month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' });
    return `${withDay.format(start)} – ${withDay.format(end)}`;
  }
  const [s, e] = [time.format(start), time.format(end)];
  const period = (t: string) => t.slice(-2);
  // "6:30 – 8:00 PM" rather than "6:30 PM – 8:00 PM" when both are PM.
  return s === e ? s : period(s) === period(e) ? `${s.slice(0, -3)} – ${e}` : `${s} – ${e}`;
}

/** First few sentences of the description, for compact cards. */
export function summary(event: CalendarEvent, max = 180): string {
  const text = event.description
    .replace(/https?:\/\/\S+/g, '')
    .replace(/\s+/g, ' ')
    .replace(/[\s:(–-]+$/, '')
    .trim();
  return text.length > max ? `${text.slice(0, max - 1).replace(/\s+\S*$/, '')}…` : text;
}

/** Google Calendar's "add this event" link. */
export function googleAddLink(event: CalendarEvent): string {
  const stamp = (v: string) =>
    event.allDay ? v.replaceAll('-', '') : new Date(v).toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: event.title,
    dates: `${stamp(event.start)}/${stamp(event.end)}`,
    ctz: TZ,
  });
  if (event.location) params.set('location', event.location);
  if (event.description) params.set('details', event.description.slice(0, 1500));
  return `https://calendar.google.com/calendar/render?${params}`;
}

/** Map link for the location, unless it's an online meeting link. */
export function mapLink(event: CalendarEvent): string | null {
  if (!event.location || /^https?:\/\//.test(event.location)) return null;
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(event.location)}`;
}

/** Address of the downloadable .ics file for one event (made by src/pages/events/[id].ics.ts). */
export function icsPath(event: CalendarEvent): string {
  return `/events/${event.id}.ics`;
}
