// Tests for the calendar and newsletter parsers: `npm test`.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { parseIcs, toPlainText } from './lib/ics.mjs';
import { parseArchive, parseRss } from './lib/rss.mjs';

const ics = (events) =>
  [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Google Inc//Google Calendar 70.9054//EN',
    'BEGIN:VTIMEZONE',
    'TZID:America/Chicago',
    'BEGIN:DAYLIGHT',
    'TZOFFSETFROM:-0600',
    'TZOFFSETTO:-0500',
    'TZNAME:CDT',
    'DTSTART:19700308T020000',
    'RRULE:FREQ=YEARLY;BYMONTH=3;BYDAY=2SU',
    'END:DAYLIGHT',
    'BEGIN:STANDARD',
    'TZOFFSETFROM:-0500',
    'TZOFFSETTO:-0600',
    'TZNAME:CST',
    'DTSTART:19701101T020000',
    'RRULE:FREQ=YEARLY;BYMONTH=11;BYDAY=1SU',
    'END:STANDARD',
    'END:VTIMEZONE',
    ...events.flatMap((e) => ['BEGIN:VEVENT', ...e, 'END:VEVENT']),
    'END:VCALENDAR',
  ].join('\r\n');

const window = { from: new Date('2026-11-01T00:00:00Z'), until: new Date('2027-01-31T00:00:00Z') };

test('single timed event in Central time', () => {
  const [event, ...rest] = parseIcs(
    ics([
      [
        'UID:one@google.com',
        'DTSTART;TZID=America/Chicago:20261112T183000',
        'DTEND;TZID=America/Chicago:20261112T200000',
        'SUMMARY:Education Night',
        'LOCATION:Fayetteville Public Library\\, 401 W Mountain St',
        'DESCRIPTION:Free and open to all.<br>RSVP: <a href="https://www.google.com/url?q=https://example.org/rsvp&amp;sa=D">here</a>',
      ],
    ]),
    window,
  );
  assert.equal(rest.length, 0);
  assert.equal(event.title, 'Education Night');
  assert.equal(event.start, '2026-11-13T00:30:00.000Z'); // 6:30pm CST
  assert.equal(event.end, '2026-11-13T02:00:00.000Z');
  assert.equal(event.allDay, false);
  assert.equal(event.location, 'Fayetteville Public Library, 401 W Mountain St');
  assert.equal(event.description, 'Free and open to all.\nRSVP: here (https://example.org/rsvp)');
  assert.equal(event.url, 'https://example.org/rsvp');
});

test('past and too-far-ahead events are dropped', () => {
  const events = parseIcs(
    ics([
      ['UID:old@x', 'DTSTART:20261001T000000Z', 'DTEND:20261001T010000Z', 'SUMMARY:Old'],
      ['UID:far@x', 'DTSTART:20270601T000000Z', 'DTEND:20270601T010000Z', 'SUMMARY:Far'],
      ['UID:now@x', 'DTSTART:20261031T230000Z', 'DTEND:20261101T010000Z', 'SUMMARY:Still on'],
    ]),
    window,
  );
  assert.deepEqual(
    events.map((e) => e.title),
    ['Still on'],
  );
});

test('repeating event with a skipped date, a moved date, and a cancelled date', () => {
  const events = parseIcs(
    ics([
      [
        'UID:monthly@google.com',
        'DTSTART;TZID=America/Chicago:20260910T180000',
        'DTEND;TZID=America/Chicago:20260910T193000',
        'RRULE:FREQ=MONTHLY;BYDAY=2TH',
        'EXDATE;TZID=America/Chicago:20261210T180000',
        'SUMMARY:Integration Circle',
      ],
      [
        'UID:monthly@google.com',
        'RECURRENCE-ID;TZID=America/Chicago:20261112T180000',
        'DTSTART;TZID=America/Chicago:20261113T190000',
        'DTEND;TZID=America/Chicago:20261113T203000',
        'SUMMARY:Integration Circle (moved to Friday)',
      ],
      [
        'UID:monthly@google.com',
        'RECURRENCE-ID;TZID=America/Chicago:20270114T180000',
        'DTSTART;TZID=America/Chicago:20270114T180000',
        'DTEND;TZID=America/Chicago:20270114T193000',
        'STATUS:CANCELLED',
        'SUMMARY:Integration Circle',
      ],
    ]),
    window,
  );
  assert.deepEqual(
    events.map((e) => [e.title, e.start]),
    [['Integration Circle (moved to Friday)', '2026-11-14T01:00:00.000Z']],
  );
  assert.equal(new Set(events.map((e) => e.id)).size, events.length);
});

