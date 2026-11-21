import { test, expect } from '@playwright/test';

test.describe('1-Click Smart Calendar Sync & PWA Offline Support (Feature 3C)', () => {
  test('matches device automatically on 1-click sync, generates iCal file, and tests PWA offline mode', async ({
    page,
    request,
  }) => {
    // 1. Visit Ramanujan Reimagined event page
    await page.goto('/events/ramanujan-reimagined', { waitUntil: 'domcontentloaded' });

    // 2. Check Smart Add to Calendar button visibility
    const calBtn = page.locator('[data-testid="add-to-calendar-button"]');
    await expect(calBtn).toBeVisible({ timeout: 10000 });
    await expect(calBtn).toContainText('Add to Calendar');

    // Prevent real window.open popup navigation during test
    await page.evaluate(() => {
      window.open = () => null;
    });

    // 3. Click the smart button: automatically detects platform and initiates sync
    await calBtn.click();

    // 4. Verify immediate feedback: button text changes to "Synced!" with emerald checkmark
    await expect(calBtn).toContainText('Synced!', { timeout: 3000 });

    // 5. Verify smart platform-matching toast appears
    const toast = page.locator('[data-testid="calendar-sync-toast"]');
    await expect(toast).toBeVisible({ timeout: 3000 });

    // Take screenshot of Smart 1-Click Synced Button and Toast
    await page.screenshot({
      path: 'C:/Users/austi/.gemini/antigravity/brain/74b30428-1f11-4b32-8bcd-1a9155f5bff2/calendar-smart-sync.png',
    });

    // 6. Verify direct API endpoint returns valid .ics iCalendar file
    const icsRes = await request.get('/api/events/ramanujan-reimagined/calendar');
    expect(icsRes.status()).toBe(200);
    expect(icsRes.headers()['content-type']).toContain('text/calendar');
    const icsText = await icsRes.text();
    expect(icsText).toContain('BEGIN:VCALENDAR');
    expect(icsText).toContain('BEGIN:VEVENT');
    expect(icsText).toContain('SUMMARY:Ramanujan Reimagined');
    expect(icsText).toContain('LOCATION:Green Building');

    // 7. Test PWA Offline Status Simulation
    // Simulate browser offline
    await page.context().setOffline(true);
    await page.evaluate(() => {
      window.dispatchEvent(new Event('offline'));
    });

    // Check offline status banner
    const offlineBanner = page.locator('[data-testid="pwa-offline-banner"]');
    await expect(offlineBanner).toBeVisible({ timeout: 5000 });

    // Take screenshot of PWA offline indicator
    await page.screenshot({
      path: 'C:/Users/austi/.gemini/antigravity/brain/74b30428-1f11-4b32-8bcd-1a9155f5bff2/pwa-offline-banner.png',
    });

    // Restore online
    await page.context().setOffline(false);
    await page.evaluate(() => {
      window.dispatchEvent(new Event('online'));
    });
    await expect(offlineBanner).not.toBeVisible({ timeout: 5000 });
  });
});
