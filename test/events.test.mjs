import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { mapEvent } from '../lib/events.js';
import { eventHref } from '../lib/format.js';

describe('mapEvent', () => {
  it('maps raw DB row to normalized application event object', () => {
    const raw = {
      id: 42,
      title: 'Pi Day Challenge 2026',
      description: 'Annual mathematics problem-solving competition.',
      event_date: '2026-03-14',
      end_date: '2026-03-14',
      event_type: 'Competition',
      status: 'conducted',
      venue: 'Auditorium, RIT Chennai',
      cover_image_url: 'https://infinitus-seven.vercel.app/events/pi-day.webp',
      external_link: 'https://instagram.com/infinitus_club.rit',
      registration_form_url: null,
      event_images: [
        { image_url: 'https://example.com/img2.jpg', sort_order: 2 },
        { image_url: 'https://example.com/img1.jpg', sort_order: 1 },
      ],
    };

    const mapped = mapEvent(raw);
    assert.equal(mapped.id, '42');
    assert.equal(mapped.title, 'Pi Day Challenge 2026');
    assert.equal(mapped.status, 'conducted');
    assert.equal(mapped.coverImageUrl, 'https://infinitus-seven.vercel.app/events/pi-day.webp');
    assert.equal(mapped.externalLink, 'https://instagram.com/infinitus_club.rit');
    // Critical Bug #1 check: external Instagram link must NEVER be treated as registrationFormUrl
    assert.equal(mapped.registrationFormUrl, null);
    // Sorts event images by sort_order
    assert.deepEqual(mapped.images, [
      'https://example.com/img1.jpg',
      'https://example.com/img2.jpg',
    ]);
  });

  it('preserves valid Google Forms registration URL', () => {
    const raw = {
      id: 101,
      title: 'SHINKA 2026',
      event_date: '2026-02-18',
      status: 'upcoming',
      registration_form_url: 'https://forms.gle/xyzShinka2026',
      external_link: 'https://instagram.com/p/DFxyz',
    };

    const mapped = mapEvent(raw);
    assert.equal(mapped.registrationFormUrl, 'https://forms.gle/xyzShinka2026');
    assert.equal(mapped.externalLink, 'https://instagram.com/p/DFxyz');
  });

  it('sanitizes dangerous URLs in DB records', () => {
    const raw = {
      id: 102,
      title: 'Malicious Event',
      cover_image_url: 'javascript:alert(1)',
      external_link: 'data:text/html,evil',
      registration_form_url: 'javascript:steal()',
      event_images: [{ image_url: 'javascript:bad()' }],
    };

    const mapped = mapEvent(raw);
    assert.equal(mapped.coverImageUrl, null);
    assert.equal(mapped.externalLink, null);
    assert.equal(mapped.registrationFormUrl, null);
    assert.deepEqual(mapped.images, []);
  });
});

describe('eventHref', () => {
  it('generates standard relative event URL', () => {
    assert.equal(eventHref({ id: 'shinka-2026' }), '/events/shinka-2026');
    assert.equal(eventHref({ id: 12 }), '/events/12');
  });

  it('escapes special characters in event ID', () => {
    assert.equal(eventHref({ id: 'math & logic' }), '/events/math%20%26%20logic');
  });
});

describe('bundled static events & gallery data integrity', () => {
  it('ensures all 42 conducted events exist and have valid assets', async () => {
    const fs = await import('node:fs');
    const path = await import('node:path');
    const { EVENTS } = await import('../lib/data.js');

    assert.equal(EVENTS.length, 42, 'Exactly 42 events must be bundled');
    for (const ev of EVENTS) {
      assert.ok(ev.id, 'Event must have an ID');
      assert.ok(ev.title, `Event ${ev.id} must have a title`);
      assert.equal(ev.status, 'conducted', `Event ${ev.id} must be conducted`);
      assert.match(ev.eventDate, /^\d{4}-\d{2}-\d{2}$/, `Event ${ev.id} must have valid YYYY-MM-DD date`);

      if (ev.coverImageUrl) {
        assert.match(ev.coverImageUrl, /^\/(events|gallery)\/[a-z0-9-]+\.webp$/);
        const diskPath = path.resolve('public', ev.coverImageUrl.slice(1));
        assert.ok(fs.existsSync(diskPath), `Cover image missing for ${ev.id}: ${diskPath}`);
      }
    }
  });

  it('ensures all 26 gallery items exist on disk with captions and dimensions', async () => {
    const fs = await import('node:fs');
    const path = await import('node:path');
    const { GALLERY } = await import('../lib/data.js');

    assert.equal(GALLERY.length, 26, 'Exactly 26 gallery photos must be defined');
    for (const item of GALLERY) {
      assert.ok(item.src, 'Gallery item must have src');
      assert.ok(item.caption, 'Gallery item must have caption');
      assert.ok(item.width > 0 && item.height > 0, 'Gallery item must have positive dimensions');
      const diskPath = path.resolve('public', item.src.slice(1));
      assert.ok(fs.existsSync(diskPath), `Gallery image missing: ${diskPath}`);
    }
  });
});