test('endless weekly event stops at the window', () => {
  const events = parseIcs(
    ics([
      [
        'UID:weekly@x',
        'DTSTART;TZID=America/Chicago:20250106T120000',
        'DTEND;TZID=America/Chicago:20250106T130000',
        'RRULE:FREQ=WEEKLY',
        'SUMMARY:Weekly',
      ],
    ]),
    window,
  );
  assert.equal(events.length, 13); // Mondays from Nov 2 2026 to Jan 25 2027
  assert.equal(events[0].start, '2026-11-02T18:00:00.000Z');
});

test('all-day events keep their dates', () => {
  const [event] = parseIcs(
    ics([['UID:day@x', 'DTSTART;VALUE=DATE:20261121', 'DTEND;VALUE=DATE:20261123', 'SUMMARY:Symposium']]),
    window,
  );
  assert.equal(event.allDay, true);
  assert.equal(event.start, '2026-11-21');
  assert.equal(event.end, '2026-11-23');
});

test('description HTML becomes readable text', () => {
  assert.equal(
    toPlainText('<p>Line one &amp; more</p><ul><li>a</li><li>b</li></ul><a href="https://x.org">https://x.org</a>'),
    'Line one & more\n\n• a\n\n• b\n\nhttps://x.org',
  );
});

test('Substack RSS', () => {
  const posts = parseRss(`<?xml version="1.0"?><rss version="2.0" xmlns:content="http://purl.org/rss/1.0/modules/content/"><channel><title>PSoAR</title>
    <item><title><![CDATA[Older]]></title><link>https://psoar.substack.com/p/older</link><pubDate>Mon, 01 Sep 2026 12:00:00 GMT</pubDate><description><![CDATA[Short]]></description></item>
    <item><title><![CDATA[Newer &amp; better]]></title><link>https://psoar.substack.com/p/newer</link><pubDate>Mon, 06 Oct 2026 12:00:00 GMT</pubDate>
      <description><![CDATA[<p>Hello &amp; welcome</p>]]></description><enclosure url="https://substackcdn.com/image/x.jpg" length="0" type="image/jpeg"/></item>
  </channel></rss>`);
  assert.deepEqual(
    posts.map((p) => [p.title, p.summary, p.image]),
    [
      ['Newer & better', 'Hello & welcome', 'https://substackcdn.com/image/x.jpg'],
      ['Older', 'Short', ''],
    ],
  );
});

test('Substack archive API (fallback)', () => {
  const posts = parseArchive(
    JSON.stringify([
      { title: 'Older', canonical_url: 'https://psoar.substack.com/p/older', post_date: '2026-09-01T12:00:00.000Z', subtitle: 'Sub' },
      {
        title: 'Newer',
        canonical_url: 'https://psoar.substack.com/p/newer',
        post_date: '2026-10-06T12:00:00.000Z',
        description: 'Hello &amp; welcome',
        cover_image: 'https://substackcdn.com/image/y.jpg',
      },
    ]),
  );
  assert.deepEqual(
    posts.map((p) => [p.title, p.summary, p.image]),
    [
      ['Newer', 'Hello & welcome', 'https://substackcdn.com/image/y.jpg'],
      ['Older', 'Sub', ''],
    ],
  );
});

test('long-running repeating event that started years ago still shows its upcoming dates', () => {
  const events = parseIcs(
    ics([
      [
        'UID:daily-since-2019@x',
        'DTSTART;TZID=America/Chicago:20190101T080000',
        'DTEND;TZID=America/Chicago:20190101T083000',
        'RRULE:FREQ=DAILY',
        'SUMMARY:Morning sit',
      ],
    ]),
    window,
  );
  assert.equal(events.length, 91); // every day from Nov 1 2026 to Jan 30 2027
  assert.equal(events[0].start, '2026-11-01T14:00:00.000Z'); // 8am CST (DST ended that morning)
});

test('events up to a year out are included', () => {
  const events = parseIcs(
    ics([['UID:may@x', 'DTSTART;VALUE=DATE:20270515', 'DTEND;VALUE=DATE:20270516', 'SUMMARY:Spring gathering']]),
    { from: new Date('2026-11-01T00:00:00Z'), until: new Date('2027-11-01T00:00:00Z') },
  );
  assert.deepEqual(
    events.map((e) => e.title),
    ['Spring gathering'],
  );
});
