import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import {
  parseEventDateTime,
  formatIcsDate,
  generateGoogleCalendarUrl,
  generateOutlookCalendarUrl,
  generateYahooCalendarUrl,
  generateIcsContent,
} from '../lib/calendar.js';

describe('1-Click Calendar Sync & iCal Generators (Feature 3C)', () => {
  const sampleEvent = {
    id: 'scilab-workshop',
    title: 'Scilab Workshop',
    tagline: 'Computational Mathematics & Scientific Computing',
    description: 'Hands-on training session on numerical simulation and matrix algorithms',
    eventDate: '2026-12-15',
    time: '10:00 A.M. - 4:00 P.M.',
    venue: 'Green Building, Fourth Floor',
  };

  test('parses event date and time strings accurately into Start and End Dates', () => {
    const { start, end } = parseEventDateTime(sampleEvent);
    assert.ok(start instanceof Date, 'Start must be a Date object');
    assert.ok(end instanceof Date, 'End must be a Date object');
    assert.ok(end.getTime() > start.getTime(), 'End must be chronologically after start');
    assert.equal(start.getFullYear(), 2026);
    assert.equal(start.getMonth(), 11); // December is month index 11
    assert.equal(start.getDate(), 15);
  });

  test('formats iCalendar UTC timestamp compliant with RFC 5545', () => {
    const testDate = new Date(Date.UTC(2026, 11, 15, 4, 30, 0));
    const formatted = formatIcsDate(testDate);
    assert.equal(formatted, '20261215T043000Z', 'Must match standard iCal UTC format');
  });

  test('generates valid Google Calendar URL with required query parameters', () => {
    const url = generateGoogleCalendarUrl(sampleEvent);
    assert.ok(url.startsWith('https://calendar.google.com/calendar/render?action=TEMPLATE'));
    assert.ok(url.includes('text=Scilab%20Workshop'));
    assert.ok(url.includes('dates='));
    assert.ok(url.includes('location='));
    assert.ok(url.includes('Green%20Building'));
  });

  test('generates valid Outlook Calendar URL', () => {
    const url = generateOutlookCalendarUrl(sampleEvent);
    assert.ok(url.startsWith('https://outlook.live.com/calendar/0/deeplink/compose'));
    assert.ok(url.includes('subject=Scilab%20Workshop'));
    assert.ok(url.includes('startdt='));
    assert.ok(url.includes('enddt='));
  });

  test('generates valid Yahoo Calendar URL', () => {
    const url = generateYahooCalendarUrl(sampleEvent);
    assert.ok(url.startsWith('https://calendar.yahoo.com/?v=60&view=d&type=20'));
    assert.ok(url.includes('title=Scilab%20Workshop'));
  });

  test('generates valid RFC 5545 .ics iCalendar document payload', () => {
    const ics = generateIcsContent(sampleEvent);
    assert.ok(ics.includes('BEGIN:VCALENDAR'), 'Must start with BEGIN:VCALENDAR');
    assert.ok(ics.includes('VERSION:2.0'), 'Must specify VERSION:2.0');
    assert.ok(ics.includes('BEGIN:VEVENT'), 'Must contain BEGIN:VEVENT');
    assert.ok(ics.includes('SUMMARY:Scilab Workshop'), 'Must include event summary');
    assert.ok(ics.includes('LOCATION:Green Building'), 'Must include location');
    assert.ok(ics.includes('DTSTART:'), 'Must include DTSTART');
    assert.ok(ics.includes('DTEND:'), 'Must include DTEND');
    assert.ok(ics.includes('END:VEVENT'), 'Must end event block');
    assert.ok(ics.includes('END:VCALENDAR'), 'Must end calendar block');
  });
});
