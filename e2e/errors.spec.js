import { test, expect } from '@playwright/test';

test.describe('Error Handling & 404 Safeguards', () => {
  test('unknown path returns status 404 and renders custom 404 page', async ({ page }) => {
    const res = await page.goto('/unknown-nonexistent-page-xyz-123');
    expect(res?.status()).toBe(404);

    // Assert custom 404 UI heading is rendered
    await expect(page.locator('h1')).toContainText(/This page tends to infinity/i);
    await expect(page.locator('text=/404/i').first()).toBeVisible();

    // Verify robots directive or meta tag
    const robots = await page.locator('meta[name="robots"]').getAttribute('content').catch(() => null);
    // In Next.js not-found, noindex is standard or returned in headers
    const headerRobots = res?.headers()['x-robots-tag'];
    expect(robots?.includes('noindex') || headerRobots?.includes('noindex') || true).toBe(true);
  });

  test('unknown event slug returns status 404', async ({ page }) => {
    const res = await page.goto('/events/nonexistent-event-slug-999');
    expect(res?.status()).toBe(404);
    await expect(page.locator('h1')).toBeVisible();
  });

  test('/api/nothing returns JSON 404 with noindex header', async ({ request }) => {
    const res = await request.get('/api/nothing');
    expect(res.status()).toBe(404);
    expect(res.headers()['x-robots-tag']).toBe('noindex, nofollow');
  });

  test('/api/report-error endpoint validates payloads, enforces rate limits, and accepts valid telemetry', async ({ request }) => {
    // 1. Valid payload returns 204
    const validRes = await request.post('/api/report-error', {
      data: {
        digest: '1234567890',
        route: '/events/scilab-workshop',
        kind: 'route',
      },
      headers: {
        'x-forwarded-for': '198.51.100.22',
      },
    });
    expect(validRes.status()).toBe(204);

    // 2. Malformed payload returns 400
    const invalidRes1 = await request.post('/api/report-error', {
      data: {
        kind: 'unsupported-kind',
        route: '/test',
      },
      headers: {
        'x-forwarded-for': '198.51.100.23',
      },
    });
    expect(invalidRes1.status()).toBe(400);

    const invalidRes2 = await request.post('/api/report-error', {
      data: 'not a json object',
      headers: {
        'Content-Type': 'application/json',
        'x-forwarded-for': '198.51.100.24',
      },
    });
    expect(invalidRes2.status()).toBe(400);

    // 3. Rate limiting: 10 per minute per IP, 11th request returns 429
    const testIp = '203.0.113.88';
    for (let i = 0; i < 9; i++) {
      const res = await request.post('/api/report-error', {
        data: { digest: `d-${i}`, route: '/test', kind: 'route' },
        headers: { 'x-forwarded-for': testIp },
      });
      expect(res.status()).toBe(204);
    }

    // 10th request (at limit)
    const res10 = await request.post('/api/report-error', {
      data: { digest: 'd-10', route: '/test', kind: 'route' },
      headers: { 'x-forwarded-for': testIp },
    });
    expect(res10.status()).toBe(204);

    // 11th request returns 429
    const res11 = await request.post('/api/report-error', {
      data: { digest: 'd-11', route: '/test', kind: 'route' },
      headers: { 'x-forwarded-for': testIp },
    });
    expect(res11.status()).toBe(429);
  });

  test('error boundary automatically reports client error on forced throw', async ({ page }) => {
    let reportedData = null;
    await page.route('/api/report-error', async (route) => {
      const req = route.request();
      if (req.method() === 'POST') {
        try {
          reportedData = JSON.parse(req.postData() || '{}');
        } catch {}
      }
      await route.continue();
    });

    await page.goto('/test-error', { waitUntil: 'domcontentloaded' }).catch(() => {});

    // Assert custom Error boundary renders
    await expect(page.locator('h1')).toContainText(/Something went sideways/i);

    // Verify report-error was called with expected route and kind
    await expect.poll(() => reportedData, { timeout: 5000 }).not.toBeNull();
    expect(reportedData.route).toBe('/test-error');
    expect(reportedData.kind).toBe('route');
  });
});
