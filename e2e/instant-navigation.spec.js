import { test, expect } from '@playwright/test';

test.describe('Instantaneous Page Navigation & Responsive Clicks', () => {
  test('navigates from home to gallery instantaneously without delay', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('domcontentloaded');

    // Click Gallery in desktop or mobile nav
    const galleryLink = page.locator('a[href="/gallery"]').first();
    await expect(galleryLink).toBeVisible();

    const startTime = Date.now();
    await galleryLink.click();
    await page.waitForURL('**/gallery');
    const elapsed = Date.now() - startTime;

    // Verify route switched quickly and responsively
    expect(elapsed).toBeLessThan(4000);

    // Verify gallery heading and grid photos are immediately visible
    await expect(page.locator('h1')).toBeVisible();
    const photos = page.locator('button[aria-label^="View photo:"]');
    await expect(photos.first()).toBeVisible();
  });

  test('clicks individual event card and transitions immediately to event details page', async ({ page }) => {
    await page.goto('/events');
    await page.waitForLoadState('domcontentloaded');

    // Find first event card
    const firstCard = page.locator('article.card').first();
    await expect(firstCard).toBeVisible();

    const startTime = Date.now();
    // Click card
    await firstCard.click();
    await page.waitForURL(/\/events\/[^/]+/);
    const elapsed = Date.now() - startTime;

    // Verify route switched quickly
    expect(elapsed).toBeLessThan(4000);

    // Verify event title and poster container are immediately visible without clipping
    await expect(page.locator('h1')).toBeVisible();
    await expect(page.locator('div[data-testid="gyro-parallax-container"]')).toBeVisible();
  });

  test('clicking Details button on event card navigates directly with prefetch', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('domcontentloaded');

    // Scroll to events section
    const detailsLink = page.locator('article.card a:has-text("Details"), article.card a:has-text("Register online"), article.card a:has-text("Offline details")').first();
    await detailsLink.scrollIntoViewIfNeeded();
    await expect(detailsLink).toBeVisible();

    const startTime = Date.now();
    await detailsLink.click();
    await page.waitForURL(/\/events\/[^/]+/);
    const elapsed = Date.now() - startTime;

    expect(elapsed).toBeLessThan(4000);
    await expect(page.locator('h1')).toBeVisible();
  });
});
