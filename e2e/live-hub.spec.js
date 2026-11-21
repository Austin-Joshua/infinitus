import { test, expect } from '@playwright/test';

test.describe('Live Event-Day Mode / Symposium Live Hub (Feature 4A)', () => {
  test('renders live round tracker, interactive campus venue map, and live finalist board', async ({
    page,
  }) => {
    // 1. Visit /live page
    await page.setViewportSize({ width: 1280, height: 950 });
    await page.goto('/live', { waitUntil: 'networkidle' });

    // 2. Check Live Hub header & Round Tracker
    const roundsSection = page.locator('[data-testid="section-rounds"]');
    await expect(roundsSection).toBeVisible({ timeout: 10000 });

    const activeRoundCard = page.locator('[data-testid="active-round-card"]');
    await expect(activeRoundCard).toBeVisible({ timeout: 5000 });
    await expect(activeRoundCard).toContainText('Algorithmic Duel & Cryptographic Decryption');
    await expect(activeRoundCard).toContainText('Live Contest in Progress');

    // Wait for entrance animation to settle
    await page.waitForTimeout(500);

    // Take screenshot of Live Round Tracker
    await page.locator('#live-hub').screenshot({
      path: 'C:/Users/austi/.gemini/antigravity/brain/74b30428-1f11-4b32-8bcd-1a9155f5bff2/live-hub-round-tracker.png',
    });

    // 3. Switch to Venue & Floor Map Tab
    const venuesTab = page.locator('[data-testid="tab-venues"]');
    await venuesTab.click();

    const venuesSection = page.locator('[data-testid="section-venues"]');
    await expect(venuesSection).toBeVisible({ timeout: 5000 });
    await expect(venuesSection).toContainText('Wozniak Auditorium');
    await expect(venuesSection).toContainText('Academic Block — Ground Floor');

    // Click a floor zone inside Wozniak Auditorium
    const stageZoneBtn = page.locator('button:has-text("Main Keynote Stage")');
    await expect(stageZoneBtn).toBeVisible({ timeout: 5000 });
    await stageZoneBtn.click();

    // Click Green Building 4th floor venue button
    const greenVenueBtn = page.locator('button:has-text("Green Building")');
    await greenVenueBtn.click();
    await expect(venuesSection).toContainText('Green Block — Level 4');
    await expect(venuesSection).toContainText('Ramanujan Reimagined Exhibition');

    // Take screenshot of Interactive Campus Venue Floor Map
    await page.locator('#live-hub').screenshot({
      path: 'C:/Users/austi/.gemini/antigravity/brain/74b30428-1f11-4b32-8bcd-1a9155f5bff2/live-hub-venue-map.png',
    });

    // 4. Switch to Live Standings & Finalists Tab
    const standingsTab = page.locator('[data-testid="tab-standings"]');
    await standingsTab.click();

    const standingsSection = page.locator('[data-testid="section-standings"]');
    await expect(standingsSection).toBeVisible({ timeout: 5000 });

    const table = page.locator('[data-testid="leaderboard-table"]');
    await expect(table).toBeVisible({ timeout: 5000 });
    await expect(table).toContainText('Team Riemann');
    await expect(table).toContainText("Euler's Circuit");
    await expect(table).toContainText('Ramanujan 1729');

    // Filter by Top 8 Finalists Only
    const finalistsFilterBtn = page.locator('button:has-text("Top 8 Finalists Only")');
    await finalistsFilterBtn.click();

    // Verify only 8 rows exist in tbody
    const rows = table.locator('tbody tr');
    await expect(rows).toHaveCount(8);

    // Take screenshot of Live Standings & Finalist Board
    await page.locator('#live-hub').screenshot({
      path: 'C:/Users/austi/.gemini/antigravity/brain/74b30428-1f11-4b32-8bcd-1a9155f5bff2/live-hub-leaderboard.png',
    });

    // 5. Test Live Hub entry from /events page
    await page.goto('/events', { waitUntil: 'domcontentloaded' });
    const liveBannerLink = page.locator('a:has-text("Open Live Hub →")');
    await expect(liveBannerLink).toBeVisible({ timeout: 5000 });
    await liveBannerLink.click();
    await expect(page).toHaveURL(/\/live/);
  });
});
