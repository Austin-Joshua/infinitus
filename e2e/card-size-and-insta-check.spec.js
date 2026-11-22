import { test, expect } from '@playwright/test';

test.describe('Mobile Mathematician Card & Team Instagram Removal Verification', () => {
  test('verifies reduced mathematician card on mobile and absence of extra instagram pill', async ({ page }) => {
    // 1. Set mobile viewport matching iPhone 14 / modern smartphone
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/about', { waitUntil: 'domcontentloaded' });

    // Scroll to Math History Timeline
    const mathTimeline = page.locator('#math-history-timeline').first();
    await expect(mathTimeline).toBeVisible({ timeout: 10000 });
    await mathTimeline.scrollIntoViewIfNeeded();

    // Select Pioneering Calculus era (Madhava)
    const calculusEraBtn = page.locator('button:has-text("Pioneering Calculus")').first();
    await calculusEraBtn.click();
    await page.waitForTimeout(300);

    const activeCard = page.locator('[data-testid="math-history-active-card"]');
    await expect(activeCard).toBeVisible();
    await expect(activeCard).toContainText('Madhava of Sangamagrama');
    await expect(activeCard).toContainText('Discovery of Calculus & Infinite Power Series');
    await expect(activeCard).toContainText('π/4 = 1 - 1/3 + 1/5 - 1/7 + 1/9 - 1/11 + ...');

    // Capture screenshot of the reduced mathematician card on mobile
    await activeCard.screenshot({
      path: 'C:/Users/austi/.gemini/antigravity/brain/74b30428-1f11-4b32-8bcd-1a9155f5bff2/math-card-reduced-mobile.png',
    });

    // Capture full mobile section view
    await page.screenshot({
      path: 'C:/Users/austi/.gemini/antigravity/brain/74b30428-1f11-4b32-8bcd-1a9155f5bff2/math-timeline-reduced-mobile-full.png',
    });

    // 2. Navigate to Team page and verify extra @infinitus_club.rit pill is gone
    await page.goto('/team', { waitUntil: 'domcontentloaded' });
    const teamSection = page.locator('text=Filter by Committee Domain').first();
    await expect(teamSection).toBeVisible({ timeout: 10000 });

    // Verify @infinitus_club.rit button in TeamBrowser header is completely removed
    const instaPill = page.locator('a[aria-label="Follow official INFINITUS on Instagram"]');
    await expect(instaPill).toHaveCount(0);

    await page.screenshot({
      path: 'C:/Users/austi/.gemini/antigravity/brain/74b30428-1f11-4b32-8bcd-1a9155f5bff2/team-insta-removed-mobile.png',
    });
  });
});
