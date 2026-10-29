/**
 * Turns a Google Calendar .ics feed into a plain list of upcoming events.
 *
 * Handles what Google actually sends: repeating events (RRULE), one-off changes
 * to a single repeat (RECURRENCE-ID), skipped dates (EXDATE), cancelled events,
 * all-day events, and events in named time zones (VTIMEZONE).
 */
import ICAL from 'ical.js';

/**
 * @typedef {object} CalendarEvent
 * @property {string} id        Stable id for this occurrence (safe for URLs and file names).
 * @property {string} uid       The event's iCalendar UID (shared by every repeat).
 * @property {string} title
 * @property {string} start     ISO timestamp (timed events) or YYYY-MM-DD (all-day events).
 * @property {string} end       ISO timestamp, or YYYY-MM-DD for all-day events (exclusive, as in iCalendar).
 * @property {boolean} allDay
 * @property {string} location
 * @property {string} description  Plain text; paragraphs separated by blank lines.
 * @property {string} url       First link found in the event (Eventbrite, Zoom, Facebook…), or ''.
 */

/**
 * @param {string} text      The .ics file contents.
 * @param {object} options
 * @param {Date} options.from   Events that have already ended before this are dropped.
 * @param {Date} options.until  Events starting after this are dropped (also stops repeats).
 * @param {number} [options.limit]
 * @returns {CalendarEvent[]} Sorted by start time.
 */
export function parseIcs(text, { from, until, limit = 200 }) {
  const calendar = new ICAL.Component(ICAL.parse(text));
  for (const tz of calendar.getAllSubcomponents('vtimezone')) ICAL.TimezoneService.register(tz);

  const masters = [];
  const exceptions = new Map(); // uid -> [Event]
  for (const component of calendar.getAllSubcomponents('vevent')) {
    const event = new ICAL.Event(component);
    if (event.isRecurrenceException()) {
      if (!exceptions.has(event.uid)) exceptions.set(event.uid, []);
      exceptions.get(event.uid).push(event);
    } else {
      masters.push(event);
    }
  }

  const fromTime = ICAL.Time.fromJSDate(from, true);
  const untilTime = ICAL.Time.fromJSDate(until, true);
  /** @type {CalendarEvent[]} */
  const out = [];

  for (const master of masters) {
    const changed = exceptions.get(master.uid) ?? [];
    exceptions.delete(master.uid);
    for (const exception of changed) master.relateException(exception);

    if (!master.isRecurring()) {
      add(out, master, master.startDate, master.endDate, fromTime, untilTime);
      continue;
    }

    const iterator = master.iterator();
    // A safety cap: a daily event with no end date would otherwise run until `until`.
    for (let n = 0, next; n < 2000 && (next = iterator.next()); n++) {
      if (next.compare(untilTime) > 0) break;
      const details = master.getOccurrenceDetails(next);
      add(out, details.item, details.startDate, details.endDate, fromTime, untilTime, details.recurrenceId);
    }
  }

  // Changes to a repeat whose original event isn't in the feed: show them as they are.
  for (const orphan of [...exceptions.values()].flat()) {
    add(out, orphan, orphan.startDate, orphan.endDate, fromTime, untilTime, orphan.recurrenceId);
  }

  out.sort((a, b) => sortKey(a).localeCompare(sortKey(b)) || a.title.localeCompare(b.title));
  return out.slice(0, limit);
}

function add(out, event, start, end, from, until, recurrenceId) {
  if ((event.component.getFirstPropertyValue('status') || '').toUpperCase() === 'CANCELLED') return;
  if (!end) end = start.clone();
  if (end.compare(from) <= 0 || start.compare(until) > 0) return;

  const allDay = start.isDate;
  const description = toPlainText(event.description || '');
  const occurrence = (recurrenceId ?? start).toUnixTime();
  out.push({
    id: `${slug(event.uid)}-${occurrence}`,
    uid: event.uid,
    title: oneLine(event.summary) || 'Untitled event',
    start: allDay ? start.toString() : start.toJSDate().toISOString(),
    end: allDay ? end.toString() : end.toJSDate().toISOString(),
    allDay,
    location: oneLine(event.location),
    description,
    url: firstUrl(`${event.component.getFirstPropertyValue('url') || ''} ${description} ${event.location || ''}`),
  });
}

/** All-day events sort as if they start at midnight UTC on their date. */
function sortKey(event) {
  return event.allDay ? `${event.start}T00:00:00.000Z` : event.start;
}

function oneLine(text) {
  return (text || '').replace(/\s+/g, ' ').trim();
}

function slug(text) {
  return (
    text
      .toLowerCase()
      .replace(/@.*$/, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '')
      .slice(0, 40) || 'event'
  );
}

const ENTITIES = { amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ' };

/**
 * Google Calendar descriptions are often HTML from its editor. Keep the words and
 * the line breaks; keep link addresses (as "text (address)" when they differ).
 */
export function toPlainText(html) {
  return html
    .replace(/<a\b[^>]*href="([^"]*)"[^>]*>(.*?)<\/a>/gis, (_, href, label) => {
      const text = label.replace(/<[^>]+>/g, '').trim();
      const address = href.replace(/^https?:\/\/(www\.)?google\.com\/url\?q=([^&]+).*/, (__, ___, q) =>
        decodeURIComponent(q),
      );
      return !text || text === address || address.includes(text) ? address : `${text} (${address})`;
    })
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/(p|div|li|h[1-6])>/gi, '\n\n')
    .replace(/<li[^>]*>/gi, '• ')
    .replace(/<[^>]+>/g, '')
    .replace(/&(#x?[0-9a-f]+|[a-z]+);/gi, (match, code) => {
      if (code[0] === '#') {
        const n = code[1].toLowerCase() === 'x' ? parseInt(code.slice(2), 16) : parseInt(code.slice(1), 10);
        return Number.isFinite(n) ? String.fromCodePoint(n) : match;
      }
      return ENTITIES[code.toLowerCase()] ?? match;
    })
    .replace(/\r\n?/g, '\n')
    .replace(/[ \t]+\n/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

function firstUrl(text) {
  const match = text.match(/https?:\/\/[^\s<>()"]+[^\s<>()".,;:!?]/);
  return match ? match[0] : '';
}
