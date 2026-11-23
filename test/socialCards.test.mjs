import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { EVENTS } from '../lib/data.js';
import { getEventOgStaticParams, OG_SIZE, OG_CONTENT_TYPE } from '../lib/ogHelper.js';

describe('Dynamic Edge Social Cards (Feature 3B)', () => {
  test('exports standard 1200x630 OG dimensions and image/png content type', () => {
    assert.deepEqual(OG_SIZE, { width: 1200, height: 630 }, 'OG card size must be 1200x630');
    assert.equal(OG_CONTENT_TYPE, 'image/png', 'OG card content type must be image/png');
  });

  test('getEventOgStaticParams provides parameters for all 42 bundled events', () => {
    const params = getEventOgStaticParams();
    assert.ok(Array.isArray(params), 'Params must be an array');
    assert.equal(params.length, 42, 'Must provide static params for all 42 events');

    for (const p of params) {
      assert.ok(p.id, `Missing event ID in static params: ${JSON.stringify(p)}`);
      assert.ok(
        EVENTS.some((e) => e.id === p.id),
        `Event ID ${p.id} not found in EVENTS dataset`
      );
    }
  });
});
