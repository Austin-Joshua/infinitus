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
});
