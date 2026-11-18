import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { validateErrorReportPayload } from '../lib/reportError.js';

describe('validateErrorReportPayload', () => {
  test('accepts valid route-level error report payload', () => {
    const res = validateErrorReportPayload({
      route: '/events/scilab-workshop',
      kind: 'route',
      digest: '3819284910',
    });
    assert.equal(res.valid, true);
    assert.equal(res.data.route, '/events/scilab-workshop');
    assert.equal(res.data.kind, 'route');
    assert.equal(res.data.digest, '3819284910');
  });

  test('accepts valid global error report payload without digest', () => {
    const res = validateErrorReportPayload({
      route: '/',
      kind: 'global',
    });
    assert.equal(res.valid, true);
    assert.equal(res.data.route, '/');
    assert.equal(res.data.kind, 'global');
    assert.equal(res.data.digest, null);
  });

  test('rejects payload with invalid kind', () => {
    const res = validateErrorReportPayload({
      route: '/gallery',
      kind: 'unknown-kind',
    });
    assert.equal(res.valid, false);
    assert.match(res.error, /Invalid error kind/i);
  });

  test('rejects route with script tag injection attempts', () => {
    const res = validateErrorReportPayload({
      route: '/<script>alert(1)</script>',
      kind: 'route',
    });
    assert.equal(res.valid, false);
    assert.match(res.error, /Invalid route format/i);
  });

  test('rejects route without leading slash or with spaces', () => {
    const res1 = validateErrorReportPayload({
      route: 'events/scilab',
      kind: 'route',
    });
    assert.equal(res1.valid, false);

    const res2 = validateErrorReportPayload({
      route: '/events/bad route with spaces',
      kind: 'route',
    });
    assert.equal(res2.valid, false);
  });

  test('rejects digest with dangerous characters', () => {
    const res = validateErrorReportPayload({
      route: '/events',
      kind: 'route',
      digest: '<script>bad</script>',
    });
    assert.equal(res.valid, false);
    assert.match(res.error, /Invalid digest format/i);
  });

  test('rejects null, non-object, or array payloads', () => {
    assert.equal(validateErrorReportPayload(null).valid, false);
    assert.equal(validateErrorReportPayload('string').valid, false);
    assert.equal(validateErrorReportPayload([1, 2, 3]).valid, false);
  });
});
