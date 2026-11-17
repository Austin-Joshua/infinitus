import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { safeUrl, isRegistrationFormUrl } from '../lib/safeUrl.js';

describe('safeUrl', () => {
  it('allows valid https URLs', () => {
    assert.equal(safeUrl('https://example.com/path?foo=bar'), 'https://example.com/path?foo=bar');
    assert.equal(safeUrl('https://forms.gle/xyz123'), 'https://forms.gle/xyz123');
  });

  it('allows valid http URLs', () => {
    assert.equal(safeUrl('http://example.com/test'), 'http://example.com/test');
  });

  it('allows site-relative paths', () => {
    assert.equal(safeUrl('/events/shinka-2026'), '/events/shinka-2026');
    assert.equal(safeUrl('/brand/logo.webp'), '/brand/logo.webp');
  });

  it('rejects protocol-relative URLs (//malicious.com)', () => {
    assert.equal(safeUrl('//malicious.com'), null);
  });

  it('rejects dangerous protocols (javascript:, data:, vbscript:, file:)', () => {
    assert.equal(safeUrl('javascript:alert(1)'), null);
    assert.equal(safeUrl('data:text/html,<script>alert(1)</script>'), null);
    assert.equal(safeUrl('file:///etc/passwd'), null);
  });

  it('rejects non-URL strings or empty inputs', () => {
    assert.equal(safeUrl('not-a-url'), null);
    assert.equal(safeUrl(''), null);
    assert.equal(safeUrl(null), null);
    assert.equal(safeUrl(undefined), null);
  });
});

describe('isRegistrationFormUrl', () => {
  it('identifies official Google Forms URLs', () => {
    assert.equal(isRegistrationFormUrl('https://forms.gle/sampleFormId'), true);
    assert.equal(isRegistrationFormUrl('https://docs.google.com/forms/d/e/1FAIpQLSc/viewform'), true);
  });

  it('rejects Instagram or social media links as registration forms (prevents Bug #1 regression)', () => {
    assert.equal(isRegistrationFormUrl('https://instagram.com/infinitus_club.rit'), false);
    assert.equal(isRegistrationFormUrl('https://www.instagram.com/p/DFxyz123/'), false);
    assert.equal(isRegistrationFormUrl('https://twitter.com/rit_infinitus'), false);
    assert.equal(isRegistrationFormUrl('https://github.com/Austin-Joshua'), false);
  });

  it('rejects general non-form URLs', () => {
    assert.equal(isRegistrationFormUrl('https://example.com'), false);
    assert.equal(isRegistrationFormUrl('/events'), false);
  });

  it('returns false for invalid or null URLs', () => {
    assert.equal(isRegistrationFormUrl(null), false);
    assert.equal(isRegistrationFormUrl(''), false);
    assert.equal(isRegistrationFormUrl('javascript:alert(1)'), false);
  });
});
