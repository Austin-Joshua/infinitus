import { EVENTS } from './data.js';

export const OG_SIZE = { width: 1200, height: 630 };
export const OG_CONTENT_TYPE = 'image/png';

/**
 * Returns static parameters for pre-generating social cards for all bundled events.
 */
export function getEventOgStaticParams() {
  return EVENTS.map((e) => ({ id: e.id }));
}
