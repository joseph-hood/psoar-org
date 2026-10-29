/**
 * One downloadable calendar file per upcoming event: /events/<id>.ics
 * ("Apple / Outlook" button on each event). Built from the same data as the pages.
 */
import type { APIRoute, GetStaticPaths } from 'astro';
import { type CalendarEvent, getEvents } from '../../lib/events';
import { SITE } from '../../config/site';

export const getStaticPaths = (() =>
  getEvents().map((event) => ({ params: { id: event.id }, props: { event } }))) satisfies GetStaticPaths;

export const GET: APIRoute = ({ props }) => {
  const event = (props as { event: CalendarEvent }).event;
  return new Response(toIcs(event), {
    headers: { 'Content-Type': 'text/calendar; charset=utf-8' },
  });
};

function toIcs(event: CalendarEvent): string {
  const stamp = (v: string) => new Date(v).toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
  const date = (v: string) => v.replaceAll('-', '');
  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    `PRODID:-//${SITE.shortName}//psoar.org//EN`,
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `UID:${event.id}@psoar.org`,
    `DTSTAMP:${stamp(new Date().toISOString())}`,
    event.allDay ? `DTSTART;VALUE=DATE:${date(event.start)}` : `DTSTART:${stamp(event.start)}`,
    event.allDay ? `DTEND;VALUE=DATE:${date(event.end)}` : `DTEND:${stamp(event.end)}`,
    `SUMMARY:${escape(event.title)}`,
    event.location && `LOCATION:${escape(event.location)}`,
    event.description && `DESCRIPTION:${escape(event.description)}`,
    event.url && `URL:${event.url}`,
    'END:VEVENT',
    'END:VCALENDAR',
  ].filter(Boolean) as string[];
  return lines.map(fold).join('\r\n') + '\r\n';
}

function escape(text: string): string {
  return text.replace(/\\/g, '\\\\').replace(/;/g, '\;').replace(/,/g, '\\,').replace(/\r?\n/g, '\\n');
}

/** iCalendar lines are at most 75 bytes; longer ones continue on the next line after a space. */
function fold(line: string): string {
  const bytes = new TextEncoder().encode(line);
  if (bytes.length <= 75) return line;
  const parts: string[] = [];
  let current = '';
  for (const char of line) {
    if (new TextEncoder().encode(current + char).length > (parts.length ? 74 : 75)) {
      parts.push(current);
      current = '';
    }
    current += char;
  }
  parts.push(current);
  return parts.join('\r\n ');
}
