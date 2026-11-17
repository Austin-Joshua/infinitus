import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { createApiHandler } from '../lib/apiHandler.js';

function mockRequest(ip = '10.10.10.10') {
  return {
    headers: new Headers({
      'x-forwarded-for': ip,
    }),
  };
}

describe('createApiHandler', () => {
  it('executes handler and returns 200 JSON with security and rate limit headers', async () => {
    const handler = createApiHandler({
      handler: async () => ({ hello: 'world' }),
      rateLimit: { limit: 10, windowMs: 10000 },
    });

    const res = await handler(mockRequest('10.1.1.1'));
    assert.equal(res.status, 200);
    assert.equal(res.headers.get('X-Robots-Tag'), 'noindex, nofollow');
    assert.equal(res.headers.get('X-RateLimit-Limit'), '10');
    assert.equal(res.headers.get('X-RateLimit-Remaining'), '9');

    const body = await res.json();
    assert.deepEqual(body, { hello: 'world' });
  });

  it('returns 429 when rate limit threshold is exceeded', async () => {
    const handler = createApiHandler({
      handler: async () => ({ status: 'ok' }),
      rateLimit: { limit: 2, windowMs: 10000 },
    });

    const req = mockRequest('10.1.1.2');
    const res1 = await handler(req);
    assert.equal(res1.status, 200);
    const res2 = await handler(req);
    assert.equal(res2.status, 200);

    const res3 = await handler(req);
    assert.equal(res3.status, 429);
    assert.equal(res3.headers.get('X-Robots-Tag'), 'noindex, nofollow');
    assert.ok(res3.headers.get('Retry-After'));

    const body = await res3.json();
    assert.equal(body.error, 'Too many requests. Please try again later.');
  });

  it('catches unhandled exceptions and returns 500 JSON without leaking stack traces', async () => {
    const handler = createApiHandler({
      handler: async () => {
        throw new Error('Secret database connection string leaked');
      },
      rateLimit: { limit: 10, windowMs: 10000 },
    });

    const res = await handler(mockRequest('10.1.1.3'));
    assert.equal(res.status, 500);
    assert.equal(res.headers.get('X-Robots-Tag'), 'noindex, nofollow');

    const body = await res.json();
    assert.deepEqual(body, { error: 'Internal Server Error' });
  });
});
