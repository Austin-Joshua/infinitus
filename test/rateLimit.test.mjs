import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { checkRateLimit } from '../lib/rateLimit.js';

function mockRequest(ip = '192.168.1.100') {
  return {
    headers: new Headers({
      'x-forwarded-for': ip,
    }),
  };
}

describe('checkRateLimit', () => {
  it('allows requests within the limit', () => {
    const req = mockRequest('10.0.0.1');
    const result = checkRateLimit(req, { limit: 5, windowMs: 10000 });
    assert.equal(result.allowed, true);
    assert.equal(result.remaining, 4);
    assert.ok(result.reset > 0);
  });

  it('blocks requests when threshold is exceeded', () => {
    const req = mockRequest('10.0.0.2');
    for (let i = 0; i < 3; i++) {
      checkRateLimit(req, { limit: 3, windowMs: 10000 });
    }
    const blocked = checkRateLimit(req, { limit: 3, windowMs: 10000 });
    assert.equal(blocked.allowed, false);
    assert.equal(blocked.remaining, 0);
    assert.ok(blocked.reset > 0);
  });

  it('isolates rate limits by IP address', () => {
    const reqA = mockRequest('10.0.0.3');
    const reqB = mockRequest('10.0.0.4');

    for (let i = 0; i < 2; i++) {
      checkRateLimit(reqA, { limit: 2, windowMs: 10000 });
    }
    const blockedA = checkRateLimit(reqA, { limit: 2, windowMs: 10000 });
    assert.equal(blockedA.allowed, false);

    // reqB should still be allowed
    const allowedB = checkRateLimit(reqB, { limit: 2, windowMs: 10000 });
    assert.equal(allowedB.allowed, true);
  });
});
