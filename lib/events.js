import { cache } from 'react';
import { getSupabaseClient } from './supabaseClient.js';
import { EVENTS } from './data.js';
import { safeUrl, isRegistrationFormUrl } from './safeUrl.js';

/**
 * Checks if an event date has completely passed.
 * Returns true if the end of the event day (23:59:59.999 local/IST) has elapsed.
 */
export function isEventDuePast(eventDate, endDate) {
  if (!eventDate) return false;
  const targetDate = endDate || eventDate;
  const parts = String(targetDate).split('-').map(Number);
  if (parts.length < 3 || parts.some(isNaN)) return false;
  const [year, month, day] = parts;
  const eventEnd = new Date(year, month - 1, day, 23, 59, 59, 999);
  return Date.now() > eventEnd.getTime();
}

/**
 * Resolves event status with automatic time awareness.
 * If status is 'upcoming' but eventDate has already passed, seamlessly transitions to 'conducted'.
 */
export function resolveEventStatus(declaredStatus, eventDate, endDate) {
  if (declaredStatus === 'conducted') return 'conducted';
  if (declaredStatus === 'upcoming') {
    return isEventDuePast(eventDate, endDate) ? 'conducted' : 'upcoming';
  }
  return 'conducted';
}

/**
 * Maps raw database event records to the normalized application schema.
 * Prevents Instagram URLs from being mistaken for registration form links.
 * Sanitizes all URLs against XSS/injections.
 */
export function mapEvent(e) {
  // Only Google Forms or explicit registration URLs count as registration links
  let formUrl = null;
  if (isRegistrationFormUrl(e.registration_form_url)) {
    formUrl = safeUrl(e.registration_form_url);
  } else if (isRegistrationFormUrl(e.external_link)) {
    formUrl = safeUrl(e.external_link);
  }

  const status = resolveEventStatus(e.status, e.event_date, e.end_date);

  return {
    id: String(e.id),
    title: String(e.title || ''),
    description: e.description || '',
    eventDate: e.event_date,
    endDate: e.end_date || null,
    eventType: e.event_type || 'Event',
    status,
    venue: e.venue || null,
    coverImageUrl: safeUrl(e.cover_image_url) || null,
    externalLink: safeUrl(e.external_link) || null,
    registrationFormUrl: formUrl,
    images: (e.event_images || [])
      .sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0))
      .map((img) => safeUrl(img.image_url))
      .filter(Boolean),
  };
}

function mapMockEvent(e) {
  const status = resolveEventStatus(e.status, e.eventDate, e.endDate);

  return {
    ...e,
    status,
    coverImageUrl: safeUrl(e.coverImageUrl) || null,
    externalLink: safeUrl(e.externalLink) || null,
    registrationFormUrl: isRegistrationFormUrl(e.registrationFormUrl)
      ? safeUrl(e.registrationFormUrl)
      : null,
    images: (e.images || []).map(safeUrl).filter(Boolean),
  };
}

function staticEvents(status) {
  const mapped = EVENTS.map(mapMockEvent);
  return status ? mapped.filter((e) => e.status === status) : mapped;
}

/**
 * Event merge rules:
 * 1. Bundled events from `lib/data.js` provide the primary static truth (guaranteeing 0 downtime).
 * 2. Supabase events are fetched with a 4s timeout.
 * 3. Any new event from Supabase not already present in bundled data (matched case-insensitively by title)
 *    is merged in.
 * 4. Upcoming events are sorted soonest-first; conducted archive events are sorted newest-first.
 */
export const getEvents = cache(async function getEvents(status) {
  const bundled = staticEvents(status);
  const fromDb = await getDbEvents(status);
  const titles = new Set(bundled.map((e) => e.title.toLowerCase().trim()));
  const extraDbEvents = fromDb.filter((e) => !titles.has(e.title.toLowerCase().trim()));

  const all = [...bundled, ...extraDbEvents];

  if (status === 'upcoming') {
    return all.sort((a, b) => new Date(a.eventDate).getTime() - new Date(b.eventDate).getTime());
  }

  if (status === 'conducted') {
    return all.sort((a, b) => new Date(b.eventDate).getTime() - new Date(a.eventDate).getTime());
  }

  // Combined: upcoming events chronologically first (soonest first), followed by conducted archive (newest first)
  const upcoming = all
    .filter((e) => e.status === 'upcoming')
    .sort((a, b) => new Date(a.eventDate).getTime() - new Date(b.eventDate).getTime());
  const conducted = all
    .filter((e) => e.status !== 'upcoming')
    .sort((a, b) => new Date(b.eventDate).getTime() - new Date(a.eventDate).getTime());

  return [...upcoming, ...conducted];
});

/** One event plus its neighbours in the newest-first list (for prev/next links). */
export const getEvent = cache(async function getEvent(id) {
  const events = await getEvents();
  const index = events.findIndex((e) => String(e.id) === String(id));
  if (index === -1) return null;
  return { event: events[index], newer: events[index - 1] ?? null, older: events[index + 1] ?? null };
});

async function getDbEvents(status) {
  const supabase = getSupabaseClient();
  if (!supabase) return [];

  try {
    let query = supabase
      .from('events')
      .select(
        'id, title, description, event_date, event_type, status, venue, cover_image_url, external_link, registration_form_url, event_images(image_url, sort_order)'
      )
      .order('event_date', { ascending: false });

    if (status) query = query.eq('status', status);

    const { data, error } = await query;

    if (error) {
      console.error('[Supabase getDbEvents query error, falling back to static]:', error.message || error);
      return [];
    }

    if (!data || !Array.isArray(data)) return [];
    return data.map(mapEvent);
  } catch (err) {
    console.error('[Supabase getDbEvents unexpected exception]:', err.message || err);
    return [];
  }
}
