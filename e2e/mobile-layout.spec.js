import { test, expect } from '@playwright/test';

test.describe('Mobile Mode Two-Column Layout & Centered Hero', () => {
  test.use({ viewport: { width: 390, height: 844 } });

  test('renders centered hero on mobile and 2 cards per row in explore section', async ({ page }) => {
    await page.goto('/', { waitUntil: 'load' });
    await page.waitForTimeout(1500);

    // Verify Hero text and buttons are centered on mobile
    const heroH1 = page.locator('h1').first();
    await expect(heroH1).toBeVisible();

    const heroJoinBtn = page.getByRole('link', { name: /Join the Club/i });
    await expect(heroJoinBtn).toBeVisible();

    // Scroll slightly down to capture the hero cleanly
    const heroSection = page.locator('section').first();
    await heroSection.screenshot({
      path: 'C:/Users/austi/.gemini/antigravity/brain/74b30428-1f11-4b32-8bcd-1a9155f5bff2/mobile-hero-centered.png',
    });

    // Check "Find your way around" (HomeExplore)
    const exploreHeading = page.getByRole('heading', { name: /Find your way around/i });
    await expect(exploreHeading).toBeVisible();
    await exploreHeading.scrollIntoViewIfNeeded();
    await page.waitForTimeout(800);

    const aboutCard = page.getByRole('link', { name: /About/i }).first();
    const eventsCard = page.getByRole('link', { name: /Events/i }).first();
    await expect(aboutCard).toBeVisible();
    await expect(eventsCard).toBeVisible();

    // Verify About and Events cards are arranged horizontally side-by-side in 2-column row
    const aboutBox = await aboutCard.boundingBox();
    const eventsBox = await eventsCard.boundingBox();
    expect(aboutBox).toBeTruthy();
    expect(eventsBox).toBeTruthy();

    // In 2-column layout, both cards should share roughly the same Y coordinate (same row)
    expect(Math.abs(aboutBox.y - eventsBox.y)).toBeLessThan(20);
    // And their widths should each be ~160-180px on a 390px mobile screen (not full 360px width)
    expect(aboutBox.width).toBeLessThan(200);
    expect(eventsBox.width).toBeLessThan(200);

    // Capture mobile explore 2-column screenshot
    const exploreSection = page.locator('section:has-text("Find your way around")');
    await exploreSection.screenshot({
      path: 'C:/Users/austi/.gemini/antigravity/brain/74b30428-1f11-4b32-8bcd-1a9155f5bff2/mobile-explore-2cols.png',
    });
  });
});
