import { SITE, CLUB_NAME } from './site.js';

/**
 * Parses event dates and time strings into JavaScript Date objects.
 * Infinitus events are hosted in Chennai, India (IST: UTC+05:30).
 */
export function parseEventDateTime(event) {
  if (!event) return { start: new Date(), end: new Date() };

  const rawDate = event.eventDate || event.date || new Date().toISOString().split('T')[0];
  const parts = String(rawDate).split('-').map(Number);
  const year = parts[0] || new Date().getFullYear();
  const month = (parts[1] || 1) - 1;
  const day = parts[2] || 1;

  let startHour = 9;
  let startMinute = 0;
  let endHour = 17;
  let endMinute = 0;

  // Try parsing time string, e.g. "9:00 A.M. - 11:00 A.M." or "10:00 AM - 4:00 PM"
  const rawTime = event.time || '';
  if (rawTime.includes('-')) {
    const [startPart, endPart] = rawTime.split('-').map((s) => s.trim().toUpperCase());

    const parsePart = (str) => {
      const match = str.match(/(\d{1,2})(?::(\d{2}))?\s*(A\.?M\.?|P\.?M\.?)?/i);
      if (!match) return null;
      let h = parseInt(match[1], 10);
      const m = match[2] ? parseInt(match[2], 10) : 0;
      const meridiem = (match[3] || '').replace(/\./g, '');
      if (meridiem === 'PM' && h < 12) h += 12;
      if (meridiem === 'AM' && h === 12) h = 0;
      return { h, m };
    };

    const s = parsePart(startPart);
    const e = parsePart(endPart);
    if (s) {
      startHour = s.h;
      startMinute = s.m;
    }
    if (e) {
      endHour = e.h;
      endMinute = e.m;
    }
  }

  // Create dates in local / IST context
  const start = new Date(year, month, day, startHour, startMinute, 0);
  const end = new Date(year, month, day, endHour, endMinute, 0);

  // If end is before or equal to start, push end by 2 hours
  if (end <= start) {
    end.setTime(start.getTime() + 2 * 60 * 60 * 1000);
  }

  return { start, end };
}

/**
 * Formats a Date object to iCalendar / UTC ISO string: YYYYMMDDTHHmmssZ
 */
export function formatIcsDate(date) {
  const pad = (n) => String(n).padStart(2, '0');
  return (
    date.getUTCFullYear() +
    pad(date.getUTCMonth() + 1) +
    pad(date.getUTCDate()) +
    'T' +
    pad(date.getUTCHours()) +
    pad(date.getUTCMinutes()) +
    pad(date.getUTCSeconds()) +
    'Z'
  );
}

/**
 * Generates direct Google Calendar URL.
 */
export function generateGoogleCalendarUrl(event) {
  const { start, end } = parseEventDateTime(event);
  const startIso = formatIcsDate(start);
  const endIso = formatIcsDate(end);

  const title = encodeURIComponent(event.title || 'INFINITUS Event');
  const details = encodeURIComponent(
    `${event.description || event.tagline || ''}\n\nOrganized by ${CLUB_NAME}.\nOfficial Link: ${SITE.url}/events/${event.id}`
  );
  const location = encodeURIComponent(
    event.venue
      ? `${event.venue}, Rajalakshmi Institute of Technology, Chennai`
      : 'Rajalakshmi Institute of Technology, Chennai'
  );

  return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${startIso}/${endIso}&details=${details}&location=${location}`;
}

/**
 * Generates direct Outlook Web Calendar URL.
 */
export function generateOutlookCalendarUrl(event) {
  const { start, end } = parseEventDateTime(event);
  const startIso = start.toISOString();
  const endIso = end.toISOString();

  const title = encodeURIComponent(event.title || 'INFINITUS Event');
  const details = encodeURIComponent(
    `${event.description || event.tagline || ''}\n\nOrganized by ${CLUB_NAME}.\nLink: ${SITE.url}/events/${event.id}`
  );
  const location = encodeURIComponent(
    event.venue
      ? `${event.venue}, Rajalakshmi Institute of Technology, Chennai`
      : 'Rajalakshmi Institute of Technology, Chennai'
  );

  return `https://outlook.live.com/calendar/0/deeplink/compose?subject=${title}&startdt=${startIso}&enddt=${endIso}&body=${details}&location=${location}`;
}

/**
 * Generates direct Yahoo Calendar URL.
 */
export function generateYahooCalendarUrl(event) {
  const { start, end } = parseEventDateTime(event);
  const startIso = formatIcsDate(start);
  const endIso = formatIcsDate(end);

  const title = encodeURIComponent(event.title || 'INFINITUS Event');
  const details = encodeURIComponent(
    `${event.description || event.tagline || ''}\n\nOrganized by ${CLUB_NAME}.\nLink: ${SITE.url}/events/${event.id}`
  );
  const location = encodeURIComponent(
    event.venue
      ? `${event.venue}, Rajalakshmi Institute of Technology, Chennai`
      : 'Rajalakshmi Institute of Technology, Chennai'
  );

  return `https://calendar.yahoo.com/?v=60&view=d&type=20&title=${title}&st=${startIso}&et=${endIso}&desc=${details}&in_loc=${location}`;
}

/**
 * Generates RFC 5545 iCalendar (.ics) string format.
 */
export function generateIcsContent(event) {
  const { start, end } = parseEventDateTime(event);
  const now = new Date();
  const dtStamp = formatIcsDate(now);
  const dtStart = formatIcsDate(start);
  const dtEnd = formatIcsDate(end);

  const summary = (event.title || 'INFINITUS Event').replace(/\n/g, ' ');
  const description = (
    (event.description || event.tagline || '') +
    `\\n\\nOrganized by ${CLUB_NAME}.\\nEvent Link: ${SITE.url}/events/${event.id}`
  ).replace(/\n/g, '\\n');
  const location = (
    event.venue
      ? `${event.venue}, Rajalakshmi Institute of Technology, Chennai`
      : 'Rajalakshmi Institute of Technology, Chennai'
  ).replace(/\n/g, ' ');

  const uid = `${event.id || 'event'}-${dtStart}@infinitus-rit.vercel.app`;

  return [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//INFINITUS RIT//Mathematics Club Event Calendar//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `UID:${uid}`,
    `DTSTAMP:${dtStamp}`,
    `DTSTART:${dtStart}`,
    `DTEND:${dtEnd}`,
    `SUMMARY:${summary}`,
    `DESCRIPTION:${description}`,
    `LOCATION:${location}`,
    `URL:${SITE.url}/events/${event.id}`,
    'STATUS:CONFIRMED',
    'SEQUENCE:0',
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n');
}

/**
 * Client-side helper to trigger download of .ics file.
 */
export function downloadIcsFile(event) {
  if (typeof window === 'undefined' || typeof document === 'undefined') return;

  const icsData = generateIcsContent(event);
  const blob = new Blob([icsData], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', `${event.id || 'infinitus-event'}.ics`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
