import { test, expect } from '@playwright/test';

test.describe('Accessibility & Keyboard Navigation', () => {
  test('duplicate marquee tracks with inert={true} are never focused during Tab navigation', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' });

    // Wait for the page and marquee to render
    const duplicateTracks = page.locator('[data-marquee-duplicate="true"]');
    await expect(duplicateTracks.first()).toBeAttached();
    const count = await duplicateTracks.count();
    expect(count).toBeGreaterThan(0);

    // Verify inert attribute is present on all duplicate tracks
    for (let i = 0; i < count; i++) {
      const track = duplicateTracks.nth(i);
      const isInert = await track.evaluate((el) => el.inert === true || el.hasAttribute('inert'));
      expect(isInert).toBe(true);
    }

    // Tab through interactive elements on the page (80 tabs)
    for (let i = 0; i < 80; i++) {
      await page.keyboard.press('Tab');
      const focusedInDuplicate = await page.evaluate(() => {
        const active = document.activeElement;
        if (!active || active === document.body) return false;
        return active.closest('[data-marquee-duplicate="true"]') !== null;
      });

      expect(focusedInDuplicate).toBe(false);
    }
  });
});
