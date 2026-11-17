import { SITE } from '@/lib/site';
import { getEvents } from '@/lib/events';
import { eventHref } from '@/lib/format';

/**
 * Dynamic XML sitemap generator.
 * Uses real event dates for lastModified; omits lastModified on static content pages without reliable dates.
 */
export default async function sitemap() {
  const events = await getEvents();
  const newestDate = events.length > 0 && events[0].eventDate ? new Date(events[0].eventDate) : undefined;

  const staticPages = [
    {
      url: SITE.url,
      lastModified: newestDate,
      changeFrequency: 'weekly',
      priority: 1.0,
    },
    {
      url: `${SITE.url}/events`,
      lastModified: newestDate,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${SITE.url}/gallery`,
      lastModified: newestDate,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${SITE.url}/about`,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${SITE.url}/team`,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${SITE.url}/contact`,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
  ];

  const eventPages = events.map((event) => {
    const entry = {
      url: `${SITE.url}${eventHref(event)}`,
      changeFrequency: 'monthly',
      priority: 0.6,
    };
    if (event.eventDate) {
      entry.lastModified = new Date(event.eventDate);
    }
    return entry;
  });

  return [...staticPages, ...eventPages];
}
